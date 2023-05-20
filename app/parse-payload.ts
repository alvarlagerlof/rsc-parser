export function parsePayload(payload: string) {
  const rows = payload.split("\n");

  const response: _Response = {
    _chunks: new Map(),
    _fromJSON: undefined as any,
  };

  response._fromJSON = createFromJSONCallback(response as _Response);

  const parsedRows = rows
    .map((row) => {
      return { raw: row, parsed: processFullRow(response, row)! };
    })
    .filter(({ parsed }) => !!parsed);
  return {
    raw: payload,
    rows: parsedRows,
    chunks: response._chunks,
  };
}

export type ParsedPayload = ReturnType<typeof parsePayload>;
export type Row = ParsedPayload["rows"][number];

type _Response = {
  _chunks: Map<string | number, ParsedResponseValue>;
  _fromJSON?: (key: string, value: JSONValue) => any;
};

type ParsedResponseValue = ReturnType<typeof processFullRow>;

type UninitializedModel = string;

export type JSONValue =
  | number
  | null
  | boolean
  | string
  | { [key: string]: JSONValue }
  | JSONValue[];

function processFullRow(response: _Response, row: string) {
  if (row === "") {
    return null;
  }
  const colon = row.indexOf(":", 0);
  const id = parseInt(row.slice(0, colon), 16);
  const tag = row[colon + 1];
  // When tags that are not text are added, check them here before
  // parsing the row as text.
  // switch (tag) {
  // }
  switch (tag) {
    case "I": {
      return { id, row: parseModule(response, id, row.slice(colon + 2)) };
    }
    case "H": {
      const code = row[colon + 2];
      return { id, row: parseHint(response, code, row.slice(colon + 3)) };
    }
    case "E": {
      const errorInfo = JSON.parse(row.slice(colon + 2));
      // if (__DEV__) {
      //   resolveErrorDev(
      //     response,
      //     id,
      //     errorInfo.digest,
      //     errorInfo.message,
      //     errorInfo.stack
      //   );
      // } else {
      //   resolveErrorProd(response, id, errorInfo.digest);
      // }
      return { id, row: { type: "error" as const, errorInfo } };
    }
    default: {
      // We assume anything else is JSON.
      // resolveModel(response, id, row.slice(colon + 1));
      // return;
      return {
        id,
        row: register(response, id, {
          type: "model" as const,
          // id,
          data: parseModel(response, row.slice(colon + 1)),
        }),
      };
    }
  }
}

export type ClientReferenceMetadata = {
  id: string;
  chunks: Array<string>;
  name: string;
  async: boolean;
};

function register<T>(response: _Response, id: number, value: T): T {
  response._chunks.set(id, value as any);
  return value;
}

function parseModule(
  response: _Response,
  id: number,
  model: UninitializedModel
) {
  // const chunks = response._chunks;
  // const chunk = chunks.get(id);
  const clientReferenceMetadata: ClientReferenceMetadata = parseModel(
    response,
    model
  );
  return register(response, id, {
    type: "module-import" as const,
    // id,
    meta: clientReferenceMetadata,
  });
}

// This typing is a bit lazy, React has more detailed types for it
export type HintModel = string | [string, Record<string, any>];

function parseHint(
  response: _Response,
  code: string,
  model: UninitializedModel
) {
  const hintModel = parseModel<HintModel>(response, model);
  return { type: "hint" as const, code, value: hintModel };
}

function parseModel<T = ParsedModel>(
  response: _Response,
  json: UninitializedModel
): T {
  return JSON.parse(json, response._fromJSON);
}

export type ParsedModel =
  | ParsedElement
  | ParsedPrimitive
  | ParsedModel[]
  | { [key: string]: ParsedModel };

function createFromJSONCallback(response: _Response) {
  return function (this: any, key: string, value: JSONValue) {
    if (typeof value === "string") {
      // We can't use .bind here because we need the "this" value.
      return parseModelString(response, this, key, value);
    }
    if (typeof value === "object" && value !== null) {
      return parseModelTuple(response, value);
    }
    return value;
  };
}

