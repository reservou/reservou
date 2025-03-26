"use client";

import type { GetCurrentUserHotelOutput } from "@/src/modules/hotel/actions/get-current-user-hotel";
import { getCurrentUserHotel } from "@/src/modules/hotel/actions/get-current-user-hotel";
import React from "react";

export function useHotel() {
	const [hotel, setHotel] = React.useState<GetCurrentUserHotelOutput | null>(
		null,
	);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		async function fetchHotel() {
			setLoading(true);
			const response = await getCurrentUserHotel();
			if (response.success) {
				setHotel(response.data);
				setError(null);
			} else {
				setError(response.message);
			}
			setLoading(false);
		}

		fetchHotel();
	}, []);

	return { hotel, loading, error };
}
