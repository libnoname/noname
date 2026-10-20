# Owned marks implementation plan

> Execute with executing-plans and test-driven-development. User approved implementation and waived further plan approval on 2026-10-19.

**Goal:** serializable, opt-in source relations; ordinary numeric/array/shared/self-resource marks remain compatible.
**Architecture:** pure OwnedMarkStore, Player facade, Game identity/sync/replay adapter, skill migration, selective release deployment.
**Tech stack:** ES modules, node:test, existing browser engine. No new production dependencies.
**Spec:** current user request and original audit report at baseline 3e72c4b.

## Global constraints

- Explicit owner, never inferred from event, seat, general or skill.
- storage[name] remains numeric/array; opted numeric marks project anonymous + owned quantities.
- Mutations commit synchronously before await/reward; stale effect revisions consume nothing.
- Network and replay use separate full-state messages with explicit identity maps. Legacy state has no guessed owner.
- Death, temporary out, skill loss, reset and permanent removal differ.
- Preserve original audit snapshot; development branch feat/owned-marks. Release deploy only selected reviewed deltas with backups.

## Review focus

1. Nested events must not duplicate consumed effects.
2. Legacy aggregate removal is deliberately aggregate; migrated skills exclusively consume owner-selected records.
3. Partial transfer splits IDs; full transfer preserves identity/parameters.
4. Restore identities before effects; late packets cannot rewind state.
5. Existing arrays/shared/resources and multi-provider globals retain behavior.

## Task 1 / batch A: store and Player facade

Files: element/ownedMarkStore.js, element/player.js, tests/owned-marks/store.test.mjs and player.test.mjs.
Produces: explicit add/remove/count/has/get/update/transfer/consume/clear/owners API; numeric projection and anonymous legacy bucket.
- [x] Write red tests for two owners, parameter instances, full/partial transfer, stale consumption, JSON validation, legacy coexistence and restore validation.
- [x] Run node --test tests/owned-marks/store.test.mjs (expect missing API).
- [x] Implement clone-before-commit, invariants, one revision per transaction; Player facade calls Game adapter.
- [x] Run tests and commit feat(core): add transactional owned mark ledger.

## Task 2 / batch B: identity, lifecycle and recovery

Files: game/ownedMarks.js, game/index.js, get/index.js, library/index.js, content.ts and Player hooks; recovery tests.
Consumes: store snapshot/grant/remove/transfer/update/lifecycle API.
- [x] Write red tests for session/revision recovery, lifecycle isolation and serialization.
- [x] Implement stable identity independent of playerid regeneration, replay/reconnect snapshots and explicit save-state APIs.
- [x] Verify no inferred legacy owner; run core tests and commit separately.

## Task 3 / batch C: skill migration

Files: extra/skill.js+translate, guozhan wushuang skill+translate, mobile/skill.js, newjiang/skill.js.
Consumes: explicit Player APIs.
- [x] Red tests: independent camps, bearer-source buffs, owner-only consumption, threshold/suit/disabled-skill separation, global雀 clearing.
- [x] Implement both camp variants, mbjiejian, yj_yanyu, drlt_duorui, yichong. Update text and migration catalog.
- [x] Run tests and expanded scan; separate reviewable commits.

## Task 4 / batch D: runtime and integration

- [x] Verify actual release entry paths; apply selected deltas, preserving local changes and backups.
- [x] Disposable browser profile tests with real Players/skills/queue. Separate transport simulation from actual online tests.
- [x] Syntax, runtime/source parity, all tests, scan coverage, independent review and RED/GREEN fixes.
- [x] Deliver API docs, commit SHAs, deployment manifest, testing results and unverified limits.

## Carried decisions

- Adopt owner-specific camps as explicitly requested; ordinary external camp expires, guozhan camp returns to owner.
- One bonus per effective owner present on bearer; no bonus from unrelated global holders, no quantity multiplication. Sequential collection never duplicates cards.
- Camp owner death/lost skill/reset removes that owner's effects; temporary out retains relations but ineffective owner gives no bonus.
- Old unidentified quantities are anonymous. No owner may claim them. Old APIs remain aggregate operations.
- Lexical scanning does not prove complete semantic safety; publish retained shared/resource marks and unresolved special cases.
