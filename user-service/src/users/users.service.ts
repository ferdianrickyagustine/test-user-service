import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePasswordDto, UpdateUserDto, UserProfile } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


  async getProfile(userId: string): Promise<UserProfile> {
    const user =  await this.prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        throw new NotFoundException('User not found')
    }

    return user as UserProfile
  }

  async updateProfile(userId: string, updateData: UpdateUserDto): Promise<UserProfile> {
    if (updateData.email) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: updateData.email },
        })

        if (existingUser && existingUser.id !== userId) {
            throw new NotFoundException('Email already in use by another user');
        }
    }

    const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData
    })

    return updatedUser as UserProfile
  }

  async changePassword(userId: string, passwordData: UpdatePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
        throw new NotFoundException('Incorrect Password');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new NotFoundException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10)

    await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })

    return { message: 'Password updated successfully' }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    const users = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return users as UserProfile[]
  }
}
