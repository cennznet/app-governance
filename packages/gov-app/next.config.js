// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require("@nrwl/next/plugins/with-nx");

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	experimental: {
		externalDir: true,
	},
	nx: {
		// Set this to true if you would like to to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: true,
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/identity/connect",
				permanent: false,
			},
			{
				source: "/identity",
				destination: "/identity/connect",
				permanent: false,
			},
			{
				source: "/proposals",
				destination: "/proposals/new",
				permanent: false,
			},
		];
	},
	experimental: {
		externalDir: true,
	},
};

module.exports = withNx(nextConfig);
