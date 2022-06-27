import { ChangeEvent, ChangeEventHandler, useState } from "react";

interface ControlledInputHook<T> {
	value: T;
	onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export function useControlledInput<T>(defaultValue: T): ControlledInputHook<T> {
	const [value, setValue] = useState<T>(defaultValue);

	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => setValue(event.target.value as unknown as T);

	return {
		value,
		onChange,
	};
}
