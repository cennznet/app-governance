import { AMQPChannel, AMQPClient, AMQPQueue } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK, RABBBITMQ_SERVER } from "@gov-libs/constants";

export async function getRabbitMQSet(
	name: string
): Promise<[AMQPChannel, AMQPQueue]> {
	const client = new AMQPClient(RABBBITMQ_SERVER);
	const connection = await client.connect();

	const channel = await connection.channel();
	const queue = await channel.queue(`${getNetworkName()}_GovServices_${name}`, {
		durable: true,
	});

	return [channel, queue];
}

function getNetworkName(): string {
	return `${CENNZ_NETWORK.charAt(0).toUpperCase()}${CENNZ_NETWORK.slice(1)}`;
}
