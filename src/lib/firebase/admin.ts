"server-only";

import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

import serviceAccount from "@/secrets/firebase-admin.secret.json";
import { getEnv } from "@/src/env";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: cert(serviceAccount as unknown as string),
		storageBucket: getEnv("STORAGE_BUCKET"),
	});
}

const storage = admin.storage();
const auth = admin.auth();

export { auth, storage };
