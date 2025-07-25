import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    email?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    photo?: string

    @IsOptional()
    @IsString()
    position?: string
}

export class UserProfile {
    id: string
    name: string
    email: string
    phone?: string
    photo?: string
    position?: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export class UpdatePasswordDto {
    @IsString()
    @MinLength(6)
    currentPassword: string

    @IsString()
    @MinLength(6)
    newPassword: string

    @IsString()
    @MinLength(6)
    confirmPassword: string
}