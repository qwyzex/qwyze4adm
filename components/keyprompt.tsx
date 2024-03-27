import generateRandomKey from "@/functions/generateRandomKey";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { SetStateAction, useState } from "react";

const KeyPrompt = ({ setLoading, setAuthorized, keyString }: any) => {
    const [keyInput, setKeyInput] = useState("");

    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${
        today.getMonth() + 1
    }-${today.getDate()}`;

    const keydatesRef = collection(db, "adminkey");
    const docRef = doc(keydatesRef, todayDateString);

    const createDeviceLocalKey = () => {
        const key = generateRandomKey(16);
        return key;
    };

    const submitHandler = async (e: any) => {
        e.preventDefault();
        if (keyString === keyInput) {
            const key = createDeviceLocalKey();
            localStorage.setItem("localKey", key);
            updateDoc(docRef, {
                ["localKey"]: key,
                ["timeUsedLOC"]: new Date().toTimeString(),
                ["timeUsedUTC"]: new Date().toUTCString(),
            });
            setAuthorized("authorized");
            setLoading(false);
        } else {
            console.log("wrong");
        }
    };

    return (
        <div>
            <form onSubmit={submitHandler}>
                <input
                    onChange={(e) => setKeyInput(e.target.value)}
                    required
                    type="text"
                    value={keyInput}
                    placeholder="Insert Key"
                />
                <button type="submit">SUBMIT</button>
            </form>
        </div>
    );
};

export default KeyPrompt;
