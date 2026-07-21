import Link from 'next/link';

export const metadata = { title: 'Privacy Policy' };

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="text-white py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-white/80 text-sm">Last updated: January 1, 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <p className="text-gray-600 leading-relaxed mb-10">
            GlobalTech Inc. ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>

          <Section title="1. Information We Collect">
            <p><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping address, and payment information when you create an account or place an order.</p>
            <p><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages, and referring URL collected automatically via cookies and analytics tools.</p>
            <p><strong>Device Information:</strong> Hardware model, operating system, unique device identifiers, and mobile network information.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and fulfil your orders and send related transactional emails</li>
              <li>Create and manage your account</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our website and product offerings</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Sharing Your Information">
            <p>We do not sell, trade, or rent your personal information. We may share it with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Service Providers:</strong> Payment processors, shipping carriers, and cloud infrastructure providers who assist in our operations.</li>
              <li><strong>Legal Requirements:</strong> When required by law, subpoena, or to protect our rights.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
            </ul>
          </Section>

          <Section title="4. Cookies">
            <p>We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings. See our <Link href="/cookie-policy" className="text-orange-500 hover:underline">Cookie Policy</Link> for details.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the right to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact us at <a href="mailto:privacy@globaltech.store" className="text-orange-500 hover:underline">privacy@globaltech.store</a>.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have done so, please contact us immediately.</p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </Section>

          <Section title="9. Contact Us">
            <p>Questions about this policy? Reach us at:</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-2 text-sm">
              <p className="font-semibold text-gray-800">GlobalTech Inc.</p>
              <p>123 Tech Boulevard, San Francisco, CA 94105</p>
              <p><a href="mailto:privacy@globaltech.store" className="text-orange-500 hover:underline">privacy@globaltech.store</a></p>
              <p>+1 800-456-2789</p>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex gap-4 text-sm text-gray-500 justify-center">
          <Link href="/terms-of-service" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/cookie-policy" className="hover:text-orange-500 transition-colors">Cookie Policy</Link>
          <span>·</span>
          <Link href="/" className="hover:text-orange-500 transition-colors">← Back to Store</Link>
        </div>
      </div>
    </div>
  );
}
