import React from 'react';
import ReactDOM from 'react-dom';
import type { AppMountParameters, CoreStart } from '@kbn/core/public';
import type { AppPluginStartDependencies } from './types';
import { IndexLastSyncedApp } from './components/app';

export const renderApp = (
  { notifications, http }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  try {
    ReactDOM.render(
      <IndexLastSyncedApp
        basename={appBasePath}
        notifications={notifications}
        http={http}
        navigation={navigation}
      />,
      element
    );

    return () => ReactDOM.unmountComponentAtNode(element);
  } catch (error) {
    console.error('Error rendering IndexLastSyncedApp:', error);
    element.innerHTML = '<div style="padding: 20px; color: red;">오류가 발생했습니다. 콘솔을 확인하세요.</div>';
    return () => {
      element.innerHTML = '';
    };
  }
};
