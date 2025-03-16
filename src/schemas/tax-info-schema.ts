import { z } from "zod";

const isValidCPF = (cpf: string) => {
	const cleanCPF = cpf.replace(/[^\d]/g, "");
	if (cleanCPF.length !== 11) return false;
	return /^\d{11}$/.test(cleanCPF);
};

const isValidCNPJ = (cnpj: string) => {
	const cleanCNPJ = cnpj.replace(/[^\d]/g, "");
	if (cleanCNPJ.length !== 14) return false;
	return /^\d{14}$/.test(cleanCNPJ);
};

export const taxInfoSchema = z
	.object({
		taxIdType: z.enum(["CNPJ", "CPF"], {
			required_error: "O tipo de identificação fiscal é obrigatório",
			invalid_type_error: "O tipo deve ser 'CNPJ' ou 'CPF'",
		}),
		taxId: z
			.string({
				required_error: "O número de identificação fiscal é obrigatório",
			})
			.trim(),
	})
	.refine(
		(data) => {
			if (data.taxIdType === "CPF") {
				return isValidCPF(data.taxId);
			}
			if (data.taxIdType === "CNPJ") {
				return isValidCNPJ(data.taxId);
			}
			return false; // Should not reach here due to enum validation
		},
		(data) => ({
			message:
				data.taxIdType === "CPF"
					? "Por favor, insira um CPF válido (11 dígitos numéricos)"
					: "Por favor, insira um CNPJ válido (14 dígitos numéricos)",
			path: ["taxId"],
		}),
	);
