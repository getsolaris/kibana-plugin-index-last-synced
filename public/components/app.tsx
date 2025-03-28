import React, { useEffect, useState, useCallback } from 'react';
import { i18n } from '@kbn/i18n';
import { BrowserRouter as Router } from '@kbn/shared-ux-router';
import { I18nProvider } from '@kbn/i18n-react';
import { 
  EuiPageTemplate, 
  EuiTitle, 
  EuiSpacer, 
  EuiText, 
  EuiLoadingSpinner, 
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiToolTip,
  EuiIcon,
  EuiBadge,
  EuiTablePagination,
  EuiSearchBar,
  EuiPanel,
  EuiLink,
  EuiHealth,
  EuiHorizontalRule,
  EuiFieldSearch,
  EuiSwitch,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFormRow,
  EuiSelect
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import type { CoreStart } from '@kbn/core/public';
import type { NavigationPublicPluginStart } from '@kbn/navigation-plugin/public';
import { IndexMetadata, IndexMetadataResponse } from '../../common/types';
import { PLUGIN_NAME } from '../../common';

// CSS 스타일
import './app.scss';

interface IndexLastSyncedAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

// 테이블 컬럼 타입 정의
interface TableColumn {
  field: string;
  name: string;
  width: string;
  sortable?: boolean;
  render?: (value: any, item: IndexMetadata) => React.ReactNode;
}

export const IndexLastSyncedApp = ({
  basename,
  notifications,
  http,
  navigation,
}: IndexLastSyncedAppDeps) => {
  const [indices, setIndices] = useState<IndexMetadata[]>([]);
  const [displayIndices, setDisplayIndices] = useState<IndexMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeSystem, setIncludeSystem] = useState<boolean>(false);
  const [includeHidden, setIncludeHidden] = useState<boolean>(false);
  const [stats, setStats] = useState({ totalIndices: 0, systemIndices: 0 });
  // 자동 새로고침 상태
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  
  // 페이지네이션 상태
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // 정렬 상태
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // 검색 쿼리
  const [searchQuery, setSearchQuery] = useState('');

  // 날짜를 'Y-m-d H:i:s (몇초전)' 형식으로 변환하는 함수
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      
      if (isNaN(diffSec)) return dateString;
      
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      
      let timeAgo = '';
      if (diffSec < 60) timeAgo = `${diffSec} seconds ago`;
      else if (diffSec < 3600) timeAgo = `${Math.floor(diffSec / 60)} minutes ago`;
      else if (diffSec < 86400) timeAgo = `${Math.floor(diffSec / 3600)} hours ago`;
      else if (diffSec < 2592000) timeAgo = `${Math.floor(diffSec / 86400)} days ago`;
      else timeAgo = `${Math.floor(diffSec / 2592000)} months ago`;
      
      return `${formattedDate} (${timeAgo})`;
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  const fetchIndices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await http.get<IndexMetadataResponse>('/api/index_last_synced/indices', {
        query: { includeSystem }
      });
      
      setIndices(response.indices || []);
      setStats({
        totalIndices: response.totalIndices || 0,
        systemIndices: response.systemIndices || 0
      });
      
      notifications.toasts.addSuccess('Index information successfully retrieved.');
    } catch (err) {
      const errorMessage = err.message || 'Unknown error';
      setError('Failed to get index information: ' + errorMessage);
      notifications.toasts.addDanger({
        title: 'Error',
        text: 'Failed to retrieve index data.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [http, includeSystem, notifications.toasts]);

  // 인덱스 필터링 및 정렬
  useEffect(() => {
    // 검색 및 정렬 로직
    let filteredIndices = [...indices];
    
    // 검색 필터링
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredIndices = filteredIndices.filter(
        (index) => index.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    // 정렬
    filteredIndices.sort((a, b) => {
      let aValue = a[sortField as keyof IndexMetadata];
      let bValue = b[sortField as keyof IndexMetadata];
      
      // null 값 처리
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      // 문자열 타입이면 소문자로 변환하여 비교
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    // 페이지네이션
    const startIndex = pageIndex * pageSize;
    const displayItems = filteredIndices.slice(startIndex, startIndex + pageSize);
    
    setDisplayIndices(displayItems);
  }, [indices, pageIndex, pageSize, sortField, sortDirection, searchQuery]);

  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  // 자동 새로고침 타이머 설정
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      // 3초마다 인덱스 정보 새로고침
      intervalId = setInterval(() => {
        fetchIndices();
      }, 3000);
    }
    
    // 컴포넌트 언마운트 또는 autoRefresh 상태 변경 시 타이머 정리
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, fetchIndices]);

  const handleToggleSystem = (checked: boolean) => {
    setIncludeSystem(checked);
    try {
      localStorage.setItem('indexLastSynced.includeSystem', JSON.stringify(checked));
    } catch (e) {
      // localStorage 오류 무시
      console.warn('Failed to save settings to localStorage', e);
    }
  };
  
  const handleToggleHidden = (checked: boolean) => {
    setIncludeHidden(checked);
    try {
      localStorage.setItem('indexLastSynced.includeHidden', JSON.stringify(checked));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  };

  // 자동 새로고침 토글 핸들러
  const handleToggleAutoRefresh = (checked: boolean) => {
    setAutoRefresh(checked);
    try {
      localStorage.setItem('indexLastSynced.autoRefresh', JSON.stringify(checked));
    } catch (e) {
      console.warn('Failed to save auto-refresh settings to localStorage', e);
    }
  };

  // useEffect to load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedIncludeSystem = localStorage.getItem('indexLastSynced.includeSystem');
      if (savedIncludeSystem) {
        setIncludeSystem(JSON.parse(savedIncludeSystem));
      }
      
      const savedIncludeHidden = localStorage.getItem('indexLastSynced.includeHidden');
      if (savedIncludeHidden) {
        setIncludeHidden(JSON.parse(savedIncludeHidden));
      }
      
      const savedAutoRefresh = localStorage.getItem('indexLastSynced.autoRefresh');
      if (savedAutoRefresh) {
        setAutoRefresh(JSON.parse(savedAutoRefresh));
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
  }, []);

  // 테이블 컬럼 정의
  const tableColumns: TableColumn[] = [
    {
      field: 'name',
      name: 'Index Name',
      width: '30%',
      render: (name: string, item: IndexMetadata) => (
        <div className="nameCell">
          {item.isSystemIndex && (
            <EuiToolTip content="System Index">
              <EuiIcon type="lock" size="s" color="subdued" />
            </EuiToolTip>
          )}
          <span style={{ marginLeft: item.isSystemIndex ? '5px' : '0' }}>
            <EuiLink 
              href={`management/data/index_management/indices/index_details?indexName=${name}`}
            >
              {name}
            </EuiLink>
          </span>
        </div>
      ),
      sortable: true
    },
    {
      field: 'lastTimestamp',
      name: 'Last Time',
      width: '25%',
      render: (timestamp: string | null) => {
        if (!timestamp) return <span>N/A</span>;
        return <span>{formatTimeAgo(timestamp)}</span>;
      },
      sortable: true
    },
    {
      field: 'docCount',
      name: 'Document Count',
      width: '20%',
      render: (count: number) => <span>{count.toLocaleString()}</span>,
      sortable: true
    },
    {
      field: 'status',
      name: 'Status',
      width: '15%',
      render: (status: string) => {
        let color: 'success' | 'danger' | 'warning' = 'warning';
        if (status === 'open') color = 'success';
        if (status === 'close') color = 'danger';
        
        return <EuiHealth color={color}>{status}</EuiHealth>;
      },
      sortable: true
    },
    {
      field: 'actions',
      name: 'Actions',
      width: '10%',
      render: () => (
        <div style={{ textAlign: 'right' }}>
          <EuiToolTip content="View Index">
            <EuiIcon type="eye" style={{ marginRight: '10px', cursor: 'pointer' }} />
          </EuiToolTip>
          <EuiToolTip content="Manage Index">
            <EuiIcon type="wrench" style={{ cursor: 'pointer' }} />
          </EuiToolTip>
        </div>
      )
    }
  ];

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: indices.length,
    pageSizeOptions: [10, 20, 50, 100],
    showPerPageOptions: true,
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Router basename={basename}>
      <I18nProvider>
        <div className="indexLastSyncedApp">
          <EuiPageTemplate restrictWidth="1200px">
            <EuiPageTemplate.Header>
              <EuiTitle size="l">
                <h1>{PLUGIN_NAME}</h1>
              </EuiTitle>
            </EuiPageTemplate.Header>
            <EuiPageTemplate.Section>
              <EuiSpacer size="l" />
              
              <EuiFlexGroup gutterSize="m" wrap>
                <EuiFlexItem grow={4}>
                  <EuiFieldSearch
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    fullWidth
                    aria-label="Search indices"
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSwitch
                    label="Include System Indices"
                    checked={includeSystem}
                    onChange={(e) => handleToggleSystem(e.target.checked)}
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSwitch
                    label="Include Hidden Indices"
                    checked={includeHidden}
                    onChange={(e) => handleToggleHidden(e.target.checked)}
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSwitch
                    label="Auto Refresh"
                    checked={autoRefresh}
                    onChange={(e) => handleToggleAutoRefresh(e.target.checked)}
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty
                    onClick={() => fetchIndices()}
                    iconType="refresh"
                    isLoading={isLoading}
                    size="m"
                  >
                    Refresh
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
              
              <EuiSpacer size="m" />
              
              {error ? (
                <EuiCallOut title="Error" color="danger">
                  {error}
                </EuiCallOut>
              ) : isLoading && indices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <EuiLoadingSpinner size="xl" />
                  <EuiSpacer />
                  <EuiText size="s">Loading indices...</EuiText>
                </div>
              ) : (
                <>
                  <div className="indexTableContainer">
                    <table className="indexTable">
                      <thead>
                        <tr>
                          {tableColumns.map((column, i) => (
                            <th
                              key={i}
                              style={{ width: column.width }}
                              onClick={() => {
                                if (column.sortable) {
                                  setSortField(column.field);
                                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                }
                              }}
                              className={column.sortable ? 'sortable' : ''}
                            >
                              <div className="headerContent">
                                <span>{column.name}</span>
                                {column.sortable && sortField === column.field && (
                                  <EuiIcon
                                    type={sortDirection === 'asc' ? 'sortUp' : 'sortDown'}
                                    size="s"
                                  />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayIndices.length === 0 ? (
                          <tr>
                            <td colSpan={tableColumns.length} style={{ textAlign: 'center', padding: '20px' }}>
                              <EuiText size="s">No indices found.</EuiText>
                            </td>
                          </tr>
                        ) : (
                          displayIndices.map((index, rowIndex) => (
                            <tr key={rowIndex}>
                              {tableColumns.map((column, cellIndex) => (
                                <td key={cellIndex}>
                                  {column.render && column.field in index
                                    ? column.render(index[column.field as keyof IndexMetadata], index)
                                    : index[column.field as keyof IndexMetadata]
                                  }
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <EuiSpacer size="m" />
                  
                  <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                    <EuiFlexItem grow={false}>
                      <EuiText size="s" color="subdued">
                        {indices.length > 0 && (
                          <p>Showing {displayIndices.length} of {indices.length} indices
                            {stats.systemIndices > 0 && includeSystem && ` (including ${stats.systemIndices} system indices)`}
                          </p>
                        )}
                      </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiTablePagination
                        activePage={pagination.pageIndex}
                        itemsPerPage={pagination.pageSize}
                        itemsPerPageOptions={pagination.pageSizeOptions}
                        pageCount={Math.ceil(indices.length / pagination.pageSize)}
                        onChangeItemsPerPage={(size) => {
                          setPageSize(size);
                          setPageIndex(0);
                        }}
                        onChangePage={(pageNumber) => setPageIndex(pageNumber)}
                      />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </>
              )}
            </EuiPageTemplate.Section>
          </EuiPageTemplate>
        </div>
      </I18nProvider>
    </Router>
  );
};