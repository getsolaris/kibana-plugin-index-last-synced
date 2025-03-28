import { PluginInitializerContext } from '@kbn/core/server';
import { IndexLastSyncedServerPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new IndexLastSyncedServerPlugin();
}

export type { IndexLastSyncedPluginSetup, IndexLastSyncedPluginStart } from './types';
