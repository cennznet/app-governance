import { CENNZ_NETWORK } from "@gov-libs/lib/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import * as chalk from "chalk";
import startProposalRelayer from "@proposal-relayer/utils/startProposalRelayer";

const logger = getLogger("ProposalRelayer");
logger.info(
	`Start ProposalRelayer for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

getCENNZnetApi()
	.then(startProposalRelayer)
	.catch((error) => {
		logger.error("%s", error);
	});
