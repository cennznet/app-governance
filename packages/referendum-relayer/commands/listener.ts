import chalk from "chalk";
import { AMQPError } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { waitForBlock } from "@gov-libs/utils/waitForBlock";
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
	const polling = true;

	const [, queue] = await getRabbitMQSet("ReferendumQueue");

	try {
		while (polling) {
			await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);

			await monitorVetoSum(cennzApi, queue);
		}
	} catch (error) {
		if (error instanceof AMQPError) error?.connection?.close();
		logger.error("%s", error);
		process.exit(1);
	}
});
