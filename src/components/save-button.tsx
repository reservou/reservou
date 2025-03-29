import { Loading } from "@/src/components/animations/loading";
import { Button } from "@/src/components/ui/button";
import { CheckIcon, SaveIcon } from "lucide-react";
import type React from "react";

export const SaveButton = ({
	canSave,
	isSaved,
	isSaving,
	onClick,
}: {
	canSave: boolean;
	isSaving: boolean;
	isSaved: boolean;
	onClick: () => void;
}) => {
	return isSaving ? (
		<Button disabled variant="outline">
			<Loading /> Salvando...
		</Button>
	) : isSaved ? (
		<Button variant="outline" disabled>
			<CheckIcon className="w-5 h-5 mr-2" /> Salvo
		</Button>
	) : (
		<Button disabled={!canSave} variant="default" onClick={onClick}>
			<SaveIcon className="w-5 h-5 mr-2" /> Salvar alterações
		</Button>
	);
};
