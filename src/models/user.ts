import type { Model, Types } from "mongoose";
import { Schema, model, models } from "mongoose";

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
			ref: "Hotel",
		},
	},
	{
		timestamps: true,
	},
);

export type IUserModel = Model<IUser>;

const collectionName = "users";

export const UserModel: IUserModel =
	models[collectionName] || model(collectionName, UserSchema);
