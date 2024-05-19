import app from "../config";
import {
  collection,
  getDocs,
  where,
  query,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);

export default async function getTokenWithUId(uid) {
  let result = null;
  let error = null;
  try {
    const q = query(collection(db, "access_tokens"), where("uid", "==", uid));
    result = await getDocs(q);
  } catch (error) {
    console.error("Error fetching data:", error);
    error = error;
  }
  return { result, error };
}
