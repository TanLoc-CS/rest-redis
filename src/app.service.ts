import { Injectable } from '@nestjs/common';
// import { RedisClientType } from '@redis/client';
// import * as redis from "redis"
// import cryptoRandomString from 'crypto-random-string';

@Injectable()
export class AppService {
  // redisClient: RedisClientType
  // constructor() {
  //   this.redisClient = redis.createClient();
  //   this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
  //   this.redisClient.connect();
  // }

  async getHello() {
    // const name = await this.redisClient.get("name").then(res => { return res; });
    return 'name';
  }

  async setName(name: string) {
    // return await this.redisClient.set('name', name);
  }
}
