'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const businessHours = [
  { day: 'Monday - Saturday', hours: '10:00 AM - 8:00 PM' },
  { day: 'Sunday', hours: '10:00 AM - 6:00 PM' },
];

const faqItems = [
  {
    title: 'How do I place an order?',
    description:
      'Add your favorite products to the bag and choose "Order via WhatsApp" at checkout. Our team will confirm your order instantly.',
  },
  {
    title: 'Do you deliver pan-India?',
    description:
      'Yes, we ship to all major Indian cities. Orders above ₹999 qualify for complimentary delivery.',
  },
  {
    title: 'Are the products authentic?',
    description:
      'We partner directly with authorized distributors to guarantee genuine, fresh inventory every time.',
  },
  {
    title: 'What payment options do you support?',
    description:
      'We accept UPI, online payments, and Cash on Delivery. Secure payment links are shared after order confirmation.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Create WhatsApp message
    const whatsappMessage = `
*New Contact Form Submission*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}

*Message:*
${formData.message}
    `.trim();

    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });

    toast.success('Opening WhatsApp to send your message!');
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-24">
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">Contact</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
              Let's Create Beauty Moments Together
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70">
              Reach out to our concierge team for personalized recommendations, order support, or brand collaborations.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur p-10 shadow-xl">
              <h2 className="text-3xl font-semibold text-slate-900 mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-none bg-secondary-500/10 p-5">
                  <div className="text-3xl text-secondary-500">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">WhatsApp Concierge</h3>
                    <p className="text-slate-600 mb-2">
                      Order instantly or get curated product edits from our experts.
                    </p>
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-600 hover:text-secondary-700 font-semibold"
                    >
                      +91 99999 99999
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-none bg-primary-500/10 p-5">
                  <div className="text-3xl text-primary-500">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">Beauty Assist Line</h3>
                    <p className="text-slate-600 mb-2">Call us for quick guidance on shades, routines, or existing orders.</p>
                    <a
                      href="tel:+919999999999"
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      +91 99999 99999
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-none bg-slate-900/5 p-5">
                  <div className="text-3xl text-slate-900">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">Email Support</h3>
                    <p className="text-slate-600 mb-2">Expect a response within 24 hours on business days.</p>
                    <a
                      href="mailto:info@poonamcosmetics.com"
                      className="text-slate-900 underline-offset-4 hover:underline"
                    >
                      info@poonamcosmetics.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-none bg-slate-900/5 p-5">
                  <div className="text-3xl text-slate-900">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">Boutique Address</h3>
                    <p className="text-slate-600">
                      Poonam Cosmetics Studio
                      <br />Mumbai, Maharashtra 400001
                      <br />India
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-none bg-slate-900/5 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Business Hours</h3>
                <ul className="mt-4 space-y-3">
                  {businessHours.map((slot) => (
                    <li key={slot.day} className="flex items-center justify-between text-sm md:text-base text-slate-600">
                      <span>{slot.day}</span>
                      <span className="font-semibold text-slate-900">{slot.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-sm bg-white shadow-xl p-10">
              <h2 className="text-3xl font-semibold text-slate-900">Send us a message</h2>
              <p className="mt-4 text-slate-600">
                For the quickest response, reach out on WhatsApp. Prefer email? Share your details below and we will reply shortly.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="mt-2 w-full rounded-sm border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="mt-2 w-full rounded-sm border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="mt-2 w-full rounded-sm border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="How can we help you?"
                    required
                    className="mt-2 w-full rounded-sm border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <div className="mt-8 rounded-none border border-slate-100 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-600">Prefer a quick chat?</p>
                <a
                  href="https://wa.me/919999999999?text=Hi%20Poonam%20Cosmetics%2C%20I%20have%20a%20question"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-secondary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary-700"
                >
                  <FaWhatsapp />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-24 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-500/80">Faq</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900">Answers to your top questions</h2>
            <p className="mt-4 text-slate-600">
              We curated quick answers for our community's most-loved topics. Still curious? Drop us a note.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {faqItems.map((faq) => (
              <div key={faq.title} className="rounded-sm border border-slate-100 bg-white/90 p-8 shadow-sm backdrop-blur">
                <h3 className="text-lg font-semibold text-slate-900">{faq.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{faq.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

