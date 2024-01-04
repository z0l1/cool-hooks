/* currently depending on mantine hooks */

import { useEventListener } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import useIsMounted from "@/hooks/useIsMounted.ts";

export function useHardPress(listener?: () => void, pressTime: number = 3000) {
	const pressTimer = useRef<undefined | NodeJS.Timeout>(undefined);
	const isMounted = useIsMounted();

	const startTimer = () => {
		if (!listener) {
			return;
		}
		console.log("hardPress timer started");

		pressTimer.current = setTimeout(() => {
			if (!isMounted()) {
				return;
			}

			listener?.();
			console.log("DING DONG DING DONG");
		}, pressTime);
	};

	useEffect(() => {
		if (!listener) {
			return;
		}

		if (typeof window === "undefined") {
			return;
		}

		const upListener = () => {
			console.log("hardPress timer cancelled");
			clearTimeout(pressTimer.current);
		};

		window.addEventListener("mouseup", upListener);

		return () => {
			window.removeEventListener("mouseup", upListener);
		};
	}, [listener, pressTimer.current]);

	return useEventListener("mousedown", startTimer);
}
