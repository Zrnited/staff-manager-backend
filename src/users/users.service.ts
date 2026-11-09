import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
    this.repo = repo;
  }

  //create a user
  create(firstName: string, lastName: string, email: string, password: string) {
    //create an instance of the user Entity - IMPORTANT - So hooks (or logs) can be excuted
    const user = this.repo.create({ firstName, lastName, email, password });

    return this.repo.save(user);
  }

  //find a user by id
  async findOne(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  //find a user by email
  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  //find list of users
  //   find() {}

  //update a user information
  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    // //verify if email isn't in use already
    // if (attrs.email && attrs.email !== user.email) {
    //   const taken = await this.findByEmail(attrs.email);
    //   if (taken) throw new ConflictException('Email already in use');
    // }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  //delete a user info
  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.repo.remove(user);
  }
}
