import { Controller, Get, Req, Session } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Session() session, @Req() req) {
    console.log(session)
    console.log(session.nonce)
    console.log(req.session)
    return this.appService.getHello()
  }
}
