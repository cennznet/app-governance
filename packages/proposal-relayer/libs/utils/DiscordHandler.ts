import type { InteractionWebhook } from "discord.js";
import type {
	DiscordMessage,
	ProposalDetails,
	ProposalInfo,
	ProposalRecordUpdater,
	VoteOption,
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
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";

const logger = getLogger("DiscordBot");

export class DiscordHandler {
	api: Api;
	webhook: InteractionWebhook;
	proposalId: number;
	proposalDetails: ProposalDetails;
	proposalInfo: ProposalInfo;
	sentMessage: Message;

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
		const message = new MessageEmbed()
			.setColor("#9847FF")
			.setTitle("New Proposal")
			.setDescription(`**ID:** _#${this.proposalId}_`)
			.addFields([
				{
					name: "Title",
					value: this.proposalDetails.title,
					inline: true,
				},
				{
					name: "Details",
					value: this.proposalDetails.description,
					inline: true,
				},
				{
					name: "Sponsor",
					value: this.proposalInfo.sponsor,
					inline: false,
				},
				{
					name: "Enactment Delay",
					value: `_${this.proposalInfo.enactmentDelay} blocks_`,
					inline: false,
				},
			]);

		const votes = new MessageEmbed()
			.setColor("#1130FF")
			.setTitle("Votes")
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

		await this.webhook
			.send({ embeds: [message, votes], components: [voteButtons] })
			.then((sentMessage: Message) => (this.sentMessage = sentMessage));

		return this.sentMessage;
	}

	async updateOnVote(
		updateProposalRecord: ProposalRecordUpdater
	): Promise<void> {
		await this.api.query.governance.proposalVotes(
			this.proposalId,
			async (voteInfo: ProposalVoteInfo) => {
				const [pass, reject] = this.getVotes(voteInfo);
				const proposalStatus = (
					await this.api.query.governance.proposalStatus(this.proposalId)
				).toString();

				logger.info("Proposal #%d: updating status...", this.proposalId);
				updateProposalRecord({ status: proposalStatus });

				let newMessage: DiscordMessage;

				if (proposalStatus === "Deliberation")
					newMessage = {
						components: this.sentMessage.components,
						embeds: [
							this.sentMessage.embeds[0],
							this.sentMessage.embeds[1].setFields(
								{ name: "Status", value: `_${proposalStatus}_` },
								{ name: "Pass", value: `_${pass}_`, inline: true },
								{ name: "Reject", value: `_${reject}_`, inline: true }
							),
						],
					};

				if (proposalStatus !== "Deliberation")
					newMessage = {
						components: [],
						embeds: [
							new MessageEmbed()
								.setColor("#9847FF")
								.setDescription(`**ID:** _#${this.proposalId}_`)
								.setTitle("Voting Complete")
								.setFields({ name: "Status", value: `_${proposalStatus}_` }),
						],
					};

				logger.info("Proposal #%d: updating votes...", this.proposalId);
				await this.webhook.editMessage(this.sentMessage.id, newMessage);
			}
		);
	}

	getProposalLink(action: VoteOption): string {
		return `${PROPOSALS_URL}/${this.proposalId}?stage=proposal&action=${action}`;
	}

	getVotes({ activeBits, voteBits }): [pass: number, reject: number] {
		const countOnes = (bits: u128[]) =>
			bits
				.map((bit) => (bit.toNumber() >>> 0).toString(2).split("1").length - 1)
				.reduce((total, acc) => total + acc, 0);

		const activeCount = countOnes(activeBits);
		const passCount = countOnes(voteBits);

		return [passCount, activeCount - passCount];
	}
}
