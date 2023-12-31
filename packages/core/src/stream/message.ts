export type RscChunkMessage = {
  type: "RSC_CHUNK";
  tabId: number;
  data: {
    fetchUrl: string;
    fetchHeaders: Record<string, string | undefined>;
    fetchStartTime: number;
    chunkValue: Record<string, number>;
    chunkStartTime: number;
    chunkEndTime: number;
  };
};
