import { promises as fs } from 'fs';
import path from 'path';

export const uploadsDir = path.join(__dirname, 'uploads');

export const ensureUploadDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
};
