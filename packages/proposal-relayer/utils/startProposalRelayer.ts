import type { Api } from "@cennznet/api";

export default async function startProposalRelayer(
	cennzApi: Api
): Promise<void> {
	console.log(cennzApi.isConnected);
}
