import EventedTokenizer from './evented-tokenizer';

export interface TokenizerOptions {
  loc?: any;
};

export type Attribute = [string, string, boolean];

export interface Token {
  type: string;
  chars?: string;
  attributes?: Attribute[];
  tagName?: string;
  selfClosing?: boolean;
  loc?: {
    start: {
      line: number;
      column: number;
    },
    end: {
      line: number;
      column: number;
    }
  };
  syntaxError?: string;
}

export default class Tokenizer {
  private token: Token = null;
  private startLine = 1;
  private startColumn = 0;
  private tokenizer: EventedTokenizer;
  private tokens: Token[] = [];
  private currentAttribute: Attribute = null;

  constructor(entityParser, private options: TokenizerOptions = {}) {
    this.tokenizer = new EventedTokenizer(this, entityParser);
  }

  tokenize(input) {
    this.tokens = [];
    this.tokenizer.tokenize(input);
    return this.tokens;
  }

  tokenizePart(input) {
    this.tokens = [];
    this.tokenizer.tokenizePart(input);
    return this.tokens;
  }

  tokenizeEOF() {
    this.tokens = [];
    this.tokenizer.tokenizeEOF();
    return this.tokens[0];
  }

  reset() {
    this.token = null;
    this.startLine = 1;
    this.startColumn = 0;
  }

  addLocInfo() {
    if (this.options.loc) {
      this.token.loc = {
        start: {
          line: this.startLine,
          column: this.startColumn
        },
        end: {
          line: this.tokenizer.line,
          column: this.tokenizer.column
        }
      };
    }
    this.startLine = this.tokenizer.line;
    this.startColumn = this.tokenizer.column;
  }

  // Data

  beginData() {
    this.token = {
      type: 'Chars',
      chars: ''
    };
    this.tokens.push(this.token);
  }

  appendToData(char) {
    this.token.chars += char;
  }

  finishData() {
    this.addLocInfo();
  }

  // Comment

  beginComment() {
    this.token = {
      type: 'Comment',
      chars: ''
    };
    this.tokens.push(this.token);
  }

  appendToCommentData(char) {
    this.token.chars += char;
  }

  finishComment() {
    this.addLocInfo();
  }

  // Tags - basic

  beginStartTag() {
    this.token = {
      type: 'StartTag',
      tagName: '',
      attributes: [],
      selfClosing: false
    };
    this.tokens.push(this.token);
  }

  beginEndTag() {
    this.token = {
      type: 'EndTag',
      tagName: ''
    };
    this.tokens.push(this.token);
  }

  finishTag() {
    this.addLocInfo();
  }

  markTagAsSelfClosing() {
    this.token.selfClosing = true;
  }

  // Tags - name

  appendToTagName(char) {
    this.token.tagName += char;
  }

  // Tags - attributes

  beginAttribute() {
    this.currentAttribute = ["", "", null];
    this.token.attributes.push(this.currentAttribute);
  }

  appendToAttributeName(char) {
    this.currentAttribute[0] += char;
  }

  beginAttributeValue(isQuoted) {
    this.currentAttribute[2] = isQuoted;
  }

  appendToAttributeValue(char) {
    this.currentAttribute[1] = this.currentAttribute[1] || "";
    this.currentAttribute[1] += char;
  }

  finishAttributeValue() {
  }

  reportSyntaxError(message: string) {
    this.token.syntaxError = message;
  }
}
