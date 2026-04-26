import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDTO } from './dtos/loginUsuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
    loginUsuario(
      @Body() loginUsuarioDto: LoginUsuarioDTO
    ){
      return this.authService.loginUsuario(loginUsuarioDto);
    }
}
