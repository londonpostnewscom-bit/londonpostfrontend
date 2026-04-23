// import { useAdminAuth } from '../context/AdminAuthContext';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// export function useAdminApi() {
//   const { admin } = useAdminAuth();
//   const headers = () => ({ Authorization: `Bearer ${admin?.token}` });

//   const get = async (path: string) => {
//     const res = await fetch(`${API_URL}${path}`, { headers: headers() });
//     if (!res.ok) throw new Error('Request failed');
//     return res.json();
//   };

//   const put = async (path: string, body: FormData) => {
//     const res = await fetch(`${API_URL}${path}`, { method: 'PUT', headers: headers(), body });
//     if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Update failed'); }
//     return res.json();
//   };

//   const post = async (path: string, body: FormData) => {
//     const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers: headers(), body });
//     if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Create failed'); }
//     return res.json();
//   };

//   const del = async (path: string) => {
//     const res = await fetch(`${API_URL}${path}`, { method: 'DELETE', headers: headers() });
//     if (!res.ok) throw new Error('Delete failed');
//     return res.json();
//   };

//   return { get, put, post, del };
// }



import { useAdminAuth } from '../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type RequestBody = FormData | Record<string, any> | null | undefined;

export function useAdminApi() {
  const { admin } = useAdminAuth();

  const authHeaders = (): HeadersInit => ({
    Authorization: `Bearer ${admin?.token || ''}`,
  });

  const makeRequest = async (
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: RequestBody
  ) => {
    const isFormData = body instanceof FormData;

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: isFormData
        ? authHeaders()
        : {
            ...authHeaders(),
            'Content-Type': 'application/json',
          },
      body:
        method === 'GET' || method === 'DELETE'
          ? undefined
          : isFormData
          ? body
          : JSON.stringify(body || {}),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `${method} request failed`);
    }

    return data;
  };

  const get = async (path: string) => {
    return makeRequest(path, 'GET');
  };

  const post = async (path: string, body: RequestBody) => {
    return makeRequest(path, 'POST', body);
  };

  const put = async (path: string, body: RequestBody) => {
    return makeRequest(path, 'PUT', body);
  };

  const del = async (path: string) => {
    return makeRequest(path, 'DELETE');
  };

  return { get, post, put, del };
}