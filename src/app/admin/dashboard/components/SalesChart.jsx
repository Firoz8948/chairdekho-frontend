'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import adminService from '@/lib/services/admin';
import styles from '../dashboard.module.css';

const RANGES = [
  { id: '7d', label: '7D' },
  { id: '10d', label: '10D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: '12m', label: '12M' },
];

const METRICS = [
  { id: 'revenue', label: 'Revenue', money: true },
  { id: 'orders', label: 'Orders', money: false },
  { id: 'avg_order_value', label: 'Avg. order', money: true },
];

const SCOPES = [
  { id: 'all', label: 'All sales' },
  { id: 'paid', label: 'Paid only' },
];

const CHART_TYPES = [
  { id: 'line', label: 'Line' },
  { id: 'bar', label: 'Bar' },
];

const RANGE_CAPTION = {
  '7d': 'last 7 days',
  '10d': 'last 10 days',
  '30d': 'last 30 days',
  '90d': 'last 90 days',
  '12m': 'last 12 months',
};

const ACCENT = '#5c3d2e';

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function formatMoney(value) {
  return `₹${inr.format(Math.round(Number(value) || 0))}`;
}

function formatCompactMoney(value) {
  const num = Number(value) || 0;
  if (num >= 1e7) return `₹${(num / 1e7).toFixed(1).replace(/\.0$/, '')}Cr`;
  if (num >= 1e5) return `₹${(num / 1e5).toFixed(1).replace(/\.0$/, '')}L`;
  if (num >= 1e3) return `₹${(num / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return `₹${inr.format(num)}`;
}

function formatMetric(metric, value) {
  return metric.money ? formatMoney(value) : inr.format(Number(value) || 0);
}

function percentChange(current, previous) {
  if (!previous) return current ? null : 0;
  return ((current - previous) / previous) * 100;
}

function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div className={styles.segmented} role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          className={`${styles.segmentBtn} ${value === opt.id ? styles.segmentBtnActive : ''}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, metric }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.chartTooltipDate}>{point.label}</div>
      <div className={styles.chartTooltipValue}>{formatMetric(metric, point[metric.id])}</div>
      <div className={styles.chartTooltipMeta}>
        {point.orders} order{point.orders === 1 ? '' : 's'}
        {metric.id !== 'revenue' ? ` · ${formatMoney(point.revenue)}` : ''}
      </div>
    </div>
  );
}

export default function SalesChart() {
  const [range, setRange] = useState('10d');
  const [metricId, setMetricId] = useState('revenue');
  const [scope, setScope] = useState('all');
  const [chartType, setChartType] = useState('line');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    adminService
      .getDashboardSales({ range, scope })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load sales');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range, scope]);

  const metric = METRICS.find((m) => m.id === metricId) || METRICS[0];
  const points = useMemo(() => data?.points || [], [data]);
  const current = data?.totals?.[metric.id] ?? 0;
  const previous = data?.previous?.[metric.id] ?? 0;
  const change = percentChange(current, previous);
  const hasSales = points.some((p) => p.orders > 0);
  const manyPoints = points.length > 12;

  const axisTick = { fill: '#64748b', fontSize: 12 };
  const yFormatter = (v) => (metric.money ? formatCompactMoney(v) : inr.format(v));

  return (
    <section className={styles.salesCard}>
      <div className={styles.salesHeader}>
        <div>
          <h2 className={styles.activityTitle} style={{ marginBottom: 4 }}>
            Sales overview
          </h2>
          <p className={styles.salesCaption}>
            {metric.label} · {RANGE_CAPTION[range]}
          </p>
        </div>
        <div className={styles.salesSummary}>
          <div className={styles.salesTotal}>
            {loading && !data ? '…' : formatMetric(metric, current)}
          </div>
          {data && change !== null ? (
            <span
              className={`${styles.changePill} ${
                change > 0 ? styles.changeUp : change < 0 ? styles.changeDown : styles.changeFlat
              }`}
            >
              {change > 0 ? '▲' : change < 0 ? '▼' : '—'} {Math.abs(change).toFixed(1)}%
              <span className={styles.changeHint}>vs previous period</span>
            </span>
          ) : data ? (
            <span className={`${styles.changePill} ${styles.changeUp}`}>
              New <span className={styles.changeHint}>no sales in previous period</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.salesFilters}>
        <Segmented options={RANGES} value={range} onChange={setRange} ariaLabel="Date range" />
        <Segmented options={METRICS} value={metricId} onChange={setMetricId} ariaLabel="Metric" />
        <Segmented options={SCOPES} value={scope} onChange={setScope} ariaLabel="Sales scope" />
        <Segmented
          options={CHART_TYPES}
          value={chartType}
          onChange={setChartType}
          ariaLabel="Chart type"
        />
      </div>

      <div className={styles.chartArea}>
        {error ? (
          <div className={styles.emptyState}>{error}</div>
        ) : loading && !data ? (
          <div className={styles.chartSkeleton} />
        ) : (
          <>
            <div className={`${styles.chartInner} ${loading ? styles.chartLoading : ''}`}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={points} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
                    <CartesianGrid stroke="#eef2f6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      interval={manyPoints ? 'preserveStartEnd' : 0}
                      minTickGap={12}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tickFormatter={yFormatter}
                      allowDecimals={metric.money}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(92, 61, 46, 0.06)' }}
                      content={<ChartTooltip metric={metric} />}
                    />
                    <Bar
                      dataKey={metric.id}
                      fill={ACCENT}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={42}
                      animationDuration={600}
                    />
                  </BarChart>
                ) : (
                  <ComposedChart data={points} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ACCENT} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#eef2f6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      interval={manyPoints ? 'preserveStartEnd' : 0}
                      minTickGap={12}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tickFormatter={yFormatter}
                      allowDecimals={metric.money}
                    />
                    <Tooltip
                      cursor={{ stroke: ACCENT, strokeDasharray: '4 4', strokeOpacity: 0.5 }}
                      content={<ChartTooltip metric={metric} />}
                    />
                    <Area
                      type="monotone"
                      dataKey={metric.id}
                      stroke="none"
                      fill="url(#salesFill)"
                      animationDuration={600}
                    />
                    <Line
                      type="monotone"
                      dataKey={metric.id}
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      dot={manyPoints ? false : { r: 3.5, fill: '#fff', stroke: ACCENT, strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 2 }}
                      animationDuration={600}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
            {!hasSales && !loading ? (
              <p className={styles.chartEmptyNote}>No sales in this period yet.</p>
            ) : null}
          </>
        )}
      </div>

      {data ? (
        <div className={styles.salesFooter}>
          <div>
            <span className={styles.footerLabel}>Revenue</span>
            <strong>{formatMoney(data.totals.revenue)}</strong>
          </div>
          <div>
            <span className={styles.footerLabel}>Orders</span>
            <strong>{inr.format(data.totals.orders)}</strong>
          </div>
          <div>
            <span className={styles.footerLabel}>Avg. order value</span>
            <strong>{formatMoney(data.totals.avg_order_value)}</strong>
          </div>
        </div>
      ) : null}
    </section>
  );
}
