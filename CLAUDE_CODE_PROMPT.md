<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Captura SBK 2.0 — Plataforma jurídico-tecnológica</title>

<!-- Plus Jakarta Sans (brand body) + Fraunces (display, rare) + JetBrains Mono -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

<link rel="stylesheet" href="sbk-tokens.css"/>
<link rel="stylesheet" href="app.css"/>

<template id="__bundler_thumbnail">
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#012824"/>
    <g transform="translate(60,60)" fill="none" stroke="#5C9094" stroke-width="6" stroke-linecap="round">
      <circle cx="40" cy="40" r="34" opacity="0.4"/>
      <circle cx="40" cy="40" r="22" opacity="0.7"/>
      <circle cx="40" cy="40" r="6" fill="#5C9094"/>
      <path d="M40 40 L66 14"/>
    </g>
    <text x="100" y="170" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="600" fill="#ECEFF3">SBK 2.0</text>
  </svg>
</template>
</head>
<body>
<div id="root"></div>

<!-- React + Babel -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<!-- Mock data -->
<script src="data.js"></script>

<!-- Components (load order matters) -->
<script type="text/babel" src="primitives.jsx"></script>
<script type="text/babel" src="shell.jsx"></script>
<script type="text/babel" src="ops.jsx"></script>
<script type="text/babel" src="portal.jsx"></script>
<script type="text/babel" src="tweaks-panel.jsx"></script>

<!-- App entry -->
<script type="text/babel">
const { useState, useEffect, useMemo, useRef } = React;

/* ===========================================================
   AI Assistant Drawer — Lum.IA — slides in from the right
   =========================================================== */
