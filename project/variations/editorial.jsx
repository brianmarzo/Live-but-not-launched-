// Variation A — Editorial Playbook
// Marketing-quality scrolling page. Cream surfaces, generous whitespace,
// each gate is a chapter with huge editorial numerals. Interactive: tap
// checkboxes to advance, sticky progress bar tracks gates cleared, outcome
// surfaces at the foot based on derived state.

const { useState, useEffect, useMemo, useRef } = React;

const F = window.FRAMEWORK;

// ---------- Tiny atoms ----------

function CheckRow({ checked, onToggle, title, detail, disabled, accent = "owner-green" }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`ed-row ${checked ? "is-checked" : ""} ${disabled ? "is-disabled" : ""}`}
      style={{ "--row-accent": `var(--${accent})` }}
    >
      <span className="ed-row-box" aria-hidden="true">
        <svg viewBox="0 0 14 14" width="14" height="14" className="ed-row-check">
          <path d="M2 7.5L5.5 11 12 3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="ed-row-text">
        <span className="ed-row-title">{title}</span>
        <span className="ed-row-detail">{detail}</span>
      </span>
    </button>
  );
}

function GateBadge({ n, kicker, accent, state }) {
  const stateLabel =
    state === "passed" ? "Cleared" : state === "blocked" ? "Blocked" : state === "active" ? "In progress" : "Pending";
  return (
    <div className="ed-gate-badge" style={{ "--badge-accent": `var(--${accent})` }}>
      <div className="ed-gate-kicker">Gate {parseInt(n, 10)}</div>
      <div className="ed-gate-numeral">{n}</div>
      <div className="ed-gate-meta">
        <div className="ed-gate-meta-label">{kicker}</div>
        <div className={`ed-gate-status is-${state}`}>
          <span className="dot" />
          {stateLabel}
        </div>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="ed-flow-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 64" width="24" height="64">
        <line x1="12" y1="0" x2="12" y2="52" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
        <path d="M6 48L12 58L18 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ResultBanner({ kind, title, body }) {
  // kind: 'pass' | 'stop' | 'pause'
  return (
    <div className={`ed-result is-${kind}`}>
      <div className="ed-result-icon" aria-hidden="true">
        {kind === "pass" ? (
          <svg viewBox="0 0 18 18" width="18" height="18"><path d="M3 9.5L7.5 14L15 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : kind === "stop" ? (
          <svg viewBox="0 0 18 18" width="18" height="18"><circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="4.5" y1="13.5" x2="13.5" y2="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <svg viewBox="0 0 18 18" width="18" height="18"><rect x="5" y="3" width="3" height="12" rx="1" fill="currentColor" /><rect x="10" y="3" width="3" height="12" rx="1" fill="currentColor" /></svg>
        )}
      </div>
      <div className="ed-result-body">
        <div className="ed-result-title">{title}</div>
        <div className="ed-result-text">{body}</div>
      </div>
    </div>
  );
}

// ---------- Hero ----------

function EditorialHero({ cleared, total }) {
  return (
    <header className="ed-hero">
      <div className="ed-hero-grad" aria-hidden="true">
        <div className="ed-hero-star ed-hero-star-1" />
        <div className="ed-hero-star ed-hero-star-2" />
      </div>
      <div className="ed-hero-inner">
        <div className="ed-hero-top">
          <div className="ed-hero-brand">
            <img src={window.OWNER_LOGOS.lockupWhite} alt="Owner" />
            <span className="ed-hero-divider" />
            <span className="ed-hero-section">{F.eyebrow}</span>
          </div>
          <div className="ed-hero-progress">
            <div className="ed-hero-progress-label">Gates cleared</div>
            <div className="ed-hero-progress-track">
              {[0, 1, 2, 3].map(i => (
                <span key={i} className={`ed-hero-progress-pip ${i < cleared ? "is-on" : ""}`} />
              ))}
            </div>
            <div className="ed-hero-progress-count">{cleared} <span>/ {total}</span></div>
          </div>
        </div>

        <h1 className="ed-hero-title">{F.title}</h1>
        <p className="ed-hero-sub">{F.subtitle}</p>

        <div className="ed-principle">
          <div className="ed-principle-label">{F.principle.label}</div>
          <div className="ed-principle-chain">
            {F.principle.chain.map((c, i) => (
              <React.Fragment key={c}>
                <span className="ed-principle-step">
                  <span className="ed-principle-step-n">{i + 1}</span>
                  <span className="ed-principle-step-text">{c}</span>
                </span>
                {i < F.principle.chain.length - 1 && <span className="ed-principle-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="ed-principle-note">{F.principle.note}</p>
        </div>
      </div>
    </header>
  );
}

// ---------- Gates ----------

function GateSection({ gate, idx, state, gateData, setGateData }) {
  // gate state: 'pending' | 'active' | 'passed' | 'blocked'
  const isPending = state === "pending";
  const isBlocked = state === "blocked";
  const isPassed = state === "passed";

  if (gate.id === "g3") {
    return <GateThreeSection gate={gate} state={state} gateData={gateData} setGateData={setGateData} />;
  }

  const arr = gateData[gate.id] || [false, false, false];
  const allChecked = arr.every(Boolean);

  return (
    <section className={`ed-gate ed-gate-${gate.id} is-${state}`} aria-disabled={isPending}>
      <GateBadge n={gate.n} kicker={gate.kicker} accent={gate.kickerColor} state={state} />
      <div className="ed-gate-body">
        <h2 className="ed-gate-title">{gate.title}</h2>
        <p className="ed-gate-summary">{gate.summary}</p>

        <ul className="ed-gate-list">
          {gate.items.map((item, i) => (
            <li key={item.id}>
              <CheckRow
                checked={arr[i]}
                disabled={isPending}
                onToggle={() => {
                  const next = arr.slice();
                  next[i] = !next[i];
                  setGateData({ ...gateData, [gate.id]: next });
                }}
                title={item.title}
                detail={item.detail}
                accent={gate.kickerColor}
              />
            </li>
          ))}
        </ul>

        {isBlocked && <ResultBanner kind={gate.fail.kind === "pause" ? "pause" : "stop"} title={gate.fail.title} body={gate.fail.body} />}
        {isPassed && <ResultBanner kind="pass" title={gate.pass.title} body={gate.pass.body} />}
      </div>
    </section>
  );
}

function GateThreeSection({ gate, state, gateData, setGateData }) {
  const branch = gateData.branch;
  const isPending = state === "pending";
  const isPassed = state === "passed";
  const verdict = branch ? gate.branches.find(b => b.id === branch).verdict : null;

  return (
    <section className={`ed-gate ed-gate-g3 is-${state}`} aria-disabled={isPending}>
      <GateBadge n={gate.n} kicker={gate.kicker} accent={gate.kickerColor} state={state} />
      <div className="ed-gate-body">
        <h2 className="ed-gate-title">{gate.title}</h2>
        <p className="ed-gate-summary">{gate.summary}</p>

        <div className="ed-branches">
          {gate.branches.map(b => (
            <button
              key={b.id}
              type="button"
              className={`ed-branch ${branch === b.id ? "is-selected" : ""}`}
              disabled={isPending}
              onClick={() => setGateData({ ...gateData, branch: branch === b.id ? null : b.id })}
            >
              <div className="ed-branch-head">
                <div className="ed-branch-radio" aria-hidden="true">
                  <span />
                </div>
                <h3 className="ed-branch-title">{b.title}</h3>
              </div>
              <p className="ed-branch-lede">{b.lede}</p>
              <ul className="ed-branch-rows">
                {b.rows.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              <div className={`ed-branch-verdict is-${b.verdict}`}>
                {b.verdict === "launch" ? "→ Launch path" : "→ Coaching required"}
              </div>
            </button>
          ))}
        </div>

        {verdict === "coach" && (
          <div className="ed-coaching">
            <div className="ed-coaching-head">
              <span className="ed-coaching-tag">Stop. Coaching first.</span>
              <h3 className="ed-coaching-title">{gate.coaching.title}</h3>
            </div>
            <ol className="ed-coaching-list">
              {gate.coaching.questions.map((q, i) => (
                <li key={i}><span className="ed-coaching-num">{String(i + 1).padStart(2, "0")}</span>{q}</li>
              ))}
            </ol>
            <p className="ed-coaching-warn">{gate.coaching.warn}</p>
          </div>
        )}

        {isPassed && <ResultBanner kind="pass" title={gate.pass.title} body={gate.pass.body} />}
      </div>
    </section>
  );
}

// ---------- Outcomes ----------

function OutcomeGrid({ activeOutcome }) {
  return (
    <section className="ed-outcomes">
      <div className="ed-outcomes-head">
        <span className="ed-eyebrow">Step five</span>
        <h2 className="ed-outcomes-title">Decision outcomes</h2>
        <p className="ed-outcomes-sub">Three paths come out the other side of the framework. The framework above will surface the right one when the gates resolve.</p>
      </div>

      <div className="ed-outcomes-grid">
        {Object.values(F.outcomes).map(o => (
          <div key={o.id} className={`ed-outcome ed-outcome-${o.tone} ${activeOutcome === o.id ? "is-active" : ""}`}>
            <div className="ed-outcome-top">
              <div className="ed-outcome-icon" aria-hidden="true">{o.icon}</div>
              <div className="ed-outcome-label">{o.label}</div>
              {activeOutcome === o.id && <div className="ed-outcome-active-tag">Recommended for this case</div>}
            </div>
            <h3 className="ed-outcome-title">{o.title}</h3>
            <p className="ed-outcome-body">{o.body}</p>
            <ul className="ed-outcome-steps">
              {o.steps.map((s, i) => (
                <li key={i}>
                  <span className="ed-outcome-num">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Top Component ----------

function EditorialPlaybook() {
  const [gateData, setGateData] = useState({
    g1: [false, false, false],
    g2: [false, false, false],
    branch: null,
    g4: [false, false, false],
  });

  const stateSnapshot = useMemo(() => ({
    gate1: gateData.g1,
    gate2: gateData.g2,
    branch: gateData.branch,
    gate4: gateData.g4,
  }), [gateData]);

  const outcomeResult = useMemo(() => window.deriveOutcome(stateSnapshot), [stateSnapshot]);

  // per-gate state
  const gateStates = useMemo(() => {
    const g1all = gateData.g1.every(Boolean);
    const g2all = gateData.g2.every(Boolean);
    const g3sel = !!gateData.branch;
    const g3pass = g3sel && F.gates[2].branches.find(b => b.id === gateData.branch).verdict === "launch";
    const g4all = gateData.g4.every(Boolean);

    return {
      g1: g1all ? "passed" : "active",
      g2: !g1all ? "pending" : (g2all ? "passed" : "active"),
      g3: (!g1all || !g2all) ? "pending" : (g3pass ? "passed" : "active"),
      g4: (!g1all || !g2all || !g3pass) ? "pending" : (g4all ? "passed" : "active"),
    };
  }, [gateData]);

  const cleared = Object.values(gateStates).filter(s => s === "passed").length;
  const activeOutcome = outcomeResult.outcome;

  function reset() {
    setGateData({ g1: [false, false, false], g2: [false, false, false], branch: null, g4: [false, false, false] });
  }
  function demo() {
    setGateData({ g1: [true, true, true], g2: [true, true, true], branch: "well-configured", g4: [true, true, true] });
  }

  return (
    <div className="ed-root">
      <EditorialHero cleared={cleared} total={4} />

      <main className="ed-main">
        <div className="ed-toolbar">
          <div className="ed-toolbar-left">
            <span className="ed-eyebrow">The framework</span>
            <h2 className="ed-toolbar-title">Four gates. One principle.</h2>
          </div>
          <div className="ed-toolbar-right">
            <button type="button" className="ed-btn ed-btn-ghost" onClick={reset}>Reset case</button>
            <button type="button" className="ed-btn ed-btn-tonal" onClick={demo}>Try a sample case</button>
          </div>
        </div>

        <div className="ed-gates">
          {F.gates.map((gate, idx) => (
            <React.Fragment key={gate.id}>
              <GateSection
                gate={gate}
                idx={idx}
                state={gateStates[gate.id]}
                gateData={gateData}
                setGateData={setGateData}
              />
              {idx < F.gates.length - 1 && <FlowArrow />}
            </React.Fragment>
          ))}
        </div>

        <OutcomeGrid activeOutcome={activeOutcome} />
      </main>

      <footer className="ed-footer">
        <div className="ed-footer-inner">
          <img src={window.OWNER_LOGOS.markBlack} alt="" className="ed-footer-mark" />
          <p className="ed-footer-text">{F.footer}</p>
        </div>
      </footer>
    </div>
  );
}

window.EditorialPlaybook = EditorialPlaybook;
