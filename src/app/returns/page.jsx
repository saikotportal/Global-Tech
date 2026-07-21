export default function ReturnsPage() {
  const steps = [
    { step: 1, icon: '📋', title: 'Initiate Return',     time: 'Day 0',    desc: 'Log into your account, go to Order History, and click "Return Item." Select your reason and preferred resolution (refund, exchange, or store credit).' },
    { step: 2, icon: '📬', title: 'Receive Label',       time: 'Day 1',    desc: 'A prepaid return shipping label will be emailed to you within 24 hours. Print it and affix it to your securely packed item.' },
    { step: 3, icon: '🚚', title: 'Ship the Item',       time: 'Days 1–3', desc: 'Drop off your package at any authorized carrier location. You\'ll receive a tracking number to monitor your return shipment.' },
    { step: 4, icon: '🔍', title: 'Item Inspected',      time: 'Days 4–6', desc: 'Once received, our team inspects the item within 1–2 business days. You\'ll receive an email confirming the inspection result.' },
    { step: 5, icon: '💰', title: 'Refund Processed',    time: 'Days 7–10',desc: 'Approved refunds are credited to your original payment method within 3–5 business days. Exchanges ship immediately upon inspection.' },
  ];

  const policies = [
    { icon: '📅', title: '30-Day Window',         desc: 'Returns must be initiated within 30 days of the delivery date.' },
    { icon: '📦', title: 'Original Condition',    desc: 'Items must be unused, undamaged, and in original packaging with all accessories.' },
    { icon: '🚫', title: 'Non-Returnable Items',  desc: 'Digital downloads, opened software, and perishable items cannot be returned.' },
    { icon: '🎁', title: 'Gift Returns',           desc: 'Gift recipients can return for store credit without the original purchaser being notified.' },
    { icon: '🔧', title: 'Damaged on Arrival',    desc: 'Report damage within 48 hours. We\'ll replace or refund with no return required in most cases.' },
    { icon: '💳', title: 'Refund Timeline',        desc: 'Refunds appear on your statement within 3–10 business days depending on your bank.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Returns & Refunds</h1>
          <p className="text-gray-500 text-lg">Hassle-free returns within 30 days. No questions asked.</p>
        </div>

        
        <div className="bg-blue-600 text-white rounded-2xl p-8 text-center mb-14">
          <h2 className="text-2xl font-bold mb-2">Ready to start a return?</h2>
          <p className="text-blue-100 mb-5">Go to your account and select the item you'd like to return.</p>
          <a href="/account" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block">
            Go to My Orders →
          </a>
        </div>

        
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Return Process Timeline</h2>
        <div className="relative mb-14">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block" />
          <div className="space-y-6">
            {steps.map(({ step, icon, title, time, desc }) => (
              <div key={step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                  {step}
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-semibold text-gray-800">{title}</span>
                    <span className="ml-auto text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{time}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Return Policy Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {policies.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-gray-800 mb-2">Need help with a return?</h3>
          <p className="text-gray-500 text-sm mb-5">Our support team is available 24/7 to assist you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">Contact Support</a>
            <a href="/faq" className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">View FAQ</a>
          </div>
        </div>
      </div>
    </div>
  );
}
