// inspired by https://usehooks-typescript.com/react-hook/use-dark-mode
import { useCallback, useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean => {
	const doesMatch = useCallback(
		(query: string): boolean => {
			if (!window) return false;
			return window.matchMedia(query).matches;
		},
		[query]
	);

	const [matches, setMatches] = useState<boolean>(doesMatch(query));

	useEffect(() => {
		const handler = () => setMatches(doesMatch(query));
		const matchMedia = window.matchMedia(query);

		matchMedia.addEventListener("change", handler);

		return () => {
			matchMedia.removeEventListener("change", handler);
		};
	}, []);

	useEffect(() => setMatches(doesMatch(query)), [query, doesMatch]);

	return matches;
};

export default useMediaQuery;

