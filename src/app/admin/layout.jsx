'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/admin',            icon: '📊' },
      { label: 'Analytics',  href: '/admin/analytics',  icon: '📈' },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { label: 'Products',   href: '/admin/products',   icon: '📦' },
      { label: 'Coupons',    href: '/admin/coupons',    icon: '🎟️' },
    ],
  },
  {
    group: 'Commerce',
    items: [
      { label: 'Orders',     href: '/admin/orders',     icon: '🛒' },
      { label: 'Customers',  href: '/admin/customers',  icon: '👥' },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Settings',   href: '/admin/settings',   icon: '⚙️' },
    ],
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`
        flex flex-col bg-gray-900 text-white h-full
        ${mobile ? 'w-72' : collapsed ? 'w-16' : 'w-60'}
        transition-all duration-200
      `}
    >
      
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          <span className="text-sm font-bold">GT</span>
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="font-bold text-sm leading-tight">GlobalTech</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>}
            </svg>
          </button>
        )}
      </div>

      
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {NAV.map((group) => (
          <div key={group.group}>
            {(!collapsed || mobile) && (
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-1">
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive(item.href)
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                    `}
                    style={isActive(item.href)
                      ? { background: 'linear-gradient(135deg,#e8517a22,#f4874b22)', color: '#f4874b' }
                      : {}}
                    title={collapsed && !mobile ? item.label : undefined}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {(!collapsed || mobile) && <span>{item.label}</span>}
                    {isActive(item.href) && (!collapsed || mobile) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#f4874b' }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      
      <div className="border-t border-gray-800 p-3 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-all"
        >
          <span>🌐</span>
          {(!collapsed || mobile) && <span>View Store</span>}
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: 'var(--font-outfit,sans-serif)' }}>
      
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-14 flex items-center gap-4 flex-shrink-0">
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          
          <div className="text-sm text-gray-500 hidden sm:block">
            {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
              <span key={seg}>
                <span className={i === arr.length - 1 ? 'text-gray-900 font-medium capitalize' : 'capitalize'}>
                  {seg}
                </span>
                {i < arr.length - 1 && <span className="mx-1.5 text-gray-300">/</span>}
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              A
            </div>
          </div>
        </header>

        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
