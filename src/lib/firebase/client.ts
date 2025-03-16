import { initializeApp } from "firebase/app";
import {
	type Auth,
	GoogleAuthProvider,
	type UserCredential,
	getAuth,
	signInWithPopup,
} from "firebase/auth";

import * as firebaseConfig from "@/secrets/firebase-client.secret.json";

const clientSideApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(clientSideApp);

const googleProvider = new GoogleAuthProvider();

export {
	auth,
	clientSideApp,
	googleProvider,
	signInWithPopup,
	type UserCredential,
};
