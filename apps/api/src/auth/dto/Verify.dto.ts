import { IsNotEmpty, IsString } from 'class-validator'
import { SiweMessage } from 'siwe'

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  message: string
  @IsString()
  @IsNotEmpty()
  signature: string
}
