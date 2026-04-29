'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  BarChart3,
  Users,
  Zap,
  Clock,
  FileText,
  Settings,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mockClientesOps } from '@/lib/mocks/clientes-ops';

const navItems = [
  { icon: BarChart3, label: 'Dashboard Operacional', href: '/ops/dashboard' },
  { icon: AlertTriangle, label: 'Dashboard Executivo', href: '/ops/executive' },
  { icon: Users, label: 'Clientes', href: '/ops/clients' },
  { icon: Zap, label: 'Captura (CNJ)', href: '/ops/capture' },
  { icon: Clock, label: 'Retry & Timeout', href: '/ops/retry' },
  { icon: FileText, label: 'Registro de Captura', href: '/ops/records' },
  { icon: AlertCircle, label: 'Auditoria', href: '/ops/audit' },
  { icon: Settings, label: 'Configurações', href: '/ops/settings' },
];

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClient, setSelectedClient] = useState(mockClientesOps[0]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500/20 text-green-700';
      case 'inativo':
        return 'bg-gray-500/20 text-gray-700';
      case 'suspenso':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">SBK</span>
              <span className="text-xs font-semibold text-orange-400 tracking-wider">
                OPS
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform text-slate-400 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-400 font-medium border-l-2 border-orange-400'
                        : 'text-slate-300 hover:bg-slate-800'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={20} className="shrink-0" />
                    {!collapsed && <span className="flex-1 text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-800 p-4 space-y-4">
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'gap-3'
            } p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer`}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              JA
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">João Admin</p>
                <p className="text-xs text-slate-400 truncate">admin</p>
              </div>
            )}
          </div>

          <button
            className={`w-full flex items-center ${
              collapsed ? 'justify-center' : 'gap-2'
            } px-3 py-2 text-sm text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-orange-500 text-white px-6 py-2 text-center text-sm font-semibold">
          Portal Interno SBK - Uso Operacional
        </div>

        <header className="border-b border-slate-800 bg-slate-900 h-20 flex items-center px-6 gap-4">
          <div className="flex-1 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <AlertCircle size={16} />
              <span className="font-semibold">Operacional</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowClientSelector(!showClientSelector)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium transition-colors border border-slate-700"
                title="Selecionar cliente em foco"
              >
                <span className="truncate max-w-xs">{selectedClient.nome}</span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {showClientSelector && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowClientSelector(false)}
                />
              )}

              {showClientSelector && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {mockClientesOps.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setShowClientSelector(false);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-slate-700 hover:bg-slate-700 transition-colors flex items-center justify-between ${
                        selectedClient.id === client.id ? 'bg-slate-700' : ''
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-100">
                          {client.nome}
                        </p>
                        <p className="text-xs text-slate-400">
                          {client.id} · {client.plano}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            <Search size={18} />
            <kbd className="hidden sm:inline text-xs bg-slate-900 px-2 py-1 rounded border border-slate-700">
              Cmd K
            </kbd>
          </button>

          <button
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative"
            title="Notificações"
          >
            <Bell size={20} className="text-slate-400 hover:text-slate-200" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              JA
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">João Admin</p>
              <p className="text-xs text-slate-400">admin</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
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
                <Search className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes, processos, alertas..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
