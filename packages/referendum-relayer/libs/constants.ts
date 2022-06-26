export const REFERENDUM_URL: string =
	process.env.REFERENDUM_URL || "https://gov.cennz.net/proposals";

export const BLOCK_POLLING_INTERVAL = Number(
	process.env.BLOCK_POLLING_INTERVAL || 5
);
