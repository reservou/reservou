import mongoose from "mongoose";

export function resolveMongooseModel<T>(
	key: string,
	schema: mongoose.Schema,
): mongoose.Model<T> {
	const storedModel = mongoose.models && mongoose.models[key];

	if (storedModel) {
		return storedModel;
	}

	return mongoose.model<T>(key, schema);
}
