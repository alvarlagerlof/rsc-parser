import { RscChunkMessage } from "../main";
import {
  FlightResponse,
  createFromJSONCallback,
  processBinaryChunk,
} from "../react/ReactFlightClient";
import { createStringDecoder } from "../react/ReactFlightClientConfigBrowser";

export function messagesToResponse(messages: RscChunkMessage[]) {
  if (messages.length === 0) {
    return null;
  }

  const responseBuffer: Array<Uint8Array> = [];

  for (const [index, message] of messages.entries()) {
    responseBuffer[index] = new Uint8Array(
      Object.keys(message.data.chunkValue).length,
    );
    for (const [key, value] of Object.entries(message.data.chunkValue)) {
      responseBuffer[index][Number(key)] = Number(value);
    }
  }

  // for (let i = 0; i < messages.length; i++) {
  //   responseBuffer[i] = new Uint8Array(
  //     Object.keys(messages[i].data.chunkValue).length,
  //   );
  //   for (let n = 0; n < messages[i].data.chunkValue.length; n++) {
  //     responseBuffer[i][n] = Number(messages[i].data.chunkValue[n]);
  //   }
  // }

  const response = {
    _buffer: [],
    _rowID: 0,
    _rowTag: 0,
    _rowLength: 0,
    _rowState: 0,
    _stringDecoder: createStringDecoder(),
    _chunks: [] as FlightResponse["_chunks"],
  } satisfies FlightResponse;

  response._fromJSON = createFromJSONCallback(response);

  // const flightResponses = messages.map((message) => {
  //   return {
  //     _buffer: message.data.chunkValue,
  //     _rowID: message.data.chunkId,
  //     _rowLength: 1
  //   } satisfies FlightResponse
  // })

  for (const buffer of responseBuffer) {
    processBinaryChunk(response, buffer);
  }

  // for (let i = 0; i < responseBuffer.length; i++) {
  //   processBinaryChunk(response, responseBuffer[i]);
  // }

  return response;
}
