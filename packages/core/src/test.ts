const enableBinaryFlight = true;

type RowParserState = 0 | 1 | 2 | 3 | 4;

export type FlightResponse = {
  _rowState: RowParserState;
  _rowID: number; // parts of a row ID parsed so far
  _rowTag: number; // 0 indicates that we're currently parsing the row ID
  _rowLength: number; // remaining bytes in the row. 0 indicates that we're looking for a newline.
  _buffer: Array<Uint8Array>; // chunks received so far as part of this row
  _stringDecoder: StringDecoder;
  _chunks: Chunk[];
};

const ROW_ID = 0;
const ROW_TAG = 1;
const ROW_LENGTH = 2;
const ROW_CHUNK_BY_NEWLINE = 3;
const ROW_CHUNK_BY_LENGTH = 4;

export function processBinaryChunk(
  response: FlightResponse,
  chunk: Uint8Array,
): void {
  let i = 0;
  let rowState = response._rowState;
  let rowID = response._rowID;
  let rowTag = response._rowTag;
  let rowLength = response._rowLength;
  const buffer = response._buffer;
  const chunkLength = chunk.length;
  while (i < chunkLength) {
    let lastIdx = -1;
    switch (rowState) {
      case ROW_ID: {
        const byte = chunk[i++];
        if (byte === 58 /* ":" */) {
          // Finished the rowID, next we'll parse the tag.
          rowState = ROW_TAG;
        } else {
          rowID = (rowID << 4) | (byte > 96 ? byte - 87 : byte - 48);
        }
        continue;
      }
      case ROW_TAG: {
        const resolvedRowTag = chunk[i];
        if (
          resolvedRowTag === 84 /* "T" */ ||
          (enableBinaryFlight &&
            (resolvedRowTag === 65 /* "A" */ ||
              resolvedRowTag === 67 /* "C" */ ||
              resolvedRowTag === 99 /* "c" */ ||
              resolvedRowTag === 85 /* "U" */ ||
              resolvedRowTag === 83 /* "S" */ ||
              resolvedRowTag === 115 /* "s" */ ||
              resolvedRowTag === 76 /* "L" */ ||
              resolvedRowTag === 108 /* "l" */ ||
              resolvedRowTag === 70 /* "F" */ ||
              resolvedRowTag === 68 /* "D" */ ||
              resolvedRowTag === 78 /* "N" */ ||
              resolvedRowTag === 109 /* "m" */ ||
              resolvedRowTag === 86)) /* "V" */
        ) {
          rowTag = resolvedRowTag;
          rowState = ROW_LENGTH;
          i++;
        } else if (resolvedRowTag > 64 && resolvedRowTag < 91 /* "A"-"Z" */) {
          rowTag = resolvedRowTag;
          rowState = ROW_CHUNK_BY_NEWLINE;
          i++;
        } else {
          rowTag = 0;
          rowState = ROW_CHUNK_BY_NEWLINE;
          // This was an unknown tag so it was probably part of the data.
        }
        continue;
      }
      case ROW_LENGTH: {
        const byte = chunk[i++];
        if (byte === 44 /* "," */) {
          // Finished the rowLength, next we'll buffer up to that length.
          rowState = ROW_CHUNK_BY_LENGTH;
        } else {
          rowLength = (rowLength << 4) | (byte > 96 ? byte - 87 : byte - 48);
        }
        continue;
      }
      case ROW_CHUNK_BY_NEWLINE: {
        // We're looking for a newline
        lastIdx = chunk.indexOf(10 /* "\n" */, i);
        break;
      }
      case ROW_CHUNK_BY_LENGTH: {
        // We're looking for the remaining byte length
        lastIdx = i + rowLength;
        if (lastIdx > chunk.length) {
          lastIdx = -1;
        }
        break;
      }
    }
    const offset = chunk.byteOffset + i;
    if (lastIdx > -1) {
      // We found the last chunk of the row
      const length = lastIdx - i;
      const lastChunk = new Uint8Array(chunk.buffer, offset, length);
      processFullRow(response, rowID, rowTag, buffer, lastChunk);
      // Reset state machine for a new row
      i = lastIdx;
      if (rowState === ROW_CHUNK_BY_NEWLINE) {
        // If we're trailing by a newline we need to skip it.
        i++;
      }
      rowState = ROW_ID;
      rowTag = 0;
      rowID = 0;
      rowLength = 0;
      buffer.length = 0;
    } else {
      // The rest of this row is in a future chunk. We stash the rest of the
      // current chunk until we can process the full row.
      const length = chunk.byteLength - i;
      const remainingSlice = new Uint8Array(chunk.buffer, offset, length);
      buffer.push(remainingSlice);
      // Update how many bytes we're still waiting for. If we're looking for
      // a newline, this doesn't hurt since we'll just ignore it.
      rowLength -= remainingSlice.byteLength;
      break;
    }
  }
  response._rowState = rowState;
  response._rowID = rowID;
  response._rowTag = rowTag;
  response._rowLength = rowLength;
}

