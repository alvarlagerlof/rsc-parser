import { RscEvent } from './events';

export function readNextJsScriptTags(): RscEvent[] | undefined {
  try {
    // @ts-expect-error This is a hack
    const payload = self.__next_f.map((f) => f?.[1]).join('');

    const requestId = String(Date.now() + Math.random()); // TODO: Use a better random number generator or uuid

    const events = [
      {
        type: 'RSC_REQUEST',
        data: {
          requestId: requestId,
          tabId: 0,
          timestamp: Date.now(),
          url: window.location.href,
          method: 'GET',
          headers: {},
        },
      },
      {
        type: 'RSC_RESPONSE',
        data: {
          requestId: requestId,
          tabId: 0,
          timestamp: Date.now(),
          status: 200,
          headers: {},
        },
      },
      {
        type: 'RSC_CHUNK',
        data: {
          requestId: requestId,
          tabId: 0,
          timestamp: Date.now(),
          chunkValue: Array.from(new TextEncoder().encode(payload)),
        },
      },
    ] satisfies RscEvent[];

    return events;
  } catch (error) {
    console.error(
      new Error('Error parsing Next.js payload', {
        cause: error,
      }),
    );
  }
}