function AIDrawer({ open, onClose, portal }) {
  const [messages, setMessages] = useState([
    { who: 'ai', text: 'Olá! Eu sou a Lum.IA. Posso te ajudar a localizar processos, gerar laudos ou explicar movimentações. Como posso ajudar hoje?' },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { who: 'user', text }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const lower = text.toLowerCase();
      let reply;
      if (lower.includes('laudo')) {
        reply = 'Posso gerar um laudo executivo a partir de qualquer captura. Os laudos cobrem síntese da causa, riscos identificados, jurisprudência correlata e recomendação. Quer que eu gere para o último processo capturado?';
      } else if (lower.includes('cnj') || lower.includes('processo')) {
        reply = 'Posso buscar por número CNJ, partes envolvidas, ou cliente. Cole o CNJ ou diga o nome da parte que estou nesse caso em segundos.';
      } else if (lower.includes('falha') || lower.includes('retry')) {
        reply = 'No momento há 4 capturas em fila de retry. 2 são timeout em DJE-PR e 2 são certificado expirado em TJBA. Posso agendar reprocessamento agora?';
      } else {
        reply = 'Entendi. Vou trabalhar nisso e te trago um resumo em alguns segundos. Enquanto isso, você pode continuar navegando que aviso aqui quando estiver pronto.';
      }
      setMessages(m => [...m, { who: 'ai', text: reply }]);
    }, 900);
  };

  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(1,28,26,0.4)',
        zIndex: 99, animation: 'fade 200ms' }}/>
      <aside style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 440,
        background: 'var(--sbk-bg-canvas)', boxShadow: '-24px 0 60px -20px rgba(1,28,26,0.30)',
        zIndex: 100, display: 'flex', flexDirection: 'column',
        animation: 'slidein 280ms cubic-bezier(0.20,0.80,0.20,1)',
        borderLeft: '1px solid var(--sbk-border)' }}>
        <header style={{ padding: '18px 22px', borderBottom: '1px solid var(--sbk-border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'linear-gradient(135deg, #012824 0%, #023631 100%)', color: '#ECEFF3' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #075056, #2A7C79)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 3px rgba(92,144,148,0.20)' }}>
            <SBKIcon name="sparkle" size={18} color="#ECEFF3"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Lum.IA</div>
            <div style={{ fontSize: 11, color: '#8FAFA9', display:'flex', alignItems:'center', gap: 6 }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius:'50%', background:'#5C9094' }}/>
              Pronta · MCP · 97.8% acuracidade
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" style={{ color:'#ECEFF3' }}>
            <SBKIcon name="x" size={16}/>
          </button>
        </header>

        <div ref={scrollRef} className="scrolly" style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.who === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '82%',
                padding: '11px 14px',
                borderRadius: m.who === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.who === 'user' ? 'var(--sbk-verde-escuro)' : 'var(--sbk-grey-50)',
                color: m.who === 'user' ? 'var(--sbk-off-white)' : 'var(--sbk-fg-1)',
                fontSize: 13.5, lineHeight: 1.55,
                border: m.who === 'user' ? 'none' : '1px solid var(--sbk-border)',
              }}>{m.text}</div>
            </div>
          ))}
          {thinking && (
            <div style={{ display:'flex', alignItems:'center', gap: 8, color:'var(--sbk-fg-3)', fontSize: 12, padding: '4px 6px' }}>
              <span className="dots"><span/><span/><span/></span>
              Lum.IA está pensando…
            </div>
          )}
        </div>

        <div style={{ padding: '16px 22px', borderTop: '1px solid var(--sbk-border)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap:'wrap' }}>
            {['Gerar laudo', 'Buscar CNJ', 'Status retry'].map(s => (
              <button key={s} className="chip" onClick={() => send(s)}
                style={{ background: 'var(--sbk-verde-50)', color: 'var(--sbk-verde-escuro)', borderColor: 'transparent', cursor: 'pointer' }}>
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
            style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte qualquer coisa…"
              style={{ flex: 1, padding: '11px 14px', border: '1px solid var(--sbk-border)',
                borderRadius: 10, fontFamily: 'inherit', fontSize: 13, outline: 'none',
                background: 'var(--sbk-grey-50)' }}/>
            <button type="submit" className="btn btn-primary btn-icon" disabled={!input.trim()}>
              <SBKIcon name="send" size={14}/>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

/* ===========================================================
   ROOT APP
   =========================================================== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "compact",
  "statusStyle": "filled",
  "showAI": false,
  "opsTone": "deep",
  "cardStyle": "border"
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useState('ops/dashboard');
  const [aiOpen, setAiOpen] = useState(false);
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const h = () => setAiOpen(true);
    window.addEventListener('sbk-open-ai', h);
    return () => window.removeEventListener('sbk-open-ai', h);
  }, []);

  useEffect(() => {
    document.body.dataset.density     = t.density;
    document.body.dataset.statusStyle = t.statusStyle;
    document.body.dataset.cardStyle   = t.cardStyle;
    document.body.dataset.opsTone     = t.opsTone;
  }, [t]);

  const portal = route.startsWith('ops/') ? 'ops' : 'portal';
  const view = useMemo(() => ({
    'ops/dashboard':       <OpsDashboard goto={setRoute}/>,
    'ops/captura':         <OpsCaptura   goto={setRoute}/>,
    'ops/retry':           <OpsRetry     goto={setRoute}/>,
    'ops/clientes':        <OpsClientes  goto={setRoute}/>,
    'ops/executivo':       <OpsExecutivo goto={setRoute}/>,
    'ops/registro':        <OpsRegistro  goto={setRoute}/>,
    'portal/caixa':         <PortalCaixa    goto={setRoute}/>,
    'portal/monitoramento': <PortalMonit    goto={setRoute}/>,
    'portal/documentos':    <PortalDocs     goto={setRoute}/>,
    'portal/alertas':       <PortalAlertas  goto={setRoute}/>,
    'portal/api':           <PortalAPI      goto={setRoute}/>,
    'portal/credenciais':   <PortalCred     goto={setRoute}/>,
    'portal/conta':         <PortalConta    goto={setRoute}/>,
  }[route]), [route]);

  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton } = window;

  return (
    <>
      <AppShell portal={portal} route={route} setRoute={setRoute} density={t.density}>
        {view}
      </AppShell>

      {t.showAI && (
        <button onClick={() => setAiOpen(true)} className="ai-fab" aria-label="Abrir Lum.IA">
          <SBKIcon name="sparkle" size={20} color="#ECEFF3"/>
        </button>
      )}

      <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} portal={portal}/>

      <TweaksPanel title="Tweaks · SBK 2.0">
        <TweakSection label="Layout">
          <TweakRadio label="Densidade" value={t.density}
            options={[{value:'comfortable',label:'Confortável'},{value:'compact',label:'Compacta'}]}
            onChange={v => setTweak('density', v)}/>
          <TweakRadio label="Tom do /ops" value={t.opsTone}
            options={[{value:'deep',label:'Verde profundo'},{value:'light',label:'Claro'}]}
            onChange={v => setTweak('opsTone', v)}/>
        </TweakSection>
        <TweakSection label="Componentes">
          <TweakRadio label="Status badge" value={t.statusStyle}
            options={[{value:'filled',label:'Preenchido'},{value:'outline',label:'Outline'},{value:'dot',label:'Dot'}]}
            onChange={v => setTweak('statusStyle', v)}/>
          <TweakRadio label="Card" value={t.cardStyle}
            options={[{value:'border',label:'Borda'},{value:'shadow',label:'Sombra'},{value:'tint',label:'Tinta'}]}
            onChange={v => setTweak('cardStyle', v)}/>
          <TweakToggle label="Lum.IA flutuante" value={t.showAI}
            onChange={v => setTweak('showAI', v)}/>
        </TweakSection>
        <TweakSection label="Acesso rápido">
          <TweakButton label="Abrir Lum.IA" onClick={() => setAiOpen(true)}/>
          <TweakButton label="Ir para Portal Cliente" onClick={() => setRoute('portal/caixa')}/>
          <TweakButton label="Ir para Ops" onClick={() => setRoute('ops/dashboard')}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
</script>
</body>
</html>
