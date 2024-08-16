import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthLoginBodyDto, AuthLoginResDto } from '@ctrl/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AbstractController } from '@ctrl/abstract.controller';

@Controller()
export class AuthController extends AbstractController {
  private mockUsers: { id: string; username: string; password: string; last_session?: Date }[] = [
    {
      id: '1',
      username: 'default',
      password: 'default',
      last_session: undefined,
    },
  ];

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  @Post('login')
  async login(@Body() body: AuthLoginBodyDto): Promise<AuthLoginResDto> {
    this.logger.log({ body });
    const user = this.mockUsers.find((u) => u.username === body.username);
    if (user && user.password === body.password) {
      if (user.last_session) throw new UnauthorizedException('There was active session');

      user.last_session = new Date();
      return {
        access_token: this.jwtService.sign({ sub: user.id, iat: Date.now() }),
      };
    }

    throw new UnauthorizedException('Invalid username or password');
  }
}
