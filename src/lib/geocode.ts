"server-only";

import { getEnv } from "../env";
import { InternalServerError, NotFoundError } from "../errors";

export type Geocode = {
	lat: number;
	lng: number;
	formattedAddress: string;
};

type GMapsAPIResponse = {
	results: {
		address_components: {
			long_name: string;
			short_name: string;
			types: string[];
		}[];
		formatted_address: string;
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
			location_type: string;
			viewport: {
				northeast: {
					lat: number;
					lng: number;
				};
				southwest: {
					lat: number;
					lng: number;
				};
			};
		};
		navigation_points: {
			location: {
				latitude: number;
				longitude: number;
			};
			restricted_travel_modes: string[];
			road_name: string;
		}[];
		place_id: string;
		plus_code: {
			compound_code: string;
			global_code: string;
		};
		types: string[];
	}[];
	status: string;
};

/**
 * Geocodes an address using the Google Maps API.
 * @param {string} address - The address to geocode.
 * @returns {Promise<Geocode>} - A promise that resolves to the geocoded location.
 * @throws {InternalServerError} - If the API request fails.
 * @throws {NotFoundError} - If the address cannot be found.
 */
export async function geocodeAddress(address: string): Promise<Geocode> {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${getEnv("GMAPS_API_KEY")}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new InternalServerError(
			"Geocode fetching from google maps API failed",
			{
				url,
				address,
			},
		);
	}

	const data: GMapsAPIResponse = await response.json();

	if (data.status !== "OK" || !data.results.length) {
		throw new NotFoundError(
			`Não conseguimos encontrar esse endereço: ${address}`,
		);
	}

	const { lat, lng } = data.results[0].geometry.location;
	const { formatted_address: formattedAddress } = data.results[0];
	return { lat, lng, formattedAddress };
}
