import type { InteractionWebhook, EmbedFieldData } from "discord.js";
import type {
	DiscordMessage,
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
	ProposalRecordUpdater,
	VoteAction,
	ProposalVotes,
} from "@proposal-relayer/libs/types";
import type { Api } from "@cennznet/api";

import {
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from "discord.js";
import { PROPOSALS_URL } from "@proposal-relayer/libs/constants";
import { fetchVotes } from "@proposal-relayer/libs/utils/fetchVotes";
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";

export class DiscordHandler {
	api: Api;
	webhook: InteractionWebhook;
	proposalId: string;
	proposalDetails: ProposalDetails;
	proposalInfo: ProposalInfo;
	sentMessage: Message;
	proposalFields: EmbedFieldData[];
	voteFields: EmbedFieldData[];
	updateProposalRecord: ProposalRecordUpdater;

	constructor(
		api: Api,
		webhook: InteractionWebhook,
		proposalId: string,
		proposalDetails: ProposalDetails,
		proposalInfo: ProposalInfo
	) {
		this.api = api;
		this.webhook = webhook;
		this.proposalId = proposalId;
		this.proposalDetails = proposalDetails;
		this.proposalInfo = proposalInfo;
		this.updateProposalRecord = createProposalRecordUpdater(Number(proposalId));
	}

	async sendProposal(): Promise<Message> {
		this.proposalFields = [
			{
				name: "Details",
				value: this.proposalDetails.get("description"),
			},
			{
				name: "Sponsor",
				value: `_${this.proposalInfo.get("sponsor")}_`,
			},
			{
				name: "Enactment Delay",
				value: `${this.proposalInfo.get("enactmentDelay")} blocks`,
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
			.setDescription(`_**${this.proposalDetails.get("title")}**_`)
			.setFields(this.proposalFields)
			.addFields(this.voteFields)
			.setFooter({ text: "Status: Deliberation" })
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

		this.updateProposalRecord({
			state: "DiscordSent",
			passVotes: 1,
			rejectVotes: 0,
		});

		return (this.sentMessage = (await this.webhook.send({
			embeds: [message],
			components: [voteButtons],
		})) as Message);
	}

	async updateVotes(): Promise<string> {
		const proposalStatus = (
			await this.api.query.governance.proposalStatus(this.proposalId)
		).toString();

		const { passVotes, rejectVotes } = await fetchVotes(
			this.api,
			this.proposalId
		);

		this.updateProposalRecord({
			status: proposalStatus as ProposalStatus,
			passVotes,
			rejectVotes,
		});

		await this.webhook.editMessage(
			this.sentMessage.id,
			this.getMessage(proposalStatus as ProposalStatus, {
				passVotes,
				rejectVotes,
			})
		);

		return proposalStatus;
	}

	getMessage(status: ProposalStatus, votes: ProposalVotes): DiscordMessage {
		return status === "Deliberation"
			? {
					components: this.sentMessage.components,
					embeds: [
						this.sentMessage.embeds[0]
							.setFields(this.proposalFields)
							.addFields(this.getVoteFields(votes))
							.setFooter({ text: `Status: ${status}` })
							.setTimestamp(),
					],
			  }
			: {
					components: [],
					embeds: [
						this.sentMessage.embeds[0]
							.setColor(status === "Disapproved" ? "RED" : "#05b210")
							.setFields(this.proposalFields)
							.setFooter({ text: `Status: ${status}` })
							.setTimestamp(),
					],
			  };
	}

	getVoteFields({ passVotes, rejectVotes }: ProposalVotes): EmbedFieldData[] {
		this.voteFields[0] = {
			name: "Votes to Pass",
			value: `_**${passVotes}**_`,
			inline: true,
		};

		this.voteFields[1] = {
			name: "Votes to Reject",
			value: `_**${rejectVotes}**_`,
			inline: true,
		};

		return this.voteFields;
	}

	getProposalLink(action: VoteAction): string {
		return `${PROPOSALS_URL}/${this.proposalId}?stage=proposal&action=${action}`;
	}
}
