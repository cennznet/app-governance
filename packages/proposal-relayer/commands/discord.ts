import type {
	ProposalDetails,
	ProposalInfo,
} from "@proposal-relayer/libs/types";

import chalk from "chalk";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { waitForBlock } from "@gov-libs/utils/waitForBlock";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { getDiscordWebhook } from "@gov-libs/utils/getDiscordWebhook";
import { BLOCK_POLLING_INTERVAL } from "@proposal-relayer/libs/constants";
import { DiscordHandler } from "@proposal-relayer/libs/utils/DiscordHandler";
import { handleDiscordMessage } from "@proposal-relayer/libs/utils/handleDiscordMessage";
import { fetchProposalDetails } from "@proposal-relayer/libs/utils/fetchProposalDetails";

const logger = getLogger("ProposalDiscord");
logger.info(
	`Start ProposalDiscord for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi(), getDiscordWebhook()]).then(
	async ([cennzApi, discordWebhook]) => {
		const polling = true;
		const discordHandlers: Record<number, DiscordHandler> = {};
		const finalized: Record<number, boolean> = {};

		while (polling) {
			try {
				await cennzApi.query.governance.proposals.entries((entries) => {
					entries
						//Sort entries by proposalId
						.sort(([aKey], [bKey]) =>
							Number(aKey.toHuman()[0]) < Number(bKey.toHuman()[0]) ? -1 : 1
						)
						.forEach(async ([storageKey, entry]) => {
							const proposalId = Number(storageKey.toHuman()[0]);

							//1. Do nothing if voting is finished
							if (finalized[proposalId]) return;

							const newProposal = !discordHandlers[proposalId];

							//2. Create new DiscordHandler for a new proposal
							if (newProposal) {
								const proposalInfo: ProposalInfo = entry.toHuman();

								const proposalDetails: ProposalDetails =
									await fetchProposalDetails(proposalInfo.justificationUri);

								discordHandlers[proposalId] = new DiscordHandler(
									cennzApi,
									discordWebhook,
									proposalId,
									proposalDetails,
									proposalInfo
								);
							}

							//3. Update Discord message on vote or voting completion
							const proposalResult = await handleDiscordMessage(
								proposalId,
								newProposal,
								discordHandlers[proposalId]
							);
							finalized[proposalId] = true;
							logger.info(
								"Proposal #%d: Finalized, result: %s",
								proposalId,
								proposalResult
							);
						});
				});

				await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);
			} catch (error) {
				logger.error("Error: %s", error);
				process.exit();
			}
		}
	}
);
