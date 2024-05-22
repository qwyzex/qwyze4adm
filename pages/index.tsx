import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import { db } from "@/firebase";
import { DocumentData, collection, doc, getDoc, setDoc } from "firebase/firestore";

import KeyPrompt from "@/components/keyprompt";

import { useEffect, useState } from "react";
import { adminKeyDoc } from "@/types/types";
import Dashboard from "@/components/dashboard";
import Blocked from "@/components/blocked";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [publicDeviceLocalKey, setPublicDeviceLocalKey] = useState("");
    const [authorized, setAuthorized] = useState("unauthorized");
    const [publicData, setPublicData]: any = useState({});
    
    useEffect(() => {
        // Initialize the checking
        async function returnDoc() {
            console.log("Initializing");
            // Access Database
            const today = new Date();
            const todayDateString = `${today.getFullYear()}-${
                today.getMonth() + 1
            }-${today.getDate()}`;

            // Database Access
            const keydatesRef = collection(db, "adminkey");
            const docRef = doc(keydatesRef, todayDateString);
            const docSnapshot = await getDoc(docRef);
            
            // Databse Document
            const dataThis: DocumentData | adminKeyDoc | undefined = docSnapshot.data();
            await setPublicData(docSnapshot.data());
            
            const getLocalKey = localStorage.getItem("localKey");
            if (getLocalKey) {
                setPublicDeviceLocalKey(getLocalKey);
            }

            // If localKey in DB exists
            if (dataThis?.localKey) {
                // If localKey in device storage exists
                console.log("localKey exists in db");
                if (getLocalKey !== "") {
                    // If localKey in DB and device storage match
                    console.log("localKey exists in db and device storage");
                    if (dataThis?.localKey === getLocalKey) {
                        console.log("localkey matches");
                        setLoading(false);
                        setAuthorized("authorized");
                    }
                    // If localKey in DB exists but device localKey didn't match
                    else if (dataThis?.localKey !== getLocalKey) {
                        console.log("localkey doesn't match");
                        setLoading(false);
                        setAuthorized("blocked");
                    }
                }
                // If localKey in DB exists, but it's not this device that use it
                else {
                    console.log("localKey doesn't exist in device");
                    setLoading(false);
                    setAuthorized("blocked");
                }
            } else if (!dataThis?.localKey ?? dataThis?.localKey == null) {
                console.log("localKey doesn't exist in db");
                setLoading(false);
            }
        }

        returnDoc();
    }, []);

    return (
        <>
            <Head>
                <title>Enter Key</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div>{JSON.stringify(publicData?.date)}</div>
                <div>{JSON.stringify(publicData?.key)}</div>
                <div>{JSON.stringify(publicData?.emailSent)}</div>
                <div>{JSON.stringify(publicData?.timeSentLOC)}</div>
                <div>{JSON.stringify(publicData?.timeSentUTC)}</div>
                <div>{JSON.stringify(publicData?.timeUsedLOC)}</div>
                <div>{JSON.stringify(publicData?.timeUsedUTC)}</div>
                <div>{JSON.stringify(publicData?.localKey)}</div>
                <div>
                    {!loading && authorized === "unauthorized" ? (
                        <KeyPrompt
                            setLoading={setLoading}
                            setAuthorized={setAuthorized}
                            keyString={publicData?.key}
                        ></KeyPrompt>
                    ) : !loading && authorized === "blocked" ? (
                        <Blocked></Blocked>
                    ) : !loading && authorized === "authorized" ? (
                        <Dashboard></Dashboard>
                    ) : (
                        <>LOADING</>
                    )}
                </div>
            </main>
        </>
    );
}
