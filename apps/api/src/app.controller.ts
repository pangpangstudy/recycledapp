import { Controller, Get, Req, Session, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getHello(@Session() session, @Req() req) {
    console.log(session)
    console.log(session.nonce)
    console.log(req.session)
    return this.appService.getHello()
  }
}
