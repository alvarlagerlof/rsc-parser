import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ViewerStreams,
  ViewerStreamsEmptyState,
  RscChunkMessage,
  PanelLayout,
  Logo,
  RecordButton,
  DebugCopyMessagesButton,
  ClearMessagesButton,
} from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

interface NetworkPanelRequest extends chrome.devtools.network.Request {
  response: {
    content: { mimeType: string };
  };
  request: {
    url: string;
    method: string;
  };
  startedDateTime: string;
  time: number;
}

function isRscResponse(request: NetworkPanelRequest): boolean {
  return request.response.content.mimeType === "text/x-component";
}

export function App() {
  const { isRecording, startRecording, messages, clearMessages } =
    useRscMessages();

  return (
    <PanelLayout
      header={
        <>
          <Logo variant="wide" />
          <RecordButton
            isRecording={isRecording}
            onClickRecord={startRecording}
          />
          {process.env.NODE_ENV === "development" ? (
            <DebugCopyMessagesButton messages={messages} />
          ) : null}
          {messages.length > 0 ? (
            <ClearMessagesButton onClickClearMessages={clearMessages} />
          ) : null}
        </>
      }
    >
      {messages.length === 0 || !isRecording ? (
        <ViewerStreamsEmptyState />
      ) : (
        <ViewerStreams messages={messages} />
      )}
    </PanelLayout>
  );
}

function useRscMessages() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const tabId = useMemo(() => Date.now(), []);

  const handleNetworkRequest = useCallback(function (
    req: chrome.devtools.network.Request,
  ) {
    const request = req as NetworkPanelRequest;
    if (isRscResponse(request)) {
      request.getContent((content) => {
        const startTime = new Date(request.startedDateTime).getTime();

        const requestMessage = {
          fetchUrl: request.request.url,
          fetchMethod: request.request.method,
          fetchStartTime: startTime,
          chunkStartTime: startTime,
          chunkEndTime: startTime + request.time,
          chunkValue: [],
        } satisfies RscChunkMessage;

        // there is an issue in chrome devtools, that during dev mode of nextjs
        // the content is not available (it is also not shown within the network response tab)
        if (content) {
          requestMessage.chunkValue = Array.from(
            new TextEncoder().encode(content),
          );

          startTransition(() => {
            setMessages((previous) => [
              ...previous,
              { type: "RSC_CHUNK", tabId: 0, data: requestMessage },
            ]);
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(
        handleNetworkRequest,
      );
    };
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);

    chrome.devtools.network.onRequestFinished.addListener(handleNetworkRequest);

    chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
      type: "START_RECORDING",
      tabId: tabId,
    } satisfies StartRecordingMessage);
  }, [tabId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isRecording,
    startRecording,
    messages,
    clearMessages,
  };
}

type StartRecordingMessage = {
  type: "START_RECORDING";
  tabId: number;
};