type TextChunk = {
  type: "text";
  id: string;
  value: string;
};

type ModuleChunk = {
  type: "module";
  id: string;
  value: string;
};

type HintChunk = {
  type: "hint";
  id: string;
  code: string;
  value: string;
};

type TreeChunk = {
  type: "tree";
  id: string;
  value: string;
};

type ErrorChunk = {
  type: "error";
  id: string;
  digest: string;
  message?: string;
  stack?: string;
};

type PostponeChunk = {
  type: "postpone";
  id: string;
  reason?: string;
  stack?: string;
};

type BufferChunk = {
  type: "buffer";
  id: string;
  value: ArrayBuffer;
};

export type Chunk =
  | TextChunk
  | ModuleChunk
  | HintChunk
  | TreeChunk
  | ErrorChunk
  | PostponeChunk
  | BufferChunk;

const __DEV__ = process.env.NODE_ENV === "development";
const enablePostpone = true;

export function processFullRow(
  response: FlightResponse,
  id: number,
  tag: number,
  buffer: Array<Uint8Array>,
  chunk: Uint8Array,
): void {
  console.log("processFullRow", response, id, tag, buffer, chunk);
  if (enableBinaryFlight) {
    switch (tag) {
      case 65 /* "A" */:
        // We must always clone to extract it into a separate buffer instead of just a view.
        // resolveBuffer(response, id, mergeBuffer(buffer, chunk).buffer);
        response._chunks.push({
          type: "buffer",
          id: new Number(id).toString(16),
          value: mergeBuffer(buffer, chunk).buffer,
        });
        return;
      case 67 /* "C" */:
        resolveTypedArray(response, id, buffer, chunk, Int8Array, 1);
        return;
      case 99 /* "c" */:
        // resolveBuffer(
        //   response,
        //   id,
        //   buffer.length === 0 ? chunk : mergeBuffer(buffer, chunk),
        // );
        response._chunks.push({
          type: "buffer",
          id: new Number(id).toString(16),
          value:
            buffer.length === 0 ? chunk : mergeBuffer(buffer, chunk).buffer,
        });
        return;
      case 85 /* "U" */:
        resolveTypedArray(response, id, buffer, chunk, Uint8ClampedArray, 1);
        return;
      case 83 /* "S" */:
        resolveTypedArray(response, id, buffer, chunk, Int16Array, 2);
        return;
      case 115 /* "s" */:
        resolveTypedArray(response, id, buffer, chunk, Uint16Array, 2);
        return;
      case 76 /* "L" */:
        resolveTypedArray(response, id, buffer, chunk, Int32Array, 4);
        return;
      case 108 /* "l" */:
        resolveTypedArray(response, id, buffer, chunk, Uint32Array, 4);
        return;
      case 70 /* "F" */:
        resolveTypedArray(response, id, buffer, chunk, Float32Array, 4);
        return;
      case 68 /* "D" */:
        resolveTypedArray(response, id, buffer, chunk, Float64Array, 8);
        return;
      case 78 /* "N" */:
        resolveTypedArray(response, id, buffer, chunk, BigInt64Array, 8);
        return;
      case 109 /* "m" */:
        resolveTypedArray(response, id, buffer, chunk, BigUint64Array, 8);
        return;
      case 86 /* "V" */:
        resolveTypedArray(response, id, buffer, chunk, DataView, 1);
        return;
    }
  }

  const stringDecoder = response._stringDecoder;
  let row = "";
  for (let i = 0; i < buffer.length; i++) {
    row += readPartialStringChunk(stringDecoder, buffer[i]);
  }
  row += readFinalStringChunk(stringDecoder, chunk);

  switch (tag) {
    case 73 /* "I" */: {
      //resolveModule(response, id, row);
      response._chunks.push({
        type: "module",
        id: new Number(id).toString(16),
        value: row,
      });
      return;
    }
    case 72 /* "H" */: {
      const code = row[0] as HintCode;
      //resolveHint(response, code, row.slice(1));
      response._chunks.push({
        type: "hint",
        code: code,
        id: new Number(id).toString(16),
        value: row.slice(1),
      });
      return;
    }
    case 69 /* "E" */: {
      const errorInfo = JSON.parse(row);
      if (__DEV__) {
        // resolveErrorDev(
        //   response,
        //   id,
        //   errorInfo.digest,
        //   errorInfo.message,
        //   errorInfo.stack,
        // );
        response._chunks.push({
          type: "error",
          id: new Number(id).toString(16),
          digest: errorInfo.digest,
          message: errorInfo.message,
          stack: errorInfo.stack,
        });
      } else {
        //resolveErrorProd(response, id, errorInfo.digest);
        response._chunks.push({
          type: "error",
          id: new Number(id).toString(16),
          digest: errorInfo.digest,
        });
      }
      return;
    }
    case 84 /* "T" */: {
      //resolveText(response, id, row);
      response._chunks.push({
        type: "text",
        id: new Number(id).toString(16),
        value: row,
      });
      return;
    }
    case 80 /* "P" */: {
      if (enablePostpone) {
        if (__DEV__) {
          const postponeInfo = JSON.parse(row);
          // resolvePostponeDev(
          //   response,
          //   id,
          //   postponeInfo.reason,
          //   postponeInfo.stack,
          // );
          response._chunks.push({
            type: "postpone",
            id: new Number(id).toString(16),
            reason: postponeInfo.reason,
            stack: postponeInfo.stack,
          });
        } else {
          //resolvePostponeProd(response, id);
          response._chunks.push({
            type: "postpone",
            id: new Number(id).toString(16),
          });
        }
        return;
      }
    }
    // Fallthrough
    default: /* """ "{" "[" "t" "f" "n" "0" - "9" */ {
      // We assume anything else is JSON.
      //resolveModel(response, id, row);
      response._chunks.push({
        type: "tree",
        id: new Number(id).toString(16),
        value: row,
      });
      return;
    }
  }
}

