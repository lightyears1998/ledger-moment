import randomstring from "randomstring";

export function genSecret(): string {
  return randomstring.generate({
    length: 64,
    readable: true,
    charset: "alphanumeric",
    capitalization: "lowercase"
  });
}
