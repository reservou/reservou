export type SignUpIntent = {
	name: string;
	email: string;
};

/**
 * Holds the userId `uid` and hotelId if present `hid`
 */
export type AccessTokenPayload = {
	uid: string;
	hid?: string;
};
