# Identity, transport and recovery

`game.getOwnedMarkIdentity(player)` assigns a session-scoped identity independent of playerid, general name and seat position. Death, temporary absence and changing generals do not by themselves replace it. Lifecycle policies determine whether individual effects survive. Permanently removed Player objects remain resolvable within that session; `resetOwnedMarks()` clears the registry.

`exportOwnedMarkState()` returns JSON data:

```js
{ ledger: { version: 1, sessionId, revision, sequence, buckets },
  players: [{ id, playerid, position, detached? }] }
```

Detached identities preserve provenance after a source leaves permanently, or when an explicitly supplied owner identity has no Player. Their position is null and they never bind to a replacement seat.

`importOwnedMarkState(payload, { force = false, replay = false })` accepts that object or its JSON string. Network import binds only explicit playerid matches. Replay and explicit save restoration use recorded positions for non-detached identities. It validates every binding and effect identity reference before changing the ledger. Older and duplicate revisions return false. A first authoritative snapshot can replace a locally created, empty query-only ledger. After an authoritative import or local transaction, another session requires reset or explicit force.

Projection writes numeric storage and refreshes UI without addMark/removeMark events, markSkill replay messages, or onunmark effects. `refreshOwnedMarks()` rebuilds the current projection and relation hooks after ordinary skill-state replacement, without broadcasting or recording. It does not accept a new ledger.

Each successful authoritative ledger change projects totals, applies per-effect `lib.skill[sourceSkill].onOwnedMarkChange(recordOrNull, previousOrNull, { restoring })`, broadcasts one complete state and records `ownedMarks`. Nested hook transactions publish the final revision; stale outer diffs stop. Hooks receive cloned records. They must rebuild idempotent derived skill state when restoring, and must not grant or consume effects during restore. A throwing hook is logged without preventing ledger transport.

Network packets and arenaState/skillState use a JSON string for the ownedMarks field. This avoids the generic network encoder's recursion limit and reserved string interpretation inside arbitrary JSON params. Replay stores the plain JSON object. Arena preparation, replay initialization and reconnect initialization reset the prior session; reconnect imports after Players have been constructed.

## Explicit mode persistence

```js
// After ordinary mode-specific state is saved:
game.saveOwnedMarkState("ownedMarks"); // game.save(key, payload, optionalMode)

// After loading the mode and reconstructing its Players:
game.loadOwnedMarkState("ownedMarks"); // reads this mode's lib.storage key
// Or import a payload carried by a mode's own save envelope:
game.loadOwnedMarkState(savedEnvelope.ownedMarks);
```

The load helper defaults to `{ force: true, replay: true }`; its second argument can override either setting. Saving an effect ledger alone does not save HP, cards, turns or other mode state. Existing chess campaign persistence saves campaign progress rather than an active battle, so this change does not attach an obsolete battle ledger to that unrelated save or claim every mode now supports midgame saves.

The Node recovery tests use the actual pure ledger and adapter with a controlled Player/transport boundary. They verify identity mapping, provenance, quiet restoration, stale rejection, missing-binding atomicity, mode save roundtrip, detached owners, hooks and reentrancy. They do not establish a real multi-process network roundtrip or complete browser replay.
