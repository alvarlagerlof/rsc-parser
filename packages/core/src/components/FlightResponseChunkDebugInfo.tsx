import React from 'react';
import { DebugInfoChunk } from '@rsc-parser/react-client';
import { FlightResponseChunkModel } from './FlightResponseChunkModel';

export function FlightResponseChunkDebugInfo({
  data,
  onClickID,
}: {
  data: DebugInfoChunk['value'];
  onClickID: (id: string) => void;
}) {
  return (
    <FlightResponseChunkModel
      key={JSON.stringify(data)}
      data={data}
      onClickID={onClickID}
    />
  );
}
