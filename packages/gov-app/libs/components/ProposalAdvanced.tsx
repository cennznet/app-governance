import type { FC } from "react";

import { useState } from "react";
import { AutoGrowInput } from "@gov-app/libs/components";

export const ProposalAdvanced: FC = () => {
	const [cennzModule, setCennzModule] = useState<string>("");
	const [cennzCall, setCennzCall] = useState<string>("");

	const { cennzValues, setCennzValue } = useCennzValues();

	return (
		<div className="w-full">
			<label htmlFor="cennzExtrinsic" className="text-lg">
				Extrinsic
			</label>
			<fieldset
				id="cennzExtrinsic"
				className="border-dark mb-4 inline-flex w-full items-center border-[3px] bg-white px-4 py-2"
			>
				<p className="mr-2 tracking-widest text-gray-600">api.tx.</p>
				<AutoGrowInput
					placeholder="module"
					value={cennzModule}
					onChange={setCennzModule}
				/>
				<p className="mx-2 tracking-widest">.</p>
				<AutoGrowInput
					placeholder="call"
					value={cennzCall}
					onChange={setCennzCall}
				/>
			</fieldset>
			<label htmlFor="cennzValues" className="text-lg">
				Values
			</label>
			<fieldset
				id="cennzValues"
				className="border-dark inline-flex w-full items-center border-[3px] bg-white px-4 py-2"
			>
				{["one", "two", "three"].map((num, index) => (
					<AutoGrowInput
						placeholder={`value ${num}`}
						key={index}
						value={cennzValues[index]}
						inputClassName="mx-2"
						onChange={(value: string) => setCennzValue(value, index)}
					/>
				))}
			</fieldset>
		</div>
	);
};

const useCennzValues = () => {
	const [cennzValues, setCennzValues] = useState({
		0: undefined,
		1: undefined,
		2: undefined,
	});

	const setCennzValue = (value: string, index: number) =>
		setCennzValues((prevValues) => ({
			...prevValues,
			[index]: value,
		}));

	return {
		cennzValues,
		setCennzValue,
	};
};
