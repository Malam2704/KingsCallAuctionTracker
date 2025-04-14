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

    try {
        const now = new Date();

        // Query for watchlist items that have just ended
        const watchlistRef = collection(db, "users");
        const usersSnapshot = await getDocs(watchlistRef);

        const notifications = [];

        // For each user, check their watchlist
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userEmail = userData.email;

            if (userData.watchlist) {
                for (const item of userData.watchlist) {
                    const endTime = new Date(item.auctionEndTime);

                    // If auction just ended (within last 5 minutes) and not notified
                    if (endTime <= now && endTime > new Date(now - 5 * 60 * 1000) && !item.notificationSent) {
                        // Send email
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: userEmail,
                            subject: `Auction Ended: ${item.cardName}`,
                            html: `<p>Your watched auction for <strong>${item.cardName}</strong> has ended.</p>
                      <p><a href="https://yourapp.com/watchlist">View your watchlist</a></p>`
                        });

                        // Mark as notified
                        notifications.push({
                            userId: userDoc.id,
                            itemId: item.id
                        });
                    }
                }
            }
        }

        // Update items as notified
        for (const notification of notifications) {
            // Update the specific item in the user's watchlist array
            // This requires custom logic based on your data structure
        }

        res.status(200).json({ processed: notifications.length });
    } catch (error) {
        console.error("Error processing auctions:", error);
        res.status(500).json({ error: error.message });
    }
}