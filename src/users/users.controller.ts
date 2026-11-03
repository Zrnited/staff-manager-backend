import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Res,
  UnauthorizedException,
  // UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UsersService } from './users.service.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { Serialize } from '../interceptors/serialize.interceptor.js';
import { UserDto } from './dtos/user.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/login-user.dto.js';
import type { Request, Response } from 'express';
// import { AuthGuard } from '../guards/auth.guard.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('users')
@Serialize(UserDto) //handling password removal
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/create-user')
  @ResponseMessage('User created successfully')
  createUser(@Body() body: CreateUserDto) {
    const { firstName, lastName, email, password } = body;
    const user = this.usersService.create(firstName, lastName, email, password);
    return user;
  }

  @Public()
  @Post('/signup')
  @ResponseMessage('User created successfully')
  signup(@Body() body: CreateUserDto) {
    const { firstName, lastName, email, password } = body;
    return this.authService.signup(firstName, lastName, email, password);
  }

  @Public()
  @Post('/signin')
  @ResponseMessage('Login successful')
  async signin(@Body() body: LoginDto, @Req() req: Request) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    await new Promise<void>(
      (res, rej) => req.session.regenerate((err) => (err ? rej(err) : res())), // new ID on login
    );
    req.session.userId = user.id;
    return user;
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        res.clearCookie('connect.sid'); // default cookie name
        resolve();
      });
    });
  }

  @Get('/whoami') // static route first
  @ResponseMessage('Current user found!')
  async whoami(@Req() req: Request) {
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.findOne(userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  // @UseGuards(AuthGuard)
  @ResponseMessage('User fetched successfully')
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.usersService.findOne(id);
    return user;
  }

  @Delete('/:id')
  @ResponseMessage('User deleted successfully')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  @ResponseMessage('User updated successfully')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}
