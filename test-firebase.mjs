import admin from "firebase-admin";
import { credential, initializeApp, app } from "firebase-admin";

console.log("admin default:", typeof admin);
console.log("admin.credential:", typeof admin?.credential);
console.log("named credential:", typeof credential);
console.log("named initializeApp:", typeof initializeApp);
console.log("named app:", typeof app);