function resolveTypedArray(
  response: FlightResponse,
  id: number,
  buffer: Array<Uint8Array>,
  lastChunk: Uint8Array,
  constructor: any,
  bytesPerElement: number,
): void {
  // If the view fits into one original buffer, we just reuse that buffer instead of
  // copying it out to a separate copy. This means that it's not always possible to
  // transfer these values to other threads without copying first since they may
  // share array buffer. For this to work, it must also have bytes aligned to a
  // multiple of a size of the type.
  const chunk =
    buffer.length === 0 && lastChunk.byteOffset % bytesPerElement === 0
      ? lastChunk
      : mergeBuffer(buffer, lastChunk);
  // TODO: The transfer protocol of RSC is little-endian. If the client isn't little-endian
  // we should convert it instead. In practice big endian isn't really Web compatible so it's
  // somewhat safe to assume that browsers aren't going to run it, but maybe there's some SSR
  // server that's affected.
  const view: ArrayBufferView = new constructor(
    chunk.buffer,
    chunk.byteOffset,
    chunk.byteLength / bytesPerElement,
  );
  // resolveBuffer(response, id, view);
  response._chunks.push({
    type: "buffer",
    id: new Number(id).toString(16),
    value: view.buffer,
  });
}

function mergeBuffer(
  buffer: Array<Uint8Array>,
  lastChunk: Uint8Array,
): Uint8Array {
  const l = buffer.length;
  // Count the bytes we'll need
  let byteLength = lastChunk.length;
  for (let i = 0; i < l; i++) {
    byteLength += buffer[i].byteLength;
  }
  // Allocate enough contiguous space
  const result = new Uint8Array(byteLength);
  let offset = 0;
  // Copy all the buffers into it.
  for (let i = 0; i < l; i++) {
    const chunk = buffer[i];
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  result.set(lastChunk, offset);
  return result;
}

export type PreinitOptions = {
  as: string;
  precedence?: string;
  crossOrigin?: string;
  integrity?: string;
  nonce?: string;
  fetchPriority?: FetchPriorityEnum;
};
export type PreinitModuleOptions = {
  as?: string;
  crossOrigin?: string;
  integrity?: string;
  nonce?: string;
};

type CrossOriginString = string;
export type CrossOriginEnum = "" | "use-credentials" | CrossOriginString;
export type FetchPriorityEnum = "high" | "low" | "auto";

export type PreloadImplOptions = {
  crossOrigin?: CrossOriginEnum;
  integrity?: string;
  nonce?: string;
  type?: string;
  fetchPriority?: string;
  referrerPolicy?: string;
  imageSrcSet?: string;
  imageSizes?: string;
  media?: string;
};
export type PreloadModuleImplOptions = {
  as?: string;
  crossOrigin?: CrossOriginEnum;
  integrity?: string;
  nonce?: string;
};
export type PreinitStyleOptions = {
  crossOrigin?: CrossOriginEnum;
  integrity?: string;
  fetchPriority?: string;
};
export type PreinitScriptOptions = {
  crossOrigin?: CrossOriginEnum;
  integrity?: string;
  fetchPriority?: string;
  nonce?: string;
};
export type PreinitModuleScriptOptions = {
  crossOrigin?: CrossOriginEnum;
  integrity?: string;
  nonce?: string;
};

type UnspecifiedPrecedence = 0;

type TypeMap = {
  // prefetchDNS(href)
  D: /* href */ string;
  // preconnect(href, options)
  C: /* href */ string | [/* href */ string, CrossOriginEnum];
  // preconnect(href, options)
  L:
    | [/* href */ string, /* as */ string]
    | [/* href */ string, /* as */ string, PreloadImplOptions];
  m: /* href */ string | [/* href */ string, PreloadModuleImplOptions];
  S:
    | /* href */ string
    | [/* href */ string, /* precedence */ string]
    | [
        /* href */ string,
        /* precedence */ string | UnspecifiedPrecedence,
        PreinitStyleOptions,
      ];
  X: /* href */ string | [/* href */ string, PreinitScriptOptions];
  M: /* href */ string | [/* href */ string, PreinitModuleScriptOptions];
};

type HintCode = keyof TypeMap;

export type StringDecoder = TextDecoder;

export function createStringDecoder() {
  return new TextDecoder();
}

const decoderOptions = { stream: true };

export function readPartialStringChunk(
  decoder: StringDecoder,
  buffer: Uint8Array,
): string {
  return decoder.decode(buffer, decoderOptions);
}

export function readFinalStringChunk(
  decoder: StringDecoder,
  buffer: Uint8Array,
): string {
  return decoder.decode(buffer);
}
