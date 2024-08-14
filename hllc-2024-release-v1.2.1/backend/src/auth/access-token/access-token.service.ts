import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenPayload } from '../interfaces/access-token.interface';

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: IAccessTokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async verify(token: string): Promise<IAccessTokenPayload> {
    // console.log('access',token);

    try {
      const payload =
        await this.jwtService.verifyAsync<IAccessTokenPayload>(token);
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
