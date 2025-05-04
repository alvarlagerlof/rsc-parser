import React from 'react';
import { ConsoleChunk } from '@rsc-parser/react-client';
import { FlightResponseChunkModel } from './FlightResponseChunkModel';

export function FlightResponseChunkConsole({
  data,
  onClickID,
}: {
  data: ConsoleChunk['value'];
  onClickID: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-1 items-center">
        <div className="bg-slate-300 px-2 py-1 rounded-full inline dark:bg-slate-700">
          {data.methodName.toUpperCase()}
        </div>
        <div className="bg-slate-300 px-2 py-1 rounded-full inline dark:bg-slate-700">
          {data.env}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="font-semibold">Stack trace</div>
        <ul className="flex flex-col gap-2 list-disc">
          {data.stackTrace.map(
            ([functionName, fileName, lineNumber, columnNumber]) => {
              return (
                <li
                  className="ml-3.5"
                  key={JSON.stringify([
                    functionName,
                    fileName,
                    lineNumber,
                    columnNumber,
                  ])}
                >
                  <div>{functionName}</div>
                  <div className="text-slate-500 dark:text-slate-300">
                    {fileName} ({lineNumber}:{columnNumber})
                  </div>
                </li>
              );
            },
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-1">
        <div className="font-semibold">Args</div>
        <ul className="flex flex-col gap-2 list-disc">
          {data.args.map((arg) => {
            return (
              <li className="ml-3.5">
                <FlightResponseChunkModel
                  key={JSON.stringify(arg)}
                  data={arg}
                  onClickID={onClickID}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-1">
        <div className="font-semibold">Owner</div>
        <FlightResponseChunkModel data={data.owner} onClickID={onClickID} />
      </div>
    </div>
  );
}
