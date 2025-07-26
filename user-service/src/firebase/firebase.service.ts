import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}
  onModuleInit() {
      const serviceAccount = require('../../firebase-service-account.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
  }

  async sendNotificationToAdmins(title: string, body: string, data?: any) {
    try {
      const adminTokens = await this.getAdminFCMTokens();
      
      if (adminTokens.length === 0) {
        return { success: false, message: 'No admin tokens available' };
      }
      
      const message = {
        notification: { title, body },
        data: data ? { payload: JSON.stringify(data) } : undefined,
        tokens: adminTokens,
      };
      
      const response = await admin.messaging().sendEachForMulticast(message);
      
      return { 
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
       };
    } catch (error) {
      console.error('Firebase notification error:', error);
      throw error;
    }
  }

  private async getAdminFCMTokens(): Promise<string[]> {
    const admins = await this.prisma.user.findMany({
      where: { 
        role: 'ADMIN', 
        fcmToken: { not: null },
    },
      select: { fcmToken: true }
    })

    return admins.map(admin => admin.fcmToken).filter(token => token !== null);
  }
}
