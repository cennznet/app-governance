import { Api } from "@cennznet/api";

export async function waitForBlock(
	api: Api,
	numberOfBlocks: number = 1
): Promise<void> {
	let firstBlock: number;

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
