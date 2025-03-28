import type { NavigationPublicPluginStart } from '@kbn/navigation-plugin/public';

export interface IndexLastSyncedPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IndexLastSyncedPluginStart {}
export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

