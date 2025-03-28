# Kibana Plugin Index Last Synced

Index Last Synced는 여러 인덱스의 마지막 동기화 시간을 한 번에 확인할 수 있도록 만든 Kibana 플러그인입니다.


기존에는 일일이 인덱스를 조회하고 쿼리를 날려야 했던 작업을, 이 플러그인 하나로 깔끔하게 대시보드처럼 확인할 수 있습니다.


데이터 수집이 멈췄거나 지연되고 있는 인덱스를 빠르게 파악하는 데 유용합니다.

![1](https://raw.githubusercontent.com/getsolaris/kibana-plugin-index-last-synced/refs/heads/main/images/22222.png)


## 주요 기능

- Elasticsearch 클러스터의 모든 인덱스 리스트를 한눈에 확인
- 각 인덱스의 가장 최신 @timestamp 값 표시
  - 날짜(YYYY-MM-DD HH:mm:ss)와 얼마나 지났는지(예: "5분 전")
- 다양한 인덱스 필터링 옵션:
  - 시스템 인덱스 포함/제외
  - 히든 인덱스 포함/제외
  - 인덱스 이름 검색 기능

- 인덱스 상태 및 문서 수 확인 (open/close 여부 포함)
- 이름, 타임스탬프, 문서 수 등으로 정렬 기능 제공
- 자동 새로고침 지원 (3초마다 최신 정보로 업데이트)

## 설치

### GitHub 릴리즈에서 설치

```bash
$ bin/kibana-plugin install https://github.com/getsolaris/kibana-plugin-index-last-synced/releases/download/v1.0.0/indexLastSynced-8.17.0.zip
```

### 수동 설치

1. 릴리즈 페이지(https://github.com/getsolaris/kibana-plugin-index-last-synced/releases)에서 최신 버전 다운로드
2. 다운로드한 zip 파일을 사용하여 플러그인 설치:
```bash
$ bin/kibana-plugin install file:///경로/indexLastSynced-8.17.0.zip
```

마지막으로 Kibana 재시작


## 사용법

![2](https://raw.githubusercontent.com/getsolaris/kibana-plugin-index-last-synced/refs/heads/main/images/111111.png)

1. 플러그인 설치 이후 Kibana 왼쪽 메뉴에서 ‘Index Last Synced’ 클릭


---


## Scripts

<dl>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>

  <dt><code>yarn plugin-helpers dev --watch</code></dt>
    <dd>Execute this to build your plugin ui browser side so Kibana could pick up when started in development</dd>
</dl>
