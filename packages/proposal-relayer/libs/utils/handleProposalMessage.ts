import type { Api } from "@cennznet/api"
import { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";

export async function handleProposalMessage (cennzApi: Api, queue: AMQPQueue, message: AMQPMessage, abortSignal: AbortSignal) {
	console.log({cennzApi, queue, message, abortSignal})
}