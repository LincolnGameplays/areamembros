import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
// import * as nodemailer from "nodemailer"; // Uncomment to setup email

admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

// TACTICAL: Webhook Handler for ParadisePags
export const handleParadisePagsWebhook = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            // 1. Parse Incoming Data (Map these fields to ParadisePags docs)
            const payload = req.body;
            const email = payload.email || payload.customer_email;
            const status = payload.status || payload.payment_status;
            const name = payload.name || payload.customer_name || "Operador";

            console.log(`Incoming Webhook for: ${email} | Status: ${status}`);

            // 2. Validate Payment Status
            if (status !== "approved" && status !== "paid" && status !== "completed") {
                console.log("Payment not approved. Ignoring.");
                res.status(200).send("Ignored: Status not approved");
                return;
            }

            // 3. Check if User Exists
            let uid: string;
            let isNewUser = false;

            try {
                const userRecord = await admin.auth().getUserByEmail(email);
                uid = userRecord.uid;
                console.log("User exists. Updating permissions.");
            } catch (error) {
                // 4. Create New User
                console.log("User not found. Creating new Operador.");
                isNewUser = true;
                // Generate a secure temporary password
                const tempPassword = Math.random().toString(36).slice(-8) + "Dark#2025";

                const userRecord = await admin.auth().createUser({
                    email: email,
                    password: tempPassword,
                    displayName: name,
                });
                uid = userRecord.uid;

                // TODO: Send Welcome Email via Nodemailer with tempPassword here
                // Example:
                // const transporter = nodemailer.createTransport({...});
                // await transporter.sendMail({
                //   from: '"Protocolo Dark" <noreply@protocolodark.com>',
                //   to: email,
                //   subject: 'BEM-VINDO AO PROTOCOLO DARK',
                //   html: `<p>Sua senha temporária: <strong>${tempPassword}</strong></p>`
                // });

                console.log(`User created. Temp Password: ${tempPassword}`);
            }

            // 5. Grant Access in Firestore
            // 'soldado' = Basic Access, 'operador' = Full Access
            await db.collection("users").doc(uid).set({
                uid: uid,
                email: email,
                displayName: name,
                accessLevel: "operador", // Grants access to Protocolo Dark
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                // Initialize progress if new
                progress: isNewUser ? {} : admin.firestore.FieldValue.delete(),
            }, { merge: true });

            res.status(200).send({ success: true, message: "Access Granted" });

        } catch (error) {
            console.error("Webhook Error:", error);
            res.status(500).send({ error: "Internal Server Error" });
        }
    });
});
