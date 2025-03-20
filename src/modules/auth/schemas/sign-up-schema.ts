import { z } from "zod";

export const signUpSchema = z.object({
	email: z
		.string({ required_error: "O e-mail é obrigatório" })
		.email("Por favor, insira um e-mail válido")
		.trim(),
	name: z
		.string({ required_error: "O nome é obrigatório" })
		.min(1, "O nome não pode estar vazio")
		.trim(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
