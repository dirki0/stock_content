<script setup lang="ts">
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/vue'
import { eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, format } from 'date-fns'

import type { Period, Range } from '../../types/home.types'

const props = defineProps<{
  period: Period
  range: Range
}>()

const cardRef = useTemplateRef<HTMLElement | null>('cardRef')

interface DataRecord {
  amount: number
  date: Date
}

const { width } = useElementSize(cardRef)

// We use `useAsyncData` here to have same random data on the client and server
const { data } = await useAsyncData<Array<DataRecord>>(async () => {
  const dates = ({
    daily: eachDayOfInterval,
    monthly: eachMonthOfInterval,
    weekly: eachWeekOfInterval,
  } as Record<Period, typeof eachDayOfInterval>)[props.period](props.range)

  const min = 1000
  const max = 10000

  return dates.map(date => ({ amount: Math.floor(Math.random() * (max - min + 1)) + min, date }))
}, {
  default: () => [],
  watch: [() => props.period, () => props.range],
})

const x = (_: DataRecord, i: number) => i
const y = (d: DataRecord) => d.amount

const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))

const formatNumber = new Intl.NumberFormat('en', { currency: 'USD', maximumFractionDigits: 0, style: 'currency' }).format

function formatDate (date: Date): string {
  return ({
    daily: format(date, 'd MMM'),
    monthly: format(date, 'MMM yyy'),
    weekly: format(date, 'd MMM'),
  })[props.period]
}

function xTicks (i: number) {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) {
    return ''
  }

  return formatDate(data.value[i].date)
}

const template = (d: DataRecord) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`
</script>

<template>
  <UCard
    ref="cardRef"
    :ui="{ body: '!px-0 !pt-0 !pb-3' }"
  >
    <template #header>
      <div>
        <p class="text-xs text-(--ui-text-muted) uppercase mb-1.5">
          Revenue
        </p>
        <p class="text-3xl text-(--ui-text-highlighted) font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <VisXYContainer
      :data="data"
      :padding="{ top: 40 }"
      class="h-96"
      :width="width"
    >
      <VisLine
        :x="x"
        :y="y"
        color="var(--ui-primary)"
      />
      <VisArea
        :x="x"
        :y="y"
        color="var(--ui-primary)"
        :opacity="0.1"
      />

      <VisAxis
        type="x"
        :x="x"
        :tick-format="xTicks"
      />

      <VisCrosshair
        color="var(--ui-primary)"
        :template="template"
      />

      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
