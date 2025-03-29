import { RotateCcwIcon } from "lucide-react";
import { Button } from "./ui/button";

export const ResetButton = ({
	canReset,
	handleReset,
}: {
	canReset: boolean;
	handleReset: () => void;
}) => {
	return (
		<Button disabled={!canReset} variant="ghost" onClick={handleReset}>
			<RotateCcwIcon />
			<span>Resetar</span>
		</Button>
	);
};
