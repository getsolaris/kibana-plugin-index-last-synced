import { CoreSetup, CoreStart, Plugin } from '@kbn/core/server';
import { defineRoutes } from './routes/index_metadata';

export class IndexLastSyncedServerPlugin implements Plugin {
  public setup(core: CoreSetup): void {
    // Register server side APIs
    defineRoutes(core.http.createRouter());
  }

  public start(core: CoreStart): void {}

  public stop(): void {}
}
