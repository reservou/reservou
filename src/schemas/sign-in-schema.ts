import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email("E-mail inválido").trim().toLowerCase(),
});

export type SignInInput = z.infer<typeof signInSchema>;
