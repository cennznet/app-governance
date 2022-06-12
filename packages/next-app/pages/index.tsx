import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>CENNZnet Governance</title>
				<meta name="description" content="CENNZnet Governance" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="m-auto">
				<h1 className="font-mono text-2xl text-center">
					Welcome to CENNZnet Governance
				</h1>
			</div>
		</div>
	);
};

export default Home;
