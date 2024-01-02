import type {
  CrossOriginEnum,
  PreloadImplOptions,
  PreloadModuleImplOptions,
  PreinitStyleOptions,
  PreinitScriptOptions,
  PreinitModuleScriptOptions,
} from "./ReactDOMTypes";

// We use zero to represent the absence of an explicit precedence because it is
// small, smaller than how we encode undefined, and is unambiguous. We could use
// a different tuple structure to encode this instead but this makes the runtime
// cost cheaper by eliminating a type checks in more positions.
type UnspecifiedPrecedence = 0;

// prettier-ignore
type TypeMap = {
    // prefetchDNS(href)
    'D': /* href */ string,
    // preconnect(href, options)
    'C':
      | /* href */ string
      | [/* href */ string, CrossOriginEnum],
    // preconnect(href, options)
    'L':
      | [/* href */ string, /* as */ string]
      | [/* href */ string, /* as */ string, PreloadImplOptions],
    'm':
      | /* href */ string
      | [/* href */ string, PreloadModuleImplOptions],
    'S':
      | /* href */ string
      | [/* href */ string, /* precedence */ string]
      | [/* href */ string, /* precedence */ string | UnspecifiedPrecedence, PreinitStyleOptions],
    'X':
      | /* href */ string
      | [/* href */ string, PreinitScriptOptions],
    'M':
      | /* href */ string
      | [/* href */ string, PreinitModuleScriptOptions],
  }

export type HintCode = keyof TypeMap;
export type HintModel<T extends HintCode> = TypeMap[T];

export type Hints = Set<string>;
