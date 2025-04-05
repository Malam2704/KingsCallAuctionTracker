// functions/index.js - Fixed version
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Send email when an auction ends
exports.scheduleAuctionEndNotification = functions.firestore
    .document('users/{userId}/watchlist/{itemId}')
    .onCreate(function (snapshot, context) {
        // Using traditional function instead of arrow function to avoid syntax issues
        const watchlistItem = snapshot.data();
        const userId = context.params.userId;
        const itemId = context.params.itemId;

        // Only schedule if there's a valid end time
        if (!watchlistItem.auctionEndTime) {
            console.log('No auction end time for item', itemId);
            return null;
        }

        // Get end time as a timestamp
        const endTimeMs = new Date(watchlistItem.auctionEndTime).getTime();

        // Schedule the notification using Cloud Functions scheduled trigger
        const scheduledTime = new Date(endTimeMs);

        // Create a scheduled function that will trigger at auction end time
        const scheduledFunctionName = `notifyAuctionEnd_${userId}_${itemId}`;

        // Schedule a one-time function to run at the exact auction end time
        return admin.firestore().collection('scheduledFunctions').doc(scheduledFunctionName).set({
            userId: userId,
            itemId: itemId,
            cardName: watchlistItem.cardName,
            scheduledTime: admin.firestore.Timestamp.fromDate(scheduledTime),
            status: 'scheduled'
        })
            .then(function () {
                console.log(`Notification scheduled for ${scheduledTime} for item ${itemId}`);
                return null;
            })
            .catch(function (error) {
                console.error('Error scheduling notification:', error);
                return null;
            });
    });

// Cloud Function that checks for scheduled notifications
exports.processScheduledNotifications = functions.pubsub
    .schedule('every 1 minutes')
    .onRun(function (context) {
        const now = admin.firestore.Timestamp.now();

        // Find all scheduled functions that need to run now
        const query = admin.firestore()
            .collection('scheduledFunctions')
            .where('scheduledTime', '<=', now)
            .where('status', '==', 'scheduled')
            .limit(50); // Process in batches

        return query.get()
            .then(function (scheduledFunctions) {
                if (scheduledFunctions.empty) {
                    console.log('No notifications to process at this time');
                    return null;
                }

                const promises = [];

                scheduledFunctions.forEach(function (doc) {
                    const scheduledFunction = doc.data();
                    console.log(`Processing notification for user ${scheduledFunction.userId}, item ${scheduledFunction.itemId}`);

                    // Mark as processing
                    promises.push(doc.ref.update({ status: 'processing' }));

                    // Get user email
                    promises.push(
                        admin.firestore().collection('users').doc(scheduledFunction.userId).get()
                            .then(function (userDoc) {
                                if (!userDoc.exists) {
                                    throw new Error(`User ${scheduledFunction.userId} not found`);
                                }

                                const userData = userDoc.data();
                                const userEmail = userData.email;

                                if (!userEmail) {
                                    throw new Error(`No email found for user ${scheduledFunction.userId}`);
                                }

                                // Send the email notification
                                return admin.firestore().collection('mail').add({
                                    to: userEmail,
                                    message: {
                                        subject: `Your watched auction for ${scheduledFunction.cardName} has ended`,
                                        text: `Your watched auction for ${scheduledFunction.cardName} has ended. You can now claim or check the results.`,
                                        html: `<p>Your watched auction for <strong>${scheduledFunction.cardName}</strong> has ended.</p>
                          <p><a href="https://yourapp.com/auctions/${scheduledFunction.itemId}">Click here to view the results</a></p>`
                                    }
                                });
                            })
                            .then(function () {
                                // Mark as completed
                                return doc.ref.update({ status: 'completed' });
                            })
                            .catch(function (error) {
                                console.error('Error sending notification:', error);
                                return doc.ref.update({
                                    status: 'error',
                                    error: error.message
                                });
                            })
                    );
                });

                return Promise.all(promises);
            })
            .catch(function (error) {
                console.error('Error processing notifications:', error);
                return null;
            });
    });