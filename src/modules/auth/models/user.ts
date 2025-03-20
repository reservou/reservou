import { resolveMongooseModel } from "@/src/lib/database";
import type { Model, Types } from "mongoose";
import { Schema } from "mongoose";
import { HOTEL_MODEL_KEY } from "../../hotel/models/hotel";

export enum UserRole {
	HOTEL = "HOTEL",
	CUSTOMER = "CUSTOMER",
}

interface IUser {
	email: string;
	name: string;
	role: UserRole;
	hotel?: Types.ObjectId;
}

const UserSchema: Schema<IUser> = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.HOTEL,
			required: true,
		},
		hotel: {
			type: Schema.Types.ObjectId,
			ref: HOTEL_MODEL_KEY,
		},
	},
	{
		timestamps: true,
	},
);

export type IUserModel = Model<IUser>;
export const USER_MODEL_KEY = "users";
export const UserModel: IUserModel = resolveMongooseModel(
	USER_MODEL_KEY,
	UserSchema,
);
