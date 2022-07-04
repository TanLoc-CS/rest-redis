import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post(':name')
  setName(@Param('name') name: string) {
    return this.appService.setName(name);
  }
}
