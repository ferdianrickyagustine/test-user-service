import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UpdateUserDto, UserProfile } from './dto/user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    async getProfile(@Request() req): Promise<UserProfile> {
        return this.usersService.getProfile(req.user.sub);
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserProfile> {
        return this.usersService.updateProfile(req.user.sub, updateUserDto)
    }

    @Put('change-password')
    async changePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto): Promise<{ message: string } > {
        await this.usersService.changePassword(req.user.sub, updatePasswordDto)
        return  { message: 'Password updated successfully' };
    }

    @Roles(['ADMIN'])
    @Get('all')
    async getAllUsers(@Request() req): Promise<UserProfile[]> {
        return this.usersService.getAllUsers()
    }
}
