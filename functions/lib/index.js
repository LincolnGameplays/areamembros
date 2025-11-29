"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revealSecret = exports.handleCaktoWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
admin.initializeApp();
const db = admin.firestore();
const corsHandler = (0, cors_1.default)({ origin: true });
// ═══════════════════════════════════════════════════════════════════════════
// 🔐 HELPER: RANDOM PASSWORD GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Generates a cryptographically secure random alphanumeric password
 * @param length - Length of the password (default: 8)
 * @returns Random password string (A-Z, 0-9)
 */
function generateRandomPassword(length = 8) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    // Use crypto for secure random generation
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    return password;
}
// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CAKTO WEBHOOK // BURN AFTER READING PATTERN
// ═══════════════════════════════════════════════════════════════════════════
// STRATEGY: "Burn After Reading" - Generate random password, store temporarily
// Frontend retrieves password ONCE via callable function, then it's deleted
// ═══════════════════════════════════════════════════════════════════════════
exports.handleCaktoWebhook = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        var _a, _b;
        try {
            // ─────────────────────────────────────────────────────────────
            // 1. PARSE CAKTO PAYLOAD
            // ─────────────────────────────────────────────────────────────
            const payload = req.body;
            const email = ((_a = payload.customer) === null || _a === void 0 ? void 0 : _a.email) || payload.email;
            const name = ((_b = payload.customer) === null || _b === void 0 ? void 0 : _b.name) || payload.name || "Operador";
            const status = payload.state || payload.status;
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("🔔 CAKTO WEBHOOK RECEIVED");
            console.log(`📧 Email: ${email}`);
            console.log(`👤 Name: ${name}`);
            console.log(`💳 Status: ${status}`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            // ─────────────────────────────────────────────────────────────
            // 2. SECURITY VALIDATION
            // ─────────────────────────────────────────────────────────────
            if (!email) {
                console.error("❌ ERROR: No email provided in payload");
                res.status(400).send({ error: "Email is required" });
                return;
            }
            if (status !== "paid" && status !== "approved") {
                console.log(`⚠️  Payment not approved (Status: ${status}). Ignoring.`);
                res.status(200).send({ message: "Ignored: Payment not approved" });
                return;
            }
            // ─────────────────────────────────────────────────────────────
            // 3. USER PROVISIONING LOGIC
            // ─────────────────────────────────────────────────────────────
            let uid;
            let isNewUser = false;
            let generatedPassword = null;
            try {
                // Check if user already exists
                const userRecord = await admin.auth().getUserByEmail(email);
                uid = userRecord.uid;
                console.log(`✅ User exists: ${email} (UID: ${uid})`);
                console.log("🔄 Updating access level...");
            }
            catch (error) {
                // User doesn't exist - create new account with random password
                console.log(`🆕 User not found. Creating new account...`);
                isNewUser = true;
                // Generate secure random password
                generatedPassword = generateRandomPassword(8);
                console.log(`🔐 Generated random password: ${generatedPassword}`);
                const userRecord = await admin.auth().createUser({
                    email: email,
                    password: generatedPassword,
                    displayName: name,
                    emailVerified: false,
                });
                uid = userRecord.uid;
                console.log(`✅ User created successfully!`);
                console.log(`   UID: ${uid}`);
                console.log(`   Email: ${email}`);
                // ─────────────────────────────────────────────────────────
                // 4. STORE SECRET IN TEMPORARY COLLECTION
                // ─────────────────────────────────────────────────────────
                // This password will be retrievable ONCE via the revealSecret function
                await db.collection("secrets").doc(email).set({
                    password: generatedPassword,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000 // 10 minutes from now
                    ),
                    retrieved: false,
                });
                console.log(`🔒 Secret stored in Firestore (expires in 10 minutes)`);
                console.log(`   Collection: secrets/${email}`);
            }
            // ─────────────────────────────────────────────────────────────
            // 5. GRANT ACCESS IN FIRESTORE
            // ─────────────────────────────────────────────────────────────
            await db.collection("users").doc(uid).set({
                uid: uid,
                email: email,
                displayName: name,
                accessLevel: "operador",
                courseStatus: "active",
                createdAt: isNewUser ? admin.firestore.FieldValue.serverTimestamp() : admin.firestore.FieldValue.delete(),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                progress: isNewUser ? {} : admin.firestore.FieldValue.delete(),
            }, { merge: true });
            console.log(`✅ Firestore updated: accessLevel = "operador", courseStatus = "active"`);
            // ─────────────────────────────────────────────────────────────
            // 6. SUCCESS RESPONSE
            // ─────────────────────────────────────────────────────────────
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("🎯 ACCESS GRANTED SUCCESSFULLY");
            console.log(`   User: ${email}`);
            console.log(`   Status: ${isNewUser ? "NEW USER CREATED" : "EXISTING USER UPGRADED"}`);
            console.log(`   Redirect to: /obrigado?email=${encodeURIComponent(email)}`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            res.status(200).send({
                success: true,
                message: "Access granted successfully",
                isNewUser: isNewUser,
                redirectUrl: `/obrigado?email=${encodeURIComponent(email)}`,
            });
        }
        catch (error) {
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.error("❌ WEBHOOK ERROR:");
            console.error(error);
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            res.status(500).send({ error: "Internal Server Error" });
        }
    });
});
// ═══════════════════════════════════════════════════════════════════════════
// 🔥 CALLABLE FUNCTION: REVEAL SECRET (BURN AFTER READING)
// ═══════════════════════════════════════════════════════════════════════════
// This function can be called ONCE to retrieve the password
// After retrieval, the secret is immediately deleted from Firestore
// ═══════════════════════════════════════════════════════════════════════════
exports.revealSecret = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        const email = data.email;
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔓 REVEAL SECRET REQUEST");
        console.log(`📧 Email: ${email}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        // ─────────────────────────────────────────────────────────────
        // 1. VALIDATE INPUT
        // ─────────────────────────────────────────────────────────────
        if (!email) {
            console.error("❌ ERROR: No email provided");
            throw new functions.https.HttpsError("invalid-argument", "Email é obrigatório");
        }
        // ─────────────────────────────────────────────────────────────
        // 2. RETRIEVE SECRET FROM FIRESTORE
        // ─────────────────────────────────────────────────────────────
        const secretRef = db.collection("secrets").doc(email);
        const secretDoc = await secretRef.get();
        if (!secretDoc.exists) {
            console.log("⚠️  Secret not found or already retrieved");
            throw new functions.https.HttpsError("not-found", "Credencial expirada ou já visualizada");
        }
        const secretData = secretDoc.data();
        if (!secretData) {
            throw new functions.https.HttpsError("internal", "Erro ao recuperar credencial");
        }
        // ─────────────────────────────────────────────────────────────
        // 3. CHECK EXPIRATION (10 minutes)
        // ─────────────────────────────────────────────────────────────
        const expiresAt = ((_a = secretData.expiresAt) === null || _a === void 0 ? void 0 : _a.toMillis()) || 0;
        const now = Date.now();
        if (now > expiresAt) {
            console.log("⏰ Secret expired");
            // Delete expired secret
            await secretRef.delete();
            throw new functions.https.HttpsError("deadline-exceeded", "Credencial expirada. Entre em contato com o suporte.");
        }
        // ─────────────────────────────────────────────────────────────
        // 4. RETRIEVE PASSWORD
        // ─────────────────────────────────────────────────────────────
        const password = secretData.password;
        console.log(`✅ Secret retrieved: ${password}`);
        console.log(`⏱️  Time remaining: ${Math.floor((expiresAt - now) / 1000)}s`);
        // ─────────────────────────────────────────────────────────────
        // 5. 🔥 SELF-DESTRUCT: DELETE SECRET IMMEDIATELY
        // ─────────────────────────────────────────────────────────────
        await secretRef.delete();
        console.log("🔥 SECRET DELETED (Burn after reading)");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        // ─────────────────────────────────────────────────────────────
        // 6. RETURN PASSWORD TO CLIENT
        // ─────────────────────────────────────────────────────────────
        return {
            success: true,
            password: password,
        };
    }
    catch (error) {
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error("❌ REVEAL SECRET ERROR:");
        console.error(error);
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        // Re-throw HttpsError for proper client handling
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError("internal", "Erro ao revelar credencial");
    }
});
//# sourceMappingURL=index.js.map