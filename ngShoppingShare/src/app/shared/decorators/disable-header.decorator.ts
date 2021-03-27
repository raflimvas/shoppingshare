export function DisableHeader(value: boolean = true) {
  return function (target: any) {
      target.prototype.disableHeader = value;
  };
}
