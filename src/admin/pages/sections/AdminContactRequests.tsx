import { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

export function AdminContactRequests() {
  const { get, put, del } = useAdminApi();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await get('/contact-requests/admin/all');
      setItems(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await put(`/contact-requests/admin/${id}`, { status });
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this request?')) return;
    try {
      await del(`/contact-requests/admin/${id}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Contact & Query Requests</h2>
        <p className="text-sm text-gray-500">
          All requests submitted from contact page and header request form.
        </p>
      </div>

      {loading && (
        <div className="py-16 text-center text-gray-400">Loading requests...</div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="text-base font-semibold text-gray-500">No requests yet</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {item.source === 'header-request-query' ? 'Header Query' : 'Contact Page'}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'new'
                      ? 'bg-red-100 text-red-700'
                      : item.status === 'in-progress'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">{item.fullName || '—'}</div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">{item.email}</div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">{item.phone || '—'}</div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Company</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">{item.company || '—'}</div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{item.subject}</div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</div>
                  <div className="mt-1 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                    {item.message}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Submitted</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(item._id, 'new')}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Mark New
                </button>

                <button
                  onClick={() => updateStatus(item._id, 'in-progress')}
                  className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                >
                  In Progress
                </button>

                <button
                  onClick={() => updateStatus(item._id, 'closed')}
                  className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  Closed
                </button>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}