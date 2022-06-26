import type { NextPage } from "next";
import type  { ChangeEventHandler, MouseEventHandler } from "react";

import { Select } from "@gov-app/libs/components/Select";
import { Button } from "@gov-app/libs/components/Button";
import { useCENNZWallet } from "@gov-app/libs/providers/CENNZWalletProvider";
import { useCENNZExtension } from "@gov-app/libs/providers/CENNZExtensionProvider";
import { ReactComponent as CENNZLogo } from "@gov-app/libs/assets/vectors/cennz.svg";

const WalletConnect: NextPage = () => {
	const {
		onCENNZConnectClick,
		onCENNZAccountSelect,
		allAccounts,
		selectedAccount,
	} = useCENNZConnect();

	return (
		<fieldset className="mb-12 min-w-0">
			<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
				Connect your wallet
			</h2>
			<p className="mb-8">
				Lorem laborum dolor minim mollit eu reprehenderit culpa dolore labore
				dolor mollit commodo do anim incididunt sunt id pariatur elit tempor
				nostrud nulla eu proident ut id qui incididunt.
			</p>
			<Select
				placeholder="Connect CENNZnet Wallet"
				inputClassName="!py-4"
				required
				defaultValue={selectedAccount}
				onChange={onCENNZAccountSelect}
				endAdornment={
					<Button
						active={!!selectedAccount}
						size="small"
						onMouseDown={onCENNZConnectClick}
						startAdornment={<CENNZLogo className="h-4" />}
					>
						{!!selectedAccount && "Connected"}
						{!selectedAccount && "Connect"}
					</Button>
				}
			>
				{allAccounts?.map((account, index) => (
					<option value={account} key={index}>
						{account}
					</option>
				))}
			</Select>
		</fieldset>
	);
};

export default WalletConnect;

const useCENNZConnect = () => {
	const { accounts } = useCENNZExtension();
	const { connectWallet, selectedAccount, selectAccount } = useCENNZWallet();

	const allAccounts = accounts
		?.map((account) => account?.address)
		.filter(Boolean);

	const onCENNZConnectClick: MouseEventHandler<HTMLButtonElement> = () =>
		connectWallet();

	const onCENNZAccountSelect: ChangeEventHandler<HTMLSelectElement> = (
		event
	) => {
		const address = event.target.value;
		const item = accounts.find((account) => account.address === address);

		if (item) selectAccount(item);
	};

	return {
		onCENNZConnectClick,
		onCENNZAccountSelect,
		allAccounts,
		selectedAccount: selectedAccount?.address,
	};
};
