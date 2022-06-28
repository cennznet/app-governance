import chalk from "chalk";
import { AMQPError } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { BLOCK_POLLING_INTERVAL } from "@referendum-relayer/libs/constants";
import { monitorVetoSum } from "@referendum-relayer/libs/utils/monitorVetoSum";

const logger = getLogger("ReferendumListener");
logger.info(
	`Start ReferendumListener for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi()]).then(async ([cennzApi]) => {
	let lastBlockPolled: number;

	const [, queue] = await getRabbitMQSet("ReferendumQueue");

	cennzApi.rpc.chain
		.subscribeFinalizedHeads(async (head) => {
			const blockNumber = head.number.toNumber();
			if (
				lastBlockPolled &&
				blockNumber < lastBlockPolled + BLOCK_POLLING_INTERVAL
			)
				return;

			lastBlockPolled = blockNumber;
			logger.info(`HEALTH CHECK => ${chalk.italic.green("OK")}`);
			logger.info(`At blocknumber: ${chalk.italic.gray("%s")}`, blockNumber);

			await monitorVetoSum(cennzApi, queue);
		})
		.catch((error) => {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		});
});
