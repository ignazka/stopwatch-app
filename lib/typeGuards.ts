import { View, VIEWS } from './types';

export function isView(value: string): value is View {
  return (VIEWS as readonly string[]).includes(value);
}
