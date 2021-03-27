
export const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export function isNullOrWhitespace(input: string): boolean {
  if (typeof input === 'undefined' || input == null) {
    return true;
  }
  return input.match(/^ *$/) !== null;
}
