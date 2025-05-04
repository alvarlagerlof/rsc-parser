/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  StringDecoder,
  createStringDecoder,
  readFinalStringChunk,
  readPartialStringChunk,
} from './ReactFlightClientConfigBrowser';
import { ClientReferenceMetadata } from './ReactFlightClientConfigBundlerWebpack';
import { ImportMetadata } from './ReactFlightImportMetadata';
import { HintCode, HintModel } from './ReactFlightServerConfigDOM';
import { REACT_ELEMENT_TYPE } from './ReactSymbols';
import {
  ReactComponentInfo,
  ReactErrorInfoDev,
  ReactStackTrace,
} from './ReactTypes';

const enablePostpone = true;
const enableFlightReadableStream = true;
const enableBinaryFlight = true;
// const enableOwnerStacks = false;

export type TextChunk = {
  type: 'text';
  id: string;
  value: string;
  originalValue: string;
  timestamp: number;
  _response: FlightResponse;
};

export type ModuleChunk = {
  type: 'module';
  id: string;
  value: ImportMetadata;
  originalValue: string;
  timestamp: number;
  _response: FlightResponse;
};

export type ModelChunk = {
  type: 'model';
  id: string;
  value: unknown;
  originalValue: string;
  timestamp: number;
  _response: FlightResponse;
};

export type HintChunk = {
  type: 'hint';
  id: string;
  code: string;
  value: HintModel<HintCode>;
  originalValue: { code: string; model: string };
  timestamp: number;
  _response: FlightResponse;
};

export type ErrorDevChunk = {
  type: 'errorDev';
  id: string;
  error: ErrorWithDigest;
  originalValue: ReactErrorInfoDev;
  timestamp: number;
  _response: FlightResponse;
};

export type ErrorProdChunk = {
  type: 'errorProd';
  id: string;
  error: ErrorWithDigest;
  originalValue: null;
  timestamp: number;
  _response: FlightResponse;
};

export type PostponeDevChunk = {
  type: 'postponeDev';
  id: string;
  error: Postpone;
  originalValue: { reason: string; stack: string };
  timestamp: number;
  _response: FlightResponse;
};

export type PostponeProdChunk = {
  type: 'postponeProd';
  id: string;
  error: Postpone;
  originalValue: undefined;
  timestamp: number;
  _response: FlightResponse;
};

export type BufferChunk = {
  type: 'buffer';
  id: string;
  value: ArrayBufferView | ArrayBuffer;
  originalValue: string;
  timestamp: number;
  _response: FlightResponse;
};

export type DebugInfoChunk = {
  type: 'debugInfo';
  id: string;
  value: { name: string };
  originalValue: { name: string };
  timestamp: number;
  _response: FlightResponse;
};

export type ConsoleChunk = {
  type: 'console';
  id: string;
  value: {
    methodName: string;
    stackTrace: ReactStackTrace;
    owner: Reference;
    env: string;
    args: Array<any>;
  };
  originalValue: undefined;
  timestamp: number;
  _response: FlightResponse;
};

export type StartAsyncIterableChunk = {
  type: 'startAsyncIterable';
  id: string;
  value: {
    iterator: boolean;
  };
  originalValue: undefined;
  timestamp: number;
  _response: FlightResponse;
};

export type StartReadableStreamChunk = {
  type: 'startReadableStream';
  id: string;
  value: {
    type: void | 'bytes';
  };
  originalValue: undefined;
  timestamp: number;
  _response: FlightResponse;
};

export type StopStreamChunk = {
  type: 'stopStream';
  id: string;
  value: UninitializedModel;
  originalValue: undefined;
  timestamp: number;
  _response: FlightResponse;
};

export type Chunk =
  | TextChunk
  | ModuleChunk
  | HintChunk
  | ModelChunk
  | ErrorDevChunk
  | ErrorProdChunk
  | PostponeDevChunk
  | PostponeProdChunk
  | BufferChunk
  | DebugInfoChunk
  | ConsoleChunk
  | StartReadableStreamChunk
  | StartAsyncIterableChunk
  | StopStreamChunk;

type RowParserState = 0 | 1 | 2 | 3 | 4;

type UninitializedModel = string;

type JSONValue =
  | string
  | number
  | boolean
  | null
  | Array<JSONValue>
  | { [key: string]: JSONValue };

export type FlightResponse = {
  _rowState: RowParserState;
  _rowID: number; // parts of a row ID parsed so far
  _rowTag: number; // 0 indicates that we're currently parsing the row ID
  _rowLength: number; // remaining bytes in the row. 0 indicates that we're looking for a newline.
  _buffer: Array<Uint8Array>; // chunks received so far as part of this row
  _stringDecoder: StringDecoder;
  _replayConsole: boolean;
  _chunks: Chunk[];
  _currentTimestamp: number;
  __DEV__: boolean;

  _fromJSON: (key: string, value: JSONValue) => any;
};

export type Reference = {
  $$type: 'reference';
  id: string;
  identifier: string;
  type: string;
};

export function isReference(x: unknown): x is Reference {
  return (
    typeof x === 'object' &&
    x !== null &&
    '$$type' in x &&
    x.$$type === 'reference'
  );
}

function createServerReferenceProxy /*<A: Iterable<any>, T>*/(
  response: FlightResponse,
  metaData: { id: any; bound: null /*| Thenable<Array<any>>*/ },
): Pick<Reference, 'identifier' | 'type'> /*:(...A) => Promise<T>*/ {
  // const callServer = response._callServer;
  // const proxy = function (): Promise<T> {
  //   // $FlowFixMe[method-unbinding]
  //   const args = Array.prototype.slice.call(arguments);
  //   const p = metaData.bound;
  //   if (!p) {
  //     return callServer(metaData.id, args);
  //   }
  //   if (p.status === INITIALIZED) {
  //     const bound = p.value;
  //     return callServer(metaData.id, bound.concat(args));
  //   }
  //   // Since this is a fake Promise whose .then doesn't chain, we have to wrap it.
  //   // TODO: Remove the wrapper once that's fixed.
  //   return ((Promise.resolve(p): any): Promise<Array<any>>).then(
  //     function (bound) {
  //       return callServer(metaData.id, bound.concat(args));
  //     },
  //   );
  // };
  // registerServerReference(proxy, metaData, response._encodeFormAction);
  // return proxy;

  return {
    identifier: 'F',
    type: 'Server Reference',
  };
}

