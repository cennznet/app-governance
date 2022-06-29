import type { VetoSumFields } from "@referendum-relayer/libs/types";

import { MessageActionRow, MessageButton, EmbedFieldData } from "discord.js";
import { REFERENDUM_URL } from "@referendum-relayer/libs/constants";

export function getVetoButton(proposalId: number): MessageActionRow {
	return new MessageActionRow().addComponents(
		new MessageButton()
			.setURL(getVetoLink(proposalId))
			.setLabel("Veto")
			.setStyle("LINK")
	);
}

function getVetoLink(proposalId: number): string {
	return `${REFERENDUM_URL}/${proposalId}?stage=referendum`;
}

export function getVetoSumField({
	vetoThreshold,
	vetoPercentage,
}: VetoSumFields): EmbedFieldData[] {
	return [
		{
			name: "Veto Sum",
			value: `_**${vetoPercentage} / ${vetoThreshold} %**_`,
			inline: false,
		},
	];
}
