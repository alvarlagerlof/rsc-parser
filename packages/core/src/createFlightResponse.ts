import { RscChunkEvent } from "./events";
import {
  FlightResponse,
  createFromJSONCallback,
  processBinaryChunk,
} from "./react/ReactFlightClient";
import { createStringDecoder } from "./react/ReactFlightClientConfigBrowser";

export function createFlightResponse(events: RscChunkEvent[]): FlightResponse {
  // @ts-expect-error TODO: fix this
  const response: FlightResponse = {
    _buffer: [],
    _rowID: 0,
    _rowTag: 0,
    _rowLength: 0,
    _rowState: 0,
    _currentTimestamp: 0,
    _stringDecoder: createStringDecoder(),
    _chunks: [] as FlightResponse["_chunks"],
  };

  response._fromJSON = createFromJSONCallback(response);

  for (let i = 0; i < events.length; i++) {
    response._currentTimestamp = events[i].data.timestamp;
    processBinaryChunk(response, Uint8Array.from(events[i].data.chunkValue));
  }

  return response;
}
