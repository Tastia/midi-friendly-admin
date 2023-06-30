import { emailRegex } from "../generator/regex";

export const isValidEmail = (string: string) => emailRegex.test(string);
