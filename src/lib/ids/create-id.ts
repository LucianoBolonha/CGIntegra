import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
const nanoid = customAlphabet(alphabet, 16);

export function createId(prefix: string): string {
  return `${prefix}_${nanoid()}`;
}
