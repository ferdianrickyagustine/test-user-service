import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersService, FirebaseService],
  controllers: [UsersController]
})
export class UsersModule {}
