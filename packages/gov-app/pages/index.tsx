import type { NextPage } from "next";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";

const Home: NextPage = () => {
	return (
		<Layout>
			<Header />
			<div className="flex flex-1 justify-center">
				<h1 className="font-mono text-2xl">Welcome to CENNZnet Governance</h1>
			</div>
		</Layout>
	);
};

export default Home;
