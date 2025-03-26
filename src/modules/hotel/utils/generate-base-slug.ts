export type SlugGenerationParams = {
	name: string;
	city: string;
	country: string;
};

function normalizeString(str: string): string {
	return str
		.toLowerCase()
		.normalize("NFD") // Decompose into base character + combining marks
		.replace(/[^a-z0-9\s-]/g, "") // Remove remaining special characters
		.trim()
		.replace(/\s+/g, "-"); // Replace spaces with hyphens
}

export const slugStrategies: ((params: SlugGenerationParams) => string)[] = [
	// 1. normalized name (e.g., "hilton")
	({ name }) => `${normalizeString(name)}`,

	// 2. name-city (e.g., "hilton-paris")
	({ name, city }) => `${normalizeString(name)}-${normalizeString(city)}`,

	// 3. city-name (e.g., "paris-hilton")
	({ name, city }) => `${normalizeString(city)}-${normalizeString(name)}`,

	// 4. name-city-country (e.g., "hilton-paris-fra")
	({ name, city, country }) => {
		const countryCode = normalizeString(country).slice(0, 3);
		return `${normalizeString(name)}-${normalizeString(city)}-${countryCode}`;
	},

	// 5. country-city-name (e.g., "fra-paris-hilton")
	({ name, city, country }) => {
		const countryCode = normalizeString(country).slice(0, 3);
		return `${countryCode}-${normalizeString(city)}-${normalizeString(name)}`;
	},
];

export function generateBaseSlug(
	params: SlugGenerationParams,
	strategyIndex: number,
): string {
	const slug = slugStrategies[strategyIndex](params);
	return slug.length > 50 ? slug.slice(0, 50).replace(/-$/, "") : slug;
}
