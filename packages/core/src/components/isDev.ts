import { RscEvent } from '../events';

export function isDev(events: RscEvent[]) {
  return events.some(
    (event) =>
      event.type === 'RSC_REQUEST' &&
      (event.data.url.includes('localhost') ||
        event.data.url.includes('127.0.0.1')),
  );
}
