import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { NewsRow, ColumnRow, InterviewRow } from '../lib/supabase';
import { newsData as mockNews } from '../mocks/news';
import { columnsData as mockColumns } from '../mocks/columns';

/**
 * Supabase が設定されていればDBから取得、なければモックデータを返す。
 * これにより .env 未設定でも開発・プレビューが可能。
 */

/* ---------- News ---------- */
export function useNews(limit?: number) {
  const [data, setData] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      let query = supabase.from('news').select('*').eq('published', true).order('date', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data: rows } = await query;
      if (rows) setData(rows);
    } else {
      // モックデータ
      const mock = (limit ? mockNews.slice(0, limit) : mockNews) as unknown as NewsRow[];
      setData(mock);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useNewsDetail(id: string | number) {
  const [data, setData] = useState<NewsRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (isSupabaseConfigured()) {
        const { data: row } = await supabase.from('news').select('*').eq('id', id).single();
        if (row) setData(row);
      } else {
        const found = mockNews.find((n) => String(n.id) === String(id));
        if (found) setData(found as unknown as NewsRow);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return { data, loading };
}

/* ---------- Columns ---------- */
export function useColumns(limit?: number) {
  const [data, setData] = useState<ColumnRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      let query = supabase.from('columns').select('*').eq('published', true).order('date', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data: rows } = await query;
      if (rows) setData(rows);
    } else {
      const mock = (limit ? mockColumns.slice(0, limit) : mockColumns) as unknown as ColumnRow[];
      setData(mock);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useColumnDetail(id: string | number) {
  const [data, setData] = useState<ColumnRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (isSupabaseConfigured()) {
        const { data: row } = await supabase.from('columns').select('*').eq('id', id).single();
        if (row) setData(row);
      } else {
        const found = mockColumns.find((c) => String(c.id) === String(id));
        if (found) setData(found as unknown as ColumnRow);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return { data, loading };
}

/* ---------- Interviews (for home page carousel) ---------- */
export function useInterviews() {
  const [data, setData] = useState<InterviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const { data: rows } = await supabase
        .from('interviews')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      if (rows) setData(rows);
    } else {
      // ホームページ用の簡易データ（モックから変換）
      setData([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

/* ---------- Skeleton Component ---------- */
export const SkeletonBlock = ({ className = '' }: { className?: string }) => {
  return React.createElement('div', { className: 'animate-pulse bg-slate-200 rounded-xl ' + className });
};

export const SkeletonCard = () => {
  return React.createElement('div', { className: 'bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm' },
    React.createElement(SkeletonBlock, { className: 'h-48 rounded-none' }),
    React.createElement('div', { className: 'p-5 space-y-3' },
      React.createElement(SkeletonBlock, { className: 'h-4 w-20' }),
      React.createElement(SkeletonBlock, { className: 'h-5 w-3/4' }),
      React.createElement(SkeletonBlock, { className: 'h-4 w-full' }),
      React.createElement(SkeletonBlock, { className: 'h-4 w-2/3' })
    )
  );
};

export const SkeletonList = ({ count = 4 }: { count?: number }) => {
  return React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8' },
    Array.from({ length: count }).map((_, i) => React.createElement(SkeletonCard, { key: i }))
  );
};