function getOutlinedModel<T>(
  response: FlightResponse,
  reference: string,
  parentObject: object,
  key: string,
  map: (
    response: FlightResponse,
    model: any,
  ) => Pick<Reference, 'identifier' | 'type'> /*T*/,
): Reference /*: T*/ {
  const path = reference.split(':');
  const id = parseInt(path[0], 16);

  const metadata = map(response, undefined);
  return {
    $$type: 'reference',
    id: new Number(id).toString(16),
    identifier: '',
    type: metadata.type,
  };

  // const chunk = getChunk(response, id);
  // switch (chunk.status) {
  //   case RESOLVED_MODEL:
  //     initializeModelChunk(chunk);
  //     break;
  //   case RESOLVED_MODULE:
  //     initializeModuleChunk(chunk);
  //     break;
  // }
  // The status might have changed after initialization.
  // switch (chunk.status) {
  //   case INITIALIZED:
  //     let value = chunk.value;
  //     for (let i = 1; i < path.length; i++) {
  //       value = value[path[i]];
  //     }
  //     const chunkValue = map(response, value);
  //     if (response.__DEV__ && chunk._debugInfo) {
  //       // If we have a direct reference to an object that was rendered by a synchronous
  //       // server component, it might have some debug info about how it was rendered.
  //       // We forward this to the underlying object. This might be a React Element or
  //       // an Array fragment.
  //       // If this was a string / number return value we lose the debug info. We choose
  //       // that tradeoff to allow sync server components to return plain values and not
  //       // use them as React Nodes necessarily. We could otherwise wrap them in a Lazy.
  //       if (
  //         typeof chunkValue === 'object' &&
  //         chunkValue !== null &&
  //         (isArray(chunkValue) ||
  //           typeof chunkValue[ASYNC_ITERATOR] === 'function' ||
  //           chunkValue.$$typeof === REACT_ELEMENT_TYPE) &&
  //         !chunkValue._debugInfo
  //       ) {
  //         // We should maybe use a unique symbol for arrays but this is a React owned array.
  //         // $FlowFixMe[prop-missing]: This should be added to elements.
  //         Object.defineProperty((chunkValue: any), '_debugInfo', {
  //           configurable: false,
  //           enumerable: false,
  //           writable: true,
  //           value: chunk._debugInfo,
  //         });
  //       }
  //     }
  //     return chunkValue;
  //   case PENDING:
  //   case BLOCKED:
  //     return waitForReference(chunk, parentObject, key, response, map, path);
  //   default:
  //     // This is an error. Instead of erroring directly, we're going to encode this on
  //     // an initialization handler so that we can catch it at the nearest Element.
  //     if (initializingHandler) {
  //       initializingHandler.errored = true;
  //       initializingHandler.value = chunk.reason;
  //     } else {
  //       initializingHandler = {
  //         parent: null,
  //         chunk: null,
  //         value: chunk.reason,
  //         deps: 0,
  //         errored: true,
  //       };
  //     }
  //     // Placeholder
  //     return (null: any);
  // }
}

function createMap(
  response: FlightResponse,
  model: Array<[any, any]>,
): Pick<Reference, 'identifier' | 'type'> /*: Map<any, any>*/ {
  //return new Map(model);

  return {
    identifier: 'Q',
    type: 'Map',
  } as const;
}

function createSet(
  response: FlightResponse,
  model: Array<any>,
): Pick<Reference, 'identifier' | 'type'> /*: Set<any>*/ {
  //return new Set(model);

  return {
    identifier: 'W',
    type: 'Set',
  };
}

function createBlob(
  response: FlightResponse,
  model: Array<any>,
): Pick<Reference, 'identifier' | 'type'> /*: Blob*/ {
  // return new Blob(model.slice(1), { type: model[0] });

  return {
    identifier: 'B',
    type: 'Blob',
  };
}

function createFormData(
  response: FlightResponse,
  model: Array<[any, any]>,
): Pick<Reference, 'identifier' | 'type'> /*: FormData*/ {
  // const formData = new FormData();
  // for (let i = 0; i < model.length; i++) {
  //   formData.append(model[i][0], model[i][1]);
  // }
  // return formData;

  return {
    identifier: 'K',
    type: 'FormData',
  };
}

function extractIterator(
  response: FlightResponse,
  model: Array<any>,
): Pick<Reference, 'identifier' | 'type'> /*: Iterator<any>*/ {
  // // $FlowFixMe[incompatible-use]: This uses raw Symbols because we're extracting from a native array.
  // return model[Symbol.iterator]();

  return {
    identifier: 'i',
    type: 'Iterator',
  };
}

function createModel(
  response: FlightResponse,
  model: any,
): Pick<Reference, 'identifier' | 'type'> /*: any*/ {
  // return model;

  return {
    identifier: '',
    type: 'Reference',
  };
}

