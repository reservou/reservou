import { buildAction } from "@/src/lib/action";
import { NotFoundError } from "@/src/lib/errors";

interface ZipCodeDetails {
	cep: string;
	logradouro: string;
	complemento: string;
	unidade: string;
	bairro: string;
	localidade: string;
	uf: string;
	estado: string;
	regiao: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
}

export const getZipCodeDetails = buildAction(async (zipCode: string) => {
	const cleanZipCode = zipCode.replace(/\D/g, "");

	const response = await fetch(
		`https://viacep.com.br/ws/${cleanZipCode}/json/`,
	);
	if (!response.ok) {
		throw new NotFoundError("Erro ao buscar detalhes do CEP");
	}

	const data: ZipCodeDetails = await response.json();

	if ("erro" in data) {
		throw new Error("CEP inválido ou não encontrado");
	}

	return {
		zipCode: data.cep,
		city: data.localidade,
		state: data.uf,
		country: "Brasil",
		street: data.logradouro,
	};
});
