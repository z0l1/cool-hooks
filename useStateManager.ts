import { ChangeEvent } from "react";

export function useStateManager<T>(
	data: T,
	setData?: (data: T) => void,
	options?: {
		setValueValidator?: (key: keyof T, value: any) => boolean;
		onSetValue?: (key: keyof T, value: any) => void;
		onSet?: () => void;
		disabled?: boolean;
	}
): {
	setValue: (key: keyof T, value: any) => void;
	valueSetter: (key: keyof T, value: any) => () => void;
	inputValueSetter: <TI>(key: keyof T, afterFunc?: () => void) => (e: ChangeEvent<TI>) => void;
	inputNumberValueSetter: <TI>(
		key: keyof T,
		afterFunc?: () => void
	) => (e: ChangeEvent<TI>) => void;
} {
	const setValue = (key: keyof T, value: any) => {
		if (options?.disabled === true) {
			return;
		}

		if (options?.setValueValidator?.(key, value) === false) {
			return;
		}

		setData?.({ ...data, [key]: value });
		options?.onSetValue?.(key, value);
		options?.onSet?.();
	};

	const valueSetter = (key: keyof T, value: any) => {
		return () => setValue(key, value);
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
		valueSetter,
		inputValueSetter,
		inputNumberValueSetter,
	};
}

