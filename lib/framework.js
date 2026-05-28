export const FRAMEWORK = {
  title: "GP Score Launch Decision Framework",
  eyebrow: "Manager Playbook",
  subtitle: "A step-by-step system for managers to evaluate when to launch, when to add a CSM, and when to override a held case — grounded in one principle.",
  principle: {
    label: "Core Principle",
    chain: ["Customer", "Company", "Rep"],
    note: "We check boxes 1 and 2 before box 3 ever matters.",
  },

  gates: [
    {
      id: "g1",
      n: "01",
      title: "Is the customer live?",
      kicker: "Customer",
      kickerColor: "owner-green",
      summary: "The customer must be functional and aware they're launched. Anything less, and there is no case to make here.",
      items: [
        {
          id: "g1-1",
          title: "Website is live and taking orders",
          detail: "The Owner site is up, OLO is functional, and the customer can accept orders today.",
        },
        {
          id: "g1-2",
          title: "Customer believes they are launched",
          detail: "The customer has been told — and understands — that they are live. They are not waiting on us for anything.",
        },
        {
          id: "g1-3",
          title: "Test order was completed successfully",
          detail: "The end-to-end test order went through prior to launch. If there's an integration, it was confirmed.",
        },
      ],
      fail: {
        kind: "stop",
        title: "Stop here.",
        body: "If the customer is not live and functional, there is no case to launch. Address the blocker first before this framework applies.",
      },
      pass: {
        title: "Customer check passed.",
        body: "The customer is live. Move to Gate 2.",
      },
    },
    {
      id: "g2",
      n: "02",
      title: "Are there any active risks on this account?",
      kicker: "Company",
      kickerColor: "deep-blue",
      summary: "Check any that apply. Risks here don't block the path forward — they inform the coaching conversation at Gate 3.",
      riskMode: true,
      alwaysPassable: true,
      items: [
        {
          id: "g2-1",
          title: "Open support tickets — unresolved",
          detail: "Tickets sitting open without active progress: no owner, no timeline, no clear path to resolution.",
        },
        {
          id: "g2-2",
          title: "Support tickets present but under control",
          detail: "Tickets exist, but are actively being worked. There is an owner, a timeline, and a clear path to resolution.",
        },
        {
          id: "g2-3",
          title: "Churn or cancellation signal",
          detail: "Customer has expressed dissatisfaction, hinted at cancellation, or has been unresponsive since going live. Flag even if it seems minor.",
        },
        {
          id: "g2-4",
          title: "Customer experiencing post-launch instability",
          detail: "Site issues, menu errors, ordering failures, or integration problems — active or recently reported. Note it here so Gate 3 can address it.",
        },
      ],
      pass: {
        title: "Risk check complete.",
        body: "Any flagged risks will be addressed in the coaching conversation at Gate 3. Move forward.",
      },
    },
    {
      id: "g3",
      n: "03",
      title: "What is the GP score issue?",
      kicker: "Diagnosis",
      kickerColor: "gold",
      summary: "Select the type of GP score flag on this case. This determines the path forward.",
      branchType: "select",
      branches: [
        {
          id: "uncontrollable",
          title: "Uncontrollable Fractured Domain",
          lede: "The score is elevated but nothing the rep can do will move it.",
          rows: [
            "Third-party owned (Square, Shift4, FOX, Slice)",
            "Customer cannot gain ownership",
            "No path to resolution exists",
            "Customer is aware of the situation",
          ],
          verdict: "launch",
        },
        {
          id: "well-configured",
          title: "High Score, Well-Configured Launch",
          lede: "The launch is sound. The flag is a data lag, not a real defect.",
          rows: [
            "GBP links look correct but still flagging",
            "Yext sync shows complete on dashboard but SFDC hasn't updated",
            "No rep action can change the outcome",
            "Launch is properly configured underneath the flag",
          ],
          verdict: "launch",
        },
        {
          id: "real-blocker",
          title: "Real GBP or Yext Blocker",
          lede: "There is a real configuration issue and a path to fix it.",
          rows: [
            "GBP is pointing to the wrong domain",
            "Yext is not confirmed or synced correctly",
            "There is an action the rep could take",
            "Issue has a resolution path",
          ],
          verdict: "coach",
        },
      ],
      coaching: {
        title: "Manager Coaching — answer these first",
        questions: [
          "When was this issue first identified? How long have we known about it?",
          "What specific steps did the rep take to resolve it when they found it?",
          "Was this raised early in the launch process — or did it only surface at close?",
          "Did the rep escalate properly (GBP support ticket, Yext review request, correct Slack channel)?",
          "Given the steps that were taken, is this still a genuine unresolved issue — or a skipped step?",
        ],
        warn: "A CSM intro is not a workaround. It's earned when a rep did everything right and the issue persisted anyway. If steps were skipped, have the coaching conversation first. If the rep followed the process and this is still the outcome, proceed to the Rep Benefit Test and route to CSM at launch.",
      },
      pass: {
        title: "This is a launch.",
        body: "The score is elevated but the configuration is sound — or the issue is outside anyone's control. Move to the Rep Benefit Test.",
      },
    },
    {
      id: "g4",
      n: "04",
      title: "Who actually benefits from waiting?",
      kicker: "Rep",
      kickerColor: "violet",
      summary: "Ask the question directly. Confirm each of the three statements below. If all three are true, the override is justified.",
      stakeholders: [
        {
          who: "Customer",
          verdict: "Does not benefit from waiting",
          body: "They're already live, already taking orders, and already believe they've launched. Holding the case open doesn't improve their experience in any way.",
        },
        {
          who: "Company",
          verdict: "Does not benefit from waiting",
          body: "No support tickets means no churn signal. But a live customer sitting in an open case is unrecognized revenue — and that gap flows up through exec reporting to investors. Inaccurate launch data is a forecasting problem at scale.",
        },
        {
          who: "Rep",
          verdict: "Is the only one who benefits",
          body: "Waiting means the GP score may drop before close, which makes their metrics look better. This is the only reason the case hasn't been launched. That's not a business decision — it's a vanity metric decision.",
          isRep: true,
        },
      ],
      items: [
        {
          id: "g4-1",
          title: "Customer doesn't win from waiting",
          detail: "They're live, they know they're live, and continued delay has no benefit to them.",
        },
        {
          id: "g4-2",
          title: "Owner doesn't win from waiting",
          detail: "No churn signal, no support tickets — and an unrecognized launched customer creates a real data integrity problem upstream.",
        },
        {
          id: "g4-3",
          title: "The rep is the only one benefiting from the delay",
          detail: "The sole motivation for holding back the launch is improving the rep's closing GP score. No other reason has been given.",
        },
      ],
      fail: {
        kind: "pause",
        title: "Pause here.",
        body: "If there's a legitimate reason beyond the rep's metrics, that needs to be explored before overriding. Ask the rep directly: \"Who benefits if we wait one more week?\"",
      },
      pass: {
        title: "All three boxes checked.",
        body: "The override is justified. See the outcome below.",
      },
    },
  ],

  outcomes: {
    launch: {
      id: "launch",
      icon: "🚀",
      label: "Launch — No CSM",
      title: "Override & Close",
      body: "The launch is well-configured, the GP flag is either uncontrollable or a data issue, and there is no legitimate reason to hold the case open.",
      steps: [
        "Manager approves the override",
        "Rep closes the case in SFDC",
        "Document the GP flag type in case notes",
        "Note customer awareness of domain issue (if applicable)",
      ],
      tone: "go",
    },
    csm: {
      id: "csm",
      icon: "🤝",
      label: "Launch — With CSM",
      title: "Launch & Hand Off",
      body: "The rep followed the right process but a real GBP or Yext issue remains. The customer should not be held back — but the issue needs ownership post-launch.",
      steps: [
        "Manager confirms rep followed the correct steps",
        "CSM is looped in at launch — not as a rescue, but as a handoff",
        "Outstanding issue is documented and tracked",
        "Rep closes the case; CSM owns the issue",
      ],
      tone: "handoff",
    },
    hold: {
      id: "hold",
      icon: "✋",
      label: "Do Not Launch",
      title: "Address the Blocker",
      body: "There is a real reason this case should not be launched yet — a support issue, a churn risk, an unresolved blocker the rep hasn't acted on, or steps that were skipped.",
      steps: [
        "Identify the specific blocker",
        "Create a clear action plan with a deadline",
        "Schedule the follow-up before leaving this conversation",
        "Do not add a CSM to compensate for incomplete work",
      ],
      tone: "stop",
    },
  },

  footer: "Internal use only — Owner Launch Leadership · Questions? Bring to your weekly manager sync.",
};

export function deriveOutcome(state) {
  const all = (arr, n) => Array.isArray(arr) && arr.length === n && arr.every(Boolean);
  if (!all(state.gate1, 3)) return { status: "blocked", on: "g1", outcome: null };
  // gate2 is informational — risks are noted but never block progression
  if (!state.branch) return { status: "blocked", on: "g3", outcome: null };
  if (state.branch === "real-blocker") {
    if (!all(state.gate4, 3)) return { status: "blocked", on: "g4", outcome: null };
    return { status: "ready", outcome: "csm" };
  }
  if (!all(state.gate4, 3)) return { status: "blocked", on: "g4", outcome: null };
  return { status: "ready", outcome: "launch" };
}
