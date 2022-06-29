import type { Api } from "@cennznet/api";
import type { u128, Permill, EraIndex } from "@cennznet/types";

export async function fetchVetoPercentage(
	cennzApi: Api,
	vetoSum: number
): Promise<string> {
	const stakingEra = (await cennzApi.query.staking.currentEra()) as EraIndex;

	const totalStaked = (
		(await cennzApi.query.staking.erasTotalStake(stakingEra.toJSON())) as u128
	).toNumber();

	const referendumThreshold = (
		(await cennzApi.query.governance.referendumThreshold()) as Permill
	).toNumber();

	return `${(vetoSum / totalStaked).toFixed()} / ${
		referendumThreshold / 10000
	} %`;
}
