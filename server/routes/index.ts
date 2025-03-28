import type { IRouter } from '@kbn/core/server';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/index_last_synced/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );
}
