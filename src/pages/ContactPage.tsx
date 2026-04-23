import { useState } from 'react';
import { LocationIcon } from '../components/Icons';
import { SectionHeading } from '../components/SectionHeading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const contactItems = [
  { Icon: LocationIcon, label: 'Office', value: 'London, United Kingdom' },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact-page',
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit form.');
      }

      setSuccessMessage('Our team will get in touch with you soon.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch with the editorial and partnerships team"
        description="Reach out for editorial inquiries, partnerships, strategic communications and general requests."
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="grid gap-5">
          {contactItems.map(({ Icon, label, value }) => (
            <div key={label} className="rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-slate-500">{label}</div>
                  <div className="mt-1 text-xl font-semibold text-ink">{value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 p-8 shadow-soft">
          <div className="grid gap-5 md:grid-cols-2">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
              required
            />
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company / Organization"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            />
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            rows={7}
            className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            required
          />

          {successMessage && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}