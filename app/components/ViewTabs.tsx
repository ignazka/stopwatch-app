import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { View, VIEW_LABELS, VIEWS } from '@/lib/types';

export function ViewTabs({
  currentView,
  currentTag,
}: {
  currentView?: View | undefined;
  currentTag?: string;
}) {
  return (
    <div className='ml-[-1.5px]'>
      {VIEWS.map((view) => (
        <Button
          variant={'secondary'}
          className={`${view === currentView ? 'bg-card' : 'bg-zinc-700'}`}
        >
          <a
            key={view}
            href={`?view=${view}${currentTag ? `&tag=${currentTag}` : ''}`}
          >
            {VIEW_LABELS[view]}
          </a>
        </Button>
      ))}
    </div>
  );
}
