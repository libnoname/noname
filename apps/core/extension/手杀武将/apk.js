// APK members are real subdirectories of this extension, not extra menu entries.
import { normalizeCharacterMetadata } from "../_merge.js";

export const sources = [
    { name: "8月武将补充", key: "apk_august" },
    { name: "崔芙", key: "apk_cuifu" },
    { name: "还原武将", key: "apk_restored" },
    { name: "势魏延", key: "apk_shiweiyan", blocked: "依赖旧版 UI 与玩家方法，资源已收纳，暂不执行全局补丁" },
    { name: "新武将", key: "apk_new" },
    { name: "诸葛兔", key: "apk_rabbit" },
    { name: "手杀补全", key: "merged_completion" },
];

function addMissing(target, source, existing = {}) {
    for (const [key, value] of Object.entries(source || {})) {
        if (!(key in target) && !(key in existing)) target[key] = value;
    }
}

export function normalizeAssets(pack, name) {
    normalizeCharacterMetadata(pack);
    const path = `手杀武将/apk/${name}`;
    for (const [id, character] of Object.entries(pack.character?.character || {})) {
        if (Array.isArray(character)) {
            const tags = character[4] ||= [];
            // The source APK omits this portrait; reuse the existing same-character art.
            const portrait = name === "还原武将" && id === "newsb_liubei" ? "character:sb_liubei" : `ext:${path}/${id}.jpg`;
            if (!tags.some(s => /^(ext:|db:|character:|img:)/.test(s))) tags.push(portrait);
            if (!tags.some(s => s.startsWith("die:"))) tags.push(`die:ext:${path}/${id}.mp3`);
        } else {
            character.img ||= `extension/${path}/${id}.jpg`;
            character.dieAudios ||= [`ext:${path}/${id}.mp3`];
        }
    }
    const skills = skill => {
        if (typeof skill.audio === "number" || typeof skill.audio === "boolean") skill.audio = `ext:${path}:${Number(skill.audio)}`;
        for (const sub of Object.values(skill.subSkill || {})) skills(sub);
    };
    for (const section of [pack.character, pack.card, pack.skill]) {
        for (const skill of Object.values(section?.skill || {})) skills(skill);
    }
    for (const [id, card] of Object.entries(pack.card?.card || {})) {
        card.image ||= `ext:${path}/${id}.${card.fullskin ? "png" : "jpg"}`;
        if (card.audio === true) card.audio = `ext:${path}`;
    }
}

/** Additive only: the original pack and already-loaded core definitions win. */
export function appendPackage(target, incoming, name, key, lib) {
    normalizeAssets(incoming, name);
    for (const section of ["character", "card", "skill"]) {
        const dest = target[section] ||= {};
        for (const [field, dict] of Object.entries(incoming[section] || {})) {
            // Rebuild one outer character pack instead of retaining six old pack IDs.
            if (field === "characterSort" || field === "name") continue;
            if (Array.isArray(dict)) {
                const list = dest[field] ||= [];
                for (const entry of dict) if (!list.some(old => JSON.stringify(old) === JSON.stringify(entry))) list.push(entry);
            } else if (dict && typeof dict === "object") {
                addMissing(dest[field] ||= {}, dict, lib[field]);
            }
        }
    }
    const characters = Object.keys(incoming.character?.character || {}).filter(id => target.character.character?.[id] === incoming.character.character[id]);
    const sort = (target.character.characterSort ||= {})["手杀武将"] ||= {};
    sort[key] = characters;
    (target.character.translate ||= {})[key] = name;
}

export async function composeApk(base, args, load = name => import(`./apk/${name}/extension.js`)) {
    const [lib, game] = args;
    const originalContent = base.content;
    const originalPrecontent = base.precontent;
    const selected = [];
    const errors = [];
    const record = (name, phase, error) => {
        errors.push(new Error(`手杀武将/${name} ${phase}: ${error.message || error}`, { cause: error }));
        console.error(`手杀合并成员加载失败：${name} (${phase})`, error);
    };
    base.config ||= {};
    for (const item of sources) {
        if (item.blocked) {
            base.config[item.key] = { name: `${item.name}：已收纳，待兼容`, intro: item.blocked, clear: true, nopointer: true };
            continue;
        }
        const fullKey = `extension_手杀武将_${item.key}`;
        base.config[item.key] = { name: `APK 武将 · ${item.name}`, init: true, intro: "并入手杀武将；同名武将和技能沿用工程现有定义，重启生效。" };
        if ((lib.config[fullKey] ?? true) !== true) continue;
        try {
        const module = await load(item.name);
        const member = await module.default(...args);
        const options = { enable: true };
        for (const [key, option] of Object.entries(member.config || {})) {
            const newKey = `${item.key}_${key}`;
            const oldConfigKey = `extension_${item.name}_${key}`;
            const newConfigKey = `extension_手杀武将_${newKey}`;
            options[key] = lib.config[newConfigKey] ?? lib.config[oldConfigKey] ?? option.init;
            base.config[newKey] = {
                ...option, name: `${item.name} · ${option.name}`, init: options[key],
                onclick(value) {
                    game.saveConfig(newConfigKey, value);
                    game.saveConfig(oldConfigKey, value);
                },
            };
            // Legacy skill closures still read their original option name.
            lib.config[oldConfigKey] = options[key];
        }
        selected.push({ ...item, member, options });
        } catch (error) {
            record(item.name, "import", error);
        }
    }
    base.precontent = async function (config) {
        await originalPrecontent?.call(this, config);
        for (const item of selected) {
            try {
                await item.member.precontent?.call(item.member, item.options, item.member.package);
            } catch (error) {
                item.failed = true;
                record(item.name, "precontent", error);
            }
        }
    };
    base.content = async function (config, pack) {
        await originalContent?.call(this, config, pack);
        const originalIds = Object.keys(pack.character?.character || {});
        (pack.character.characterSort ||= {})["手杀武将"] ||= { apk_original: originalIds };
        (pack.character.translate ||= {}).apk_original = "原有手杀武将";
        for (const { member, options, name, key, failed } of selected) {
            if (failed) continue;
            try {
                await member.content?.call(member, options, member.package);
                appendPackage(pack, member.package, name, key, lib);
            } catch (error) {
                record(name, "content", error);
            }
        }
        if (errors.length) throw new AggregateError(errors, errors.map(error => error.message).join("\n"));
    };
    return base;
}
