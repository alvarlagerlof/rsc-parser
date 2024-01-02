import type { CrossOriginString } from "./crossOriginStrings";

export type PrefetchDNSOptions = Record<string, unknown>;
export type PreconnectOptions = { crossOrigin?: string };
export type PreloadOptions = {
  as: string;
  crossOrigin?: string;
  integrity?: string;
  type?: string;
  nonce?: string;
  fetchPriority?: FetchPriorityEnum;
  imageSrcSet?: string;
  imageSizes?: string;
  referrerPolicy?: string;
};
export type PreloadModuleOptions = {
  as?: string;
  crossOrigin?: string;
  integrity?: string;
  nonce?: string;
};
export type PreinitOptions = {
  as: string;
  precedence?: string;
  crossOrigin?: string;
  integrity?: string;
  nonce?: string;
  fetchPriority?: FetchPriorityEnum;
};
export type PreinitModuleOptions = {
  as?: string;
  crossOrigin?: string;
  integrity?: string;
  nonce?: string;
};

export type CrossOriginEnum = "" | "use-credentials" | CrossOriginString;
export type FetchPriorityEnum = "high" | "low" | "auto";

export type PreloadImplOptions = {
  crossOrigin?: CrossOriginEnum;
  integrity?: string | null | undefined;
  nonce?: string | null | undefined;
  type?: string | null | undefined;
  fetchPriority?: string | null | undefined;
  referrerPolicy?: string | null | undefined;
  imageSrcSet?: string | null | undefined;
  imageSizes?: string | null | undefined;
  media?: string | null | undefined;
};
export type PreloadModuleImplOptions = {
  as?: string | null | undefined;
  crossOrigin?: CrossOriginEnum | null | undefined;
  integrity?: string | null | undefined;
  nonce?: string | null | undefined;
};
export type PreinitStyleOptions = {
  crossOrigin?: CrossOriginEnum | null | undefined;
  integrity?: string | null | undefined;
  fetchPriority?: string | null | undefined;
};
export type PreinitScriptOptions = {
  crossOrigin?: CrossOriginEnum | null | undefined;
  integrity?: string | null | undefined;
  fetchPriority?: string | null | undefined;
  nonce?: string | null | undefined;
};
export type PreinitModuleScriptOptions = {
  crossOrigin?: CrossOriginEnum | null | undefined;
  integrity?: string | null | undefined;
  nonce?: string | null | undefined;
};

export type HostDispatcher = {
  prefetchDNS: (href: string) => void;
  preconnect: (
    href: string,
    crossOrigin?: CrossOriginEnum | null | undefined,
  ) => void;
  preload: (
    href: string,
    as: string,
    options?: PreloadImplOptions | null | undefined,
  ) => void;
  preloadModule: (
    href: string,
    options?: PreloadModuleImplOptions | null | undefined,
  ) => void;
  preinitStyle: (
    href: string,
    precedence: string | null | undefined,
    options?: PreinitStyleOptions | null | undefined,
  ) => void;
  preinitScript: (src: string, options?: PreinitScriptOptions) => void;
  preinitModuleScript: (
    src: string,
    options?: PreinitModuleScriptOptions | null | undefined,
  ) => void;
};

export type ImportMap = {
  imports?: {
    [specifier: string]: string;
  };
  scopes?: {
    [scope: string]: {
      [specifier: string]: string;
    };
  };
};
