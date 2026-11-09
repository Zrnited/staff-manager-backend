import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import type { Request } from 'express';
import { validatePassword } from '../utils/validate-password.js';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    //VALIDATE EMAIL/CHECK CONFLICT
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('email is in use already');

    //VALIDATE PASSWORD
    const { valid, errors } = validatePassword(password, {
      email,
      name: `${lastName} ${firstName}`,
    });

    if (!valid) throw new BadRequestException(errors);

    //HASH USER'S PASSWORD
    // Generate a Salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    //CREATE A NEW USER AND SAVE IT
    const user = await this.usersService.create(
      firstName,
      lastName,
      email,
      result, //password
    );

    //RETURN THE SAVED USER
    return user;
  }

  async signin(email: string, password: string) {
    //CHECK USER RECORD
    const existingUser = await this.usersService.findByEmail(email);

    if (!existingUser) throw new NotFoundException('user not found');

    //TEST PASSWORD MATCH
    //structure "salt.hash"
    const [salt, stored_hash] = existingUser.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (stored_hash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    //RETURN USER
    return existingUser;
  }

  async signOut(req: Request): Promise<void> {
    return new Promise((res, rej) => {
      req.session.destroy((err) => (err ? rej(err) : res()));
    });
  }
}
