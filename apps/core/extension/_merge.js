/** Runtime composer for physically consolidated extensions. Existing definitions win. */
function addMissing(target, source, existing = {}) {
    for (const [key, value] of Object.entries(source || {})) {
        if (!(key in target) && !(key in existing)) target[key] = value;
    }
}

export function normalizeCharacterMetadata(pack) {
    const character = pack.character;
    if (!character?.characterPrefix) return;
    character.translate ||= {};
    for (const [id, prefix] of Object.entries(character.characterPrefix)) {
        character.translate[`${id}_prefix`] ??= prefix;
    }
    // This engine reads prefixes from translations, not lib.characterPrefix.
    delete character.characterPrefix;
}

function normalizeAssets(pack, targetName, sourceName) {
    normalizeCharacterMetadata(pack);
    const base = `${targetName}/members/${sourceName}`;
    for (const [id, character] of Object.entries(pack.character?.character || {})) {
        if (Array.isArray(character)) {
            const tags = character[4] ||= [];
            if (!tags.some(value => typeof value === "string" && /^(?:ext:|db:|character:|img:)/.test(value))) tags.push(`ext:${base}/${id}.jpg`);
            if (!tags.some(value => typeof value === "string" && value.startsWith("die:"))) tags.push(`die:ext:${base}/${id}.mp3`);
        } else if (character && typeof character === "object") {
            character.img ||= `extension/${base}/${id}.jpg`;
            character.dieAudios ||= [`ext:${base}/${id}.mp3`];
        }
    }
    const normalizeSkill = skill => {
        if (!skill || typeof skill !== "object") return;
        if (typeof skill.audio === "number" || typeof skill.audio === "boolean") skill.audio = `ext:${base}:${Number(skill.audio)}`;
        for (const subSkill of Object.values(skill.subSkill || {})) normalizeSkill(subSkill);
    };
    for (const section of [pack.character, pack.card, pack.skill]) {
        for (const skill of Object.values(section?.skill || {})) normalizeSkill(skill);
    }
}

function appendPackage(target, incoming, targetName, sourceName, lib) {
    normalizeAssets(incoming, targetName, sourceName);
    for (const sectionName of ["character", "card", "skill"]) {
        const destination = target[sectionName] ||= {};
        const source = incoming[sectionName] || {};
        for (const [field, dictionary] of Object.entries(source)) {
            if (["characterSort", "name"].includes(field)) continue;
            if (Array.isArray(dictionary)) {
                const list = destination[field] ||= [];
                for (const entry of dictionary) if (!list.some(previous => JSON.stringify(previous) === JSON.stringify(entry))) list.push(entry);
            } else if (dictionary && typeof dictionary === "object") {
                addMissing(destination[field] ||= {}, dictionary, lib[field]);
            }
        }
    }
    const characters = Object.keys(incoming.character?.character || {}).filter(id => target.character.character?.[id] === incoming.character.character[id]);
    const sort = (target.character.characterSort ||= {})[targetName] ||= {};
    const group = `merged_${sourceName.replace(/[^\p{L}\p{N}_]+/gu, "_")}`;
    sort[group] = characters;
    (target.character.translate ||= {})[group] = sourceName;
}

export async function createMergedExtension(targetName, memberNames, args, baseUrl, load = sourceName => import(new URL(`./members/${sourceName}/extension.js`, baseUrl).href)) {
    const [lib, game] = args;
    const loaded = [];
    const config = {};
    const errors = [];
    function record(sourceName, phase, error) {
        errors.push(new Error(`${targetName}/${sourceName} ${phase}: ${error.message || error}`, { cause: error }));
        console.error(`合并成员加载失败：${targetName}/${sourceName} (${phase})`, error);
    }
    for (const [index, sourceName] of memberNames.entries()) {
        try {
        const module = await load(sourceName);
        const member = typeof module.default === "function" ? await module.default(...args) : module.default;
        const options = { enable: true };
        for (const [key, option] of Object.entries(member.config || {})) {
            const mergedKey = `member_${index}_${key}`;
            const newConfigKey = `extension_${targetName}_${mergedKey}`;
            const oldConfigKey = `extension_${sourceName}_${key}`;
            options[key] = lib.config[newConfigKey] ?? lib.config[oldConfigKey] ?? option.init;
            lib.config[oldConfigKey] = options[key];
            config[mergedKey] = {
                ...option,
                name: `${sourceName} · ${option.name}`,
                init: options[key],
                onclick(value) {
                    game.saveConfig(newConfigKey, value);
                    game.saveConfig(oldConfigKey, value);
                    option.onclick?.call(this, value);
                },
            };
        }
        loaded.push({ sourceName, member, options });
        } catch (error) {
            record(sourceName, "import", error);
        }
    }
    const packageData = {
        character: { character: {}, characterSort: { [targetName]: {} }, translate: { [targetName]: targetName } },
        card: { card: {}, translate: {}, list: [] },
        skill: { skill: {}, translate: {} },
        intro: `实体合并包：${memberNames.join("、")}`,
        author: "PXLNGU",
        version: "1",
    };
    return {
        name: targetName,
        editable: false,
        config,
        help: {},
        async precontent() {
            for (const item of loaded) {
                try {
                    await item.member.precontent?.call(item.member, item.options, item.member.package);
                } catch (error) {
                    item.failed = true;
                    record(item.sourceName, "precontent", error);
                }
            }
        },
        async content(_config, pack) {
            for (const { sourceName, member, options, failed } of loaded) {
                if (failed) continue; // Do not run content after a failed initialization.
                try {
                    await member.content?.call(member, options, member.package);
                    appendPackage(pack, member.package || {}, targetName, sourceName, lib);
                } catch (error) {
                    record(sourceName, "content", error);
                }
            }
            // Report after healthy siblings have registered, not instead of registering them.
            if (errors.length) throw new AggregateError(errors, errors.map(error => error.message).join("\n"));
        },
        package: packageData,
        files: { character: [], card: [], skill: [] },
    };
}
