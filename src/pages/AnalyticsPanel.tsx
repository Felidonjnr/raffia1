import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Users, Eye, Activity, Globe2, Smartphone, AlertCircle, MousePointerClick } from 'lucide-react';

type MetricRow = { label: string; views: number };
type Report = {
  summary: { visitors: number; visits: number; pageViews: number; bounces: number; bounceRate: number; totalTime: number };
  trend: Array<{ date: string; pageViews: number; visitors: number }>;
  pages: MetricRow[];
  sources: MetricRow[];
  countries: MetricRow[];
  devices: MetricRow[];
  updatedAt?: string;
};

const number = (value?: number) => Number(value || 0).toLocaleString();
const percent = (value?: number) => `${(Number(value || 0) * 100).toFixed(1)}%`;

export const AnalyticsPanel: React.FC<{ client: any }> = ({ client }) => {
  const [range, setRange] = useState<'today' | '7days' | '30days' | '90days'>('30days');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: invokeError } = await client.functions.invoke('umami-admin-analytics', { body: { range } });
      if (invokeError) throw new Error(invokeError.message || 'Unable to load website analytics.');
      if (data?.error) throw new Error(data.error);
      setReport(data as Report);
    } catch (err: any) {
      setError(err?.message || 'Unable to load Umami analytics.');
    } finally {
      setLoading(false);
    }
  }, [client, range]);

  useEffect(() => { load(); }, [load]);

  const cards = [
    { label: 'Unique visitors', value: number(report?.summary.visitors), icon: Users },
    { label: 'Page views', value: number(report?.summary.pageViews), icon: Eye },
    { label: 'Visits', value: number(report?.summary.visits), icon: Activity },
    { label: 'Bounce rate', value: percent(report?.summary.bounceRate), icon: MousePointerClick },
  ];

  const maxViews = Math.max(1, ...(report?.trend || []).map((item) => item.pageViews));

  return <div className="space-y-7 max-w-7xl">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B84A28]">Umami reporting</span>
        <h2 className="font-sans text-4xl sm:text-5xl mt-1">Website Analytics</h2>
        <p className="text-sm text-[#57524E] mt-2">Visitor activity across Raffia Legacy · Analytics by Umami</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(['today', '7days', '30days', '90days'] as const).map((value) => (
          <button key={value} onClick={() => setRange(value)} className={`px-3 py-2 text-xs uppercase border ${range === value ? 'bg-[#181513] text-white border-[#181513]' : 'bg-white border-[#181513]/20'}`}>
            {value === 'today' ? 'Today' : value === '7days' ? '7 days' : value === '30days' ? '30 days' : '90 days'}
          </button>
        ))}
        <button onClick={load} disabled={loading} className="px-3 py-2 border bg-white text-xs inline-flex items-center gap-2 disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>
    </div>

    {error && (
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-sm flex gap-3">
        <AlertCircle size={18} className="shrink-0" />
        <div>
          <b>Analytics connection needs one final step</b>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-xs">The Umami tracking code is active. The API key must be saved securely in Supabase before reports can load here.</p>
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-white border border-[#181513]/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-[#8C7355]">{label}</span>
            <Icon size={17} className="text-[#B84A28]" />
          </div>
          <p className="text-3xl sm:text-4xl font-bold">{loading && !report ? '—' : value}</p>
        </div>
      ))}
    </div>

    {report && <>
      <section className="bg-white border border-[#181513]/10 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h3 className="text-xl font-semibold">Traffic trend</h3>
          <span className="text-[11px] text-[#8C7355]">Page views per {range === 'today' ? 'hour' : 'day'}</span>
        </div>
        {report.trend.length ? <>
          <div className="flex items-end gap-1 h-48 border-b border-l border-[#181513]/10 px-2">
            {report.trend.map((item, index) => (
              <div key={`${item.date}-${index}`} title={`${item.date}: ${number(item.pageViews)} page views`} className="flex-1 bg-[#B84A28]/80 hover:bg-[#181513] min-w-0" style={{ height: `${Math.max(3, item.pageViews / maxViews * 100)}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#8C7355] mt-2">
            <span>{report.trend[0]?.date}</span><span>{report.trend[report.trend.length - 1]?.date}</span>
          </div>
        </> : <p className="text-sm text-[#8C7355]">No traffic trend recorded for this period yet.</p>}
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="bg-white border border-[#181513]/10 p-5">
          <h3 className="text-xl font-semibold mb-4">Top pages</h3>
          {report.pages.length ? report.pages.map((item) => <div key={item.label} className="flex justify-between gap-3 py-2 border-b border-[#181513]/5 text-sm"><span className="truncate">{item.label}</span><b>{number(item.views)}</b></div>) : <p className="text-sm text-[#8C7355]">No page data yet.</p>}
        </section>
        <section className="bg-white border border-[#181513]/10 p-5">
          <h3 className="text-xl font-semibold mb-4">Traffic sources</h3>
          {report.sources.length ? report.sources.map((item) => <div key={item.label} className="flex justify-between gap-3 py-2 border-b border-[#181513]/5 text-sm"><span className="truncate">{item.label || 'Direct / none'}</span><b>{number(item.views)}</b></div>) : <p className="text-sm text-[#8C7355]">No source data yet.</p>}
        </section>
        <section className="bg-white border border-[#181513]/10 p-5">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Globe2 size={17} /> Top countries</h3>
          {report.countries.length ? report.countries.map((item) => <div key={item.label} className="flex justify-between py-2 border-b border-[#181513]/5 text-sm"><span>{item.label}</span><b>{number(item.views)}</b></div>) : <p className="text-sm text-[#8C7355]">No country data yet.</p>}
        </section>
        <section className="bg-white border border-[#181513]/10 p-5">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Smartphone size={17} /> Devices</h3>
          {report.devices.length ? report.devices.map((item) => <div key={item.label} className="flex justify-between py-2 border-b border-[#181513]/5 text-sm capitalize"><span>{item.label}</span><b>{number(item.views)}</b></div>) : <p className="text-sm text-[#8C7355]">No device data yet.</p>}
        </section>
      </div>
    </>}

    {!report && !error && <div className="bg-white border border-[#181513]/10 p-10 text-center text-sm text-[#8C7355]">{loading ? 'Loading Umami reports…' : 'No analytics data returned yet.'}</div>}
    <p className="text-xs text-[#8C7355]">Order and confirmed revenue figures remain sourced from Supabase. Website traffic is reported separately by Umami.</p>
  </div>;
};