function parseModelString(
  response: FlightResponse,
  parentObject: object,
  key: string,
  value: string,
) {
  if (value[0] === '$') {
    if (value === '$') {
      // A very common symbol.
      return REACT_ELEMENT_TYPE;
    }
    switch (value[1]) {
      case '$': {
        // This was an escaped string value.
        return value.slice(1);
      }
      case 'L': {
        // Lazy node
        const id = parseInt(value.slice(2), 16);
        // const chunk = getChunk(response, id);
        // // We create a React.lazy wrapper around any lazy values.
        // // When passed into React, we'll know how to suspend on this.
        // return createLazyChunkWrapper(chunk);

        return {
          $$type: 'reference',
          id: new Number(id).toString(16),
          identifier: 'L',
          type: 'Lazy node',
        } satisfies Reference;
      }
      case '@': {
        // Promise
        const id = parseInt(value.slice(2), 16);
        // const chunk = getChunk(response, id);
        // return chunk;

        return {
          $$type: 'reference',
          id: new Number(id).toString(16),
          identifier: '@',
          type: 'Promise',
        } satisfies Reference;
      }
      case 'S': {
        // Symbol
        return Symbol.for(value.slice(2));
      }
      case 'F': {
        // Server Reference
        const ref = value.slice(2);
        return getOutlinedModel(
          response,
          ref,
          parentObject,
          key,
          createServerReferenceProxy,
        );
      }
      case 'T': {
        // Temporary Reference
        // const reference = '$' + value.slice(2);
        // const temporaryReferences = response._tempRefs;
        // if (temporaryReferences == null) {
        //   throw new Error(
        //     'Missing a temporary reference set but the RSC response returned a temporary reference. ' +
        //       'Pass a temporaryReference option with the set that was used with the reply.',
        //   );
        // }
        // return readTemporaryReference(temporaryReferences, reference);
        return 'Missing a temporary reference set but the RSC response returned a temporary reference.';
      }
      case 'Q': {
        // Map
        const ref = value.slice(2);
        return getOutlinedModel(response, ref, parentObject, key, createMap);
      }
      case 'W': {
        // Set
        const ref = value.slice(2);
        return getOutlinedModel(response, ref, parentObject, key, createSet);
      }
      case 'B': {
        // Blob
        if (enableBinaryFlight) {
          const ref = value.slice(2);
          return getOutlinedModel(response, ref, parentObject, key, createBlob);
        }
        return undefined;
      }
      case 'K': {
        // FormData
        const ref = value.slice(2);
        return getOutlinedModel(
          response,
          ref,
          parentObject,
          key,
          createFormData,
        );
      }
      case 'Z': {
        // Error
        if (response.__DEV__) {
          const ref = value.slice(2);

          console.log('test', {
            ref,
            parentObject,
            value,
          });

          return getOutlinedModel(response, ref, parentObject, key, () => {
            return {
              identifier: 'Z',
              type: 'Error',
            };
          });
        } else {
          return resolveErrorProd(response, 1000);
        }
      }
      case 'i': {
        // Iterator
        const ref = value.slice(2);
        return getOutlinedModel(
          response,
          ref,
          parentObject,
          key,
          extractIterator,
        );
      }
      case 'I': {
        // $Infinity
        return Infinity;
      }
      case '-': {
        // $-0 or $-Infinity
        if (value === '$-0') {
          return -0;
        } else {
          return -Infinity;
        }
      }
      case 'N': {
        // $NaN
        return NaN;
      }
      case 'u': {
        // matches "$undefined"
        // Special encoding for `undefined` which can't be serialized as JSON otherwise.
        return undefined;
      }
      case 'D': {
        // Date
        return new Date(Date.parse(value.slice(2)));
      }
      case 'n': {
        // BigInt
        return BigInt(value.slice(2));
      }
      case 'E': {
        if (response.__DEV__) {
          // // In DEV mode we allow indirect eval to produce functions for logging.
          // // This should not compile to eval() because then it has local scope access.
          // try {
          //   return (0, eval)(value.slice(2));
          // } catch (x) {
          //   // We currently use this to express functions so we fail parsing it,
          //   // let's just return a blank function as a place holder.
          //   return function () {};
          // }
        }
        // Fallthrough
      }
      case 'Y': {
        if (response.__DEV__) {
          // // In DEV mode we encode omitted objects in logs as a getter that throws
          // // so that when you try to access it on the client, you know why that
          // // happened.
          // Object.defineProperty(parentObject, key, {
          //   get: function () {
          //     // We intentionally don't throw an error object here because it looks better
          //     // without the stack in the console which isn't useful anyway.
          //     throw (
          //       'This object has been omitted by React in the console log ' +
          //       'to avoid sending too much data from the server. Try logging smaller ' +
          //       'or more specific objects.'
          //     );
          //   },
          //   enumerable: true,
          //   configurable: false,
          // });
          // return null;
        }
        // Fallthrough
      }
      default: {
        // We assume that anything else is a reference ID.
        const ref = value.slice(1);
        return getOutlinedModel(response, ref, parentObject, key, createModel);
      }
    }
  }
  return value;
}

function parseModelTuple(
  response: FlightResponse,
  value: { [key: string]: JSONValue } | ReadonlyArray<JSONValue>,
) {
  if (!Array.isArray(value)) {
    return value;
  }

  if (value.length < 4) {
    return value;
  }

  if (value[0] === REACT_ELEMENT_TYPE) {
    // TODO: Consider having React just directly accept these arrays as elements.
    // Or even change the ReactElement type to be an array.
    return createElement(value[1], value[2], value[3]);
  }

  return value;
}

function ResponseInstance(__DEV__: boolean) {
  // @ts-expect-error TODO: fix this
  const response: FlightResponse = {
    _buffer: [],
    _rowID: 0,
    _rowTag: 0,
    _rowLength: 0,
    _rowState: 0,
    _replayConsole: true,
    _currentTimestamp: 0,
    _stringDecoder: createStringDecoder(),
    _chunks: [] as FlightResponse['_chunks'],
    __DEV__: __DEV__,
  };

  response._fromJSON = createFromJSONCallback(response);

  return response;
}

export function createFlightResponse(__DEV__: boolean): FlightResponse {
  return ResponseInstance(__DEV__);
}

export function createElement(type: unknown, key: unknown, props: unknown) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type as string,
    key: key as string | number | bigint,
    // ref: null,
    props: props as { [key: string]: unknown },

    // // Record the component responsible for creating this element.
    // _owner: null,
  };
  // if (response.__DEV__) {
  //   // We don't really need to add any of these but keeping them for good measure.
  //   // Unfortunately, _store is enumerable in jest matchers so for equality to
  //   // work, I need to keep it or make _store non-enumerable in the other file.
  //   element._store = ({}: {
  //     validated?: boolean,
  //   });
  //   Object.defineProperty(element._store, 'validated', {
  //     configurable: false,
  //     enumerable: false,
  //     writable: true,
  //     value: true, // This element has already been validated on the server.
  //   });
  //   Object.defineProperty(element, '_self', {
  //     configurable: false,
  //     enumerable: false,
  //     writable: false,
  //     value: null,
  //   });
  //   Object.defineProperty(element, '_source', {
  //     configurable: false,
  //     enumerable: false,
  //     writable: false,
  //     value: null,
  //   });
  // }
  return element;
}

