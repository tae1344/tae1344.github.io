export function toAbsolutePath(path?: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path;
  return `/${path}`;
}

export function filePathToSlug(filePath: string) {
  const fileName = filePath.split('/').pop()?.replace(/\.mdx?$/, '') ?? '';
  return fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

export function toDate(value?: string | Date, fallback = new Date(0)) {
  if (!value) return fallback;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? fallback : date;
}

export function toDisplayDate(value?: string | Date, locale = 'ko-KR') {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return '';
  return date.toLocaleDateString(locale);
}
