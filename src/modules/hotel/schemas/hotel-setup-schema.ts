import { z } from "zod";

export const basicInfoSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "O nome do hotel deve ter pelo menos 2 caracteres",
		})
		.max(100, {
			message: "O nome do hotel não pode exceder 100 caracteres",
		}),
	category: z.string({
		required_error: "Por favor, selecione uma categoria",
	}),
	description: z
		.string()
		.min(10, {
			message: "A descrição deve ter pelo menos 10 caracteres",
		})
		.max(500, {
			message: "A descrição não pode exceder 500 caracteres",
		}),
});

export const locationSchema = z.object({
	address: z.string().min(5, {
		message: "O endereço deve ter pelo menos 5 caracteres",
	}),
	city: z.string().min(2, {
		message: "A cidade deve ter pelo menos 2 caracteres",
	}),
	state: z.string().min(2, {
		message: "O estado deve ter pelo menos 2 caracteres",
	}),
	country: z.string().min(2, {
		message: "O país deve ter pelo menos 2 caracteres",
	}),
	zipCode: z
		.string()
		.regex(/^\d{5}-?\d{3}$/, {
			message: "Informe um CEP válido.",
		})
		.transform((val) => val.replace("-", ""))
		.refine((val) => val.length === 8, {
			message: "CEP inválido",
		}),
});

export const contactSchema = z.object({
	email: z.string().email({
		message: "Por favor, insira um email válido",
	}),
	phone: z
		.string()
		.min(10, {
			message: "O telefone deve ter pelo menos 10 dígitos",
		})
		.refine((val) => /^[0-9()\-\s+]+$/.test(val), {
			message: "Formato de telefone inválido",
		}),
	website: z
		.string()
		.url({
			message: "Por favor, insira uma URL válida",
		})
		.optional()
		.or(z.literal("")),
});

export const hotelSetupSchema = z.object({
	...basicInfoSchema.shape,
	...locationSchema.shape,
	...contactSchema.shape,
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
export type LocationFormValues = z.infer<typeof locationSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type HotelSetupFormValues = z.infer<typeof hotelSetupSchema>;
