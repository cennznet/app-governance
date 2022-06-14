export const CENNZ_NETWORK: string = process.env.CENNZ_NETWORK || "rata";

export const MONGODB_SERVER: string =
	process.env.MONGODB_SERVER || "mongodb://root:root@localhost:27017/test";
export const RABBBITMQ_SERVER: string =
	process.env.RABBBITMQ_SERVER || "amqp://guest:guest@localhost:5672";

export const MESSAGE_MAX_TIME = Number(process.env.MESSAGE_MAX_TIME || 30000);
export const MESSAGE_MAX_RETRY = Number(process.env.MESSAGE_MAX_RETRY ?? 3);
