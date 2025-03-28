import { i18n } from '@kbn/i18n';
import type { AppMountParameters, CoreSetup, CoreStart, Plugin } from '@kbn/core/public';
import type {
  IndexLastSyncedPluginSetup,
  IndexLastSyncedPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME } from '../common';

export class IndexLastSyncedPlugin
  implements Plugin<IndexLastSyncedPluginSetup, IndexLastSyncedPluginStart>
{
  public setup(core: CoreSetup): IndexLastSyncedPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'indexLastSynced',
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        try {
          // Load application bundle
          const { renderApp } = await import('./application');
          // Get start services as specified in kibana.json
          const [coreStart, depsStart] = await core.getStartServices();
          
          // Render the application
          return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
        } catch (error) {
          params.element.innerHTML = '<div style="color: red; padding: 20px;">오류가 발생했습니다. 콘솔을 확인하세요.</div>';
          return () => {};
        }
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('indexLastSynced.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): IndexLastSyncedPluginStart {
    return {};
  }

  public stop() {}
}
