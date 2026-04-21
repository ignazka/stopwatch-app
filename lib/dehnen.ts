import path from 'path';
import { DehnenProgressFile } from './types';
import fs from 'fs';

const DATA_PATH_DEHNEN = path.resolve(
  process.cwd(),
  'data/dehnen-progress.json',
);
export function getDehnenProgress(): DehnenProgressFile {
  const raw = fs.readFileSync(DATA_PATH_DEHNEN, 'utf-8');
  return JSON.parse(raw) as DehnenProgressFile;
}

export function saveDehnenProgress(data: DehnenProgressFile): void {
  fs.mkdirSync(path.dirname(DATA_PATH_DEHNEN), { recursive: true });

  if (!fs.existsSync(DATA_PATH_DEHNEN)) {
    const defaultData: DehnenProgressFile = { entries: [] };
    fs.writeFileSync(
      DATA_PATH_DEHNEN,
      JSON.stringify(defaultData, null, 2),
      'utf-8',
    );
  }

  fs.writeFileSync(DATA_PATH_DEHNEN, JSON.stringify(data, null, 2), 'utf-8');
}
