import type { NextPage } from "next";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";

const Connect: NextPage = () => {
	return (
		<Layout>
			<Header />
			<div className="flex flex-1 items-center justify-center">
				<h1 className="font-display text-6xl uppercase">Identity Connect</h1>
			</div>
		</Layout>
	);
};

export default Connect;
