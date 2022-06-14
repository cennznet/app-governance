export const CENNZ_NETWORK = {
	rata: {
		ChainName: "Rata Testnet",
		ApiUrl: {
			InWebSocket: "wss://rata.centrality.me/public/ws",
		},
		ExplorerUrl: "https://rata.uncoverexplorer.com",
	},

	nikau: {
		ChainName: "Nikau Testnet",
		ApiUrl: {
			InWebSocket: "wss://nikau.centrality.me/public/ws",
		},
		ExplorerUrl: "https://nikau.uncoverexplorer.com",
	},

	azalea: {
		ChainName: "CENNZnet Mainnet",
		ApiUrl: {
			InWebSocket: "wss://cennznet.unfrastructure.io/public/ws",
		},
		ExplorerUrl: "https://uncoverexplorer.com",
	},
}[process.env.NEXT_PUBLIC_CENNZ_NETWORK ?? "rata"];
