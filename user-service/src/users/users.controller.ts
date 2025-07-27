import { Body, Controller, Get, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UpdateUserDto, UserProfile } from './dto/user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@Request() req): Promise<UserProfile> {
        return this.usersService.getProfile(req.user.sub);
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserProfile> {
        return this.usersService.updateProfile(req.user.sub, updateUserDto)
    }

    @Put('photo')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads/',
            filename: (req, file, callback) => {
                callback(null, `photo-${Date.now()}${extname(file.originalname)}`);
            }
        }),
    }))
    async updatePhoto(@Request() req, @UploadedFile() file: any) {
        return this.usersService.updateProfile(req.user.sub, {
            photo: file.filename
        });
    }

    @Put('change-password')
    async changePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto): Promise<{ message: string }> {
        await this.usersService.changePassword(req.user.sub, updatePasswordDto)
        return { message: 'Password updated successfully' };
    }

    @Roles(['ADMIN'])
    @Get('all')
    async getAllUsers(@Request() req): Promise<UserProfile[]> {
        return this.usersService.getAllUsers()
    }

    @Roles(['ADMIN'])
    @Put(':id')
    async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserProfile> {
        return this.usersService.updateUser(req.params.id, updateUserDto);
    }

    @Roles(['ADMIN'])
    @Get(':id')
    async getUserById(@Request() req): Promise<UserProfile> {
        return this.usersService.getProfile(req.params.id)
    }
}
