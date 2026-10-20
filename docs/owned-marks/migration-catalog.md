# Owned mark migration catalog

Baseline: upstream `3e72c4b7980050c3b7d58adc53d232b64bb00791`. This catalog records deliberate semantic choices, not a claim that every mark in the repository needs an owner. The audit source and exact baseline line evidence remain in `audit/mark-ownership-2026-10-19/sweep-notes.md` outside this development checkout.

## Migrated relationships

- **mbjiejian / 节谏** (`character/mobile/skill.js`): `mbjiejian_mark` owns one relation per giver and bearer. Quantity is 1; `params.hpAtGrant` is the giver's latest grant-time HP threshold. Repeated gifts by one giver update that relation; other givers retain their thresholds. All owned relations can provide the shared protection status. At the bearer's turn end each giver consumes only its own records synchronously, before drawing, and gets at most one reward. Anonymous old numeric marks cannot identify a giver and do not reward anyone. The mark UI lists each source's threshold instead of treating a numeric count as HP. Death of owner/bearer, original skill removal and reset remove the relation.
- **yj_yanyu / 焰狱** (`character/newjiang/skill.js`): new stable key `yj_yanyu_effect`, one application instance per source and affected bearer, `params.suits` contains JSON suit names. `yj_yanyu_fire` derives conversion from all records' suit union. `yj_yanyu_use` checks only the acting owner's suit records; several matching instances still create only one trigger/reward per use of a card. New writes never maintain a second source-object array. Old `storage.yj_yanyu_fire` arrays remain anonymous conversion-only compatibility data; old `yj_yanyu_source` arrays never imply ownership or a reward. Source/bearer death and original skill loss retain the permanent conversion, matching the original text's lack of an expiry; absent sources cannot receive the trigger. Reset removes new relations. Permanent removal remains subject to the core ledger's removal policy.
- **drlt_jieying / 劫营**, **gz_gn_jieying / 国战劫营**: each owner can independently create one camp. Multiple owners may mark the same bearer. Transfer preserves provenance; a bearer receives one bonus per effective owner, regardless of that owner's quantity or unrelated global holders. Ordinary collection consumes the owner's external camp before the card transfer; guozhan returns that camp to its owner before the transfer. Self-owned camps never collect their own hand. Source death, skill removal, reset and bearer death remove the corresponding camp; temporary absence retains the relation but suspends bonuses. Both migrations intentionally adopt the user-requested owner-specific rule; the original camp text described shared global state, so this is an approved rule change rather than evidence that every shared mark is defective.
- **drlt_duorui / 夺锐**: `drlt_duorui_effect` stores `params.skills`; each effect ID is a distinct disable reason and AdditionalSkill provider. Removing or expiring one effect restores only its own disabled skills and borrowed-skill provider. The effect hook reconstructs these derived relationships during recovery without reward events. The original array storage is not replaced with an owner object.

## Cleanup fix with shared semantics retained

- **yichong / 易宠** (`character/mobile/skill.js`): the rule explicitly removes **all** 雀 when any owner activates the skill. `clearMarks()` enumerates actual player skills on living, dead and temporarily out players and removes only generated 雀 marks of this skill family. New dynamic definitions advertise `sourceSkill: "yichong"`; old definitions are recognized by their existing dynamic prefix + mark + 雀 metadata. It preserves `yichong`, gain/clear helpers and unrelated skills. The new target's source-specific dynamic mark is then added normally. Expiry still removes only the expiring owner's own dynamic mark.

## Deliberately retained shared marks (B)

- **new_wuhun**, **twwuhun**, **tywuhun**: rule text selects the most 梦魇 on a character, without attributing individual counters to a source. New武魂 was read through write and death selection; variants are search candidates, not fully retested here.
- **zongkui / guju / baijia / bmcanshi**: shared 傀 status; targeting and consumption explicitly use characters with or without 傀.
- **yingba / scfuhai / pinghe**: shared 平定 status; distance, response restriction and death benefits read the shared count.
- **xinfu_xionghuo**: 暴戾 is a self resource and a shared target status. Its derived “cannot use 杀 against this source” effect already uses a source-player list, so converting the whole family into private counters would change rules.
- **jsrgzhenglve / jsrghuilie / jsrgpingrong**: shared 猎 pool also controls awakening and extra-turn consumption.
- **dcjizhong / dcrihui / dcguangshi**: 信众 is a public status used by all three skills.
- **equan**: text explicitly consumes all 毒, while the derived dying blocker checks the original event/source separately.
- **tongqu**, **jianjie**, **sbliuli**: search results describe public 渠, 龙凤印 or globally replaced 流离 statuses. They were not migrated; their full lifecycle combinations remain outside this patch.

