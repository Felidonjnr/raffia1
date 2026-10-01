import React, { useState } from 'react';
import { X, CheckCircle2, Handshake } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const InquiryModal: React.FC = () => {
  const { isInquiryModalOpen, setIsInquiryModalOpen, inquiryType, setInquiryType } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isInquiryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setIsInquiryModalOpen(false);
    setSubmitted(false);
    setName('');
    setEmail('');
    setOrganization('');
    setMessage('');
  };

  const titleMap = {
    PARTNER: 'Institutional & Creative Partnership',
    SPONSOR: 'Corporate & Cultural Sponsorship',
    DONOR: 'Heritage Preservation & Community Donation',
    LEGACY: 'Join The Raffia Legacy Network',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181513]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF7F2] border border-[#181513]/15 shadow-2xl p-8 lg:p-10 text-[#181513]">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] mb-2">
              <Handshake className="w-4 h-4" />
              <span>Dance Ville Presents</span>
            </div>

            <h3 className="font-editorial text-3xl lg:text-4xl font-medium tracking-tight mb-2">
              {titleMap[inquiryType]}
            </h3>

            <p className="text-sm text-[#57524E] leading-relaxed mb-6 font-normal">
              Raffia is our thread. The future is what we weave with it. Connect with our curatorial and executive leadership team to shape the 2026–2027 Legacy Year.
            </p>

            {/* Type selector tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#ECE5DC] mb-6 text-[11px] font-mono uppercase text-center">
              {(['PARTNER', 'SPONSOR', 'DONOR', 'LEGACY'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInquiryType(t)}
                  className={`py-2 px-1 transition-colors cursor-pointer ${
                    inquiryType === t
                      ? 'bg-[#181513] text-[#FAF7F2] font-semibold'
                      : 'text-[#57524E] hover:text-[#181513]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-[#57524E] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#181513]/20 text-sm focus:border-[#B84A28] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-[#57524E] mb-1">
                    Organization / Studio
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company, Museum or Brand"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#181513]/20 text-sm focus:border-[#B84A28] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#57524E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#181513]/20 text-sm focus:border-[#B84A28] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#57524E] mb-1">
                  Proposal or Area of Alignment
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details regarding your institution, resources, or intended collaboration with the Raffia Legacy Project..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#181513]/20 text-sm focus:border-[#B84A28] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B84A28] text-white text-xs font-medium uppercase tracking-widest hover:bg-[#9E3E20] transition-colors cursor-pointer"
                >
                  Submit Collaboration Inquiry
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#B84A28]/10 text-[#B84A28] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-3xl font-medium mb-2">
              Inquiry Received
            </h4>
            <p className="text-sm text-[#57524E] max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you, {name}. The Dance Ville curatorial committee and executive board will review your inquiry ({inquiryType}) and respond within 3 business days.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#181513] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
