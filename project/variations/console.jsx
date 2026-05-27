// Variation C — Live Case Console
// Operator-grade internal tool. Left column = accordion of 4 gates with
// inline checklists. Right column = live decision panel: verdict card,
// case-tree visualization, and an SFDC-ready case summary that updates
// in real time. Plus a case-name field at the top for 1:1 workflow.

const { useState, useEffect, useMemo, useRef } = React;
const C_F = window.FRAMEWORK;

// ---------- Atoms ----------
const cIcon = {
  chev: <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  check: <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5L6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  copy: <svg viewBox="0 0 16 16" width="14" height="14"><rect x="5" y="2" width="9" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M11 13.5V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 2 14V5a.5.5 0 0 1 .5-.5h.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  warn: <svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 2L14 13H2L8 2zM8 7v3M8 12v.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

function StateDot({ state }) {
  return <span className={`cs-dot cs-dot-${state}`}>{state === "passed" && cIcon.check}</span>;
}

// ---------- Left: Gate accordion ----------

function GateAccordion({ gate, open, onToggle, state, gateData, setGateData, gateStates }) {
  const arr = gateData[gate.id] || [false, false, false];
  const total = gate.id === "g3" ? 3 : 3;
  const done = gate.id === "g3" ? (gateData.branch ? 1 : 0) : arr.filter(Boolean).length;
  const blockedByPrev = state === "pending";

  return (
    <section className={`cs-acc is-${state} ${open ? "is-open" : ""}`}>
      <button type="button" className="cs-acc-head" onClick={onToggle}>
        <div className="cs-acc-head-l">
          <div className="cs-acc-numeral" style={{ "--k": `var(--${gate.kickerColor})` }}>{gate.n}</div>
          <div className="cs-acc-titles">
            <div className="cs-acc-kicker">Gate {parseInt(gate.n, 10)} · {gate.kicker}</div>
            <div className="cs-acc-title">{gate.title}</div>
          </div>
        </div>
        <div className="cs-acc-head-r">
          <div className="cs-acc-tally">
            <StateDot state={state} />
            <span>{done}/{total}</span>
          </div>
          <span className={`cs-acc-chev ${open ? "is-open" : ""}`}>{cIcon.chev}</span>
        </div>
      </button>

      {open && !blockedByPrev && (
        <div className="cs-acc-body">
          {gate.id === "g3" ? (
            <BranchPicker gate={gate} branch={gateData.branch} onSelect={(b) => setGateData({ ...gateData, branch: b })} />
          ) : (
            <div className="cs-checkrows">
              {gate.items.map((item, i) => (
                <label key={item.id} className={`cs-checkrow ${arr[i] ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={arr[i]}
                    onChange={() => {
                      const next = arr.slice(); next[i] = !next[i];
                      setGateData({ ...gateData, [gate.id]: next });
                    }}
                  />
                  <span className="cs-checkrow-box">{arr[i] && cIcon.check}</span>
                  <span className="cs-checkrow-text">
                    <span className="cs-checkrow-title">{item.title}</span>
                    <span className="cs-checkrow-detail">{item.detail}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {open && blockedByPrev && (
        <div className="cs-acc-locked">
          Complete Gate {parseInt(gate.n, 10) - 1} first to unlock.
        </div>
      )}
    </section>
  );
}

function BranchPicker({ gate, branch, onSelect }) {
  return (
    <div className="cs-branchwrap">
      <div className="cs-branch-list">
        {gate.branches.map(b => {
          const sel = branch === b.id;
          return (
            <button
              key={b.id}
              type="button"
              className={`cs-branchitem ${sel ? "is-sel" : ""} is-${b.verdict}`}
              onClick={() => onSelect(sel ? null : b.id)}
            >
              <div className="cs-branchitem-radio"><span /></div>
              <div className="cs-branchitem-body">
                <div className="cs-branchitem-title">{b.title}</div>
                <div className="cs-branchitem-lede">{b.lede}</div>
                <ul className="cs-branchitem-rows">
                  {b.rows.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className={`cs-branchitem-tag is-${b.verdict}`}>
                {b.verdict === "launch" ? "Launch" : "Coach"}
              </div>
            </button>
          );
        })}
      </div>

      {branch === "real-blocker" && (
        <div className="cs-coachpanel">
          <div className="cs-coachpanel-head">
            <span className="cs-coachpanel-icon">{cIcon.warn}</span>
            <div>
              <div className="cs-coachpanel-tag">Coaching required first</div>
              <div className="cs-coachpanel-title">{gate.coaching.title}</div>
            </div>
          </div>
          <ol className="cs-coachpanel-q">
            {gate.coaching.questions.map((q, i) => (
              <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{q}</li>
            ))}
          </ol>
          <p className="cs-coachpanel-warn">{gate.coaching.warn}</p>
        </div>
      )}
    </div>
  );
}

// ---------- Right: Decision tree visualization ----------

function DecisionTree({ gateStates, gateData, outcome }) {
  const branchObj = gateData.branch ? C_F.gates[2].branches.find(b => b.id === gateData.branch) : null;

  return (
    <div className="cs-tree">
      <div className="cs-tree-col">
        <div className={`cs-tree-node is-${gateStates.g1}`}>
          <div className="cs-tree-node-n">01</div>
          <div className="cs-tree-node-l">Customer live?</div>
        </div>
        <div className={`cs-tree-link ${gateStates.g1 === "passed" ? "is-on" : ""}`} />
        <div className={`cs-tree-node is-${gateStates.g2}`}>
          <div className="cs-tree-node-n">02</div>
          <div className="cs-tree-node-l">Churn or support risk?</div>
        </div>
        <div className={`cs-tree-link ${gateStates.g2 === "passed" ? "is-on" : ""}`} />
        <div className={`cs-tree-node is-${gateStates.g3}`}>
          <div className="cs-tree-node-n">03</div>
          <div className="cs-tree-node-l">GP score issue?</div>
        </div>
      </div>

      <div className="cs-tree-branch">
        <svg className="cs-tree-svg" viewBox="0 0 200 240" preserveAspectRatio="none">
          {/* Trunk down from g3 */}
          <path d="M0,0 L0,120 L200,120" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Branch lines */}
          <path d="M100,0 L100,60 L180,60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={branchObj?.id === "uncontrollable" ? "0" : "4 4"} className={branchObj?.id === "uncontrollable" ? "cs-tree-svg-on" : ""} />
          <path d="M100,0 L100,120 L180,120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={branchObj?.id === "well-configured" ? "0" : "4 4"} className={branchObj?.id === "well-configured" ? "cs-tree-svg-on" : ""} />
          <path d="M100,0 L100,200 L180,200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={branchObj?.id === "real-blocker" ? "0" : "4 4"} className={branchObj?.id === "real-blocker" ? "cs-tree-svg-on" : ""} />
        </svg>
        <div className="cs-tree-branchcards">
          {C_F.gates[2].branches.map(b => {
            const sel = gateData.branch === b.id;
            return (
              <div key={b.id} className={`cs-tree-branchcard ${sel ? "is-sel" : ""} ${gateData.branch && !sel ? "is-faded" : ""}`}>
                <span className={`cs-tree-bdot is-${b.verdict}`} />
                <span className="cs-tree-blabel">{b.title.split(" ").slice(0, 3).join(" ")}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="cs-tree-col cs-tree-col-end">
        <div className={`cs-tree-node is-${gateStates.g4}`}>
          <div className="cs-tree-node-n">04</div>
          <div className="cs-tree-node-l">Who benefits from waiting?</div>
        </div>
        <div className={`cs-tree-link ${gateStates.g4 === "passed" ? "is-on" : ""}`} />
        <div className="cs-tree-outcomes">
          {Object.values(C_F.outcomes).map(o => (
            <div key={o.id} className={`cs-tree-outcome is-${o.tone} ${outcome === o.id ? "is-active" : ""}`}>
              <span className="cs-tree-outcome-icon">{o.icon}</span>
              <span className="cs-tree-outcome-label">{o.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Right: Verdict card ----------

function VerdictCard({ outcomeResult, gateStates }) {
  const cleared = Object.values(gateStates).filter(s => s === "passed").length;
  const status = outcomeResult.status;
  const outcome = outcomeResult.outcome ? C_F.outcomes[outcomeResult.outcome] : null;

  return (
    <div className={`cs-verdict ${outcome ? `is-${outcome.tone}` : "is-pending"}`}>
      <div className="cs-verdict-head">
        <div className="cs-verdict-eyebrow">Live recommendation</div>
        <div className="cs-verdict-progress">
          <span>{cleared}/4 gates cleared</span>
          <div className="cs-verdict-progress-track">
            {[0, 1, 2, 3].map(i => <span key={i} className={`cs-verdict-pip ${i < cleared ? "is-on" : ""}`} />)}
          </div>
        </div>
      </div>
      <div className="cs-verdict-body">
        {outcome ? (
          <>
            <div className="cs-verdict-icon">{outcome.icon}</div>
            <div>
              <div className="cs-verdict-label">{outcome.label}</div>
              <h2 className="cs-verdict-title">{outcome.title}</h2>
              <p className="cs-verdict-desc">{outcome.body}</p>
            </div>
          </>
        ) : (
          <>
            <div className="cs-verdict-icon cs-verdict-icon-pending">⋯</div>
            <div>
              <div className="cs-verdict-label">Pending</div>
              <h2 className="cs-verdict-title">Work through the gates on the left</h2>
              <p className="cs-verdict-desc">
                The recommendation will surface once every gate clears or a blocker is identified.
                {status === "blocked" && outcomeResult.on && ` Currently held at ${outcomeResult.on.toUpperCase()}.`}
              </p>
            </div>
          </>
        )}
      </div>
      {outcome && (
        <div className="cs-verdict-steps">
          <div className="cs-verdict-steps-head">Next steps</div>
          <ul>
            {outcome.steps.map((s, i) => (
              <li key={i}>
                <span className="cs-verdict-stepn">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------- Right: Case summary ----------

function CaseSummary({ caseName, gateData, outcomeResult }) {
  const lines = useMemo(() => {
    const L = [];
    L.push(`Case: ${caseName || "[unnamed]"}`);
    L.push(`Date: ${new Date().toLocaleDateString()}`);
    L.push("Framework: GP Score Launch Decision");
    L.push("");
    L.push(`Gate 1 — Customer live: ${gateData.g1.every(Boolean) ? "PASS" : `${gateData.g1.filter(Boolean).length}/3`}`);
    L.push(`Gate 2 — Company risk: ${gateData.g2.every(Boolean) ? "PASS" : `${gateData.g2.filter(Boolean).length}/3`}`);
    if (gateData.branch) {
      const b = C_F.gates[2].branches.find(x => x.id === gateData.branch);
      L.push(`Gate 3 — GP issue: ${b.title}`);
    } else {
      L.push("Gate 3 — GP issue: not selected");
    }
    L.push(`Gate 4 — Rep benefit test: ${gateData.g4.every(Boolean) ? "PASS" : `${gateData.g4.filter(Boolean).length}/3`}`);
    L.push("");
    if (outcomeResult.outcome) {
      const o = C_F.outcomes[outcomeResult.outcome];
      L.push(`DECISION: ${o.label.toUpperCase()}`);
      L.push(o.body);
    } else {
      L.push("DECISION: pending (gates not all resolved)");
    }
    return L.join("\n");
  }, [caseName, gateData, outcomeResult]);

  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(lines).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="cs-summary">
      <div className="cs-summary-head">
        <div>
          <div className="cs-summary-eyebrow">SFDC-ready</div>
          <div className="cs-summary-title">Case summary</div>
        </div>
        <button type="button" className="cs-btn cs-btn-ghost cs-btn-tiny" onClick={copy}>
          {cIcon.copy} {copied ? "Copied" : "Copy notes"}
        </button>
      </div>
      <pre className="cs-summary-body">{lines}</pre>
    </div>
  );
}

// ---------- Top component ----------

function LiveConsole() {
  const [gateData, setGateData] = useState({
    g1: [false, false, false],
    g2: [false, false, false],
    branch: null,
    g4: [false, false, false],
  });
  const [openGate, setOpenGate] = useState("g1");
  const [caseName, setCaseName] = useState("");

  const gateStates = useMemo(() => {
    const g1all = gateData.g1.every(Boolean);
    const g2all = gateData.g2.every(Boolean);
    const g3sel = !!gateData.branch;
    const g3pass = g3sel && C_F.gates[2].branches.find(b => b.id === gateData.branch).verdict === "launch";
    const g4all = gateData.g4.every(Boolean);
    return {
      g1: g1all ? "passed" : "active",
      g2: !g1all ? "pending" : (g2all ? "passed" : "active"),
      g3: (!g1all || !g2all) ? "pending" : (g3pass ? "passed" : "active"),
      g4: (!g1all || !g2all || !g3pass) ? "pending" : (g4all ? "passed" : "active"),
    };
  }, [gateData]);

  const outcomeResult = useMemo(() => window.deriveOutcome({
    gate1: gateData.g1, gate2: gateData.g2, branch: gateData.branch, gate4: gateData.g4,
  }), [gateData]);

  // Auto-advance open gate when a gate clears
  useEffect(() => {
    if (gateStates.g1 === "passed" && openGate === "g1") setOpenGate("g2");
    else if (gateStates.g2 === "passed" && openGate === "g2") setOpenGate("g3");
    else if (gateStates.g3 === "passed" && openGate === "g3") setOpenGate("g4");
  }, [gateStates, openGate]);

  function reset() {
    setGateData({ g1: [false, false, false], g2: [false, false, false], branch: null, g4: [false, false, false] });
    setOpenGate("g1");
    setCaseName("");
  }
  function demo() {
    setGateData({ g1: [true, true, true], g2: [true, true, true], branch: "uncontrollable", g4: [true, true, true] });
    setCaseName("Acme Diner · #SF-2204");
    setOpenGate("g4");
  }

  return (
    <div className="cs-root">
      <header className="cs-topbar">
        <div className="cs-topbar-l">
          <img src={window.OWNER_LOGOS.lockupBlack} alt="Owner" className="cs-topbar-logo" />
          <span className="cs-topbar-divider" />
          <span className="cs-topbar-section">Launch Decision Console</span>
        </div>
        <div className="cs-topbar-center">
          <label className="cs-caseinput">
            <span className="cs-caseinput-label">Case</span>
            <input
              type="text"
              value={caseName}
              onChange={e => setCaseName(e.target.value)}
              placeholder="Restaurant name or SFDC #"
            />
          </label>
        </div>
        <div className="cs-topbar-r">
          <button type="button" className="cs-btn cs-btn-ghost cs-btn-tiny" onClick={demo}>Demo case</button>
          <button type="button" className="cs-btn cs-btn-ghost cs-btn-tiny" onClick={reset}>Reset</button>
        </div>
      </header>

      <div className="cs-body">
        <aside className="cs-left">
          <div className="cs-left-head">
            <span className="cs-left-eyebrow">Framework</span>
            <h2 className="cs-left-title">The four gates</h2>
            <p className="cs-left-sub">Customer → Company → Diagnosis → Rep. Resolve each before opening the next.</p>
          </div>
          <div className="cs-acc-list">
            {C_F.gates.map(g => (
              <GateAccordion
                key={g.id}
                gate={g}
                open={openGate === g.id}
                onToggle={() => setOpenGate(openGate === g.id ? null : g.id)}
                state={gateStates[g.id]}
                gateData={gateData}
                setGateData={setGateData}
                gateStates={gateStates}
              />
            ))}
          </div>
        </aside>

        <main className="cs-right">
          <VerdictCard outcomeResult={outcomeResult} gateStates={gateStates} />
          <div className="cs-tree-section">
            <div className="cs-section-head">
              <span className="cs-eyebrow">Decision tree</span>
              <h3 className="cs-section-title">Case path</h3>
            </div>
            <DecisionTree gateStates={gateStates} gateData={gateData} outcome={outcomeResult.outcome} />
          </div>
          <CaseSummary caseName={caseName} gateData={gateData} outcomeResult={outcomeResult} />
        </main>
      </div>
    </div>
  );
}

window.LiveConsole = LiveConsole;
