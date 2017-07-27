const WSP = /[\t\n\f ]/;
const ALPHA = /[A-Za-z]/;
const CRLF = /\r\n?/g;

export function isSpace(char: string): boolean {
  return WSP.test(char);
}

export function isAlpha(char: string): boolean {
  return ALPHA.test(char);
}

export function preprocessInput(input: string): string {
  return input.replace(CRLF, "\n");
}
