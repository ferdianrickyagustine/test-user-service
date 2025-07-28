import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto, UserProfile } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private firebaseService: FirebaseService
    ) { }


    async getProfile(userId: string): Promise<UserProfile> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user as UserProfile
    }

    async updateProfile(userId: string, updateData: UpdateUserDto): Promise<UserProfile> {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!currentUser) {
            throw new NotFoundException('User not found');
        }

        if (updateData.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateData.email },
            });
            if (existingUser && existingUser.id !== userId) {
                throw new NotFoundException('Email already in use by another user');
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        try {
            await this.firebaseService.sendNotificationToAdmins(
                'User Profile Updated',
                `User ${currentUser.name} has updated their profile`,
                { userId, changes: updateData, previousName: currentUser.name }
            );
        } catch (error) {
            console.error('Gagal kirim notifikasi ke admin:', error);
        }

        return updatedUser as UserProfile;
    }

    async changePassword(userId: string, passwordData: UpdatePasswordDto): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException('User not found');
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

    async updateUser(userId: string, updateData: UpdateUserDto): Promise<UserProfile> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        if (updateData.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateData.email },
            })
            if (existingUser && existingUser.id !== userId) {
                throw new NotFoundException('Email sudah digunakan oleh pengguna lain')
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        return updatedUser as UserProfile;
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserProfile> {
        const { email, password, name, phone, position, role } = createUserDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                position,
                role: role || 'EMPLOYEE',
            },
        });


        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword as UserProfile
    }
}
