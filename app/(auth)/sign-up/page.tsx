import { SignUpForm } from "@/src/components/forms/sign-up-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Crie sua conta",
};

export default function SignUpPage() {
	return <SignUpForm />;
}
