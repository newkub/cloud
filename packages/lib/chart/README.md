# @wrikka/chart

> 🚀 Modern visualization library with Clean Architecture

A powerful charting library built with Clean Architecture principles, providing flexible data visualization with support for multiple chart types, real-time updates, and custom renderers.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![SolidJS](https://img.shields.io/badge/solidjs-1.9-4FC08D.svg)](https://solidjs.com/)

## Features

| Icon | Feature | Description |
|:----:|:--------|:------------|
| <center>![chart-line](https://api.iconify.design/mdi:chart-line.svg?color=%233498DB&width=16)</center> | Multiple Chart Types | Line, bar, pie, gauge, and custom charts |
| <center>![chart-pie](https://api.iconify.design/mdi:chart-pie.svg?color=%23E74C3C&width=16)</center> | Canvas Rendering | High-performance canvas-based rendering |
| <center>![time](https://api.iconify.design/mdi:clock.svg?color=%23F39C12&width=16)</center> | Real-Time Updates | Live data updates with smooth transitions |
| <center>![settings-adjust](https://api.iconify.design/mdi:cog.svg?color=%239B59B6&width=16)</center> | Custom Renderers | Extensible renderer system for custom visualizations |
| <center>![rule](https://api.iconify.design/mdi:rule.svg?color=%2327AE60&width=16)</center> | Clean Architecture | Domain-driven design with clear separation of concerns |
| <center>![calculator](https://api.iconify.design/mdi:calculator.svg?color=%23E67E22&width=16)</center> | Built-in Calculations | Common chart calculations and transformations |
| <center>![checkmark-filled](https://api.iconify.design/mdi:check-circle.svg?color=%231ABC9C&width=16)</center> | Validation | Type-safe data validation with Zod schemas |
| <center>![events](https://api.iconify.design/mdi:flash.svg?color=%2345B7D1&width=16)</center> | Event System | Domain events for chart lifecycle management |

## Get Started

1. **Install the package** — add @wrikka/chart to your project

   ```bash
   bun add @wrikka/chart
   ```

2. **Import and use** — create a chart in your SolidJS component

   ```tsx
   import { Chart } from '@wrikka/chart'
   import { createSignal } from 'solid-js'

   function App() {
     const [chartData] = createSignal({
       type: 'line' as const,
       data: {
         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
         datasets: [{ label: 'Sales', data: [65, 59, 80, 81, 56] }],
       },
     })
     return <Chart data={chartData()} />
   }
   ```

## Usage

### Line Chart

```tsx
import { Chart } from '@wrikka/chart'

function LineChartExample() {
  const data = {
    type: 'line' as const,
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{ label: 'Values', data: [10, 15, 13, 17, 14] }],
    },
    options: { smooth: true, area: true },
  }
  return <Chart data={data} />
}
```

### Bar Chart

```tsx
import { Chart } from '@wrikka/chart'

function BarChartExample() {
  const data = {
    type: 'bar' as const,
    data: {
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      datasets: [{ label: 'Sales', data: [120, 85, 95, 110] }],
    },
  }
  return <Chart data={data} />
}
```

### Gauge Chart

```tsx
import { GaugeChart } from '@wrikka/chart'

function GaugeChartExample() {
  const data = {
    value: 75, min: 0, max: 100,
    label: 'CPU Usage', unit: '%', color: '#10B981',
  }
  return <GaugeChart data={data} />
}
```

### Pie Chart

```tsx
import { Chart } from '@wrikka/chart'

function PieChartExample() {
  const data = {
    type: 'pie' as const,
    data: {
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      datasets: [{ label: 'Sales', data: [30, 20, 25, 25] }],
    },
    options: { showLabels: true, showLegend: true },
  }
  return <Chart data={data} />
}
```

### Chart Cards

```tsx
import { ChartCard } from '@wrikka/chart'
import { For } from 'solid-js'

function ChartCardsExample() {
  const stats = [
    { title: 'Revenue', value: '$12,345', change: '+12%', chart: { type: 'line', data: [...] } },
    { title: 'Users', value: '1,234', change: '+5%', chart: { type: 'bar', data: [...] } },
  ]
  return (
    <div class="grid grid-cols-2 gap-4">
      <For each={stats}>{(stat) => <ChartCard data={stat} />}</For>
    </div>
  )
}
```

### Real-Time Updates

```tsx
import { Chart } from '@wrikka/chart'
import { createSignal, onMount, onCleanup } from 'solid-js'

function RealTimeChartExample() {
  const [chartData, setChartData] = createSignal({
    type: 'line' as const,
    data: { labels: [] as string[], datasets: [{ label: 'Live Data', data: [] as number[] }] },
  })

  onMount(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString()
      const value = Math.random() * 100
      setChartData((prev) => ({
        ...prev,
        data: {
          labels: [...prev.data.labels, timeStr].slice(-20),
          datasets: [{ ...prev.data.datasets[0], data: [...prev.data.datasets[0].data, value].slice(-20) }],
        },
      }))
    }, 1000)
    onCleanup(() => clearInterval(interval))
  })

  return <Chart data={chartData()} />
}
```

### Custom Calculations

```typescript
import { calculateAverage, calculateTrend } from '@wrikka/chart'

const data = [10, 15, 13, 17, 14, 18, 16]
const average = calculateAverage(data) // 14.71
const trend = calculateTrend(data) // 'up' | 'down' | 'stable'
```

### Chart Events

```tsx
import { Chart } from '@wrikka/chart'

function ChartWithEvents() {
  const [selectedPoint, setSelectedPoint] = createSignal(null)
  return (
    <div>
      <Chart data={chartData()} onPointClick={setSelectedPoint} />
      <Show when={selectedPoint()}>
        <div>Selected: {selectedPoint().label}</div>
      </Show>
    </div>
  )
}
```

## License

This project is licensed under the <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="noopener noreferrer">MIT License</a>.

- ✓ Commercial use, Distribution, Modification, Private use
- ⓘ License and copyright notice
- ✕ Liability, Warranty
