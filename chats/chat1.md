# Score Launch Framework

_Started 2026-05-27 01:03 UTC_

---

## User

https://gp-score-launch-framework.vercel.app/

## Assistant

_[tool: list_files]_

_[tool: web_fetch]_

_[tool: list_files]_

_[tool: web_fetch]_

_[tool: questions_v2]_

I see — you've shared a GP Score Launch Decision Framework page hosted on Vercel. Before I start designing, I need to understand what you want me to do with it. Let me ask some focused questions.

## User

Questions answered:
- objective: Both: redesigned page AND interactive prototype
- audience: Frontline managers walking through real cases in 1:1s
- interactivity: Decide for me
- variations: 2-3 variations side-by-side (design_canvas)
- vibe: Owner.com marketing feel applied to internal docs, Decision-tree / flowchart-forward (visualize the branching), Editorial playbook — magazine-like, generous whitespace, warm cream surfaces
- structure: Decide for me
- outcome_handling: Big result card with next-step checklist (like the original's three outcome blocks)
- tweaks_interest: Decide for me

## Assistant

_[tool: update_todos]_

Good, I have what I need. Let me set up tasks and explore the design system files I'll lift from.

_[tool: read_file]_

_[tool: list_files]_

_[tool: copy_files]_

Setting up the project structure. Copying fonts, logos, the DS stylesheet, and grabbing the design_canvas starter.

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: write_file]_

Now building the structure. Shared content first, then 3 variations, then a wrapping design canvas.

_[tool: write_file]_

Now Variation A — the editorial playbook. This is the magazine-style scrolling page.

_[tool: write_file]_

_[tool: str_replace_edit]_

Fixing the gate state logic.

_[tool: write_file]_

Now Variation B — the Decision Wizard. Step-by-step with a live flowchart sidebar.

_[tool: write_file]_

_[tool: write_file]_

Now Variation C — the Live Case Console.

_[tool: write_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: read_file]_

The server mis-serves SVGs as `image/png`. I'll inline the SVGs at load time and provide a Logo component.

_[tool: str_replace_edit]_

Adding a bootstrap that re-serves the SVGs as blob URLs with correct MIME type.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

Clean. Let me see what it looks like.

_[tool: view_image]_

_[tool: done]_

Hero looks correct — Owner green gradient, brand lockup, big bold sentence-case headline. Surfacing to the user.

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Three directions live on the canvas — open any artboard fullscreen (the expand icon on the artboard label) to test the interaction:

- **A · Editorial Playbook** — owner.com marketing feel applied to internal docs. Cream surfaces, dark green hero, magazine-style numerals per gate, interactive checklists that progressively unlock the next gate. Outcome cards highlight when the framework resolves.
- **B · Decision Wizard** — one gate per screen with a live flowchart sidebar showing the tree, traveled path, and three terminal outcomes. "Try a sample case" / Reset on every variation.
- **C · Live Case Console** — internal-tool layout. Accordion of gates on the left, live verdict card + decision-tree visualization + SFDC-ready case summary (with copy button) on the right. Case-name field in the top bar.

All three share one content model + outcome derivation function, so the framework logic is consistent across variations.

A few next-step options when you've had a look:
- pick a direction to push further
- adjust gate copy or add/remove items
- expose tweaks (accent palette, density, surface tone) on the chosen direction
- print/PDF export of the chosen one

## User

I think option 2 is my favorite, decision wizard

## Assistant

_[tool: questions_v2]_

Good — let's push the Wizard. A few questions about where to focus.

## User

Questions answered:
- next_step: All of the above
- flowchart_feel: More visual / diagrammatic — actual branching tree with SVG edges and outcome terminals
- missing_features: None — keep it minimal
- tweaks_wanted: Decide for me
- destiny: Replace the design canvas — wizard becomes the main file

## Assistant

_[tool: update_todos]_

Going to focus the project on the Wizard, rebuild the flowchart as a real branching diagram, and add Tweaks. Setting up tasks.

_[tool: copy_starter_component]_

_[tool: grep]_

_[tool: write_file]_

Building the new diagrammatic flowchart and integrating tweaks. Starting with the new wizard JSX.

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Simplifying the tweaks — TweakColor with single hex values and a class on root that resolves the accent.

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: delete_file]_

_[tool: unregister_assets]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: screenshot_user_view]_

_[tool: multi_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

## Assistant

_[tool: str_replace_edit]_

The entry animation gets stuck in throttled iframes. Removing it.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

The SVG node labels overlap. Redoing the tree layout with proper text positioning.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

Looking great. Let me click through to verify the flow and the tree updates.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

Removing transitions from SVG elements — they're getting stuck in the iframe.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: read_file]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Cleaning up the state machine — show "active" while on a gate, "passed" only after advancing past it.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: update_todos]_

Looks good. Let me deliver.

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

The Decision Wizard is now the main file. Highlights:

- **New diagrammatic flowchart** — SVG branching tree with main spine (Customer → Company → Diagnosis → Rep), three diagnosis branch chips, three outcome terminals. Edges light up green as you advance; selected branch and active terminal fill in. Coaching detour annotation appears when "Real blocker" is picked.
- **Gate 4 now includes the stakeholder analysis** — three Customer/Company/Rep cards before the confirmation checkboxes, so the manager has the framing in front of them while running the conversation.
- **Tweaks panel** (toggle from the toolbar) — accent palette (Owner Green / Gold / Dusk Blue / Violet), flowchart variant (Tree / Rail), density (Cozy / Compact), surface (Cream / Dark).
- **Keyboard shortcuts** — ←/→ to step.

Old variation files (editorial, console) live on under `variations/` if you ever want to revisit, but the only loaded file is the wizard.

When you've played with it, easy next moves:
- pick an accent and lock it in
- tighten copy on any gate
- wire a "Copy decision to clipboard" / SFDC export to the outcome screen
- print-to-PDF view of a case decision

