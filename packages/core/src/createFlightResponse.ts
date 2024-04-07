import { RscChunkMessage } from "./types";
import {
  FlightResponse,
  createFromJSONCallback,
  processBinaryChunk,
} from "./react/ReactFlightClient";
import { createStringDecoder } from "./react/ReactFlightClientConfigBrowser";

export function createFlightResponse(
  messages: RscChunkMessage[],
): FlightResponse {
  // @ts-expect-error TODO: fix this
  const response: FlightResponse = {
    _buffer: [],
    _rowID: 0,
    _rowTag: 0,
    _rowLength: 0,
    _rowState: 0,
    _currentStartTime: 0,
    _currentEndTime: 0,
    _stringDecoder: createStringDecoder(),
    _chunks: [] as FlightResponse["_chunks"],
  };

  response._fromJSON = createFromJSONCallback(response);

  for (let i = 0; i < messages.length; i++) {
    response._currentStartTime = messages[i].data.chunkStartTime;
    response._currentEndTime = messages[i].data.chunkEndTime;
    processBinaryChunk(response, Uint8Array.from(messages[i].data.chunkValue));
  }

  return response;
}
