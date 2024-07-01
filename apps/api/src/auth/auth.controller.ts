import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common'
import { SiweMessage, generateNonce } from 'siwe'
import { VerifyDto } from './dto/Verify.dto'
import { SessionData } from 'express-session'
declare module 'express-session' {
  interface SessionData {
    nonce: string
    siwe: SiweMessage
  }
}
@Controller('auth')
export class AuthController {
  constructor() {}
  @Get('nonce')
  getNonce(@Session() session: SessionData) {
    const nonce = generateNonce()
    session.nonce = nonce
    return nonce
  }
  @Post('verify')
  async verify(@Body() body: VerifyDto, @Session() session: SessionData) {
    try {
      const sessionNonce = session.nonce
      if (!sessionNonce) {
        throw new HttpException('服务端session错误,session中没有nonce值', 500)
      }
      const { message, signature } = body

      const SIWEObject = new SiweMessage(message)

      const { data } = await SIWEObject.verify({
        signature,
        nonce: sessionNonce,
      })
      session.siwe = data
      session.cookie.maxAge = 2 * 6 * 60 * 60 * 1000
      return { message: 'Verification successful' }
    } catch (error) {
      session.siwe = null
      session.nonce = null
      console.error(error)
      throw new HttpException(error, HttpStatus.UNAUTHORIZED)
    }
  }
  @Get('logout')
  logout(@Session() session) {
    session.destroy((err) => {
      if (err) {
        return { message: 'F ailed to destroy session', error: err }
      } else {
        return { message: 'Logged out successfully' }
      }
    })
  }

  @Get('authStatus')
  isAuth(@Session() session) {
    console.log(session)
    return { address: session.siwe?.address ? session.siwe.address : '' }
  }
}
