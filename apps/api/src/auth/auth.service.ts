import { Injectable } from '@nestjs/common'
import { SiweMessage, generateNonce } from 'siwe'
@Injectable()
export class AuthService {
  async verify(body, nonce) {
    const SIWEObject = new SiweMessage(body.message)
    const { data: message } = await SIWEObject.verify({
      signature: body.signature,
      nonce: nonce,
    })
    return message
  }
  getNonce() {
    return generateNonce()
  }
}
