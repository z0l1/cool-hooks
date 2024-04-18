import { ChangeEvent } from "react";

export function useStateManager<T>(
	data: T,
	setData?: (data: T) => void,
	options?: {
		setValueValidator?: (key: keyof T, value: any) => boolean;
		onSetValue?: (key: keyof T, value: any) => void;
		onSet?: () => void;
	}
): {
	setValue: (key: keyof T, value: any) => void;
	inputValueSetter: (key: keyof T, afterFunc?: () => void) => void;
	inputNumberValueSetter: (key: keyof T, afterFunc?: () => void) => void;
} {
	const setValue = (key: keyof T, value: any) => {
		if (options.setValueValidator !== undefined) {
			if (options.setValueValidator?.(key, value) === true) {
				return;
			}
		}

		setData?.({ ...data, [key]: value });
		options.onSetValue?.(key, value);
		options.onSet?.();
	};

	const inputValueSetter = <TI = HTMLInputElement>(key: keyof T, afterFunc?: () => void) => {
		return (e: ChangeEvent<TI>) => {
			setValue(key, e.target.value);
			afterFunc?.();
		};
	};

	const inputNumberValueSetter = <TI = HTMLInputElement>(
		key: keyof T,
		afterFunc?: () => void
	) => {
		return (e: ChangeEvent<TI>) => {
			setValue(key, Number(e.target.value));
			afterFunc?.();
		};
	};

	return {
		setValue,
		inputValueSetter,
		inputNumberValueSetter,
	};
}
