import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, Handshake, Mail, Pencil, Plus, RefreshCw, Save, Trash2, Users, X, FileText, Ticket } from 'lucide-react';

export type AdminOperationsSection = 'events' | 'registrations' | 'volunteers' | 'partnerships' | 'content' | 'newsletter';
type FieldType = 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'number' | 'datetime-local' | 'select' | 'tags';
type Field = { key: string; label: string; type?: FieldType; required?: boolean; options?: string[]; placeholder?: string; help?: string };
type Config = { title: string; description: string; table: string; primary: string; secondary?: string; status?: string; fields: Field[]; defaults: Record<string, any>; readOnly?: boolean };

const configs: Record<AdminOperationsSection, Config> = {
  events: {
    title: 'Events & Festival', description: 'Create and manage Raffia Legacy programmes, festival activities and event listings.',
    table: 'legacy_events', primary: 'title', secondary: 'venue', status: 'status',
    fields: [
      { key: 'title', label: 'Event title', required: true },
      { key: 'slug', label: 'URL slug', required: true, help: 'Use lowercase words separated by hyphens.' },
      { key: 'summary', label: 'Short summary', type: 'textarea' },
      { key: 'description', label: 'Full description', type: 'textarea' },
      { key: 'starts_at', label: 'Start date and time', type: 'datetime-local' },
      { key: 'ends_at', label: 'End date and time', type: 'datetime-local' },
      { key: 'venue', label: 'Venue' },
      { key: 'city', label: 'City / LGA' },
      { key: 'state', label: 'State' },
      { key: 'status', label: 'Publishing status', type: 'select', options: ['draft','published','cancelled','completed'], required: true },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'registration_url', label: 'Registration URL', type: 'url' },
      { key: 'cover_image', label: 'Cover image URL', type: 'url' },
    ],
    defaults: { title: '', slug: '', summary: '', description: '', starts_at: '', ends_at: '', venue: '', city: 'Ikot Ekpene', state: 'Akwa Ibom', status: 'draft', capacity: '', registration_url: '', cover_image: '' },
  },
  registrations: {
    title: 'Event Registrations', description: 'Review attendees, update registration status and track event participation.',
    table: 'event_registrations', primary: 'full_name', secondary: 'email', status: 'status',
    fields: [
      { key: 'event_id', label: 'Event', type: 'select', options: [] },
      { key: 'full_name', label: 'Full name', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'phone', label: 'Phone number', type: 'tel' },
      { key: 'organization', label: 'Organisation' },
      { key: 'ticket_type', label: 'Ticket type' },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true },
      { key: 'amount', label: 'Amount (NGN)', type: 'number' },
      { key: 'status', label: 'Registration status', type: 'select', options: ['pending','confirmed','cancelled','attended'], required: true },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    defaults: { event_id: '', full_name: '', email: '', phone: '', organization: '', ticket_type: 'General', quantity: 1, amount: 0, status: 'pending', notes: '' },
  },
  volunteers: {
    title: 'Volunteer Applications', description: 'Review volunteer interest, skills, availability and onboarding decisions.',
    table: 'volunteer_applications', primary: 'full_name', secondary: 'email', status: 'status',
    fields: [
      { key: 'full_name', label: 'Full name', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'phone', label: 'Phone number', type: 'tel' },
      { key: 'skills', label: 'Skills', type: 'tags', help: 'Separate skills with commas.' },
      { key: 'availability', label: 'Availability' },
      { key: 'motivation', label: 'Why would you like to volunteer?', type: 'textarea' },
      { key: 'status', label: 'Application status', type: 'select', options: ['new','reviewing','approved','rejected'], required: true },
      { key: 'admin_notes', label: 'Internal notes', type: 'textarea' },
    ],
    defaults: { full_name: '', email: '', phone: '', skills: '', availability: '', motivation: '', status: 'new', admin_notes: '' },
  },
  partnerships: {
    title: 'Partnerships & Sponsorships', description: 'Track organisations, sponsor enquiries, proposed collaborations and follow-up.',
    table: 'partnership_inquiries', primary: 'organization_name', secondary: 'contact_name', status: 'status',
    fields: [
      { key: 'organization_name', label: 'Organisation name', required: true },
      { key: 'contact_name', label: 'Contact person', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'phone', label: 'Phone number', type: 'tel' },
      { key: 'partnership_type', label: 'Partnership type', type: 'select', options: ['Festival Sponsor','Programme Sponsor','Legacy Partner','Knowledge Partner','Media & Creative Partner','Tourism & Destination Partner','In-kind Support','Other'] },
      { key: 'message', label: 'Proposal / enquiry', type: 'textarea' },
      { key: 'estimated_value', label: 'Estimated value (NGN)', type: 'number' },
      { key: 'status', label: 'Pipeline status', type: 'select', options: ['new','reviewing','contacted','accepted','declined'], required: true },
      { key: 'admin_notes', label: 'Internal notes', type: 'textarea' },
    ],
    defaults: { organization_name: '', contact_name: '', email: '', phone: '', partnership_type: 'Other', message: '', estimated_value: '', status: 'new', admin_notes: '' },
  },
  content: {
    title: 'Content Library', description: 'Draft and organise reusable copy, announcements, articles and FAQ entries for the project.',
    table: 'content_entries', primary: 'title', secondary: 'content_key', status: 'status',
    fields: [
      { key: 'content_key', label: 'Content key', required: true, help: 'Unique internal identifier, e.g. home.hero.title.' },
      { key: 'title', label: 'Title', required: true },
      { key: 'content_type', label: 'Content type', type: 'select', options: ['page_section','announcement','article','faq'], required: true },
      { key: 'body', label: 'Content', type: 'textarea', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['draft','published','archived'], required: true },
    ],
    defaults: { content_key: '', title: '', content_type: 'page_section', body: '', status: 'draft' },
  },
  newsletter: {
    title: 'Newsletter Subscribers', description: 'Review saved subscriber consent records and manage unsubscribe status.',
    table: 'newsletter_subscribers', primary: 'email', secondary: 'source', status: 'status', readOnly: false,
    fields: [
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'source', label: 'Signup source' },
      { key: 'status', label: 'Subscription status', type: 'select', options: ['pending_sync','subscribed','unsubscribed'], required: true },
    ],
    defaults: { email: '', source: 'admin', status: 'pending_sync' },
  },
};

