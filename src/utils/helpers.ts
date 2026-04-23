export const slugify = (value: string) =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);
