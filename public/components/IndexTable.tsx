import React from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiText,
  EuiToolTip,
  EuiIcon,
  EuiBadge,
  EuiEmptyPrompt
} from '@elastic/eui';
import { IndexMetadata } from '../../common/types';

interface IndexTableProps {
  indices: IndexMetadata[];
  loading: boolean;
}

// 날짜를 '시간 전' 형식으로 변환하는 함수
const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (isNaN(diffSec)) return dateString;
    
    if (diffSec < 60) return `${diffSec}초 전`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}일 전`;
    
    // 날짜 형식으로 표시
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (e) {
    return dateString || 'N/A';
  }
};

export const IndexTable: React.FC<IndexTableProps> = ({ indices, loading }) => {
  const columns: Array<EuiBasicTableColumn<IndexMetadata>> = [
    {
      field: 'name',
      name: '인덱스 이름',
      sortable: true,
      render: (name: string, item: IndexMetadata) => (
        <EuiText size="s">
          {item.isSystemIndex ? (
            <EuiToolTip content="시스템 인덱스">
              <span>
                <EuiIcon type="lock" size="s" style={{ marginRight: '5px' }} />
                {name}
              </span>
            </EuiToolTip>
          ) : (
            name
          )}
        </EuiText>
      )
    },
    {
      field: 'lastTimestamp',
      name: '마지막 @timestamp',
      sortable: true,
      render: (timestamp: string | null) => {
        if (!timestamp) return 'N/A';
        return formatTimeAgo(timestamp);
      }
    },
    {
      field: 'docCount',
      name: '문서 수',
      sortable: true,
      render: (count: number) => count.toLocaleString()
    },
    {
      field: 'status',
      name: '상태',
      sortable: true,
      render: (status: string) => (
        <EuiBadge color={status === 'open' ? 'success' : 'danger'}>
          {status}
        </EuiBadge>
      )
    }
  ];

  // 인덱스 없을 때 표시할 컴포넌트
  const noItemsMessage = loading ? (
    '로딩 중...'
  ) : (
    <EuiEmptyPrompt
      iconType="indexSettings"
      title={<h3>인덱스를 찾을 수 없습니다</h3>}
      body={<p>검색 기준과 일치하는 인덱스가 없습니다.</p>}
    />
  );

  return (
    <EuiBasicTable
      items={indices}
      columns={columns}
      loading={loading}
      noItemsMessage={noItemsMessage}
      tableLayout="auto"
    />
  );
}; 