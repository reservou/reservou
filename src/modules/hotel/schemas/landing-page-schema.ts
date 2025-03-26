import { z } from "zod";

export const generalInfoSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "O nome do hotel deve ter pelo menos 2 caracteres",
		})
		.max(100, {
			message: "O nome do hotel não pode exceder 100 caracteres",
		})
		.optional(),
	slug: z
		.string()
		.min(2, {
			message: "O slug deve ter pelo menos 2 caracteres",
		})
		.max(50, {
			message: "O slug não pode exceder 50 caracteres",
		})
		.regex(/^@?[a-z0-9-]+$/, {
			message: "O slug deve conter apenas letras minúsculas, números e hífens",
		})
		.optional(),
	description: z
		.string()
		.min(10, {
			message: "A descrição deve ter pelo menos 10 caracteres",
		})
		.max(1000, {
			message: "A descrição não pode exceder 1000 caracteres",
		})
		.refine(
			(slug) => !RESERVED_SLUGS.includes(slug),
			"Essa slug é reservada e não pode ser utilizada",
		)
		.optional(),
});

export const locationSchema = z.object({
	address: z
		.string()
		.min(5, {
			message: "O endereço deve ter pelo menos 5 caracteres",
		})
		.max(200, {
			message: "O endereço não pode exceder 200 caracteres",
		})
		.optional(),
	city: z
		.string()
		.min(2, {
			message: "A cidade deve ter pelo menos 2 caracteres",
		})
		.max(100, {
			message: "A cidade não pode exceder 100 caracteres",
		})
		.optional(),
	state: z
		.string()
		.min(2, {
			message: "O estado deve ter pelo menos 2 caracteres",
		})
		.max(100, {
			message: "O estado não pode exceder 100 caracteres",
		})
		.optional(),
	country: z
		.string()
		.min(2, {
			message: "O país deve ter pelo menos 2 caracteres",
		})
		.max(100, {
			message: "O país não pode exceder 100 caracteres",
		})
		.optional(),
	zipCode: z
		.string()
		.min(5, {
			message: "O CEP deve ter pelo menos 5 caracteres",
		})
		.max(20, {
			message: "O CEP não pode exceder 20 caracteres",
		})
		.optional(),
	location: z
		.string()
		.min(2, {
			message: "A localização deve ter pelo menos 2 caracteres",
		})
		.max(200, {
			message: "A localização não pode exceder 200 caracteres",
		})
		.optional(),
});

export const amenitiesSchema = z.object({
	amenities: z.array(
		z.string().min(1, {
			message: "A comodidade não pode estar vazia",
		}),
	),
});

export const bannerSchema = z.object({
	bannerImage: z.string().optional(),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
export type LocationFormValues = z.infer<typeof locationSchema>;
export type AmenitiesFormValues = z.infer<typeof amenitiesSchema>;
export type BannerFormValues = z.infer<typeof bannerSchema>;

const RESERVED_SLUGS = [
	"admin",
	"api",
	"auth",
	"hotel",
	"hotels",
	"user",
	"users",
	"reserve",
	"reservation",
	"reservations",
	"reservar",
	"reservou",
	"platform",
	"plataforma",
	"dashboard",
	"room",
	"rooms",
	"quarto",
	"quartos",
	"reserva",
	"reservas",
	"reservado",
	"reservados",
	"reservados",
	"ticket",
	"tickets",
	"bilhete",
	"bilhetes",
	"payment",
	"payments",
	"pagamento",
	"pagamentos",
	"checkout",
	"checkouts",
	"check-out",
	"check-outs",
	"checkin",
	"checkins",
];
