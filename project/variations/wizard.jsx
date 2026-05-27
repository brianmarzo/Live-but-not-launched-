// Launch Decision Wizard — main interactive prototype
// Refined from the original Variation B with:
//  • Full diagrammatic SVG decision tree (left rail) with outcome terminals
//  • Rep-benefit gate now includes the stakeholder analysis cards
//  • Tweaks panel: accent palette, surface, flowchart variant, density
//  • Polished motion (entry transitions per gate, edge-draw animation)

const { useState, useEffect, useMemo, useRef } = React;
const W_F = window.FRAMEWORK;

// Local default tweaks (rewritable by the host via __edit_mode_set_keys)
const WIZARD_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "owner-green",
  "surface": "cream",
  "flowchart": "tree",
  "density": "cozy"
}/*EDITMODE-END*/;

// ---------- Icons ----------
const wIcon = {
  check: <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5L6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  arrow: <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  arrowLeft: <svg viewBox="0 0 16 16" width="14" height="14"><path d="M13 8H3m4-4l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  reset: <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8a5 5 0 0 1 8.5-3.5L13 6m0-3v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  warn: <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2L14 13H2L8 2zM8 7v3M8 12v.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

// ====================================================================
// Diagrammatic decision tree (SVG)
// ====================================================================

const TREE = {
  // Main spine nodes (rect 200 wide x 60 tall, centered horizontally)
  n01: { x: 100, y: 8,   w: 200, h: 60, cx: 200, cy: 38,  bottom: 68  },
  n02: { x: 100, y: 110, w: 200, h: 60, cx: 200, cy: 140, top: 110, bottom: 170 },
  n03: { x: 100, y: 212, w: 200, h: 60, cx: 200, cy: 242, top: 212, bottom: 272 },
  n04: { x: 100, y: 440, w: 200, h: 60, cx: 200, cy: 470, top: 440, bottom: 500 },

  // Branch chips (G3 outputs) — wider so labels fit
  b1: { x: 0,   y: 328, w: 124, h: 40, cx: 62,  cy: 348, top: 328, bottom: 368 }, // Uncontrollable
  b2: { x: 138, y: 328, w: 124, h: 40, cx: 200, cy: 348, top: 328, bottom: 368 }, // Well-configured
  b3: { x: 276, y: 328, w: 124, h: 40, cx: 338, cy: 348, top: 328, bottom: 368 }, // Real blocker

  // Outcome terminals (taller for icon + label)
  t1: { x: 0,   y: 540, w: 124, h: 64, cx: 62,  cy: 572, top: 540 }, // Launch
  t2: { x: 138, y: 540, w: 124, h: 64, cx: 200, cy: 572, top: 540 }, // CSM
  t3: { x: 276, y: 540, w: 124, h: 64, cx: 338, cy: 572, top: 540 }, // Hold
};

function edgePath(from, to) {
  // Smooth bezier between two points along a vertical flow
  const midY = (from.y + to.y) / 2;
  if (from.x === to.x) return `M${from.x} ${from.y} L${to.x} ${to.y}`;
  return `M${from.x} ${from.y} C${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

function DecisionTree({ gateStates, gateData, outcome, mode = "tree" }) {
  if (mode === "rail") return <CompactRail gateStates={gateStates} gateData={gateData} outcome={outcome} />;

  // Edges with live state
  const e_01_02 = gateStates.g1 === "passed";
  const e_02_03 = gateStates.g2 === "passed";

  const b = gateData.branch;
  const e_03_b1 = b === "uncontrollable";
  const e_03_b2 = b === "well-configured";
  const e_03_b3 = b === "real-blocker";

  // Whether the branch is wired into g4 (real-blocker needs coaching path)
  const branchToG4 = gateStates.g3 === "passed";

  const e_b1_04 = b === "uncontrollable" && branchToG4;
  const e_b2_04 = b === "well-configured" && branchToG4;
  const e_b3_04 = b === "real-blocker" && branchToG4;

  const e_04_launch = outcome === "launch";
  const e_04_csm = outcome === "csm";
  const e_04_hold = outcome === "hold";

  const branches = W_F.gates[2].branches;
  const branchById = id => branches.find(b => b.id === id);

  const nodeClass = (state) => `wz-svg-node is-${state}`;

  return (
    <svg className="wz-svg" viewBox="0 0 400 620" preserveAspectRatio="xMidYMin meet" role="img" aria-label="Decision tree">
      <defs>
        <marker id="wz-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>

      {/* ============ Edges (under nodes) ============ */}
      <g className="wz-svg-edges">
        <path className={`wz-svg-edge ${e_01_02 ? "is-on" : ""}`} d={edgePath({ x: TREE.n01.cx, y: TREE.n01.bottom }, { x: TREE.n02.cx, y: TREE.n02.top })} />
        <path className={`wz-svg-edge ${e_02_03 ? "is-on" : ""}`} d={edgePath({ x: TREE.n02.cx, y: TREE.n02.bottom }, { x: TREE.n03.cx, y: TREE.n03.top })} />

        {/* G3 → 3 branches */}
        <path className={`wz-svg-edge ${e_03_b1 ? "is-on" : b ? "is-dim" : ""}`} d={edgePath({ x: TREE.n03.cx, y: TREE.n03.bottom }, { x: TREE.b1.cx, y: TREE.b1.top })} />
        <path className={`wz-svg-edge ${e_03_b2 ? "is-on" : b ? "is-dim" : ""}`} d={edgePath({ x: TREE.n03.cx, y: TREE.n03.bottom }, { x: TREE.b2.cx, y: TREE.b2.top })} />
        <path className={`wz-svg-edge ${e_03_b3 ? "is-on coach" : b ? "is-dim" : ""}`} d={edgePath({ x: TREE.n03.cx, y: TREE.n03.bottom }, { x: TREE.b3.cx, y: TREE.b3.top })} />

        {/* Branches → G4 */}
        <path className={`wz-svg-edge ${e_b1_04 ? "is-on" : b && b !== "uncontrollable" ? "is-dim" : ""}`} d={edgePath({ x: TREE.b1.cx, y: TREE.b1.bottom }, { x: TREE.n04.cx, y: TREE.n04.top })} />
        <path className={`wz-svg-edge ${e_b2_04 ? "is-on" : b && b !== "well-configured" ? "is-dim" : ""}`} d={edgePath({ x: TREE.b2.cx, y: TREE.b2.bottom }, { x: TREE.n04.cx, y: TREE.n04.top })} />
        <path className={`wz-svg-edge ${e_b3_04 ? "is-on coach" : b && b !== "real-blocker" ? "is-dim" : ""}`} d={edgePath({ x: TREE.b3.cx, y: TREE.b3.bottom }, { x: TREE.n04.cx, y: TREE.n04.top })} />

        {/* G4 → Outcomes */}
        <path className={`wz-svg-edge ${e_04_launch ? "is-on" : outcome ? "is-dim" : ""}`} d={edgePath({ x: TREE.n04.cx, y: TREE.n04.bottom }, { x: TREE.t1.cx, y: TREE.t1.top })} />
        <path className={`wz-svg-edge coach ${e_04_csm ? "is-on" : outcome ? "is-dim" : ""}`} d={edgePath({ x: TREE.n04.cx, y: TREE.n04.bottom }, { x: TREE.t2.cx, y: TREE.t2.top })} />
        <path className={`wz-svg-edge stop ${e_04_hold ? "is-on" : outcome ? "is-dim" : ""}`} d={edgePath({ x: TREE.n04.cx, y: TREE.n04.bottom }, { x: TREE.t3.cx, y: TREE.t3.top })} />
      </g>

      {/* ============ Spine nodes ============ */}
      <SvgNode rect={TREE.n01} state={gateStates.g1} n="01" kicker="Customer" label="Live & taking orders?" />
      <SvgNode rect={TREE.n02} state={gateStates.g2} n="02" kicker="Company" label="Churn or support risk?" />
      <SvgNode rect={TREE.n03} state={gateStates.g3} n="03" kicker="Diagnosis" label="What's the GP issue?" />
      <SvgNode rect={TREE.n04} state={gateStates.g4} n="04" kicker="Rep" label="Who benefits from waiting?" />

      {/* ============ Branch chips ============ */}
      <SvgChip rect={TREE.b1} label="Uncontrollable" sel={b === "uncontrollable"} faded={b && b !== "uncontrollable"} verdict="launch" />
      <SvgChip rect={TREE.b2} label="Well-configured" sel={b === "well-configured"} faded={b && b !== "well-configured"} verdict="launch" />
      <SvgChip rect={TREE.b3} label="Real blocker" sel={b === "real-blocker"} faded={b && b !== "real-blocker"} verdict="coach" />

      {/* ============ Outcome terminals ============ */}
      <SvgTerm rect={TREE.t1} icon="🚀" label="Launch" active={outcome === "launch"} tone="go" />
      <SvgTerm rect={TREE.t2} icon="🤝" label="Launch + CSM" active={outcome === "csm"} tone="handoff" />
      <SvgTerm rect={TREE.t3} icon="✋" label="Do not launch" active={outcome === "hold"} tone="stop" />

      {/* ============ Coaching detour annotation ============ */}
      {b === "real-blocker" && (
        <g className="wz-svg-detour">
          <text x={TREE.b3.cx} y={TREE.b3.bottom + 18} textAnchor="middle">via coaching</text>
        </g>
      )}
    </svg>
  );
}

function SvgNode({ rect, state, n, kicker, label }) {
  return (
    <g className={`wz-svg-node is-${state}`}>
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="14" />
      <text className="wz-svg-node-kicker" x={rect.x + 18} y={rect.y + 23}>
        GATE {n} · {kicker.toUpperCase()}
      </text>
      <text className="wz-svg-node-label" x={rect.x + 18} y={rect.y + 45}>
        {label}
      </text>
      {state === "active" && (
        <circle className="wz-svg-pulse" cx={rect.x + rect.w - 14} cy={rect.y + 14} r="4" />
      )}
      {state === "passed" && (
        <g transform={`translate(${rect.x + rect.w - 26}, ${rect.y + 8})`} className="wz-svg-checkmark">
          <circle cx="9" cy="9" r="9" />
          <path d="M5 9.5L8 12.5L13.5 7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
}

function SvgChip({ rect, label, sel, faded, verdict }) {
  return (
    <g className={`wz-svg-chip is-${verdict} ${sel ? "is-sel" : ""} ${faded ? "is-faded" : ""}`}>
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="10" />
      <text x={rect.cx} y={rect.cy + 4} textAnchor="middle">{label}</text>
    </g>
  );
}

function SvgTerm({ rect, icon, label, active, tone }) {
  return (
    <g className={`wz-svg-term is-${tone} ${active ? "is-active" : ""}`}>
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="14" />
      <text className="wz-svg-term-icon" x={rect.cx} y={rect.cy - 4} textAnchor="middle">{icon}</text>
      <text className="wz-svg-term-label" x={rect.cx} y={rect.cy + 18} textAnchor="middle">{label}</text>
    </g>
  );
}

// Compact rail (alternate flowchart variant via Tweak)
function CompactRail({ gateStates, gateData, outcome }) {
  return (
    <div className="wz-rail">
      {[
        { id: "g1", kicker: "Customer", label: "Live & taking orders?" },
        { id: "g2", kicker: "Company", label: "Churn or support risk?" },
        { id: "g3", kicker: "Diagnosis", label: "GP score issue?" },
        { id: "g4", kicker: "Rep", label: "Who benefits from waiting?" },
      ].map((g, i, arr) => (
        <React.Fragment key={g.id}>
          <div className={`wz-rail-node is-${gateStates[g.id]}`}>
            <div className="wz-rail-n">{String(i + 1).padStart(2, "0")}</div>
            <div className="wz-rail-body">
              <div className="wz-rail-kicker">{g.kicker}</div>
              <div className="wz-rail-label">{g.label}</div>
            </div>
            {gateStates[g.id] === "passed" && (
              <div className="wz-rail-check">{wIcon.check}</div>
            )}
          </div>
          {i < arr.length - 1 && <div className={`wz-rail-conn ${gateStates[g.id] === "passed" ? "is-on" : ""}`} />}
        </React.Fragment>
      ))}
      <div className="wz-rail-terms">
        {Object.values(W_F.outcomes).map(o => (
          <div key={o.id} className={`wz-rail-term is-${o.tone} ${outcome === o.id ? "is-active" : ""}`}>
            <span>{o.icon}</span>
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// Gate screens (right pane)
// ====================================================================

function GateHeader({ gate, step, total }) {
  return (
    <div className="wz-screen-head">
      <div className="wz-step-meta">
        <span className="wz-step-num">Gate {parseInt(gate.n, 10)} of {total}</span>
        <span className="wz-step-sep">·</span>
        <span className="wz-step-kicker" style={{ "--k": `var(--${gate.kickerColor})` }}>{gate.kicker}</span>
      </div>
      <h1 className="wz-screen-title">{gate.title}</h1>
      <p className="wz-screen-sub">{gate.summary}</p>
    </div>
  );
}

function ChecklistGate({ gate, arr, setArr }) {
  return (
    <div className="wz-checklist">
      {gate.items.map((item, i) => {
        const checked = arr[i];
        return (
          <button
            key={item.id}
            type="button"
            className={`wz-check ${checked ? "is-on" : ""}`}
            onClick={() => { const next = arr.slice(); next[i] = !next[i]; setArr(next); }}
          >
            <span className="wz-check-box">{checked && wIcon.check}</span>
            <span className="wz-check-text">
              <span className="wz-check-title">{item.title}</span>
              <span className="wz-check-detail">{item.detail}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StakeholderRow({ gate }) {
  return (
    <div className="wz-stakeholders">
      {gate.stakeholders.map((s, i) => (
        <div key={s.who} className={`wz-stake ${s.isRep ? "is-rep" : ""}`}>
          <div className="wz-stake-head">
            <div className="wz-stake-num">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <div className="wz-stake-who">{s.who}</div>
              <div className={`wz-stake-verdict ${s.isRep ? "is-rep" : "is-none"}`}>{s.verdict}</div>
            </div>
          </div>
          <p className="wz-stake-body">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

function BranchSelector({ gate, branch, setBranch }) {
  return (
    <>
      <div className="wz-branches">
        {gate.branches.map(b => {
          const sel = branch === b.id;
          return (
            <button
              key={b.id}
              type="button"
              className={`wz-branchcard ${sel ? "is-sel" : ""}`}
              onClick={() => setBranch(sel ? null : b.id)}
            >
              <div className="wz-branchcard-top">
                <div className={`wz-branchcard-tag is-${b.verdict}`}>
                  {b.verdict === "launch" ? "Launch path" : "Coach + handoff"}
                </div>
              </div>
              <h3 className="wz-branchcard-title">{b.title}</h3>
              <p className="wz-branchcard-lede">{b.lede}</p>
              <ul className="wz-branchcard-rows">
                {b.rows.map((r, i) => (<li key={i}>{r}</li>))}
              </ul>
              <div className="wz-branchcard-radio" aria-hidden="true"><span /></div>
            </button>
          );
        })}
      </div>

      {branch === "real-blocker" && (
        <div className="wz-coach">
          <div className="wz-coach-head">
            <span className="wz-coach-icon">{wIcon.warn}</span>
            <div>
              <div className="wz-coach-tag">Pause before routing — coaching first</div>
              <h3 className="wz-coach-title">{gate.coaching.title}</h3>
            </div>
          </div>
          <ol className="wz-coach-q">
            {gate.coaching.questions.map((q, i) => (
              <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{q}</li>
            ))}
          </ol>
          <p className="wz-coach-warn">{gate.coaching.warn}</p>
        </div>
      )}
    </>
  );
}

// ====================================================================
// Outcome screen
// ====================================================================

function OutcomeScreen({ outcome, onReset, onBack }) {
  const o = W_F.outcomes[outcome] || W_F.outcomes.hold;
  return (
    <div className={`wz-outcome wz-outcome-${o.tone}`}>
      <div className="wz-outcome-head">
        <div className="wz-outcome-icon">{o.icon}</div>
        <div className="wz-outcome-meta">
          <div className="wz-outcome-kicker">Recommended decision</div>
          <h1 className="wz-outcome-name">{o.label}</h1>
        </div>
      </div>
      <h2 className="wz-outcome-title">{o.title}</h2>
      <p className="wz-outcome-body">{o.body}</p>

      <div className="wz-outcome-steps-wrap">
        <div className="wz-outcome-steps-head">Next steps</div>
        <ol className="wz-outcome-steps">
          {o.steps.map((s, i) => (
            <li key={i}>
              <span className="wz-outcome-stepn">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="wz-outcome-actions">
        <button type="button" className="wz-btn wz-btn-ghost" onClick={onBack}>{wIcon.arrowLeft} Back to gates</button>
        <button type="button" className="wz-btn wz-btn-ghost" onClick={onReset}>{wIcon.reset} New case</button>
      </div>
    </div>
  );
}

// ====================================================================
// Top component
// ====================================================================

function DecisionWizard() {
  const [gateData, setGateData] = useState({
    g1: [false, false, false],
    g2: [false, false, false],
    branch: null,
    g4: [false, false, false],
  });
  const [step, setStep] = useState(0); // 0..3 gates, 4 = outcome
  const [tweaks, setTweak] = window.useTweaks(WIZARD_DEFAULTS);

  // Gate state machine — visual state based on step position.
  // active = currently on it, passed = advanced past it, pending = not yet reached.
  const gateStates = useMemo(() => ({
    g1: step === 0 ? "active" : (step > 0 ? "passed" : "pending"),
    g2: step === 1 ? "active" : (step > 1 ? "passed" : "pending"),
    g3: step === 2 ? "active" : (step > 2 ? "passed" : "pending"),
    g4: step === 3 ? "active" : (step > 3 ? "passed" : "pending"),
  }), [step]);

  const outcomeResult = useMemo(() => window.deriveOutcome({
    gate1: gateData.g1, gate2: gateData.g2, branch: gateData.branch, gate4: gateData.g4,
  }), [gateData]);

  const currentGate = W_F.gates[step];
  const arr = currentGate ? (gateData[currentGate.id] || gateData.g1) : null;

  const canAdvance = (() => {
    if (step === 0) return gateData.g1.every(Boolean);
    if (step === 1) return gateData.g2.every(Boolean);
    if (step === 2) return !!gateData.branch;
    if (step === 3) return gateData.g4.every(Boolean);
    return false;
  })();
  const advanceLabel = step === 3 ? "See recommended decision" : "Next gate";

  function advance() { if (step < 4 && canAdvance) setStep(step + 1); }
  function back() { if (step > 0) setStep(step - 1); }
  function reset() {
    setGateData({ g1: [false, false, false], g2: [false, false, false], branch: null, g4: [false, false, false] });
    setStep(0);
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" && canAdvance) advance();
      else if (e.key === "ArrowLeft" && step > 0) back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canAdvance, step]);

  // Build root classes from tweaks
  const rootClass = [
    "wz-root",
    `wz-accent-${tweaks.accent}`,
    `wz-surface-${tweaks.surface}`,
    `wz-density-${tweaks.density}`,
    `wz-flow-${tweaks.flowchart}`,
  ].join(" ");

  return (
    <div className={rootClass}>
      <header className="wz-topbar">
        <div className="wz-topbar-brand">
          <img src={window.OWNER_LOGOS.lockupWhite} alt="Owner" />
          <span className="wz-topbar-divider" />
          <span className="wz-topbar-section">Launch Decision · Manager Playbook</span>
        </div>
        <div className="wz-topbar-right">
          <div className="wz-topbar-progress">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className={`wz-prog ${i < step ? "is-done" : i === step ? "is-cur" : ""}`} />
            ))}
            <span className="wz-prog-count">{step === 4 ? "Decision ready" : `Gate ${step + 1} of 4`}</span>
          </div>
          <button type="button" className="wz-btn wz-btn-tiny wz-btn-ghost" onClick={reset}>{wIcon.reset} Reset</button>
        </div>
      </header>

      <div className="wz-body">
        <aside className="wz-flow">
          <div className="wz-flow-head">
            <div className="wz-flow-eyebrow">The decision tree</div>
            <h3 className="wz-flow-title">Where you are</h3>
            <p className="wz-flow-sub">Customer first. Then company. Then the rep.</p>
          </div>
          <div className="wz-flow-canvas">
            <DecisionTree
              gateStates={gateStates}
              gateData={gateData}
              outcome={step === 4 ? outcomeResult.outcome : null}
              mode={tweaks.flowchart}
            />
          </div>

          <div className="wz-flow-legend">
            <div><span className="wz-leg-dot is-on" /> Path taken</div>
            <div><span className="wz-leg-dot is-cur" /> Current gate</div>
            <div><span className="wz-leg-dot is-out" /> Recommendation</div>
          </div>
        </aside>

        <main className="wz-main">
          {step < 4 ? (
            <div className="wz-screen" key={step}>
              <GateHeader gate={currentGate} step={step} total={4} />

              <div className="wz-screen-body">
                {currentGate.id === "g3" ? (
                  <BranchSelector
                    gate={currentGate}
                    branch={gateData.branch}
                    setBranch={(b) => setGateData({ ...gateData, branch: b })}
                  />
                ) : currentGate.id === "g4" ? (
                  <>
                    <StakeholderRow gate={currentGate} />
                    <div className="wz-g4-divider">
                      <span>Now confirm</span>
                    </div>
                    <ChecklistGate
                      gate={currentGate}
                      arr={arr}
                      setArr={(next) => setGateData({ ...gateData, [currentGate.id]: next })}
                    />
                  </>
                ) : (
                  <ChecklistGate
                    gate={currentGate}
                    arr={arr}
                    setArr={(next) => setGateData({ ...gateData, [currentGate.id]: next })}
                  />
                )}
              </div>

              <footer className="wz-screen-foot">
                <button type="button" className="wz-btn wz-btn-ghost" onClick={back} disabled={step === 0}>
                  {wIcon.arrowLeft} Back
                </button>
                <div className="wz-foot-status">
                  {canAdvance ? (
                    <span className="wz-foot-status-on">Gate cleared — ready to advance</span>
                  ) : (
                    <span className="wz-foot-status-off">{
                      currentGate.id === "g3" ? "Select the GP score issue to continue" : "Confirm every item to clear this gate"
                    }</span>
                  )}
                </div>
                <button type="button" className="wz-btn wz-btn-primary" onClick={advance} disabled={!canAdvance}>
                  {advanceLabel} {wIcon.arrow}
                </button>
              </footer>
            </div>
          ) : (
            <OutcomeScreen outcome={outcomeResult.outcome} onReset={reset} onBack={() => setStep(3)} />
          )}
        </main>
      </div>

      {/* ===== Tweaks ===== */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Accent">
          <window.TweakSelect
            label="Palette"
            value={tweaks.accent}
            options={[
              { value: "owner-green", label: "Owner Green (default)" },
              { value: "gold", label: "Gold" },
              { value: "deep-blue", label: "Dusk Blue" },
              { value: "violet", label: "Violet" },
            ]}
            onChange={(v) => setTweak("accent", v)}
          />
        </window.TweakSection>

        <window.TweakSection label="Layout">
          <window.TweakRadio
            label="Flowchart"
            value={tweaks.flowchart}
            options={[
              { value: "tree", label: "Tree" },
              { value: "rail", label: "Rail" },
            ]}
            onChange={(v) => setTweak("flowchart", v)}
          />
          <window.TweakRadio
            label="Density"
            value={tweaks.density}
            options={[
              { value: "cozy", label: "Cozy" },
              { value: "compact", label: "Compact" },
            ]}
            onChange={(v) => setTweak("density", v)}
          />
          <window.TweakRadio
            label="Surface"
            value={tweaks.surface}
            options={[
              { value: "cream", label: "Cream" },
              { value: "dark", label: "Dark" },
            ]}
            onChange={(v) => setTweak("surface", v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

window.DecisionWizard = DecisionWizard;
