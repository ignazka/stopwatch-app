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
    <Tabs defaultValue='day'>
      <TabsList>
        {VIEWS.map((view) => (
          <TabsTrigger
            value={view}
            className={`${currentView === view ? 'bg-accent-foreground text-accent-foreground' : ''}`}
          >
            <a
              key={view}
              href={`?view=${view}${currentTag ? `&tag=${currentTag}` : ''}`}
            >
              {VIEW_LABELS[view]}
            </a>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
