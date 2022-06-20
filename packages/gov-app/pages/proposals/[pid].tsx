import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";

const Proposal: NextPage = () => {
	const router = useRouter();
	const { pid } = router.query;
	return (
		<Layout>
			<Header />
			<div className="flex flex-1 items-center justify-center">
				<h1 className="font-display text-6xl uppercase">Proposal #{pid}</h1>
			</div>
		</Layout>
	);
};

export default Proposal;