export type RscChunkMessage = {
  type: "RSC_CHUNK";
  tabId: number;
  data: {
    fetchUrl: string;
    // TODO: Rename to fetchRequestMethod
    fetchMethod: "GET" | "POST";
    fetchRequestHeaders: Record<string, string> | null;
    fetchResponseHeaders: Record<string, string> | null;
    fetchStartTime: number;
    chunkValue: number[];
    chunkStartTime: number;
    chunkEndTime: number;
  };
};
