import type { Api } from "@cennznet/api";
import type { u128, Permill, EraIndex } from "@cennznet/types";

export async function fetchVetoThreshold(cennzApi: Api): Promise<number> {
	const referendumThreshold = (
		(await cennzApi.query.governance.referendumThreshold()) as Permill
	).toNumber();

	return referendumThreshold / 10000;
}

export async function fetchVetoPercentage(
	cennzApi: Api,
	vetoSum: number
): Promise<string> {
	const stakingEra = (
		(await cennzApi.query.staking.currentEra()) as EraIndex
	).toJSON();

	const totalStaked = (
		(await cennzApi.query.staking.erasTotalStake(stakingEra)) as u128
	).toNumber();

	return (vetoSum / totalStaked).toFixed();
}
