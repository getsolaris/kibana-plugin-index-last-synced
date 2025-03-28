import './index.scss';

import { IndexLastSyncedPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new IndexLastSyncedPlugin();
}
export type { IndexLastSyncedPluginSetup, IndexLastSyncedPluginStart } from './types';