## Existing ownership kept as positive controls

- **dawu / kuangfeng / gz_dawu**: source lists plus per-source AdditionalSkill keys; source membership gates effects, and expiry removes only the expiring source, including off-field players. These are already source-aware in this upstream version.
- **suizheng**: retains a source list, processes each valid source and clears all contributions at the shared bearer-next-turn expiry. A shared expiry is not by itself a cross-owner cleanup bug.
- **shefujing**: writes the granting player to the target; rejects an already marked target and resolves the stored source for benefits.
- **mbpanxiang**: giver+target history and dynamic per-player key are already separate; no migration justified by this scan.
- **twxianyuan**: source-keyed gaintag plus `storage.twxianyuan_effect[player.playerid]` separates source-specific card count. Since these are physical card tags, it is not a suitable candidate for blindly replacing storage with numeric owned marks.

## Unresolved or queued review (E, not migrated)

- **dcshengdu / dcjieling**: shared 生妒 count followed by a “you draw” reward may be order-sensitive when several copies exist. Text does not specify the placing source; decide rules before adding ownership. Check actual trigger queue revalidation separately.
- **yijiao**: rejects already marked targets, then globally consumes 异 and rewards “you”. Multi-holder semantics are not fully specified; it is not proven equivalent to the giver-specific HP record in 节谏.
- **sbxuanhuo / jdsbxuanhuo**: uses a shared target mark alongside per-source historical gain limits; determine what should be shared before migration. Do not change from a regex hit alone.
- **yujue / twyujue**: dynamic source keys coexist with numeric use limits. Need full mark/skill-removal and card-transfer lifecycle tracing; not changed here.
- **maihuo**, **mjweipo**, **zuoxing**: store one source/target object; inspect target exclusivity and repeated application before declaring overwrite defects.
- **dcsilve**: source list for UI and source-owned target lists for effects exist; permanent-skill-removal cleanup and revival are still review candidates.

## Self state and exclusions

军略/忍/暴怒 and similar resources already belong to their bearer. 缠怨 is a bearer's persistent blocker; 断肠 uses the death event source directly and has no deferred target mark. None needs a source identity merely because it has a skill icon or uses `storage`.

Third-party extensions, local release modifications not present in the pinned upstream snapshot and plugin data were excluded and are not silently migrated. Loaded release bundles were selectively updated and browser-tested separately. TypeScript skills are included in the final lexical inventory, but physical expansion cards, all gaintag interactions, inserted-turn corner cases and full multiplayer lobby flows are not fully validated.

## Expanded scan performed

458 JavaScript source files: `character` 365, `card` 10, `mode` 83. Original six-pattern audit matched 123 files. An implementation-time expanded scan also included `unmarkAuto`, AdditionalSkill add/remove, source/target storage assignments, dynamic id removals and cross-player writes:

```text
rg -n --glob '*.js' '(addMark|hasMark|countMark|markAuto|unmarkAuto|addAdditionalSkill|removeAdditionalSkill)\(|\b(storage|playerid)\b' apps/core/character apps/core/card apps/core/mode
rg -n --glob '*.js' '(target|current|trigger\.player)\.(addMark|markAuto)|storage.*playerid|storage\.[a-zA-Z0-9_]+\s*=\s*player|removeSkill\(.*playerid' apps/core/character apps/core/card apps/core/mode
```

At the relations migration checkpoint: expanded matching lines were character 9,978, card 144, mode 1,284; cross-player/source candidate lines were 387, 4, 27 respectively. Counts are lexical line counts, not independent findings or a completeness proof; concurrent batch edits may change them. The semantic decisions above distinguish confirmed relationships, intentional sharing, already-owned controls, anonymous legacy data and unresolved cases.

## Relation tests

`node --test tests/owned-marks/relations.test.mjs`: writes and consumers are the actual skill literals; the Player facade and ledger are production code through `player-fixture.mjs`. UI dialogs/card animation are replaced at the IO boundary. Initial seven regression tests were observed RED against the original skills and GREEN after migration; anonymous 焰狱 conversion compatibility adds another regression. This is function-level integration, not a browser engine, scheduler, real network or replay test.
