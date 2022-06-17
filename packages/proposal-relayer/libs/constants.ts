export const PROPOSALS_URL: string =
	process.env.PROPOSALS_URL || "https://gov.cennz.net/proposals";

export const BLOCK_POLLING_INTERVAL = Number(
	process.env.BLOCK_POLLING_INTERVAL || 10
);
