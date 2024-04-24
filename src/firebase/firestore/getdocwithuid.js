import app from "../config";

import {
  collection,
  getDocs,
  where,
  query,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);

export default async function getDoumentsWithUId(uid) {
  let result = null;
  let error = null;
  console.log(uid);
  try {
    const q = query(collection(db, "graphs"), where("userid", "==", uid));
    result = await getDocs(q);

  } catch (error) {
    console.error("Error fetching data:", error);
    error = error;
  }

  return { result, error };
}
