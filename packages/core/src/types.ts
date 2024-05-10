export type RscChunkMessage = {
  type: "RSC_CHUNK";
  tabId: number;
  data: {
    fetchUrl: string;
    fetchStartTime: number;
    chunkValue: number[];
    chunkStartTime: number;
    chunkEndTime: number;
  };
};
