const HEXCHARCODE = /^#[xX]([A-Fa-f0-9]+)$/;
const CHARCODE    = /^#([0-9]+)$/;
const NAMED       = /^([A-Za-z0-9]+)$/;

export default class EntityParser {
  constructor(private named) {
  }

  parse(entity) {
    if (!entity) {
      return;
    }
    let matches = entity.match(HEXCHARCODE);
    if (matches) {
      return String.fromCharCode(parseInt(matches[1], 16));
    }
    matches = entity.match(CHARCODE);
    if (matches) {
      return String.fromCharCode(parseInt(matches[1], 10));
    }
    matches = entity.match(NAMED);
    if (matches) {
      return this.named[matches[1]];
    }
  }
}
