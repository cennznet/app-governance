import chalk from "chalk";
import { AMQPError } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { waitForBlock } from "@gov-libs/utils/waitForBlock";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { BLOCK_POLLING_INTERVAL } from "@proposal-relayer/libs/constants";
import { fetchProposals } from "@proposal-relayer/libs/utils/fetchProposals";
import { monitorVotes } from "@proposal-relayer/libs/utils/monitorVotes";
import { monitorStatus } from "@proposal-relayer/libs/utils/monitorStatus";

const logger = getLogger("ProposalListener");
logger.info(
	`Start ProposalListener for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi()]).then(async ([cennzApi]) => {
	const polling = true;

	const [, proposalQueue] = await getRabbitMQSet("ProposalQueue");
	const [, deliberationQueue] = await getRabbitMQSet("DeliberationQueue");

	try {
		fetchProposals(cennzApi, proposalQueue);

		while (polling) {
			await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);

			await monitorVotes(cennzApi, deliberationQueue);

			await monitorStatus(cennzApi, deliberationQueue);
		}
	} catch (error) {
		if (error instanceof AMQPError) error?.connection?.close();
		logger.error("%s", error);
		process.exit(1);
	}
});
