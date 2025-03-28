export interface IndexMetadata {
  name: string;
  lastTimestamp: string | null;
  docCount: number;
  status: 'open' | 'closed';
  isSystemIndex: boolean;
}

export interface IndexMetadataResponse {
  indices: IndexMetadata[];
  totalIndices: number;
  systemIndices: number;
}

export const PLUGIN_ID = 'indexLastSynced';
export const PLUGIN_NAME = 'Index Last Synced'; 