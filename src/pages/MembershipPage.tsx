// import { useState } from 'react';
// import { SectionHeading } from '../components/SectionHeading';
// import { membershipPlans } from '../data/siteData';

// export function MembershipPage() {
//   const [open, setOpen] = useState<string | null>(membershipPlans[1].name);

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
//       <SectionHeading eyebrow="Membership" title="Support independent reporting with premium plans" description="Each plan can expand inline to reveal pricing, benefits and future checkout details." />
//       <div className="grid gap-6 lg:grid-cols-3">
//         {membershipPlans.map((plan) => {
//           const active = open === plan.name;
//           return (
//             <div key={plan.name} className={`rounded-[2rem] border p-8 shadow-sm transition ${active ? 'border-primary bg-primary text-white shadow-soft' : 'border-slate-200 bg-white'}`}>
//               <div className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Plan</div>
//               <h3 className="mt-3 text-3xl font-bold">{plan.name}</h3>
//               <div className="mt-4 text-4xl font-black">{plan.price}</div>
//               <p className={`mt-4 ${active ? 'text-white/75' : 'text-slate-600'}`}>{plan.summary}</p>
//               <button onClick={() => setOpen(active ? null : plan.name)} className={`mt-6 rounded-full px-5 py-3 font-semibold ${active ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
//                 {active ? 'Hide Details' : 'Check Details'}
//               </button>
//               {active && (
//                 <div className="mt-6 space-y-4 rounded-[1.5rem] bg-white/10 p-5 text-sm">
//                   <p>{plan.details}</p>
//                   <ul className="space-y-2 text-white/85">
//                     {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type Plan = {
  identifier: string;
  name: string;
  price: string;
  summary: string;
  features: string[];
  details: string;
  isPopular: boolean;
};

const EMPTY_FORM = { customerName: '', email: '', phone: '', isStudent: false };

export function MembershipPage() {
  const [plans,    setPlans]    = useState<Plan[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    fetch(`${API_URL}/membership/plans`)
      .then((r) => r.ok ? r.json() : [])
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const openModal = (plan: Plan) => {
    setSelected(plan);
    setForm(EMPTY_FORM);
    setSuccess(false);
    setError('');
  };

  const closeModal = () => {
    setSelected(null);
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/membership/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName:       selected.name,
          planIdentifier: selected.identifier,
          customerName:   form.customerName,
          email:          form.email,
          phone:          form.phone,
          isStudent:      form.isStudent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="text-center mb-12">
        <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Membership
        </span>
        <h1 className="mt-4 text-4xl font-black text-ink">Support independent reporting</h1>
        <p className="mt-4 max-w-xl mx-auto text-slate-600">
          Choose a plan that fits your needs. Each plan gives you access to premium editorial content, research archives and exclusive events.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isOpen = expanded === plan.identifier;
          return (
            <div
              key={plan.identifier}
              className={`relative flex flex-col rounded-[2rem] border p-8 shadow-sm transition ${
                plan.isPopular
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Plan</div>
              <h3 className="mt-3 text-3xl font-bold">{plan.name}</h3>
              <div className="mt-4 text-4xl font-black">{plan.price}</div>
              <p className={`mt-4 flex-1 ${plan.isPopular ? 'text-white/75' : 'text-slate-600'}`}>{plan.summary}</p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setExpanded(isOpen ? null : plan.identifier)}
                  className={`w-full rounded-full px-5 py-3 font-semibold transition ${
                    plan.isPopular ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {isOpen ? 'Hide Details' : 'Check Details'}
                </button>
                <button
                  onClick={() => openModal(plan)}
                  className={`w-full rounded-full border px-5 py-3 font-semibold transition ${
                    plan.isPopular
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  Get Started →
                </button>
              </div>

              {isOpen && (
                <div className={`mt-6 space-y-4 rounded-[1.5rem] p-5 text-sm ${plan.isPopular ? 'bg-white/10' : 'bg-slate-50'}`}>
                  <p className={plan.isPopular ? 'text-white/85' : 'text-slate-700'}>{plan.details}</p>
                  <ul className={`space-y-2 ${plan.isPopular ? 'text-white/80' : 'text-slate-600'}`}>
                    {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-6 py-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Selected Plan</p>
                  <h3 className="mt-1 text-2xl font-black">{selected.name}</h3>
                  <p className="text-xl font-bold text-white/80">{selected.price}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="mt-1 rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              {success ? (
                <div className="text-center py-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
                  <h4 className="text-xl font-bold text-slate-900">Thank you for choosing {selected.name}!</h4>
                  <p className="mt-3 text-slate-600">Our team will get in touch with you soon using the details you provided.</p>
                  <button onClick={closeModal} className="mt-6 w-full rounded-full bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name *</label>
                    <input
                      required
                      value={form.customerName}
                      onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address *</label>
                    <input
                      required type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Phone / WhatsApp <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+44 7700 000000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.isStudent}
                        onChange={(e) => setForm((f) => ({ ...f, isStudent: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary"
                      />
                      <span className="text-sm text-slate-700">I am a student</span>
                    </label>
                    {form.isStudent && (
                      <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        ⚠ Student discount may apply. Proof of student status (valid ID or enrollment letter) will be required before activation.
                      </div>
                    )}
                  </div>

                  <button
                    type="submit" disabled={submitting}
                    className="w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}