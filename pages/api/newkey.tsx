import nodemailer from "nodemailer";
import { db } from "@/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import generateRandomKey from "@/functions/generateRandomKey";

export default async function handler(req: any, res: any) {
    try {
        // Access Database
        const today = new Date();
        const todayDateString = `${today.getFullYear()}-${
            today.getMonth() + 1
        }-${today.getDate()}`;

        const keydatesRef = collection(db, "adminkey");
        const docRef = doc(keydatesRef, todayDateString);
        const docSnapshot = await getDoc(docRef);

        // New Key Declaration
        let adminKey = "";

        // If Key Exists, Somehow...
        if (docSnapshot.exists()) {
            adminKey = docSnapshot.data().key;
        } else {
            adminKey = generateRandomKey(Math.floor(Math.random() * (30 - 20 + 1)) + 20);
            // Update DB and Create New Document
            await setDoc(docRef, {
                date: todayDateString,
                key: adminKey,
                emailSent: process.env.SMTP_DESTINATION,
                timeSentLOC: new Date().toTimeString(),
                timeSentUTC: new Date().toUTCString(),
                timeUsedLOC: null,
                timeUsedUTC: null,
                localKey: null,
            });
        }

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Define the email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_DESTINATION,
            subject: "Daily ADMIN KEY Update",
            html: `<h1>ADMIN KEY UPDATE<h1><br><br><p>For ${todayDateString}<p><br><br><p>Todays ADMIN KEY is ${adminKey}<p>`,
        };

        // Send the email,
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "SUCCESFULL" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "ERROR RUNNING FUNCTION" });
    }
}
