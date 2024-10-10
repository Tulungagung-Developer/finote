import * as bcrypt from 'bcrypt';

function hash(text: string): string {
  return bcrypt.hashSync(text, 10);
}

function compare(text: string, hash: string): boolean {
  return bcrypt.compareSync(text, hash);
}

export const Crypt = {
  hash,
  compare,
};