export function isElement(x: unknown): x is ReturnType<typeof createElement> {
  return (
    typeof x === 'object' &&
    x !== null &&
    '$$typeof' in x &&
    x.$$typeof === REACT_ELEMENT_TYPE
  );
}

function resolveModel(
  response: FlightResponse,
  id: number,
  model: UninitializedModel,
): void {
  const chunks = response._chunks;

  const value = parseModel(response, model);

  chunks.push({
    type: 'model',
    id: new Number(id).toString(16),
    value: value,
    originalValue: model,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveText(response: FlightResponse, id: number, text: string): void {
  const chunks = response._chunks;
  // We assume that we always reference large strings after they've been
  // emitted.

  chunks.push({
    type: 'text',
    id: new Number(id).toString(16),
    value: text,
    originalValue: text,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveBuffer(
  response: FlightResponse,
  id: number,
  buffer: ArrayBufferView | ArrayBuffer,
): void {
  const chunks = response._chunks;
  // We assume that we always reference buffers after they've been emitted.

  chunks.push({
    type: 'buffer',
    id: new Number(id).toString(16),
    value: buffer,
    originalValue: buffer.toString(),
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveModule(
  response: FlightResponse,
  id: number,
  model: UninitializedModel,
): void {
  const chunks = response._chunks;

  const clientReferenceMetadata: ClientReferenceMetadata = parseModel(
    response,
    model,
  );

  chunks.push({
    type: 'module',
    id: new Number(id).toString(16),
    value: clientReferenceMetadata,
    originalValue: model,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

// function resolveStream<T: ReadableStream | $AsyncIterable<any, any, void>>(
//   response: Response,
//   id: number,
//   stream: T,
//   controller: FlightStreamController,
// ): void {
//   const chunks = response._chunks;
//   const chunk = chunks.get(id);
//   if (!chunk) {
//     chunks.set(id, createInitializedStreamChunk(response, stream, controller));
//     return;
//   }
//   if (chunk.status !== PENDING) {
//     // We already resolved. We didn't expect to see this.
//     return;
//   }
//   const resolveListeners = chunk.value;
//   const resolvedChunk: InitializedStreamChunk<T> = (chunk: any);
//   resolvedChunk.status = INITIALIZED;
//   resolvedChunk.value = stream;
//   resolvedChunk.reason = controller;
//   if (resolveListeners !== null) {
//     wakeChunk(resolveListeners, chunk.value);
//   }
// }

function startReadableStream<T>(
  response: FlightResponse,
  id: number,
  type: void | 'bytes',
): void {
  response._chunks.push({
    type: 'startReadableStream',
    id: new Number(id).toString(16),
    value: {
      type: type,
    },
    originalValue: undefined,
    timestamp: response._currentTimestamp,
    _response: response,
  });

  // let controller: ReadableStreamController = (null: any);
  // const stream = new ReadableStream({
  //   type: type,
  //   start(c) {
  //     controller = c;
  //   },
  // });
  // let previousBlockedChunk: SomeChunk<T> | null = null;
  // const flightController = {
  //   enqueueValue(value: T): void {
  //     if (previousBlockedChunk === null) {
  //       controller.enqueue(value);
  //     } else {
  //       // We're still waiting on a previous chunk so we can't enqueue quite yet.
  //       previousBlockedChunk.then(function () {
  //         controller.enqueue(value);
  //       });
  //     }
  //   },
  //   enqueueModel(json: UninitializedModel): void {
  //     if (previousBlockedChunk === null) {
  //       // If we're not blocked on any other chunks, we can try to eagerly initialize
  //       // this as a fast-path to avoid awaiting them.
  //       const chunk: ResolvedModelChunk<T> = createResolvedModelChunk(
  //         response,
  //         json,
  //       );
  //       initializeModelChunk(chunk);
  //       const initializedChunk: SomeChunk<T> = chunk;
  //       if (initializedChunk.status === INITIALIZED) {
  //         controller.enqueue(initializedChunk.value);
  //       } else {
  //         chunk.then(
  //           (v) => controller.enqueue(v),
  //           (e) => controller.error((e: any)),
  //         );
  //         previousBlockedChunk = chunk;
  //       }
  //     } else {
  //       // We're still waiting on a previous chunk so we can't enqueue quite yet.
  //       const blockedChunk = previousBlockedChunk;
  //       const chunk: SomeChunk<T> = createPendingChunk(response);
  //       chunk.then(
  //         (v) => controller.enqueue(v),
  //         (e) => controller.error((e: any)),
  //       );
  //       previousBlockedChunk = chunk;
  //       blockedChunk.then(function () {
  //         if (previousBlockedChunk === chunk) {
  //           // We were still the last chunk so we can now clear the queue and return
  //           // to synchronous emitting.
  //           previousBlockedChunk = null;
  //         }
  //         resolveModelChunk(chunk, json);
  //       });
  //     }
  //   },
  //   close(json: UninitializedModel): void {
  //     if (previousBlockedChunk === null) {
  //       controller.close();
  //     } else {
  //       const blockedChunk = previousBlockedChunk;
  //       // We shouldn't get any more enqueues after this so we can set it back to null.
  //       previousBlockedChunk = null;
  //       blockedChunk.then(() => controller.close());
  //     }
  //   },
  //   error(error: mixed): void {
  //     if (previousBlockedChunk === null) {
  //       // $FlowFixMe[incompatible-call]
  //       controller.error(error);
  //     } else {
  //       const blockedChunk = previousBlockedChunk;
  //       // We shouldn't get any more enqueues after this so we can set it back to null.
  //       previousBlockedChunk = null;
  //       blockedChunk.then(() => controller.error((error: any)));
  //     }
  //   },
  // };
  // resolveStream(response, id, stream, flightController);
}

// function asyncIterator(this: $AsyncIterator<any, any, void>) {
//   // Self referencing iterator.
//   return this;
// }

// function createIterator<T>(
//   next: (arg: void) => SomeChunk<IteratorResult<T, T>>,
// ): $AsyncIterator<T, T, void> {
//   const iterator: any = {
//     next: next,
//     // TODO: Add return/throw as options for aborting.
//   };
//   // TODO: The iterator could inherit the AsyncIterator prototype which is not exposed as
//   // a global but exists as a prototype of an AsyncGenerator. However, it's not needed
//   // to satisfy the iterable protocol.
//   (iterator: any)[ASYNC_ITERATOR] = asyncIterator;
//   return iterator;
// }

function startAsyncIterable<T>(
  response: FlightResponse,
  id: number,
  iterator: boolean,
): void {
  response._chunks.push({
    type: 'startAsyncIterable',
    id: new Number(id).toString(16),
    value: {
      iterator: iterator,
    },
    originalValue: undefined,
    timestamp: response._currentTimestamp,
    _response: response,
  });

  // const buffer: Array<SomeChunk<IteratorResult<T, T>>> = [];
  // let closed = false;
  // let nextWriteIndex = 0;
  // const flightController = {
  //   enqueueValue(value: T): void {
  //     if (nextWriteIndex === buffer.length) {
  //       buffer[nextWriteIndex] = createInitializedIteratorResultChunk(
  //         response,
  //         value,
  //         false,
  //       );
  //     } else {
  //       const chunk: PendingChunk<IteratorResult<T, T>> = (buffer[
  //         nextWriteIndex
  //       ]: any);
  //       const resolveListeners = chunk.value;
  //       const rejectListeners = chunk.reason;
  //       const initializedChunk: InitializedChunk<IteratorResult<T, T>> =
  //         (chunk: any);
  //       initializedChunk.status = INITIALIZED;
  //       initializedChunk.value = { done: false, value: value };
  //       if (resolveListeners !== null) {
  //         wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
  //       }
  //     }
  //     nextWriteIndex++;
  //   },
  //   enqueueModel(value: UninitializedModel): void {
  //     if (nextWriteIndex === buffer.length) {
  //       buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
  //         response,
  //         value,
  //         false,
  //       );
  //     } else {
  //       resolveIteratorResultChunk(buffer[nextWriteIndex], value, false);
  //     }
  //     nextWriteIndex++;
  //   },
  //   close(value: UninitializedModel): void {
  //     closed = true;
  //     if (nextWriteIndex === buffer.length) {
  //       buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
  //         response,
  //         value,
  //         true,
  //       );
  //     } else {
  //       resolveIteratorResultChunk(buffer[nextWriteIndex], value, true);
  //     }
  //     nextWriteIndex++;
  //     while (nextWriteIndex < buffer.length) {
  //       // In generators, any extra reads from the iterator have the value undefined.
  //       resolveIteratorResultChunk(
  //         buffer[nextWriteIndex++],
  //         '"$undefined"',
  //         true,
  //       );
  //     }
  //   },
  //   error(error: Error): void {
  //     closed = true;
  //     if (nextWriteIndex === buffer.length) {
  //       buffer[nextWriteIndex] =
  //         createPendingChunk<IteratorResult<T, T>>(response);
  //     }
  //     while (nextWriteIndex < buffer.length) {
  //       triggerErrorOnChunk(buffer[nextWriteIndex++], error);
  //     }
  //   },
  // };
  // const iterable: $AsyncIterable<T, T, void> = {
  //   [ASYNC_ITERATOR](): $AsyncIterator<T, T, void> {
  //     let nextReadIndex = 0;
  //     return createIterator((arg) => {
  //       if (arg !== undefined) {
  //         throw new Error(
  //           'Values cannot be passed to next() of AsyncIterables passed to Client Components.',
  //         );
  //       }
  //       if (nextReadIndex === buffer.length) {
  //         if (closed) {
  //           // $FlowFixMe[invalid-constructor] Flow doesn't support functions as constructors
  //           return new Chunk(
  //             INITIALIZED,
  //             { done: true, value: undefined },
  //             null,
  //             response,
  //           );
  //         }
  //         buffer[nextReadIndex] =
  //           createPendingChunk<IteratorResult<T, T>>(response);
  //       }
  //       return buffer[nextReadIndex++];
  //     });
  //   },
  // };
  // TODO: If it's a single shot iterator we can optimize memory by cleaning up the buffer after
  // reading through the end, but currently we favor code size over this optimization.
  // resolveStream(
  //   response,
  //   id,
  //   iterator ? iterable[ASYNC_ITERATOR]() : iterable,
  //   flightController,
  // );
}

// function stopStream(
//   response: FlightResponse,
//   id: number,
//   row: UninitializedModel,
// ): void {
//   const chunks = response._chunks;
//   const chunk = chunks.get(id);
//   if (!chunk || chunk.status !== INITIALIZED) {
//     // We didn't expect not to have an existing stream;
//     return;
//   }
//   const streamChunk: InitializedStreamChunk<any> = (chunk: any);
//   const controller = streamChunk.reason;
//   controller.close(row === '' ? '"$undefined"' : row);
// }

function stopStream(
  response: FlightResponse,
  id: number,
  row: UninitializedModel,
): void {
  const chunks = response._chunks;

  chunks.push({
    type: 'stopStream',
    id: new Number(id).toString(16),
    value: row,
    originalValue: undefined,
    timestamp: response._currentTimestamp,
    _response: response,
  });

  //   const chunk = chunks.get(id);
  //   if (!chunk || chunk.status !== INITIALIZED) {
  //     // We didn't expect not to have an existing stream;
  //     return;
  //   }
  //   const streamChunk: InitializedStreamChunk<any> = (chunk: any);
  //   const controller = streamChunk.reason;
  //   controller.close(row === '' ? '"$undefined"' : row);
}

type ErrorWithDigest = Error & { digest?: string };
function resolveErrorProd(response: FlightResponse, id: number): void {
  // if (response.__DEV__) {
  //   // These errors should never make it into a build so we don't need to encode them in codes.json
  //   // eslint-disable-next-line react-internal/prod-error-codes
  //   throw new Error(
  //     "resolveErrorProd should never be called in development mode. Use resolveErrorDev instead. This is a bug in React.",
  //   );
  // }
  const error = new Error(
    'An error occurred in the Server Components render. The specific message is omitted in production' +
      ' builds to avoid leaking sensitive details. A digest property is included on this error instance which' +
      ' may provide additional details about the nature of the error.',
  );
  error.stack = 'Error: ' + error.message;

  const chunks = response._chunks;

  chunks.push({
    type: 'errorProd',
    id: new Number(id).toString(16),
    error: error,
    originalValue: null,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveErrorDev(
  response: FlightResponse,
  id: number,
  errorInfo: ReactErrorInfoDev,
): void {
  // if (!response.__DEV__) {
  //   // These errors should never make it into a build so we don't need to encode them in codes.json
  //   // eslint-disable-next-line react-internal/prod-error-codes
  //   throw new Error(
  //     "resolveErrorDev should never be called in production mode. Use resolveErrorProd instead. This is a bug in React.",
  //   );
  // }
  // // eslint-disable-next-line react-internal/prod-error-codes
  const error = new Error(
    errorInfo.message ||
      'An error occurred in the Server Components render but no message was provided',
  );
  // @ts-ex
  error.stack = errorInfo.stack.join(', ');

  (error as any).digest = errorInfo.digest;
  const errorWithDigest = error as ErrorWithDigest;
  const chunks = response._chunks;

  chunks.push({
    type: 'errorDev',
    id: new Number(id).toString(16),
    error: errorWithDigest,
    originalValue: errorInfo,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

declare class Postpone extends Error {
  $$typeof: symbol;
}

const REACT_POSTPONE_TYPE = Symbol.for('react.postpone');

function resolvePostponeProd(response: FlightResponse, id: number): void {
  // if (response.__DEV__) {
  //   // These errors should never make it into a build so we don't need to encode them in codes.json
  //   // eslint-disable-next-line react-internal/prod-error-codes
  //   throw new Error(
  //     "resolvePostponeProd should never be called in development mode. Use resolvePostponeDev instead. This is a bug in React.",
  //   );
  // }
  const error = new Error(
    'A Server Component was postponed. The reason is omitted in production' +
      ' builds to avoid leaking sensitive details.',
  );
  const postponeInstance = error as Postpone;
  postponeInstance.$$typeof = REACT_POSTPONE_TYPE;
  postponeInstance.stack = 'Error: ' + error.message;
  const chunks = response._chunks;

  chunks.push({
    type: 'postponeProd',
    id: new Number(id).toString(16),
    error: postponeInstance,
    originalValue: undefined,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolvePostponeDev(
  response: FlightResponse,
  id: number,
  reason: string,
  stack: string,
): void {
  // if (!response.__DEV__) {
  //   // These errors should never make it into a build so we don't need to encode them in codes.json
  //   // eslint-disable-next-line react-internal/prod-error-codes
  //   throw new Error(
  //     "resolvePostponeDev should never be called in production mode. Use resolvePostponeProd instead. This is a bug in React.",
  //   );
  // }
  // // eslint-disable-next-line react-internal/prod-error-codes
  const error = new Error(reason || '');
  const postponeInstance = error as Postpone;
  postponeInstance.$$typeof = REACT_POSTPONE_TYPE;
  postponeInstance.stack = stack;
  const chunks = response._chunks;

  chunks.push({
    type: 'postponeDev',
    id: new Number(id).toString(16),
    error: postponeInstance,
    originalValue: { reason, stack },
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveHint<Code extends HintCode>(
  response: FlightResponse,
  id: number,
  code: Code,
  model: UninitializedModel,
): void {
  const hintModel: HintModel<Code> = parseModel(response, model);

  const chunks = response._chunks;

  chunks.push({
    type: 'hint',
    id: new Number(id).toString(16),
    code: code,
    value: hintModel,
    originalValue: { code, model },
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveDebugInfo(
  response: FlightResponse,
  id: number,
  debugInfo: { name: string },
): void {
  // if (!response.__DEV__) {
  //   // These errors should never make it into a build so we don't need to encode them in codes.json
  //   // eslint-disable-next-line react-internal/prod-error-codes
  //   throw new Error(
  //     'resolveDebugInfo should never be called in production mode. This is a bug in React.',
  //   );
  // }

  const chunks = response._chunks;

  chunks.push({
    type: 'debugInfo',
    id: new Number(id).toString(16),
    value: debugInfo,
    originalValue: debugInfo,
    timestamp: response._currentTimestamp,
    _response: response,
  });
}

function resolveConsoleEntry(
  response: FlightResponse,
  id: number,
  value: UninitializedModel,
): void {
  // if (!response.__DEV__) {
  //   // These errors should never make it into a build so we don't need to encode them in codes.json
  //   // eslint-disable-next-line react-internal/prod-error-codes
  //   throw new Error(
  //     'resolveConsoleEntry should never be called in production mode. This is a bug in React.',
  //   );
  // }

  if (!response._replayConsole) {
    return;
  }

  console.log({ value });

  // "[\"warn\",
  // [[\"Pokemon\",
  //   \"/Users/alvar/Code/alvarlagerlof/rsc-parser/examples/embedded-example/.next/server/chunks/ssr/_a0bf3aeb._.js
  //   \",34,25]],\"$b\",\"Server\",\"$Zc\"]"

  const payload: [string, ReactStackTrace, Reference, string, any] = parseModel(
    response,
    value,
  );
  const methodName = payload[0];
  const stackTrace = payload[1];
  const owner = payload[2];
  const env = payload[3];
  const args = payload.slice(4);

  console.log(payload);

  response._chunks.push({
    type: 'console',
    id: new Number(id).toString(16),
    value: {
      methodName,
      stackTrace,
      owner,
      env,
      args,
    },
    originalValue: undefined,
    timestamp: response._currentTimestamp,
    _response: response,
  });

  // if (!enableOwnerStacks) {
  //   // Printing with stack isn't really limited to owner stacks but
  //   // we gate it behind the same flag for now while iterating.
  //   printToConsole(methodName, args, env);
  //   return;
  // }
  // const callStack = buildFakeCallStack(
  //   response,
  //   stackTrace,
  //   printToConsole.bind(null, methodName, args, env),
  // );
  // if (owner != null) {
  //   const task = initializeFakeTask(response, owner);
  //   if (task !== null) {
  //     task.run(callStack);
  //     return;
  //   }
  //   // TODO: Set the current owner so that consoleWithStackDev adds the component
  //   // stack during the replay - if needed.
  // }
  // const rootTask = response._debugRootTask;
  // if (rootTask != null) {
  //   rootTask.run(callStack);
  //   return;
  // }
  // callStack();
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

function resolveTypedArray(
  response: FlightResponse,
  id: number,
  buffer: Array<Uint8Array>,
  lastChunk: Uint8Array,
  constructor:
    | Int8ArrayConstructor
    | Uint8ClampedArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Int32ArrayConstructor
    | Uint32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor
    | BigInt64ArrayConstructor
    | BigUint64ArrayConstructor
    | DataViewConstructor,
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
  // @ts-expect-error TODO: fix this
  const view: ArrayBufferView = new constructor(
    chunk.buffer,
    chunk.byteOffset,
    chunk.byteLength / bytesPerElement,
  );
  resolveBuffer(response, id, view);
}

function processFullBinaryRow(
  response: FlightResponse,
  id: number,
  tag: number,
  buffer: Array<Uint8Array>,
  chunk: Uint8Array,
): void {
  if (enableBinaryFlight) {
    switch (tag) {
      case 65 /* "A" */:
        // We must always clone to extract it into a separate buffer instead of just a view.
        // @ts-expect-error TODO: fix this
        resolveBuffer(response, id, mergeBuffer(buffer, chunk).buffer);
        return;
      case 79 /* "O" */:
        resolveTypedArray(response, id, buffer, chunk, Int8Array, 1);
        return;
      case 111 /* "o" */:
        resolveBuffer(
          response,
          id,
          buffer.length === 0 ? chunk : mergeBuffer(buffer, chunk),
        );
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
      case 71 /* "G" */:
        resolveTypedArray(response, id, buffer, chunk, Float32Array, 4);
        return;
      case 103 /* "g" */:
        resolveTypedArray(response, id, buffer, chunk, Float64Array, 8);
        return;
      case 77 /* "M" */:
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
  let row = '';
  for (let i = 0; i < buffer.length; i++) {
    row += readPartialStringChunk(stringDecoder, buffer[i]);
  }
  row += readFinalStringChunk(stringDecoder, chunk);
  processFullStringRow(response, id, tag, row);
}

function processFullStringRow(
  response: FlightResponse,
  id: number,
  tag: number,
  row: string,
): void {
  switch (tag) {
    case 73 /* "I" */: {
      resolveModule(response, id, row);
      return;
    }
    case 72 /* "H" */: {
      const code = row[0] as HintCode;
      resolveHint(response, id, code, row.slice(1));
      return;
    }
    case 69 /* "E" */: {
      const errorInfo = JSON.parse(row);
      if (response.__DEV__) {
        resolveErrorDev(response, id, errorInfo);
      } else {
        resolveErrorProd(response, id);
      }
      return;
    }
    case 84 /* "T" */: {
      resolveText(response, id, row);
      return;
    }
    case 68 /* "D" */: {
      // if (!response.__DEV__) {
      //   // These errors should never make it into a build so we don't need to encode them in codes.json
      //   // eslint-disable-next-line react-internal/prod-error-codes
      //   throw new Error(
      //     'resolveDebugInfo should never be called in production mode. This is a bug in React.',
      //   );
      // }
      const debugInfo = JSON.parse(row);
      resolveDebugInfo(response, id, debugInfo);
      return;
      // // We eagerly initialize the fake task because this resolving happens outside any
      // // render phase so we're not inside a user space stack at this point. If we waited
      // // to initialize it when we need it, we might be inside user code.
      // initializeFakeTask(response, debugInfo);
      // const chunk = getChunk(response, id);
      // const chunkDebugInfo: ReactDebugInfo =
      //   chunk._debugInfo || (chunk._debugInfo = []);
      // chunkDebugInfo.push(debugInfo);
    }
    case 87 /* "W" */: {
      if (response.__DEV__) {
        resolveConsoleEntry(response, id, row);
        return;
      }
      throw new Error(
        'Failed to read a RSC payload created by a development version of React ' +
          'on the server while using a production version on the client. Always use ' +
          'matching versions on the server and the client.',
      );
    }
    case 82 /* "R" */: {
      if (enableFlightReadableStream) {
        startReadableStream(response, id, undefined);
        return;
      }
    }
    // Fallthrough
    case 114 /* "r" */: {
      if (enableFlightReadableStream) {
        startReadableStream(response, id, 'bytes');
        return;
      }
    }
    // Fallthrough
    case 88 /* "X" */: {
      if (enableFlightReadableStream) {
        startAsyncIterable(response, id, false);
        return;
      }
    }
    // Fallthrough
    case 120 /* "x" */: {
      if (enableFlightReadableStream) {
        startAsyncIterable(response, id, true);
        return;
      }
    }
    // Fallthrough
    case 67 /* "C" */: {
      if (enableFlightReadableStream) {
        stopStream(response, id, row);
        return;
      }
    }
    // Fallthrough
    case 80 /* "P" */: {
      if (enablePostpone) {
        if (response.__DEV__) {
          const postponeInfo = JSON.parse(row);
          resolvePostponeDev(
            response,
            id,
            postponeInfo.reason,
            postponeInfo.stack,
          );
        } else {
          resolvePostponeProd(response, id);
        }
        return;
      }
    }
    // Fallthrough
    default: /* """ "{" "[" "t" "f" "n" "0" - "9" */ {
      // We assume anything else is JSON.
      resolveModel(response, id, row);
      return;
    }
  }
}

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
              resolvedRowTag === 79 /* "O" */ ||
              resolvedRowTag === 111 /* "o" */ ||
              resolvedRowTag === 85 /* "U" */ ||
              resolvedRowTag === 83 /* "S" */ ||
              resolvedRowTag === 115 /* "s" */ ||
              resolvedRowTag === 76 /* "L" */ ||
              resolvedRowTag === 108 /* "l" */ ||
              resolvedRowTag === 71 /* "G" */ ||
              resolvedRowTag === 103 /* "g" */ ||
              resolvedRowTag === 77 /* "M" */ ||
              resolvedRowTag === 109 /* "m" */ ||
              resolvedRowTag === 86)) /* "V" */
        ) {
          rowTag = resolvedRowTag;
          rowState = ROW_LENGTH;
          i++;
        } else if (
          (resolvedRowTag > 64 && resolvedRowTag < 91) /* "A"-"Z" */ ||
          resolvedRowTag === 114 /* "r" */ ||
          resolvedRowTag === 120 /* "x" */
        ) {
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
      processFullBinaryRow(response, rowID, rowTag, buffer, lastChunk);
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

// prettier-ignore
export function processStringChunk(response: FlightResponse, chunk: string): void {
  // This is a fork of processBinaryChunk that takes a string as input.
  // This can't be just any binary chunk coverted to a string. It needs to be
  // in the same offsets given from the Flight Server. E.g. if it's shifted by
  // one byte then it won't line up to the UCS-2 encoding. It also needs to
  // be valid Unicode. Also binary chunks cannot use this even if they're
  // value Unicode. Large strings are encoded as binary and cannot be passed
  // here. Basically, only if Flight Server gave you this string as a chunk,
  // you can use it here.
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
        const byte = chunk.charCodeAt(i++);
        if (byte === 58 /* ":" */) {
          // Finished the rowID, next we'll parse the tag.
          rowState = ROW_TAG;
        } else {
          rowID = (rowID << 4) | (byte > 96 ? byte - 87 : byte - 48);
        }
        continue;
      }
      case ROW_TAG: {
        const resolvedRowTag = chunk.charCodeAt(i);
        if (
          resolvedRowTag === 84 /* "T" */ ||
          (enableBinaryFlight &&
            (resolvedRowTag === 65 /* "A" */ ||
              resolvedRowTag === 79 /* "O" */ ||
              resolvedRowTag === 111 /* "o" */ ||
              resolvedRowTag === 85 /* "U" */ ||
              resolvedRowTag === 83 /* "S" */ ||
              resolvedRowTag === 115 /* "s" */ ||
              resolvedRowTag === 76 /* "L" */ ||
              resolvedRowTag === 108 /* "l" */ ||
              resolvedRowTag === 71 /* "G" */ ||
              resolvedRowTag === 103 /* "g" */ ||
              resolvedRowTag === 77 /* "M" */ ||
              resolvedRowTag === 109 /* "m" */ ||
              resolvedRowTag === 86)) /* "V" */
        ) {
          rowTag = resolvedRowTag;
          rowState = ROW_LENGTH;
          i++;
        } else if (
          (resolvedRowTag > 64 && resolvedRowTag < 91) /* "A"-"Z" */ ||
          resolvedRowTag === 114 /* "r" */ ||
          resolvedRowTag === 120 /* "x" */
        ) {
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
        const byte = chunk.charCodeAt(i++);
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
        lastIdx = chunk.indexOf('\n', i);
        break;
      }
      case ROW_CHUNK_BY_LENGTH: {
        if (rowTag !== 84) {
          throw new Error(
            'Binary RSC chunks cannot be encoded as strings. ' +
              'This is a bug in the wiring of the React streams.',
          );
        }
        // For a large string by length, we don't know how many unicode characters
        // we are looking for but we can assume that the raw string will be its own
        // chunk. We add extra validation that the length is at least within the
        // possible byte range it could possibly be to catch mistakes.
        if (rowLength < chunk.length || chunk.length > rowLength * 3) {
          throw new Error(
            'String chunks need to be passed in their original shape. ' +
              'Not split into smaller string chunks. ' +
              'This is a bug in the wiring of the React streams.',
          );
        }
        lastIdx = chunk.length;
        break;
      }
    }
    if (lastIdx > -1) {
      // We found the last chunk of the row
      if (buffer.length > 0) {
        // If we had a buffer already, it means that this chunk was split up into
        // binary chunks preceeding it.
        throw new Error(
          'String chunks need to be passed in their original shape. ' +
            'Not split into smaller string chunks. ' +
            'This is a bug in the wiring of the React streams.',
        );
      }
      const lastChunk = chunk.slice(i, lastIdx);
      processFullStringRow(response, rowID, rowTag, lastChunk);
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
    } else if (chunk.length !== i) {
      // The rest of this row is in a future chunk. We only support passing the
      // string from chunks in their entirety. Not split up into smaller string chunks.
      // We could support this by buffering them but we shouldn't need to for
      // this use case.
      throw new Error(
        'String chunks need to be passed in their original shape. ' +
          'Not split into smaller string chunks. ' +
          'This is a bug in the wiring of the React streams.',
      );
    }
  }
  response._rowState = rowState;
  response._rowID = rowID;
  response._rowTag = rowTag;
  response._rowLength = rowLength;
}

function parseModel<T>(response: FlightResponse, json: UninitializedModel): T {
  return JSON.parse(json, response._fromJSON);
}

export function createFromJSONCallback(response: FlightResponse) {
  return function (key: string, value: JSONValue) {
    if (typeof value === 'string') {
      // We can't use .bind here because we need the "this" value.
      // @ts-expect-error `this` doesn't work
      return parseModelString(response, this, key, value);
    }
    if (typeof value === 'object' && value !== null) {
      return parseModelTuple(response, value);
    }
    return value;
  };
}
