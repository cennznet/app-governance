import type { ChangeEvent, Dispatch, SetStateAction, FC } from "react";

interface AutoGrowInputProps {
	value: string;
	onChange: Dispatch<SetStateAction<string>>;
	placeholder: string;
	inputClassName?: string;
}

export const AutoGrowInput: FC<AutoGrowInputProps> = ({
	value,
	onChange,
	placeholder,
	inputClassName = "",
}) => {
	return (
		<div className="align-center inline-grid">
			<input
				value={value}
				onChange={(event: ChangeEvent<HTMLInputElement>) =>
					onChange(event.target.value)
				}
				placeholder={placeholder}
				className={inputClassName}
				style={{
					gridArea: "1 / 1 / 2 / 2",
				}}
			/>
			<span
				style={{
					gridArea: "1 / 1 / 2 / 2",
					visibility: "hidden",
				}}
			>
				{value}
			</span>
		</div>
	);
};
