import { useCallback } from "react";

const windowObjects: { [key: string]: Window } = {};

export const useWindowPopup = () => {
	return useCallback((url: string, name: string, width = 640, height = 640) => {
		if (windowObjects[name] && !windowObjects[name].closed)
			return windowObjects[name].focus();

		const top = window.top.innerHeight / 2 + window.top.screenY - height / 2;
		const left = window.top.innerWidth / 2 + window.top.screenX - width / 2;

		const params = `popup,scrollbar=yes,width=${width},height=${height},top=${top},left=${left}`;

		windowObjects[name] = window.open(url, name, params);
	}, []);
};
