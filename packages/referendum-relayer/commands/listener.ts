import type { Permill, ReferendumVoteCount, StorageKey } from "@cennznet/types";

import chalk from "chalk";
import { AMQPError } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { waitForBlock } from "@gov-libs/utils/waitForBlock";
import { Referendum } from "@referendum-relayer/libs/models";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { BLOCK_POLLING_INTERVAL } from "@referendum-relayer/libs/constants";

const logger = getLogger("ReferendumListener");
logger.info(
	`Start ReferendumListener for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi()]).then(async ([cennzApi]) => {
	const polling = true;

	const [, queue] = await getRabbitMQSet("ReferendumQueue");

	try {
		while (polling) {
			await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);

			await cennzApi.query.governance.referendumVetoSum.entries(
				(
					entries: [
						storageKey: StorageKey,
						voteCount: ReferendumVoteCount["vote"]
					][]
				) => {
					entries.forEach(async ([storageKey, voteCount]) => {
						const proposalId = Number(storageKey.toHuman()[0]);
						const vetoSum = voteCount.toNumber();

						const referendum = await Referendum.findOne({ proposalId });
						if (referendum?.vetoSum === vetoSum) return;

						logger.info(
							"Referendum #%d: Update found, sent to queue...",
							proposalId
						);
						queue.publish(JSON.stringify({ proposalId, vetoSum }), {
							type: !referendum?.vetoSum ? "new" : "update",
						});
					});
				}
			);
		}
	} catch (error) {
		if (error instanceof AMQPError) error?.connection?.close();
		logger.error("%s", error);
		process.exit(1);
	}
});
