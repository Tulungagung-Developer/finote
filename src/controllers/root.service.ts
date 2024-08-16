import { Injectable } from '@nestjs/common';

@Injectable()
export class RootService {
  getHello() {
    return { message: 'Hello World!' };
  }
}
