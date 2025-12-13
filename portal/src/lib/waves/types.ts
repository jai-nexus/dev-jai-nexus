// src/lib/waves/types.ts
export type WaveNhId = string; // "2.1.2.W3.0"

export interface WaveContextAction {
  waveNhId: WaveNhId;
  projectNhRoot: string; // "2.1.2"
  repos: {
    nhId: string;
    name: string;
    domainPod: string | null;
    engineGroup: string | null;
    status: string | null;
  }[];
}

export interface WaveTask {
  nhId: string; // "2.1.2.W3.0.1"
  kind: "code-edit" | "doc" | "infra" | "sync";
  targetRepo: string;
  targetPath: string;
  summary: string;
  status: "planned" | "applied" | "abandoned";
}

export interface WavePlanAction {
  waveNhId: WaveNhId;
  projectNhRoot: string;
  summary: string;
  tasks: WaveTask[];
}
