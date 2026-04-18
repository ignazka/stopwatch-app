import { View, VIEW_LABELS, VIEWS } from '@/lib/types';

export function ViewTabs({
  currentView,
  currentTag,
}: {
  currentView?: View | undefined;
  currentTag?: string;
}) {
  return (
    <div className='flex gap-1 pb-3 mb-5 dark:bg-zinc-950'>
      {VIEWS.map((view) => (
        <a
          key={view}
          href={`?view=${view}${currentTag ? `&tag=${currentTag}` : ''}`}
          className={`
           px-4 py-1.5 mr-1 transition-all 
            ${currentView === view ? 'dark:bg-zinc-950 dark:text-violet-300' : ' dark:bg-violet-300 text-zinc-950 dark:hover:bg-violet-400'}
          `}
        >
          {VIEW_LABELS[view]}
        </a>
      ))}
    </div>
  );
}
