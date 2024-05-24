import app from "../config";

import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);

export default async function addDataWithId(colllection, id, data) {
  let result = null;
  let error = null;
console.log(data)
  try {
    result = await setDoc(doc(db, colllection, id), data, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
