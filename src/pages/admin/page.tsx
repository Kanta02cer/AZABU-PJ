import { useState, useEffect, useCallback } from 'react';
import { supabase, type NewsRow, type ColumnRow, type InterviewRow } from '../../lib/supabase';

type Tab = 'news' | 'columns' | 'interviews';

/* ───── Editor Modal ───── */
function EditorModal({
  title,
  fields,
  values,
  onChange,
  onSave,
  onClose,
  saving,
}: {
  title: string;
  fields: { key: string; label: string; type: 'text' | 'textarea' | 'html' | 'date' | 'number' | 'checkbox' }[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#1A1A2E]">{title}</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <i className="ri-close-line text-xl text-[#64748B]"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === 'checkbox' ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values[field.key] as boolean}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]/20"
                  />
                  <span className="text-sm font-medium text-[#1A1A2E]">{field.label}</span>
                </label>
              ) : (
                <>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">{field.label}</label>
                  {field.type === 'textarea' || field.type === 'html' ? (
                    <textarea
                      value={(values[field.key] as string) || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      rows={field.type === 'html' ? 12 : 4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-all text-sm text-[#1A1A2E] font-mono resize-y"
                      placeholder={field.type === 'html' ? 'HTML形式で入力...' : ''}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={(values[field.key] as string | number) || ''}
                      onChange={(e) => onChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-all text-sm text-[#1A1A2E]"
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer">
            キャンセル
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <><i className="ri-loader-4-line animate-spin mr-2"></i>保存中...</> : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───── Data Table ───── */
function DataTable({
  columns,
  rows,
  onEdit,
  onDelete,
}: {
  columns: { key: string; label: string; width?: string }[];
  rows: Record<string, unknown>[];
  onEdit: (row: Record<string, unknown>) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-left font-semibold text-[#1A1A2E] ${col.width || ''}`}>
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-semibold text-[#1A1A2E] w-28">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-[#64748B]">
                <i className="ri-inbox-line text-4xl block mb-2 opacity-30"></i>
                データがありません
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id as number} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[#334155]">
                    {col.key === 'published' ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${row[col.key] ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        <i className={row[col.key] ? 'ri-checkbox-circle-fill' : 'ri-eye-off-line'}></i>
                        {row[col.key] ? '公開' : '非公開'}
                      </span>
                    ) : col.key === 'thumbnail' || col.key === 'photo' ? (
                      (row[col.key] as string) ? (
                        <img src={row[col.key] as string} alt="" className="w-16 h-10 rounded object-cover" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )
                    ) : (
                      <span className="line-clamp-1">{String(row[col.key] ?? '—')}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(row)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FF6B00]/10 text-[#64748B] hover:text-[#FF6B00] transition-colors cursor-pointer">
                      <i className="ri-edit-line"></i>
                    </button>
                    <button onClick={() => onDelete(row.id as number)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-colors cursor-pointer">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ───── ADMIN PAGE ───── */
export default function AdminPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('news');

  /* Data */
  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [columnsList, setColumnsList] = useState<ColumnRow[]>([]);
  const [interviewsList, setInterviewsList] = useState<InterviewRow[]>([]);

  /* Editor */
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorValues, setEditorValues] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  /* Auth check */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/admin/login';
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, []);

  /* Fetch data */
  const fetchData = useCallback(async () => {
    const [newsRes, colRes, intRes] = await Promise.all([
      supabase.from('news').select('*').order('date', { ascending: false }),
      supabase.from('columns').select('*').order('date', { ascending: false }),
      supabase.from('interviews').select('*').order('sort_order', { ascending: true }),
    ]);
    if (newsRes.data) setNewsList(newsRes.data);
    if (colRes.data) setColumnsList(colRes.data);
    if (intRes.data) setInterviewsList(intRes.data);
  }, []);

  useEffect(() => {
    if (!loading) fetchData();
  }, [loading, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  /* CRUD */
  const getFields = (tab: Tab) => {
    if (tab === 'interviews') {
      return [
        { key: 'name', label: '名前', type: 'text' as const },
        { key: 'position', label: '役職', type: 'text' as const },
        { key: 'title', label: 'タイトル', type: 'text' as const },
        { key: 'quote', label: 'コメント', type: 'textarea' as const },
        { key: 'photo', label: '写真URL', type: 'text' as const },
        { key: 'sort_order', label: '表示順', type: 'number' as const },
        { key: 'published', label: '公開', type: 'checkbox' as const },
      ];
    }
    return [
      { key: 'title', label: 'タイトル', type: 'text' as const },
      { key: 'date', label: '日付', type: 'date' as const },
      { key: 'category', label: 'カテゴリ', type: 'text' as const },
      { key: 'thumbnail', label: 'サムネイルURL', type: 'text' as const },
      { key: 'excerpt', label: '概要', type: 'textarea' as const },
      { key: 'content', label: '本文 (HTML)', type: 'html' as const },
      { key: 'published', label: '公開', type: 'checkbox' as const },
    ];
  };

  const getTableColumns = (tab: Tab) => {
    if (tab === 'interviews') {
      return [
        { key: 'photo', label: '写真', width: 'w-20' },
        { key: 'name', label: '名前' },
        { key: 'position', label: '役職' },
        { key: 'title', label: 'タイトル' },
        { key: 'sort_order', label: '順序', width: 'w-16' },
        { key: 'published', label: '状態', width: 'w-24' },
      ];
    }
    return [
      { key: 'thumbnail', label: '', width: 'w-20' },
      { key: 'title', label: 'タイトル' },
      { key: 'category', label: 'カテゴリ', width: 'w-24' },
      { key: 'date', label: '日付', width: 'w-28' },
      { key: 'published', label: '状態', width: 'w-24' },
    ];
  };

  const getDataForTab = (tab: Tab) => {
    if (tab === 'news') return newsList as unknown as Record<string, unknown>[];
    if (tab === 'columns') return columnsList as unknown as Record<string, unknown>[];
    return interviewsList as unknown as Record<string, unknown>[];
  };

  const openCreate = () => {
    setEditingId(null);
    const defaults: Record<string, unknown> = { published: true };
    if (activeTab === 'interviews') {
      defaults.sort_order = (interviewsList.length + 1) * 10;
    } else {
      defaults.date = new Date().toISOString().split('T')[0];
    }
    setEditorValues(defaults);
    setEditorOpen(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditingId(row.id as number);
    setEditorValues({ ...row });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const table = activeTab;
    const payload = { ...editorValues };
    delete payload.id;
    delete payload.created_at;

    if (editingId) {
      await supabase.from(table).update(payload).eq('id', editingId);
    } else {
      await supabase.from(table).insert(payload);
    }

    setSaving(false);
    setEditorOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return;
    await supabase.from(activeTab).delete().eq('id', id);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-[#FF6B00]"></i>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'news', label: 'ニュース', icon: 'ri-newspaper-line' },
    { key: 'columns', label: 'コラム', icon: 'ri-article-line' },
    { key: 'interviews', label: 'インタビュー', icon: 'ri-user-voice-line' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] rounded-xl flex items-center justify-center">
              <i className="ri-dashboard-line text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1A1A2E]">AZABU+ CMS</h1>
              <p className="text-xs text-[#64748B]">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="px-4 py-2 rounded-lg text-sm text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer">
              <i className="ri-external-link-line mr-1"></i>サイトを見る
            </a>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <i className="ri-logout-circle-r-line mr-1"></i>ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20'
                  : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <i className="ri-add-line"></i>
            新規作成
          </button>
        </div>

        {/* Table */}
        <DataTable
          columns={getTableColumns(activeTab)}
          rows={getDataForTab(activeTab)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Editor Modal */}
      {editorOpen && (
        <EditorModal
          title={editingId ? '編集' : '新規作成'}
          fields={getFields(activeTab)}
          values={editorValues}
          onChange={(key, value) => setEditorValues((prev) => ({ ...prev, [key]: value }))}
          onSave={handleSave}
          onClose={() => setEditorOpen(false)}
          saving={saving}
        />
      )}
    </div>
  );
}
