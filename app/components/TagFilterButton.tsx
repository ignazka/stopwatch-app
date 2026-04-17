export function TagFilterButton({ tag }: { tag: string }) {
  if (tag === 'alle') {
    return <a className='font-mono' href={'/'}>{`[${tag}]`}</a>;
  } else return <a className='font-mono' href={`/?tag=${tag}`}>{`[${tag}]`}</a>;
}
