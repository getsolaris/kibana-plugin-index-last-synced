# Kibana Plugin Index Last Synced

Index Last Synced is a Kibana plugin that allows you to check the last synchronization time of multiple indices at once.

Previously, you had to query each index individually, but with this plugin, you can view everything in a clean dashboard-like interface.

It's useful for quickly identifying indices where data collection has stopped or is experiencing delays.

![1](https://raw.githubusercontent.com/getsolaris/kibana-plugin-index-last-synced/refs/heads/main/images/22222.png)


## Key Features

- View all Elasticsearch cluster indices at a glance
- Display the latest @timestamp value for each index
  - Date format (YYYY-MM-DD HH:mm:ss) and time elapsed (e.g., "5 minutes ago")
- Various index filtering options:
  - Include/exclude system indices
  - Include/exclude hidden indices
  - Search functionality by index name

- Check index status and document count (including open/close status)
- Sorting functionality by name, timestamp, document count, etc.
- Auto-refresh support (updates with latest information every 3 seconds)


## Compatibility

| Kibana Version | Compatibility |
|------------|-------|
| v8.17.0    | ✅    |
| v7.17.0    | ❌    |

## Installation

### Install from GitHub Release

```bash
$ bin/kibana-plugin install https://github.com/getsolaris/kibana-plugin-index-last-synced/releases/download/8.17.0/indexLastSynced-8.17.0.zip
```

### Manual Installation

1. Download the latest version from the release page (https://github.com/getsolaris/kibana-plugin-index-last-synced/releases)
2. Install the plugin using the downloaded zip file:
```bash
$ bin/kibana-plugin install file:///path/indexLastSynced-8.17.0.zip
```

Finally, restart Kibana


## Usage

![2](https://raw.githubusercontent.com/getsolaris/kibana-plugin-index-last-synced/refs/heads/main/images/111111.png)

1. After installing the plugin, click on 'Index Last Synced' in the left menu of Kibana


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
