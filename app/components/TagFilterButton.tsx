import { Button } from '@/components/ui/button';

export function TagFilterButton({
  tag,
  currentTag,
}: {
  tag: string;
  currentTag?: string;
}) {
  return (
    <Button
      variant='link'
      className={`text-green-300 ${tag === currentTag ? 'underline' : !currentTag && tag === 'alle' ? 'underline' : ''}`}
    >
      {tag === 'alle' ? (
        <a href={'/'}>{tag}</a>
      ) : (
        <a href={`/?tag=${tag}`}>{tag}</a>
      )}
    </Button>
  );
}
