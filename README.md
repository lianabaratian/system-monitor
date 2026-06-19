# System Monitor

A cross-platform desktop application built with **Electron + React + TypeScript** that displays live operating-system and machine information: OS details, running processes, memory usage, and disk usage.

## Features

- **System** — OS name, version, platform, architecture, hostname, current user
- **Processes** — live process list (PID, name, CPU %, memory %) with:
  - search/filter by name
  - sortable columns (PID, name, CPU, memory)
  - selectable refresh interval (1s / 5s / 10s / manual) and a manual "Refresh now" button
- **Memory** — total, used, free, and usage % with a visual bar
- **Disk** — per-mount total, used, free, and usage % with a visual bar
- Loading and error states throughout
- Clean dark UI with sidebar navigation

## Tech stack

React 18, TypeScript, Electron 30, Vite (via `vite-plugin-electron`), [`systeminformation`](https://www.npmjs.com/package/systeminformation) for cross-platform metrics, and Vitest + React Testing Library for tests.

## Architecture

The app maintains a strict separation between Electron's three processes, so the renderer never touches Node or OS APIs directly:

```
React renderer  --window.api-->  Preload (contextBridge)  --IPC-->  Main process
   (src/)                          (electron/preload.ts)            (electron/main.ts)
                                                                          |
                                                                  SystemInfoService
                                                              (platform implementation)
```

- **Main process** (`electron/`) is the only place that imports `systeminformation` and `node:os`. It registers IPC handlers that delegate to a `SystemInfoService`.
- **Preload** exposes a small, typed `window.api` via `contextBridge` — the only surface the renderer can call. `contextIsolation` is on and `nodeIntegration` is off.
- **Renderer** (`src/`) is plain React. It calls `window.api` through a thin `systemApi` wrapper and renders the data.

### Platform abstraction

System metrics are read through a `SystemInfoService` interface:

```ts
interface SystemInfoService {
  getOsInfo(): Promise<OsInfo>
  getProcesses(): Promise<ProcessInfo[]>
  getMemoryInfo(): Promise<MemoryInfo>
  getDiskInfo(): Promise<DiskInfo[]>
}
```

A `BaseSystemInfoService` holds the shared cross-platform implementation, and per-OS subclasses (`MacSystemInfoService`, `LinuxSystemInfoService`, `WindowsSystemInfoService`) override only what differs (e.g. which filesystems to show). A `ServiceFactory` selects the right one at runtime from `process.platform`. This is the **Template Method** + **Factory Method** pattern — adding a new platform is a one-file change plus one `case`.

### Project structure

```
electron/
  main.ts                     # app entry, wires service + IPC
  preload.ts                  # contextBridge -> window.api
  ipc/ipcHandlers.ts          # ipcMain.handle registrations
  services/
    SystemInfoService.ts      # interface
    BaseSystemInfoService.ts  # shared implementation
    ServiceFactory.ts         # platform selection
    platforms/                # Mac / Linux / Windows subclasses
src/
  shared/types.ts             # shared data contracts + IPC channels
  api/systemApi.ts            # typed wrapper over window.api
  hooks/useAutoRefresh.ts     # polling + loading/error state
  components/                 # OsInfoPanel, ProcessList, MemoryPanel, DiskPanel, UsageBar
  utils/format.ts             # byte / percent formatting
  App.tsx                     # layout + sidebar navigation
```

## Supported platforms

macOS, Linux, and Windows. Developed and manually tested on macOS; Linux and Windows implementations are covered by unit tests with mocked platform data.

## Prerequisites

Node.js 18 or newer.

## Installation

```bash
npm install
```

## Running the app

```bash
npm run dev
```

This starts Vite and launches the Electron window with hot reload.

## Running tests

```bash
npm test
```

Runs the Vitest suite once (service tests, factory selection, and React component tests).

## Building

```bash
npm run build
```

Type-checks, builds the renderer, and packages the app with electron-builder.

## Assumptions & limitations

- **CPU on first read**: `systeminformation` computes process CPU over an interval, so the very first refresh may show low/zero CPU until a baseline is established; subsequent refreshes are accurate.
- **Memory "used"** is calculated as `total - available` (excluding cache/buffers), matching what Activity Monitor / Task Manager report rather than the raw "used" figure.
- **macOS disk usage** reflects actual occupied space (`total - available`). macOS also reports a large "purgeable" amount; this app reports real occupied space, which can read higher than Finder's purgeable-aware figure.
- **OS info** is fetched once on mount (it doesn't change at runtime); memory, disk, and processes poll on the selected interval.
- **Process CPU and memory** are reported as percentages (CPU as a share of processing time, memory as a share of physical RAM), matching systeminformation's per-process values.