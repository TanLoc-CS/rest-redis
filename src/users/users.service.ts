import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';
import * as redis from "redis"
import { v4 as uuidv4 } from 'uuid';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UsersService {
  redisClient: RedisClientType
  constructor() {
    this.redisClient = redis.createClient();
    this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
    this.redisClient.connect();
  }
  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const id = uuidv4();
    return await this.redisClient.lPush(id, [password, email, username, id]);
  }

  async findAll() {
    const ids = await this.redisClient.keys("*").then(res => { return res; });

    return await Promise.all(ids.map(async (id) => {
      const user = await this.redisClient.lRange(id, 0, 3).then(res => { return res; });
      const userJSON = new UserModel(user[0], user[1], user[2], user[3]);
      return userJSON;
    }))
  }

  async findOne(id: string) {
    const user = await this.redisClient.lRange(id, 0, 3).then(res => { return res; }).catch(err => console.log(err));
    const userJSON = new UserModel(user[0], user[1], user[2], user[3]);
    return userJSON;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // await this.redisClient.lRange(id, 0, 3).then(res => { console.log(res) }).catch(err => console.log(err));
    await this.redisClient.lSet(id, 3, updateUserDto.password);
    // await this.redisClient.lRange(id, 0, 3).then(res => { console.log(res) }).catch(err => console.log(err));
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.redisClient.lRange(id, 0, 3).then(res => { return res; }).catch(err => console.log(err));
    if (!user)
      throw new HttpException("User not found", HttpStatus.FORBIDDEN)
    await this.redisClient.del(id);
    return `This action removes a #${id} user`;
  }
}
