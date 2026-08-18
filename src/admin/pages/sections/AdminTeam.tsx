import { useState, useEffect } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

type AuthorDoc = {
  _id: string;
  name: string;
  photoUrl: string;
  isTeamMember: boolean;
};

export function AdminTeam() {
  const { get, post, del } = useAdminApi();
  const [authors, setAuthors] = useState<AuthorDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const load = () => {
    setLoading(true);
    get('/authors').then((data) => setAuthors(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const teamMembers = authors.filter((a) => a.isTeamMember);
  const contributors = authors.filter((a) => !a.isTeamMember);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      if (file) fd.append('photo', file);
      await post('/authors/team', fd);
      setName('');
      setFile(null);
      setPreview('');
      load();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this person? If they were an official team member, future Opinion pieces under their name will fall back to any photo a contributor upload provides instead.')) return;
    try {
      await del(`/authors/${id}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-16 text-center text-gray-400">Loading…</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Team</h2>
        <p className="text-sm text-gray-500">
          Anyone added here shows their official photo automatically on every Opinion piece under
          their name — this takes priority over any photo a writer might have uploaded themselves
          when their name wasn't yet recognized.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Add / Update Team Member</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full Name (must match how it's typed as an Opinion author)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" placeholder="e.g. Dr. Beruniy Alimov" />
          </div>
          <div>
            <label className="label">Photo</label>
            <div className="flex items-center gap-3">
              {preview && <img src={preview} alt="" className="h-14 w-14 rounded-full object-cover border border-gray-200" />}
              <input
                type="file" accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }}
                className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleAdd} disabled={saving || !name.trim()} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Team Member'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">Official Team ({teamMembers.length})</h3>
        <div className="space-y-2">
          {teamMembers.map((a) => (
            <div key={a._id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
              {a.photoUrl ? (
                <img src={a.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400">
                  {a.name.charAt(0)}
                </div>
              )}
              <span className="flex-1 text-sm font-semibold text-gray-800">{a.name}</span>
              <button onClick={() => handleRemove(a._id)} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Remove</button>
            </div>
          ))}
          {teamMembers.length === 0 && <p className="text-sm text-gray-400">No official team members added yet.</p>}
        </div>
      </div>

      {contributors.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">
            Contributors (self-uploaded, not official team — {contributors.length})
          </h3>
          <div className="space-y-2">
            {contributors.map((a) => (
              <div key={a._id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                {a.photoUrl ? (
                  <img src={a.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-400">
                    {a.name.charAt(0)}
                  </div>
                )}
                <span className="flex-1 text-sm text-gray-600">{a.name}</span>
                <span className="text-xs text-gray-400">Uploaded via Opinion article</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