type ParsedStringReference =
  | { type: "lazy-component-reference"; id: number }
  | { type: "promise-reference"; id: number }
  | {
      type: "server-context-provider";
      name: string;
    }
  | { type: "server-reference"; id: number }
  | { type: "reference"; id: number };

type ParsedPrimitive =
  | "$"
  | string
  | number
  | Date
  | undefined
  | null
  | bigint
  | symbol;

function parseModelString(
  response: _Response,
  parentObject: Object,
  key: string,
  value: string
): ParsedStringReference | ParsedPrimitive {
  if (value[0] === "$") {
    if (value === "$") {
      // A very common symbol.
      return REACT_ELEMENT_TYPE;
    }
    switch (value[1]) {
      case "$": {
        // This was an escaped string value.
        return value.slice(1);
      }
      case "L": {
        // Lazy node
        const id = parseInt(value.slice(2), 16);

        // // We create a React.lazy wrapper around any lazy values.
        // // When passed into React, we'll know how to suspend on this.
        // return createLazyChunkWrapper(chunk);

        return { type: "lazy-component-reference" as const, id };
      }
      case "@": {
        // Promise
        const id = parseInt(value.slice(2), 16);
        // const chunk = getChunk(response, id);
        // return chunk;
        return { type: "promise-reference" as const, id };
      }
      case "S": {
        // Symbol
        return Symbol.for(value.slice(2));
      }
      case "P": {
        // Server Context Provider
        // return getOrCreateServerContext(value.slice(2)).Provider;

        return {
          type: "server-context-provider" as const,
          name: value.slice(2),
        };
      }
      case "F": {
        // Server Reference
        const id = parseInt(value.slice(2), 16);
        return { type: "server-reference" as const, id };
      }
      case "I": {
        // $Infinity
        return Infinity;
      }
      case "-": {
        // $-0 or $-Infinity
        if (value === "$-0") {
          return -0;
        } else {
          return -Infinity;
        }
      }
      case "N": {
        // $NaN
        return NaN;
      }
      case "u": {
        // matches "$undefined"
        // Special encoding for `undefined` which can't be serialized as JSON otherwise.
        return undefined;
      }
      case "D": {
        // Date
        return new Date(Date.parse(value.slice(2)));
      }
      case "n": {
        // BigInt
        return BigInt(value.slice(2));
      }
      default: {
        // We assume that anything else is a reference ID.
        const id = parseInt(value.slice(1), 16);
        return { type: "reference" as const, id };
      }
    }
  }
  return value;
}

const REACT_ELEMENT_TYPE = "$";

export type PickVariant<
  T extends { type: string },
  TVariant extends (T & {})["type"]
> = T & {
  type: TVariant;
};

export function isComponentReference(
  elementType: ParsedElement["elementType"]
): elementType is LazyComponentReference {
  return (
    typeof elementType === "object" &&
    (elementType.type === "lazy-component-reference" ||
      elementType.type === "reference")
  );
}

export type ParsedElement = ReturnType<typeof parsedElement>;

export type LazyComponentReference = PickVariant<
  ParsedStringReference,
  "lazy-component-reference"
>;

export type OtherComponentReference = PickVariant<
  ParsedStringReference,
  "reference"
>;

type ComponentReference = LazyComponentReference | OtherComponentReference;

export function parsedElement(
  type: string | ComponentReference,
  config: any,
  props: any
) {
  return { type: "element" as const, elementType: type, config, props };
}

function parseModelTuple(
  response: _Response,
  value: { [key: string]: JSONValue } | JSONValue[]
): any {
  const tuple: [unknown, unknown, unknown, unknown] = value as any;

  if (tuple[0] === REACT_ELEMENT_TYPE) {
    // TODO: Consider having React just directly accept these arrays as elements.
    // Or even change the ReactElement type to be an array.
    return parsedElement(tuple[1] as string, tuple[2], tuple[3]);
  }
  return value;
}
