'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MoodEntry } from '@/lib/types';

export function MoodChart({ entries }: { entries: MoodEntry[] }) {
  if (entries.length < 2) {
    return null;
  }

  const data = [...entries]
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map((e) => ({
      date: `${e.date.slice(5)} ${e.time.slice(0, 5)}`,
      mood: e.mood,
    }));

  return (
    <div className='w-full max-w-md'>
      <ResponsiveContainer width='100%' height={180}>
        <LineChart data={data}>
          <XAxis
            dataKey='date'
            tick={{ fontSize: 11, fill: '#71717a' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[-10, 10]}
            ticks={[-10, 0, 10]}
            tick={{ fontSize: 11, fill: '#71717a' }}
            axisLine={false}
            tickLine={false}
            width={20}
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: 'none', fontSize: 12 }}
            labelStyle={{ color: '#a1a1aa' }}
            itemStyle={{ color: '#4ade80' }}
          />
          <Line
            type='monotone'
            dataKey='mood'
            stroke='#4ade80'
            strokeWidth={2}
            dot={{ fill: '#4ade80', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
