import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { SiweErrorType } from 'siwe'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('nonce')
  async getNonce(@Req() req) {
    req.session.nonce = this.authService.getNonce()
    console.log(req.session)
    return req.session.nonce
  }
  @Post('verify')
  async verify(@Body() body, @Req() req: any, @Res() res: Response) {
    if (!body.message) {
      throw new HttpException('message不存在', HttpStatus.BAD_REQUEST)
    }
    try {
      const message = await this.authService.verify(body, req.session.nonce)
      req.session.siwe = message
      req.session.cookie.expires = new Date(message.expirationTime)
      req.session.save(() => res.status(HttpStatus.OK).send(true))
    } catch (e) {
      req.session.siwe = null
      req.session.nonce = null
      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          req.session.save(() => res.status(440).json({ message: e.message }))
          break
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          req.session.save(() => res.status(422).json({ message: e.message }))
          break
        }
        default: {
          req.session.save(() => res.status(500).json({ message: e.message }))
          break
        }
      }
    }
  }
  @Get('me')
  async me(@Req() req: any, @Res() res: Response) {
    return `You are authenticated and your address is: ${req.session.siwe.address}`
  }
}
