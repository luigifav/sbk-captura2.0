/* global React, SBKIcon, SBKStatus, SBKSpark, SBKMetric, MOCK */
const { useState, useEffect, useMemo } = React;

/* ====================================================================
   PORTAL CLIENTE — CAIXA DE ENTRADA
   ==================================================================== */
function PortalCaixa({ goto }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal · Stellar Agro Ltda</div>
          <h1 className="page-title">Caixa de entrada</h1>
          <div className="page-sub">12 processos novos esta semana · 4 com movimentação</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-secondary"><SBKIcon name="filter" size={14}/>Filtros</button>
          <button className="btn btn-primary"><SBKIcon name="plus" size={14}/>Adicionar processo</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 18 }}>
        <SBKMetric label="Capturados (7d)" value="84" delta="+12 vs semana ant." deltaTone="pos"/>
        <SBKMetric label="Em monitoramento" value="312" delta="estável" deltaTone="neu"/>
        <SBKMetric label="Movimentações novas" value="47" delta="3 críticas" deltaTone="warn"/>
        <SBKMetric label="Laudos prontos" value="18" delta="+5 hoje" deltaTone="pos"/>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl">
          <thead><tr>
            <th>CNJ</th><th>Tribunal</th><th>Partes</th><th>Atualizado</th><th>Status</th><th></th>
          </tr></thead>
          <tbody>
            {MOCK.processes.map(p=>(
              <tr key={p.num} onClick={()=>setSelected(p)} style={{ cursor:'pointer' }}>
                <td className="mono" style={{ color:'var(--sbk-fg-1)', fontSize:12 }}>{p.num}</td>
                <td><span className="tag" style={{ background:'var(--sbk-grey-100)', color:'var(--sbk-fg-2)' }}>{p.tribunal}</span></td>
                <td style={{ fontSize:13 }}>{p.parte}</td>
                <td style={{ fontSize:12, color:'var(--sbk-fg-3)' }}>{p.updated}</td>
                <td><SBKStatus state={p.status}/></td>
                <td style={{ textAlign:'right' }}>
                  <button className="btn btn-ghost btn-sm">Abrir<SBKIcon name="arrow_right" size={12}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ====================================================================
   PORTAL — MONITORAMENTO
   ==================================================================== */
function PortalMonit({ goto }) {
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal</div>
          <h1 className="page-title">Monitoramento</h1>
          <div className="page-sub">312 processos sob observação · 99% tribunais ativos</div>
        </div>
        <button className="btn btn-primary"><SBKIcon name="plus" size={14}/>Novo monitoramento</button>
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Saúde da carteira</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily:'var(--sbk-font-display)', fontSize: 36, fontWeight: 600, letterSpacing:'-0.02em' }}>97%</span>
            <span style={{ fontSize: 12, color:'var(--sbk-verde-claro)', fontWeight: 600 }}>↗ +2pp</span>
          </div>
          <div className="prog" style={{ height: 8 }}><div style={{ width:'97%' }}/></div>
        </div>
        <SBKMetric label="Capturas hoje" value="84" delta="+12% vs ontem" deltaTone="pos" spark={MOCK.spark.capt} sparkColor="#0A5A52"/>
        <SBKMetric label="Falhas pendentes" value="3" delta="reprocessando" deltaTone="warn"/>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--sbk-border)',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0, fontSize: 14, fontWeight: 600 }}>Processos monitorados</h3>
          <div style={{ display:'flex', gap:6 }}>
            {['Todos','Com mov.','Sem mov.'].map((f,i)=>(
              <button key={f} className={`btn btn-sm ${i===0?'btn-primary':'btn-ghost'}`}>{f}</button>
            ))}
          </div>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>CNJ</th><th>Tribunal</th><th>Última mov.</th><th>Risco</th><th>Status</th>
          </tr></thead>
          <tbody>
            {MOCK.processes.slice(0,6).map(p=>(
              <tr key={p.num}>
                <td className="mono" style={{ fontSize:12 }}>{p.num}</td>
                <td><span className="tag" style={{ background:'var(--sbk-grey-100)', color:'var(--sbk-fg-2)' }}>{p.tribunal}</span></td>
                <td style={{ fontSize:12.5, color:'var(--sbk-fg-3)' }}>{p.updated}</td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                    <div className="prog" style={{ width: 60 }}>
                      <div style={{ width: p.risk+'%', background: p.risk>70?'var(--sbk-danger)':p.risk>50?'var(--sbk-warning)':'var(--sbk-verde-claro)' }}/>
                    </div>
                    <span className="mono" style={{ fontSize: 11.5 }}>{p.risk}%</span>
                  </div>
                </td>
                <td><SBKStatus state={p.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ====================================================================
   PORTAL — DOCUMENTOS
   ==================================================================== */
function PortalDocs({ goto }) {
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal</div>
          <h1 className="page-title">Documentos</h1>
          <div className="page-sub">{MOCK.documents.length} peças disponíveis · sincronização ativa</div>
        </div>
        <button className="btn btn-secondary"><SBKIcon name="download" size={14}/>Baixar todos</button>
      </div>

      <div className="grid-3">
        {MOCK.documents.map((d,i)=>(
          <div key={i} className="card card-pad">
            <div style={{ display:'flex', alignItems:'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 48, borderRadius: 6,
                background: 'var(--sbk-verde-50)', color: 'var(--sbk-verde-escuro)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: 11, fontWeight: 700 }}>PDF</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color:'var(--sbk-fg-1)',
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</div>
                <div className="mono" style={{ fontSize: 11, color:'var(--sbk-fg-3)', marginTop: 4 }}>{d.proc}</div>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize: 11.5, color:'var(--sbk-fg-3)' }}>
              <span>{d.date}</span>
              <span>{d.size}</span>
            </div>
            <div style={{ display:'flex', gap: 6, marginTop: 12 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><SBKIcon name="eye" size={12}/>Ver</button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><SBKIcon name="download" size={12}/>Baixar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================
   PORTAL — ALERTAS
   ==================================================================== */
function PortalAlertas({ goto }) {
  const [items, setItems] = useState(MOCK.alerts);
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal</div>
          <h1 className="page-title">Alertas</h1>
          <div className="page-sub">{items.filter(a=>!a.read).length} não lidos · regras configuráveis</div>
        </div>
        <button className="btn btn-secondary"><SBKIcon name="settings" size={14}/>Regras de alerta</button>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {items.map((a,i)=>{
          const tone = { warn: { bg:'var(--sbk-warning-bg)', fg:'var(--sbk-warning)' },
            danger: { bg:'var(--sbk-danger-bg)', fg:'var(--sbk-danger)' },
            success: { bg:'#E6EEEC', fg:'#0A5A52' },
            info: { bg:'#E8EFF0', fg:'#075056' } }[a.tone];
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 14,
              padding: '16px 20px',
              borderBottom: i<items.length-1?'1px solid var(--sbk-grey-100)':'none',
              background: a.read?'transparent':'rgba(7,80,86,0.025)' }}>
              {!a.read && <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--sbk-verde-escuro)' }}/>}
              {a.read && <div style={{ width:6 }}/>}
              <span className="tag" style={{ background: tone.bg, color: tone.fg }}>{a.kind}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: a.read?400:600, color:'var(--sbk-fg-1)' }}>{a.msg}</div>
                <div className="mono" style={{ fontSize: 11, color:'var(--sbk-fg-3)', marginTop: 3 }}>{a.proc}</div>
              </div>
              <span style={{ fontSize: 11.5, color:'var(--sbk-fg-3)' }}>{a.when}</span>
              <button className="btn btn-ghost btn-sm">Abrir<SBKIcon name="arrow_right" size={12}/></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====================================================================
   PORTAL — API / CONSUMO
   ==================================================================== */
function PortalAPI({ goto }) {
  const u = MOCK.apiUsage;
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal · API v2</div>
          <h1 className="page-title">Consumo de API</h1>
          <div className="page-sub">Plano Enterprise · {u.quota.toLocaleString('pt-BR')} chamadas/mês</div>
        </div>
        <button className="btn btn-secondary"><SBKIcon name="book" size={14}/>Documentação</button>
      </div>

      <div className="card card-pad-lg" style={{ marginBottom: 16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 16 }}>
          <div>
            <div className="eyebrow">Uso este mês</div>
            <div style={{ fontFamily:'var(--sbk-font-display)', fontSize: 40, fontWeight: 600,
              letterSpacing:'-0.02em', color: 'var(--sbk-fg-1)', lineHeight: 1, marginTop: 6 }}>
              {u.total.toLocaleString('pt-BR')}<span style={{ fontSize: 18, color: 'var(--sbk-fg-3)' }}> / {u.quota.toLocaleString('pt-BR')}</span>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="mono" style={{ fontSize: 13, color:'var(--sbk-verde-claro)', fontWeight: 600 }}>74%</div>
            <div style={{ fontSize: 11, color:'var(--sbk-fg-3)' }}>recurso restante: 6.530</div>
          </div>
        </div>
        <div className="prog" style={{ height: 10 }}><div style={{ width:'74%' }}/></div>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--sbk-border)' }}>
          <h3 style={{ margin:0, fontSize: 14, fontWeight: 600 }}>Endpoints mais usados</h3>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Endpoint</th><th>Chamadas</th><th>Latência média</th><th>Erros</th>
          </tr></thead>
          <tbody>
            {u.endpoints.map(e=>(
              <tr key={e.path}>
                <td className="mono" style={{ color:'var(--sbk-fg-1)', fontSize:12 }}>{e.path}</td>
                <td className="mono">{e.calls.toLocaleString('pt-BR')}</td>
                <td className="mono">{e.avg}ms</td>
                <td>
                  <span className="mono" style={{ color: e.err>1?'var(--sbk-warning)':'var(--sbk-verde-claro)', fontWeight: 600 }}>
                    {e.err}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ====================================================================
   PORTAL — CREDENCIAIS
   ==================================================================== */
function PortalCred({ goto }) {
  const [reveal, setReveal] = useState({});
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal · Acesso</div>
          <h1 className="page-title">Credenciais</h1>
          <div className="page-sub">Chaves de API · rotacionadas a cada 90 dias</div>
        </div>
        <button className="btn btn-primary"><SBKIcon name="plus" size={14}/>Gerar nova chave</button>
      </div>

      <div className="card card-pad-lg" style={{ marginBottom: 16, background: 'var(--sbk-verde-50)', borderColor: 'transparent' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--sbk-verde-escuro)',
            color: 'var(--sbk-off-white)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <SBKIcon name="shield" size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Compliance LGPD ativo</div>
            <div style={{ fontSize: 12, color:'var(--sbk-fg-2)', marginTop: 2 }}>Criptografia de ponta a ponta · auditoria contínua</div>
          </div>
        </div>
      </div>

      {MOCK.credentials.map((c,i)=>(
        <div key={i} className="card card-pad" style={{ marginBottom: 12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color:'var(--sbk-fg-3)', marginTop: 2 }}>Criada em {c.created} · {c.uses.toLocaleString('pt-BR')} usos</div>
            </div>
            <span className="status s-entregue"><span className="dot"/>Ativa</span>
          </div>
          <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
            <code className="mono" style={{ flex: 1, padding: '10px 14px', background: 'var(--sbk-grey-50)',
              borderRadius: 8, fontSize: 12, color: 'var(--sbk-fg-1)',
              border: '1px solid var(--sbk-border)' }}>
              {reveal[i] ? c.key.replace('...','3a8f9c2d4e5f') : c.key.replace(/[a-z0-9]/gi,'•').replace('•••_•••••_','sbk_prod_')}
            </code>
            <button className="btn btn-secondary btn-sm" onClick={()=>setReveal({...reveal,[i]:!reveal[i]})}>
              <SBKIcon name="eye" size={12}/>{reveal[i]?'Ocultar':'Revelar'}
            </button>
            <button className="btn btn-secondary btn-sm"><SBKIcon name="refresh" size={12}/>Rotacionar</button>
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color:'var(--sbk-fg-3)' }}>
            Último uso: <span className="mono" style={{ color:'var(--sbk-verde-claro)', fontWeight: 600 }}>{c.last}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ====================================================================
   PORTAL — CONTA / PLANO
   ==================================================================== */
function PortalConta({ goto }) {
  const c = MOCK.client;
  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portal</div>
          <h1 className="page-title">Conta</h1>
          <div className="page-sub">{c.plan}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="card card-pad-lg">
          <h3 style={{ margin:'0 0 18px', fontSize: 16, fontWeight: 600 }}>Dados cadastrais</h3>
          {[
            { l: 'Razão social', v: 'Stellar Agro Ltda' },
            { l: 'CNPJ', v: '47.823.110/0001-46', mono: true },
            { l: 'Responsável', v: c.name },
            { l: 'E-mail', v: c.email },
            { l: 'Plano', v: c.plan },
            { l: 'Próxima cobrança', v: '12/05/2026 · R$ 14.800,00' },
          ].map(f=>(
            <div key={f.l} style={{ display:'grid', gridTemplateColumns: '180px 1fr',
              padding: '14px 0', borderBottom: '1px solid var(--sbk-grey-100)' }}>
              <span style={{ fontSize: 12, color:'var(--sbk-fg-3)', fontWeight: 500 }}>{f.l}</span>
              <span className={f.mono?'mono':''} style={{ fontSize: 13.5, color:'var(--sbk-fg-1)' }}>{f.v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, display:'flex', gap: 8 }}>
            <button className="btn btn-primary">Editar dados</button>
            <button className="btn btn-secondary">Trocar plano</button>
          </div>
        </div>

        <div className="card card-pad" style={{ background: 'linear-gradient(180deg,#023631,#012824)', color: '#ECEFF3', borderColor: 'transparent', height: 'fit-content' }}>
          <div className="eyebrow" style={{ color: '#8FAFA9' }}>Seu plano</div>
          <h3 style={{ margin: '8px 0 12px', fontSize: 22, fontWeight: 600 }}>Enterprise</h3>
          <div style={{ fontSize: 13, fontWeight: 300, color: '#C8D7D4', lineHeight: 1.6, marginBottom: 16 }}>
            Captura ilimitada por API + portal · IA inclusa · SLA 30 min · Multi-usuário.
          </div>
          {[
            'Captura via PDPJ, DJE, TJs, DataJud',
            'Laudos auto-gerados pela IA',
            'Suporte dedicado · WhatsApp 24/7',
            'Compliance LGPD',
          ].map(f=>(
            <div key={f} style={{ display:'flex', gap: 8, padding: '6px 0', fontSize: 12.5, color:'#C8D7D4' }}>
              <span style={{ color: '#5C9094' }}><SBKIcon name="check" size={14}/></span>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.PortalCaixa = PortalCaixa;
window.PortalMonit = PortalMonit;
window.PortalDocs = PortalDocs;
window.PortalAlertas = PortalAlertas;
window.PortalAPI = PortalAPI;
window.PortalCred = PortalCred;
window.PortalConta = PortalConta;
