// pages/api/check-auctions.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import nodemailer from "nodemailer";

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Set up a free email provider
const transporter = nodemailer.createTransport({
    service: "gmail", // Or use Ethereal Email for testing
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export default async function handler(req, res) {
    // Check if this is a scheduled request with the correct secret
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // STEP 2: Find expired auctions
    try {
        const now = new Date();
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        let notificationsSent = 0;

        // STEP 3: Process each user's watchlist
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userEmail = userData.email;

            // Skip if no email or watchlist
            if (!userEmail || !userData.watchlist) continue;

            // Check each item in the watchlist
            const updatedWatchlist = userData.watchlist.map(item => {
                // If auction has ended and notification not yet sent
                if (item.auctionEndTime &&
                    new Date(item.auctionEndTime) <= now &&
                    !item.notificationSent) {

                    // Send email
                    sendEmailNotification(userEmail, item);
                    notificationsSent++;

                    // Mark as notified
                    return { ...item, notificationSent: true };
                }
                return item;
            });

            // Update the database if changes were made
            if (notificationsSent > 0) {
                await updateDoc(doc(db, "users", userDoc.id), {
                    watchlist: updatedWatchlist
                });
            }
        }

        res.status(200).json({ processed: notifications.length });
    } catch (error) {
        console.error("Error processing auctions:", error);
        res.status(500).json({ error: error.message });
    }
}

// Helper function to send emails
async function sendEmailNotification(email, item) {
    // Create a test account if needed
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter (email sender)
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", // For testing only
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    // Send the email
    let info = await transporter.sendMail({
        from: `"Auction Tracker" <${testAccount.user}>`,
        to: email,
        subject: `Auction Ended: ${item.cardName}`,
        html: `
        <h1>Auction Ended</h1>
        <p>Your watched auction for <strong>${item.cardName}</strong> has ended.</p>
        <p>You can now check the results in your watchlist.</p>
      `,
    });

    console.log("Email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}