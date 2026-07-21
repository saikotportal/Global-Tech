export default function AboutPage() {
  const stats = [
    { value: '2M+',   label: 'Happy Customers' },
    { value: '50K+',  label: 'Products Listed' },
    { value: '120+',  label: 'Countries Served' },
    { value: '4.9★',  label: 'Average Rating' },
  ];

  const team = [
    { name: 'Sarah Chen',    role: 'CEO & Co-Founder',   emoji: '👩‍💼' },
    { name: 'Marcus Rivera', role: 'CTO & Co-Founder',   emoji: '👨‍💻' },
    { name: 'Priya Nair',    role: 'Head of Design',     emoji: '👩‍🎨' },
    { name: 'James Okoye',   role: 'VP of Operations',   emoji: '👨‍🔧' },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      <div className="text-white py-24 px-4 text-center" style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        <h1 className="text-5xl font-extrabold mb-4">About GlobalTech</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          We're on a mission to make premium technology accessible to everyone, everywhere.
        </p>
      </div>

      
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="text-4xl font-extrabold mb-1" style={{ color: '#e8517a' }}>{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
        <div className="prose prose-lg text-gray-600 space-y-4">
          <p>
            Founded in 2018 in San Francisco, GlobalTech started with a simple idea: buying the latest technology shouldn't feel complicated or overpriced. Our founders, Sarah and Marcus, were frustrated with fragmented shopping experiences and unreliable sellers.
          </p>
          <p>
            Today we carry thousands of products from the world's top brands — Apple, Samsung, Sony, Dell, and more — backed by our 30-day return guarantee, free shipping on orders over $99, and 24/7 customer support.
          </p>
          <p>
            We verify every product, every seller, and every review. No fake listings. No grey-market goods. Just the real deal, shipped fast.
          </p>
        </div>
      </div>

      
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-3">{emoji}</div>
                <div className="font-semibold text-gray-800 text-sm">{name}</div>
                <div className="text-xs text-gray-500 mt-1">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Built By</h2>

          <div className="relative rounded-3xl overflow-hidden p-px"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b,#e8517a)' }}>
            <div className="bg-white rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center gap-8">

              
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                  SA
                </div>
                
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full" />
              </div>

              
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                  style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  Lead Developer
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-1">Saikot Islam Abir</h3>
                <p className="text-gray-500 text-sm mb-4">Designed & developed the GlobalTech platform from the ground up — frontend architecture, UI/UX, admin systems, and everything in between.</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'UI/UX Design'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              
              <div className="hidden md:flex flex-col items-end flex-shrink-0 max-w-[200px]">
                <svg className="w-8 h-8 mb-2 opacity-20" fill="currentColor" style={{ color: '#e8517a' }} viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-sm italic text-gray-400 text-right leading-relaxed">
                  "Building tech that makes tech easier to buy."
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      

      
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: 'Trust & Transparency', desc: 'Every product is authentic. Every price is honest. Every review is verified.' },
              { icon: '🌍', title: 'Global Access',        desc: 'We ship to 120+ countries and support 12 currencies with zero hidden fees.' },
              { icon: '♻️', title: 'Sustainability',       desc: 'Carbon-neutral shipping since 2022. Packaging made from 100% recycled materials.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
