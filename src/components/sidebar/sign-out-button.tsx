import { LogOut as SignOutIcon } from "lucide-react";
import Link from "next/link";
import { Button, type ButtonVariants } from "../ui/button";

export function SignOutButton(
	props: React.ComponentProps<"button"> & {
		variant?: ButtonVariants["variant"];
	},
) {
	return (
		<Link href="/sign-out">
			<Button {...props} variant={props.variant ?? "destructive"}>
				<SignOutIcon className="mr-2 h-4 w-4" />
				<span>Finalizar sessão</span>
			</Button>
		</Link>
	);
}
