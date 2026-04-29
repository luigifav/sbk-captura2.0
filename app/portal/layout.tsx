'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Inbox,
  BarChart3,
  FileText,
  AlertCircle,
  Code2,
  Lock,
  Settings,
  ChevronLeft,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Inbox, label: 'Caixa de Entrada', href: '/portal/inbox', badge: 5 },
  { icon: BarChart3, label: 'Monitoramento', href: '/portal/monitoring' },
  { icon: FileText, label: 'Documentos', href: '/portal/documents' },
  { icon: AlertCircle, label: 'Alertas', href: '/portal/alerts' },
  { icon: Code2, label: 'API & Consumo', href: '/portal/api' },
  { icon: Lock, label: 'Credenciais PDPJ', href: '/portal/credentials' },
  { icon: Settings, label: 'Conta & Plano', href: '/portal/account' },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setCollapsed(!collapsed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collapsed]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } flex flex-col border-r bg-muted/40 transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && <span className="text-xl font-bold">SBK</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={20} className="shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 text-sm">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t p-4 space-y-4">
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'gap-3'
            } p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer`}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              MS
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Maria Silva</p>
                <p className="text-xs text-muted-foreground truncate">
                  Portal Pro
                </p>
              </div>
            )}
          </div>

          <button
            className={`w-full flex items-center ${
              collapsed ? 'justify-center' : 'gap-2'
            } px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-background h-16 flex items-center px-6 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home size={18} />
            <span>/</span>
            <span>Portal</span>
          </div>

          <button
            onClick={() => setShowSearch(true)}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-sm transition-colors max-w-xs"
          >
            <Search size={18} />
            <span>Buscar...</span>
            <kbd className="hidden sm:inline text-xs bg-background px-2 py-1 rounded border">
              Cmd K
            </kbd>
          </button>

          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            title="Notificações"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
            title="Menu do usuário"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              MS
            </div>
            <ChevronDown size={18} className="text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {showSearch && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="fixed inset-x-0 top-0 z-50 pt-8 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar documentos, alertas, monitoramentos..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
