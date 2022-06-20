import { Api } from "@cennznet/api";

export async function waitForBlock(
	api: Api,
	// eslint-disable-next-line @typescript-eslint/no-inferrable-types
	numberOfBlocks: number = 1
): Promise<void> {
	let firstBlock: number;

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {
		const unsubscribe = await api.derive.chain.subscribeNewHeads(
			async (header) => {
				const headerBlock = header.number.toNumber();

				if (!firstBlock) firstBlock = header.number.toNumber();

				if (headerBlock < firstBlock + numberOfBlocks) return;

				unsubscribe();
				resolve();
			}
		);
	});
}
