import type { u64 } from "@cennznet/types";

import * as chalk from "chalk";
import { AMQPError } from "@cloudamqp/amqp-client";
import { getLogger } from "@gov-libs/utils/getLogger";
import { CENNZ_NETWORK } from "@gov-libs/lib/constants";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { collectPendingProposalIds } from "@proposal-relayer/libs/utils/collectPendingProposalIds";

const logger = getLogger("ProposalListener");
logger.info(
	`Start ProposalListener for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

getCENNZnetApi()
	.then(async (cennzApi) => {
		const [, queue] = await getRabbitMQSet("ProposalQueue");

		await cennzApi.query.governance
			.nextProposalId()
			.then(async (nextProposalId: u64) => {
				const proposalIds = await collectPendingProposalIds(
					nextProposalId.toNumber()
				);

				proposalIds.forEach((proposalId) => {
					logger.info("Proposal #%d: Sent to queue...", proposalId)
					queue.publish(proposalId.toString());
				});
			});
	})
	.catch((error) => {
		if (error instanceof AMQPError) error?.connection?.close();
		logger.error("%s", error);
		process.exit(1);
	});
