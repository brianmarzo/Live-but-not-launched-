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
      title: "Have you identified the issue?",
      kicker: "Diagnosis",
      kickerColor: "gold",
      summary: "Select the category that best describes what's going on. This determines the coaching path forward.",
      branchType: "select",
      branches: [
        {
          id: "fractured-domain",
          title: "Fractured Domain Issue",
          lede: "The domain score is elevated, but ownership is outside anyone's control — nothing the rep does can change this.",
          rows: [
            "Third-party owned domain (Square, Shift4, FOX, Slice)",
            "Customer cannot gain domain ownership",
            "No resolution path exists",
            "Customer has been made aware of the situation",
          ],
          verdict: "launch",
        },
        {
          id: "gp-score",
          title: "GP Score Flag",
          lede: "The score is flagging — could be a data sync lag or a real GBP / Yext configuration issue.",
          rows: [
            "GBP links look correct but are still flagging",
            "Yext sync shows complete but SFDC hasn't updated",
            "GBP is pointing to the wrong domain",
            "Yext is not confirmed or synced correctly",
          ],
          verdict: "coach",
          coaching: {
            title: "Diagnose the GP Score Issue",
            questions: [
              "Is this a data sync lag — or is there a real configuration problem underneath it?",
              "When was this first identified? At the start of the launch process, or only at close?",
              "What specific steps did the rep take when they found it?",
              "Did the rep escalate correctly (GBP support ticket, Yext review request, right Slack channel)?",
              "If it's a real blocker and the rep followed process: is a CSM handoff the right call at launch?",
            ],
            warn: "If the flag is a data lag with no rep action required, this is a launch. If there is a real GBP or Yext blocker and the rep followed the correct process, route to CSM at launch. If steps were skipped, have the coaching conversation first.",
          },
        },
        {
          id: "config-issue",
          title: "Configuration or Live Issue",
          lede: "There is an active issue on this account that needs to be named and owned — menu, driver, design, or anything flagged proactively.",
          rows: [
            "Menu or order injection problem",
            "Driver or fulfillment issue",
            "Website design or UX issue",
            "Any other proactively identified live concern",
          ],
          verdict: "coach",
          coaching: {
            title: "Diagnose the Configuration Issue",
            questions: [
              "What exactly is the issue? Get specific — which menu item, which driver zone, which page element?",
              "When was this first identified? Was it caught proactively or reported by the customer?",
              "Has the customer been informed and is aware?",
              "Is there a clear owner and a realistic resolution timeline?",
              "Is holding the case open the right call — or can this launch with a CSM owning the follow-through?",
            ],
            warn: "A configuration issue shouldn't hold a case open indefinitely. If there is a clear owner and timeline, the case can launch with a CSM intro. If the issue is unresolved and unowned, address that first.",
          },
        },
        {
          id: "critical-hold",
          title: "Critical Risk — Do Not Launch",
          lede: "There is a reason this case should not launch yet. The risk is too high, too active, or too unresolved for launch to be the right call.",
          rows: [
            "Incredibly high likelihood of churning",
            "Active cancellation conversation in progress",
            "Severe unresolved issue with no owner or timeline",
            "Customer relationship at risk — launch would accelerate churn",
          ],
          verdict: "hold",
        },
      ],
      pass: {
        title: "Issue identified.",
        body: "The type of issue is clear. Move to the rep benefit test.",
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
  // critical-hold bypasses Gate 4 — the risk is clear, don't launch
  if (state.branch === "critical-hold") return { status: "ready", outcome: "hold" };
  if (!all(state.gate4, 3)) return { status: "blocked", on: "g4", outcome: null };
  // fractured-domain is uncontrollable — launch with no CSM needed
  if (state.branch === "fractured-domain") return { status: "ready", outcome: "launch" };
  // gp-score and config-issue both need follow-through — launch with CSM
  return { status: "ready", outcome: "csm" };
}
