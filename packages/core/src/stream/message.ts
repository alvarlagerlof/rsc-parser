export type RscChunkMessage = {
  type: "RSC_CHUNK";
  tabId: number;
  data: {
    fetchUrl: string;
    fetchHeaders: Record<string, string>;
    fetchStartTime: number;
    chunkValue: string;
    chunkStartTime: number;
    chunkEndTime: number;
  };
};
