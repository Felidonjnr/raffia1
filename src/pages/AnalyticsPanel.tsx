import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Users, Eye, MousePointerClick, Activity, Globe2, Smartphone, AlertCircle } from 'lucide-react';

type Report = {
  summary: { activeUsers: number; sessions: number; pageViews: number; engagementRate: number };
  trend: Array<{ date: string; activeUsers: number; sessions: number; pageViews: number }>;
  pages: Array<{ pagePath: string; screenPageViews: number }>;
  sources: Array<{ sessionSourceMedium: string; sessions: number }>;
  countries: Array<{ country: string; activeUsers: number }>;
  devices: Array<{ deviceCategory: string; activeUsers: number }>;
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
    setLoading(true); setError('');
    const { data, error: invokeError } = await client.functions.invoke('ga4-admin-analytics', { body: { range } });
    if (invokeError) setError(invokeError.message || 'Unable to load Google Analytics data.');
    else if (data?.error) setError(data.error);
    else setReport(data as Report);
    setLoading(false);
  }, [client, range]);

  useEffect(() => { load(); }, [load]);

  const cards = [
    { label: 'Active users', value: number(report?.summary.activeUsers), icon: Users },
    { label: 'Sessions', value: number(report?.summary.sessions), icon: Activity },
    { label: 'Page views', value: number(report?.summary.pageViews), icon: Eye },
    { label: 'Engagement rate', value: percent(report?.summary.engagementRate), icon: MousePointerClick },
  ];

  return <div className="space-y-7 max-w-7xl">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><span className="text-xs uppercase tracking-[0.25em] text-[#B84A28]">GA4 reporting</span><h2 className="font-sans text-4xl sm:text-5xl mt-1">Website Analytics</h2><p className="text-sm text-[#57524E] mt-2">Live reporting from Raffia Legacy Website · Property 563219559</p></div>
      <div className="flex gap-2 flex-wrap">
        {(['today','7days','30days','90days'] as const).map((v) => <button key={v} onClick={() => setRange(v)} className={`px-3 py-2 text-xs uppercase border ${range===v?'bg-[#181513] text-white border-[#181513]':'bg-white border-[#181513]/20'}`}>{v==='today'?'Today':v==='7days'?'7 days':v==='30days'?'30 days':'90 days'}</button>)}
        <button onClick={load} disabled={loading} className="px-3 py-2 border bg-white text-xs inline-flex items-center gap-2"><RefreshCw size={13} className={loading?'animate-spin':''}/>Refresh</button>
      </div>
    </div>
    {error && <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-sm flex gap-3"><AlertCircle size={18} className="shrink-0"/><div><b>Analytics connection needs attention</b><p className="mt-1">{error}</p><p className="mt-2 text-xs">The dashboard is ready; Google service-account credentials must be added to Supabase before reports can load.</p></div></div>}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(({label,value,icon:Icon})=><div key={label} className="bg-white border border-[#181513]/10 p-5 space-y-3"><div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-widest text-[#8C7355]">{label}</span><Icon size={17} className="text-[#B84A28]"/></div><p className="text-3xl sm:text-4xl font-bold">{loading&&!report?'—':value}</p></div>)}</div>
    {report && <>
      <section className="bg-white border border-[#181513]/10 p-5 sm:p-6"><h3 className="text-xl font-semibold mb-5">Traffic trend</h3><div className="flex items-end gap-1 h-48 border-b border-l border-[#181513]/10 px-2">{report.trend.map((d)=><div key={d.date} title={`${d.date}: ${number(d.activeUsers)} users`} className="flex-1 bg-[#B84A28]/80 hover:bg-[#181513]" style={{height:`${Math.max(3, d.activeUsers/Math.max(1,...report.trend.map(x=>x.activeUsers))*100)}%`}} />)}</div><div className="flex justify-between text-[10px] text-[#8C7355] mt-2"><span>{report.trend[0]?.date}</span><span>{report.trend[report.trend.length-1]?.date}</span></div></section>
      <div className="grid lg:grid-cols-2 gap-5">
        <section className="bg-white border border-[#181513]/10 p-5"><h3 className="text-xl font-semibold mb-4">Top pages</h3>{report.pages.length?report.pages.map((x)=><div key={x.pagePath} className="flex justify-between gap-3 py-2 border-b border-[#181513]/5 text-sm"><span className="truncate">{x.pagePath}</span><b>{number(x.screenPageViews)}</b></div>):<p className="text-sm text-[#8C7355]">No page data yet.</p>}</section>
        <section className="bg-white border border-[#181513]/10 p-5"><h3 className="text-xl font-semibold mb-4">Traffic sources</h3>{report.sources.length?report.sources.map((x)=><div key={x.sessionSourceMedium} className="flex justify-between gap-3 py-2 border-b border-[#181513]/5 text-sm"><span className="truncate">{x.sessionSourceMedium}</span><b>{number(x.sessions)}</b></div>):<p className="text-sm text-[#8C7355]">No source data yet.</p>}</section>
        <section className="bg-white border border-[#181513]/10 p-5"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Globe2 size={17}/> Top countries</h3>{report.countries.map(x=><div key={x.country} className="flex justify-between py-2 border-b border-[#181513]/5 text-sm"><span>{x.country}</span><b>{number(x.activeUsers)}</b></div>)}</section>
        <section className="bg-white border border-[#181513]/10 p-5"><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Smartphone size={17}/> Devices</h3>{report.devices.map(x=><div key={x.deviceCategory} className="flex justify-between py-2 border-b border-[#181513]/5 text-sm capitalize"><span>{x.deviceCategory}</span><b>{number(x.activeUsers)}</b></div>)}</section>
      </div>
    </>}
    {!report&&!error&&<div className="bg-white border border-[#181513]/10 p-10 text-center text-sm text-[#8C7355]">{loading?'Loading Google Analytics reports…':'No analytics data returned yet.'}</div>}
    <p className="text-xs text-[#8C7355]">Sales and confirmed revenue remain sourced from Supabase orders. GA4 website analytics are reported separately.</p>
  </div>;
};
