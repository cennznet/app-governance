import type { Api } from "@cennznet/api";
import type { u128, Permill, EraIndex } from "@cennznet/types";

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

	const referendumThreshold = (
		(await cennzApi.query.governance.referendumThreshold()) as Permill
	).toNumber();

	const vetoPercentage = (vetoSum / totalStaked).toFixed();
	const thresholdPercentage = referendumThreshold / 10000;

	return `${vetoPercentage} / ${thresholdPercentage} %`;
}
