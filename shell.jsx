/* global React, SBKIcon, SBKStatus, SBKSpark, SBKMetric, MOCK */
const { useState, useEffect } = React;

/* ====================================================================
   APP SHELL — sidebar + top bar
   ==================================================================== */
function AppShell({ portal, route, setRoute, children, density = 'comfortable' }) {
  const isOps = portal === 'ops';
  const opsNav = [
    { id: 'ops/dashboard',     icon: 'home',     label: 'Dashboard' },
    { id: 'ops/captura',       icon: 'radar',    label: 'Captura por CNJ' },
    { id: 'ops/retry',         icon: 'refresh',  label: 'Retry / Timeout', badge: '4' },
    { id: 'ops/clientes',      icon: 'users',    label: 'Clientes',         badge: '8' },
    { id: 'ops/executivo',     icon: 'gauge',    label: 'Executivo' },
    { id: 'ops/registro',      icon: 'history',  label: 'Registro' },
  ];
  const portalNav = [
    { id: 'portal/caixa',         icon: 'inbox',    label: 'Caixa de entrada', badge: '12' },
    { id: 'portal/monitoramento', icon: 'radar',    label: 'Monitoramento' },
    { id: 'portal/documentos',    icon: 'file',     label: 'Documentos' },
    { id: 'portal/alertas',       icon: 'bell',     label: 'Alertas',          badge: '3' },
    { id: 'portal/api',           icon: 'code',     label: 'Consumo de API' },
    { id: 'portal/credenciais',   icon: 'key',      label: 'Credenciais' },
    { id: 'portal/conta',         icon: 'user',     label: 'Conta' },
  ];
  const items = isOps ? opsNav : portalNav;
  const u = isOps ? MOCK.user : MOCK.client;

  return (
    <div className="app-root" data-density={density}>
      {/* SIDEBAR */}
      <aside className={`sb-sidebar ${isOps ? 'ops' : 'portal'}`}>
        {isOps && (
          <>
            <div aria-hidden style={{ position: 'absolute', top: -100, left: -60, width: 320, height: 320,
              background: 'radial-gradient(circle, rgba(42,124,121,0.20) 0%, transparent 70%)',
              pointerEvents: 'none' }}/>
            <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'linear-gradient(#ECEFF3 1px,transparent 1px),linear-gradient(90deg,#ECEFF3 1px,transparent 1px)',
              backgroundSize: '40px 40px', pointerEvents: 'none' }}/>
          </>
        )}
        <div className="sb-brand" style={{ position: 'relative' }}>
          {isOps ? (
            <img src="assets/sbk-logo.png" alt="SBK" style={{ height: 22 }}/>
          ) : (
            <img src="assets/sbk-logo.png" alt="SBK" style={{ height: 22, filter: 'invert(15%) sepia(35%) saturate(2400%) hue-rotate(151deg) brightness(20%)' }}/>
          )}
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700,
            color: isOps ? '#5C9094' : 'var(--sbk-fg-3)',
            letterSpacing: '0.16em' }}>
            {isOps ? 'OPS' : 'PORTAL'}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
            color: isOps ? '#5C9094' : 'var(--sbk-verde-escuro)',
            background: isOps ? 'rgba(92,144,148,0.12)' : 'var(--sbk-verde-50)',
            padding: '2px 7px', borderRadius: 4 }}>v2.0</span>
        </div>

        {isOps && (
          <div style={{ margin: '12px 14px 4px', position: 'relative' }}>
            <div style={{ background: 'rgba(10,90,82,0.18)',
              border: '1px solid rgba(10,90,82,0.35)',
              borderRadius: 10, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%',
                background: '#0A5A52' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#ECEFF3' }}>Sistema operacional</div>
                <div style={{ fontSize: 10, color: '#5C9094' }}>5 de 6 canais ativos</div>
              </div>
              <span className="mono" style={{ fontSize: 10, color: '#8FAFA9' }}>14:35</span>
            </div>
          </div>
        )}

        <nav className="sb-nav scrolly" style={{ position: 'relative' }}>
          <div className="sb-section-label">{isOps ? 'Operações' : 'Sua conta'}</div>
          {items.map(n => (
            <button key={n.id}
              className={`sb-link ${route === n.id ? 'active' : ''}`}
              onClick={() => setRoute(n.id)}>
              <span className="dot"><SBKIcon name={n.icon} size={15}/></span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge && <span className="badge">{n.badge}</span>}
            </button>
          ))}

          <div className="sb-section-label">Sistema</div>
          <button className="sb-link" onClick={() => alert('Configurações')}>
            <span className="dot"><SBKIcon name="settings" size={15}/></span>
            <span>Configurações</span>
          </button>
          <button className="sb-link" onClick={() => setRoute(isOps ? 'portal/caixa' : 'ops/dashboard')}>
            <span className="dot"><SBKIcon name="layers" size={15}/></span>
            <span>Trocar para {isOps ? 'Portal Cliente' : 'Portal Ops'}</span>
          </button>
        </nav>

        <div className="sb-user" style={{ position: 'relative' }}>
          <div className="sb-avatar">{u.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600,
              color: isOps ? '#ECEFF3' : 'var(--sbk-fg-1)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {u.name}</div>
            <div style={{ fontSize: 10, color: isOps ? '#5C9094' : 'var(--sbk-fg-3)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {u.company}</div>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <header className="tb">
          <div className="tb-search">
            <span className="tb-search-icon"><SBKIcon name="search" size={14}/></span>
            <input placeholder={isOps
              ? 'Buscar por CNJ, CNPJ, cliente, vara…'
              : 'Buscar processos, documentos, alertas…'}/>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {isOps && <span className="tag tag-live">LIVE</span>}
            <button className="btn btn-ghost btn-icon" aria-label="Notificações">
              <SBKIcon name="bell" size={16}/>
            </button>
            <div style={{ width: 1, height: 22, background: 'var(--sbk-border)', margin: '0 4px' }}/>
            <button className="btn btn-primary" onClick={() => window.dispatchEvent(new Event('sbk-open-ai'))}>
              <SBKIcon name="sparkle" size={14}/>
              {isOps ? 'Nova captura' : 'Pedir laudo IA'}
            </button>
          </div>
        </header>
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

window.AppShell = AppShell;
