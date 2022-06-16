import type { InteractionWebhook, EmbedFieldData } from "discord.js";
import type {
	DiscordMessage,
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
	ProposalRecordUpdater,
	VoteAction,
} from "@proposal-relayer/libs/types";
import type { Api } from "@cennznet/api";
import type { ProposalVoteInfo, u128 } from "@cennznet/types";

import {
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from "discord.js";
import { getLogger } from "@gov-libs/utils/getLogger";
import { PROPOSALS_URL } from "@proposal-relayer/libs/constants";

const logger = getLogger("DiscordBot");

export class DiscordHandler {
	api: Api;
	webhook: InteractionWebhook;
	proposalId: number;
	proposalDetails: ProposalDetails;
	proposalInfo: ProposalInfo;
	sentMessage: Message;
	proposalFields: EmbedFieldData[];
	voteFields: EmbedFieldData[];

	constructor(
		api: Api,
		webhook: InteractionWebhook,
		proposalId: number,
		proposalDetails: ProposalDetails,
		proposalInfo: ProposalInfo
	) {
		this.api = api;
		this.webhook = webhook;
		this.proposalId = proposalId;
		this.proposalDetails = proposalDetails;
		this.proposalInfo = proposalInfo;
	}

	async sendProposal(): Promise<Message> {
		this.proposalFields = [
			{
				name: "Details",
				value: this.proposalDetails.description,
			},
			{
				name: "Sponsor",
				value: `_${this.proposalInfo.sponsor}_`,
			},
			{
				name: "Enactment Delay",
				value: `${this.proposalInfo.enactmentDelay} blocks`,
			},
		];

		this.voteFields = [
			{
				name: "Votes to Pass",
				value: "_**1**_",
				inline: true,
			},
			{
				name: "Votes to Reject",
				value: "_**0**_",
				inline: true,
			},
		];

		const message = new MessageEmbed()
			.setColor("#9847FF")
			.setTitle(`Proposal ID: _#${this.proposalId}_`)
			.setDescription(`_**${this.proposalDetails.title}**_`)
			.setFields(this.proposalFields)
			.addFields(this.voteFields)
			.setFooter(`Status: Deliberation`)
			.setTimestamp();

		const voteButtons = new MessageActionRow().addComponents(
			new MessageButton()
				.setURL(this.getProposalLink("pass"))
				.setLabel("Pass")
				.setStyle("LINK"),
			new MessageButton()
				.setURL(this.getProposalLink("reject"))
				.setLabel("Reject")
				.setStyle("LINK")
		);

		return (this.sentMessage = (await this.webhook.send({
			embeds: [message],
			components: [voteButtons],
		})) as Message);
	}

	async updateOnVote(
		updateProposalRecord: ProposalRecordUpdater
	): Promise<void> {
		await this.api.query.governance.proposalVotes(
			this.proposalId,
			async (voteInfo: ProposalVoteInfo) => {
				const votes = this.getVotes(voteInfo);
				const proposalStatus = (
					await this.api.query.governance.proposalStatus(this.proposalId)
				).toString();

				logger.info("Proposal #%d: updating status in DB...", this.proposalId);
				updateProposalRecord({
					status: proposalStatus as ProposalStatus,
				});

				logger.info(
					"Proposal #%d: updating votes on Discord...",
					this.proposalId
				);
				await this.webhook.editMessage(
					this.sentMessage.id,
					this.getMessage(proposalStatus as ProposalStatus, votes)
				);
			}
		);
	}

	getMessage(status: ProposalStatus, votes): DiscordMessage {
		return status === "Deliberation"
			? {
					components: this.sentMessage.components,
					embeds: [
						this.sentMessage.embeds[0]
							.setFields(this.proposalFields)
							.addFields(this.getVoteFields(status, votes))
							.setFooter(`Status: ${status}`)
							.setTimestamp(),
					],
			  }
			: {
					components: [],
					embeds: [
						this.sentMessage.embeds[0]
							.setColor(status === "Disapproved" ? "RED" : "#05b210")
							.setFields(this.proposalFields)
							.setFooter(`Status: ${status}`)
							.setTimestamp(),
					],
			  };
	}

	getVoteFields(
		status: ProposalStatus,
		votes: [pass: number, reject: number]
	): EmbedFieldData[] {
		const [pass, reject] = votes;

		this.voteFields[0] = {
			name: "Votes to Pass",
			value: `_**${pass}**_`,
			inline: true,
		};

		this.voteFields[1] = {
			name: "Votes to Reject",
			value: `_**${reject}**_`,
			inline: true,
		};

		return this.voteFields;
	}

	getProposalLink(action: VoteAction): string {
		return `${PROPOSALS_URL}/${this.proposalId}?stage=proposal&action=${action}`;
	}

	getVotes({ activeBits, voteBits }): [pass: number, reject: number] {
		// This function converts the bits to decimals and counts the number of ones -
		// votes are stored in this way for efficiency
		const countOnes = (bits: u128[]) =>
			bits
				.map((bit) => (bit.toNumber() >>> 0).toString(2).split("1").length - 1)
				.reduce((total, acc) => total + acc, 0);

		const activeCount = countOnes(activeBits);
		const passCount = countOnes(voteBits);

		return [passCount, activeCount - passCount];
	}
}
