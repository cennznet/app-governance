import type { CENNZNetNetwork } from "@cennznet/api/types";

import { Api } from "@cennznet/api";
import { CENNZ_NETWORK } from "@gov-libs/constants";

export async function getCENNZnetApi(): Promise<Api> {
	return await Api.create({
		network: CENNZ_NETWORK as CENNZNetNetwork,
	});
}
