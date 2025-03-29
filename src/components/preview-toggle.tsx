import { Button } from "@/src/components/ui/button";
import { EditIcon, EyeIcon } from "lucide-react";

export const PreviewToggle = ({
	previewMode,
	setPreviewMode,
}: { previewMode: boolean; setPreviewMode: (value: boolean) => void }) => {
	if (previewMode) {
		return (
			<Button variant={"outline"} onClick={() => setPreviewMode(false)}>
				<EditIcon />
				<span>Voltar para edição</span>
			</Button>
		);
	}

	return (
		<Button variant={"outline"} onClick={() => setPreviewMode(true)}>
			<EyeIcon />
			<span>Visualizar página</span>
		</Button>
	);
};
