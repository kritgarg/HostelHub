// Minimal push utility placeholder. Integrate with FCM/Expo as needed.
export const sendNotification = async (userId, { title, message }) => {
  // TODO: Look up device token(s) for userId and send via provider.
  // For now, no-op. Return success for logging purposes.
  return { userId, title, message, sent: true };
};
