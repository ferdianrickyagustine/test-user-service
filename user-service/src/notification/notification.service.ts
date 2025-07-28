import admin from '../firebase/firebase-admin';

export class NotificationService {
  async sendToUser(fcmToken: string, title: string, body: string) {
    const message = {
      notification: { title, body },
      token: fcmToken,
    };
    await admin.messaging().send(message);
  }
}