const localDateValue = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const displayDate = (value?: string) => value ? new Date(value).toLocaleString() : 'Date not set';

export const AdminOperationsPanel: React.FC<{ client: any; section: AdminOperationsSection }> = ({ client, section }) => {
  const config = configs[section];
  const [rows, setRows] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState<Record<string, any> | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!client) return;
    setLoading(true); setError('');
    const [list, eventList] = await Promise.all([
      client.from(config.table).select('*').order('created_at', { ascending: false }).limit(250),
      section === 'registrations' ? client.from('legacy_events').select('id,title').order('starts_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
    ]);
    if (list.error) setError(list.error.message);
    else setRows(list.data || []);
    if (!eventList.error) setEvents(eventList.data || []);
    setLoading(false);
  }, [client, config.table, section]);

  useEffect(() => { load(); }, [load]);

  const fields = useMemo(() => config.fields.map(field => field.key === 'event_id'
    ? { ...field, options: events.map(event => event.id) }
    : field), [config.fields, events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(row => [row[config.primary], row[config.secondary || ''], row[config.status || '']]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }, [rows, search, config]);

  const beginEdit = (row?: Record<string, any>) => {
    if (config.readOnly) return;
    const next: Record<string, any> = { ...config.defaults, ...(row || {}) };
    fields.forEach(field => {
      if (field.type === 'datetime-local') next[field.key] = localDateValue(next[field.key]);
      if (field.type === 'tags') next[field.key] = Array.isArray(next[field.key]) ? next[field.key].join(', ') : next[field.key] || '';
      if (field.type === 'datetime-local' && next[field.key] === null) next[field.key] = '';
    });
    setEditor(next);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editor || !client || config.readOnly) return;
    setSaving(true); setError(''); setNotice('');
    const payload: Record<string, any> = {};
    fields.forEach(field => {
      let value = editor[field.key];
      if (field.type === 'datetime-local') value = value ? new Date(value).toISOString() : null;
      if (field.type === 'tags') value = String(value || '').split(',').map((item: string) => item.trim()).filter(Boolean);
      if (field.type === 'number') value = value === '' || value === null ? null : Number(value);
      if (field.key === 'event_id' && !value) value = null;
      payload[field.key] = value;
    });
    if (section === 'events' || section === 'content') {
      const { data: authData } = await client.auth.getUser();
      if (authData?.user?.id) {
        payload.updated_by = authData.user.id;
        if (!editor.id) payload.created_by = authData.user.id;
      }
    }
    const query = editor.id
      ? client.from(config.table).update(payload).eq('id', editor.id)
      : client.from(config.table).insert(payload);
    const { error: saveError } = await query;
    if (saveError) setError(saveError.message);
    else { setNotice('Record saved successfully.'); setEditor(null); await load(); }
    setSaving(false);
  };

  const remove = async (row: Record<string, any>) => {
    if (!client || config.readOnly) return;
    const label = row[config.primary] || 'this record';
    if (!window.confirm('Delete ' + label + '? This cannot be undone.')) return;
    const { error: deleteError } = await client.from(config.table).delete().eq('id', row.id);
    if (deleteError) setError(deleteError.message);
    else { setNotice('Record deleted.'); await load(); }
  };

  const quickStatus = async (row: Record<string, any>, status: string) => {
    if (!config.status) return;
    const { error: updateError } = await client.from(config.table).update({ status, updated_at: new Date().toISOString() }).eq('id', row.id);
    if (updateError) setError(updateError.message);
    else { setRows(current => current.map(item => item.id === row.id ? { ...item, status } : item)); setNotice('Status updated.'); }
  };

  const countLabel = section === 'events' ? 'events' : section === 'registrations' ? 'registrations' : section === 'volunteers' ? 'applications' : section === 'partnerships' ? 'enquiries' : section === 'newsletter' ? 'subscribers' : 'content entries';

  return <div className="space-y-6 max-w-7xl">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B84A28]">Project operations</span>
        <h2 className="font-sans text-4xl sm:text-5xl mt-1">{config.title}</h2>
        <p className="text-sm text-[#57524E] mt-2 max-w-2xl">{config.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={load} disabled={loading} className="px-4 py-3 border border-[#181513]/20 bg-white text-xs uppercase tracking-wider inline-flex items-center gap-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/> Refresh
        </button>
        {!config.readOnly && <button type="button" onClick={() => beginEdit()} className="px-4 py-3 bg-[#B84A28] text-white text-xs uppercase tracking-wider inline-flex items-center gap-2">
          <Plus size={15}/> Add record
        </button>}
      </div>
    </div>

    {notice && <div className="p-3 border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm">{notice}</div>}
    {error && <div role="alert" className="p-3 border border-red-200 bg-red-50 text-red-900 text-sm flex gap-2"><AlertCircle size={16}/>{error}</div>}

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white border border-[#181513]/10 p-4"><p className="text-[10px] uppercase tracking-widest text-[#8C7355]">Total {countLabel}</p><p className="text-3xl font-bold mt-1">{rows.length}</p></div>
      {config.status && <div className="bg-white border border-[#181513]/10 p-4"><p className="text-[10px] uppercase tracking-widest text-[#8C7355]">New / Pending</p><p className="text-3xl font-bold mt-1">{rows.filter(row => ['new','pending','draft','pending_sync'].includes(row.status)).length}</p></div>}
      <div className="bg-white border border-[#181513]/10 p-4"><p className="text-[10px] uppercase tracking-widest text-[#8C7355]">Last updated</p><p className="text-sm font-semibold mt-2">{rows[0]?.updated_at ? displayDate(rows[0].updated_at) : rows[0]?.created_at ? displayDate(rows[0].created_at) : '—'}</p></div>
    </div>

    {section === 'newsletter' && rows.length === 0 && <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-sm">No subscriber records are currently stored in the Raffia database. The live signup endpoint syncs directly with Brevo; database write-back still needs to be connected before this table can mirror the mailing list.</div>}

    <div className="bg-white border border-[#181513]/10">
      <div className="p-4 border-b border-[#181513]/10">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={'Search ' + countLabel + '…'} className="w-full max-w-md border border-[#181513]/15 bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B84A28]"/>
      </div>
      {loading ? <div className="p-12 text-center text-sm text-[#8C7355]"><RefreshCw size={18} className="animate-spin inline mr-2"/>Loading records…</div>
      : filtered.length === 0 ? <div className="p-12 text-center text-sm text-[#8C7355]">No records found.</div>
      : <div className="divide-y divide-[#181513]/10">
        {filtered.map(row => <div key={row.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-[#181513] truncate">{row[config.primary] || 'Untitled record'}</p>
            <p className="text-xs text-[#8C7355] mt-1 truncate">{row[config.secondary || ''] || row.email || row.venue || row.content_key || ''}</p>
            <p className="text-[10px] text-[#8C7355] mt-1">{displayDate(row.created_at)}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {config.status && <select value={row.status || ''} onChange={e => quickStatus(row,e.target.value)} className="border border-[#181513]/15 bg-[#FCFAF7] px-3 py-2 text-xs capitalize">
              {(fields.find(f => f.key === 'status')?.options || [row.status]).map(value => <option key={value} value={value}>{String(value).replaceAll('_',' ')}</option>)}
            </select>}
            {!config.readOnly && <button type="button" onClick={() => beginEdit(row)} className="px-3 py-2 border border-[#181513]/15 text-xs inline-flex items-center gap-1.5"><Pencil size={13}/> Edit</button>}
            {!config.readOnly && <button type="button" onClick={() => remove(row)} className="px-3 py-2 border border-red-200 text-red-700 text-xs inline-flex items-center gap-1.5"><Trash2 size={13}/> Delete</button>}
          </div>
        </div>)}
      </div>}
    </div>

    {editor && <div className="fixed inset-0 z-[120] bg-black/60 p-4 flex items-center justify-center overflow-y-auto">
      <form onSubmit={save} className="my-auto w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FAF7F2] shadow-2xl">
        <div className="sticky top-0 z-10 bg-[#211D1A] text-white px-5 py-4 flex items-center justify-between">
          <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#D7A98F]">Admin Studio</p><h3 className="text-xl font-semibold">{editor.id ? 'Edit record' : 'Create record'}</h3></div>
          <button type="button" onClick={() => setEditor(null)} className="p-2 hover:bg-white/10"><X size={18}/></button>
        </div>
        <div className="p-5 sm:p-7 grid sm:grid-cols-2 gap-4">
          {fields.map(field => <label key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2 block' : 'block'}>
            <span className="block text-xs font-semibold text-[#57524E] mb-1.5">{field.label}{field.required ? ' *' : ''}</span>
            {field.type === 'textarea' ? <textarea required={field.required} rows={4} value={editor[field.key] ?? ''} onChange={e => setEditor(current => current ? { ...current, [field.key]: e.target.value } : current)} className="w-full border border-[#181513]/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B84A28]"/>
            : field.type === 'select' ? <select required={field.required} value={editor[field.key] ?? ''} onChange={e => setEditor(current => current ? { ...current, [field.key]: e.target.value } : current)} className="w-full border border-[#181513]/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B84A28]">
              <option value="">Select…</option>
              {(field.key === 'event_id' ? events.map(event => ({ value: event.id, label: event.title })) : (field.options || []).map(value => ({ value, label: value.replaceAll('_',' ') }))).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            : <input required={field.required} type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} step={field.type === 'number' ? 'any' : undefined} value={editor[field.key] ?? ''} onChange={e => setEditor(current => current ? { ...current, [field.key]: e.target.value } : current)} placeholder={field.placeholder} className="w-full border border-[#181513]/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B84A28]"/>}
            {field.help && <span className="block text-[10px] text-[#8C7355] mt-1">{field.help}</span>}
          </label>)}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[#181513]/10 px-5 py-4 flex justify-end gap-3">
          <button type="button" onClick={() => setEditor(null)} className="px-5 py-3 border border-[#181513]/20 text-xs uppercase tracking-wider">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-3 bg-[#B84A28] text-white text-xs uppercase tracking-wider inline-flex items-center gap-2 disabled:opacity-60"><Save size={14}/>{saving ? 'Saving…' : 'Save record'}</button>
        </div>
      </form>
    </div>}
  </div>;
};
