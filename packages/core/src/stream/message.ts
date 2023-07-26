export type RscChunkMessage = {
  type: "RSC_CHUNK";
  data: {
    fetchUrl: string;
    fetchHeaders: Record<string, string>;
    fetchStartTime: number;
    chunkValue: string;
    chunkStartTime: number;
    chunkEndTime: number;
  };
};
