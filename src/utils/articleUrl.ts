export function articleUrl(a: { id?: string; _id?: string; slug?: string }) {
  const id = a.id || a._id || '';
  return a.slug ? `/article/${a.slug}` : `/article/${id}`;
}

export const isMongoId = (s?: string) => !!s && /^[a-f0-9]{24}$/i.test(s);
