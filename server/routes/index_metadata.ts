import { IRouter } from '@kbn/core/server';
import { schema } from '@kbn/config-schema';
import { IndexMetadata } from '../../common/types';

export function defineRoutes(router: IRouter) {
  // GET /api/index_last_synced/indices
  router.get(
    {
      path: '/api/index_last_synced/indices',
      validate: {
        query: schema.object({
          includeSystem: schema.boolean({ defaultValue: false })
        })
      }
    },
    async (context, request, response) => {
      try {
        const { includeSystem } = request.query;
        
        // context는 Promise이므로 await로 해결해야 합니다
        const coreContext = await context.core;
        const client = coreContext.elasticsearch.client.asCurrentUser;

        // 모든 인덱스 가져오기
        const indices = await client.cat.indices({
          format: 'json',
          h: 'index,docs.count,status'
        });

        // 시스템 인덱스 필터링
        const filteredIndices = includeSystem 
          ? indices 
          : indices.filter((idx: any) => !idx.index.startsWith('.'));

        // 각 인덱스에 대해 최신 @timestamp 값 가져오기
        const results = await Promise.all(
          filteredIndices.map(async (idx: any) => {
            try {
              // 인덱스의 최신 문서 1개 가져오기
              const searchResult = await client.search({
                index: idx.index,
                size: 1,
                sort: [
                  { '@timestamp': { order: 'desc' } }
                ],
                _source: ['@timestamp'],
                ignore_unavailable: true,
                timeout: '3s'
              }).catch(() => ({ hits: { hits: [] } })); // 인덱스 검색 실패 시 빈 결과 반환

              const lastTimestamp = searchResult.hits.hits[0]?._source?.['@timestamp'] || null;

              return {
                name: idx.index,
                lastTimestamp,
                docCount: parseInt(idx['docs.count'] || '0', 10),
                status: idx.status.toLowerCase(),
                isSystemIndex: idx.index.startsWith('.')
              };
            } catch (error) {
              // 오류 발생 시 기본 정보만 반환
              return {
                name: idx.index,
                lastTimestamp: null,
                docCount: parseInt(idx['docs.count'] || '0', 10),
                status: idx.status.toLowerCase(),
                isSystemIndex: idx.index.startsWith('.')
              };
            }
          })
        );

        return response.ok({
          body: {
            indices: results,
            totalIndices: results.length,
            systemIndices: results.filter(idx => idx.isSystemIndex).length
          }
        });
      } catch (error) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: {
            message: error.message || 'Internal server error'
          }
        });
      }
    }
  );
}