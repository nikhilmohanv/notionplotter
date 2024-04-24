import app from "../config";
import { getFirestore, doc, setDoc,addDoc,collection } from "firebase/firestore";

const db = getFirestore(app)
export default async function addData(colllections, data) {
    let result = null;
    let error = null;

    try {
        const value=collection(db,colllections)
        result = await addDoc(value, data);
    } catch (e) {
        error = e;
    }

    return { result, error };
}