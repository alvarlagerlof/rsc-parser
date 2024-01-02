export type StringDecoder = TextDecoder;

export function createStringDecoder(): StringDecoder {
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
