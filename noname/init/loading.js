import "../../noname.js";
import { isClass } from "../util/index.js";
import { lib } from "../library/index.js";
import { get } from "../get/index.js";
import { _status } from "../status/index.js";
import { game } from "../game/index.js";
import { ui } from "../ui/index.js";
import { ai } from "../ai/index.js";
function loadCard(cardConfig) {
  const cardConfigName = cardConfig.name;
  lib.cardPack[cardConfigName] ??= [];
  if (cardConfig.card) {
    for (let [cardPackName, cardPack2] of Object.entries(cardConfig.card)) {
      if (!(!cardPack2.hidden && cardConfig.translate[`${cardPackName}_info`])) {
        continue;
      }
      lib.cardPack[cardConfigName].add(cardPackName);
    }
  }
  for (const [configName, configItem] of Object.entries(cardConfig)) {
    switch (configName) {
      case "name":
      case "mode":
      case "forbid":
        break;
      case "connect":
        lib.connectCardPack.push(cardConfigName);
        break;
      case "list":
        if (lib.config.mode === "connect") {
          lib.cardPackList[cardConfigName] ??= [];
          lib.cardPackList[cardConfigName].addArray(configItem);
        } else if (lib.config.cards.includes(cardConfigName)) {
          let pile = typeof configItem == "function" ? configItem() : configItem;
          lib.cardPile[cardConfigName] ??= [];
          lib.cardPile[cardConfigName].addArray(pile);
          if (lib.config.bannedpile[cardConfigName]) {
            pile = pile.filter((_value, index) => !lib.config.bannedpile[cardConfigName].includes(index));
          }
          if (lib.config.addedpile[cardConfigName]) {
            pile = [...pile, ...lib.config.addedpile[cardConfigName]];
          }
          lib.card.list.addArray(pile);
        }
        break;
      default:
        for (const [itemName, item] of Object.entries(configItem)) {
          if (configName === "skill" && itemName[0] === "_" && !item.forceLoad && (lib.config.mode !== "connect" ? !lib.config.cards.includes(cardConfigName) : !cardConfig.connect)) {
            continue;
          }
          if (configName === "translate" && itemName === cardConfigName) {
            lib[configName][`${itemName}_card_config`] = item;
          } else {
            if (lib[configName][itemName] == null) {
              if (configName === "skill" && !item.forceLoad && lib.config.mode === "connect" && !cardConfig.connect) {
                lib[configName][itemName] = {
                  nopop: item.nopop,
                  derivation: item.derivation
                };
              } else {
                Object.defineProperty(lib[configName], itemName, Object.getOwnPropertyDescriptor(configItem, itemName));
              }
            } else {
              console.log(`duplicated ${configName} in card ${cardConfigName}:
${itemName}:
lib.${configName}.${itemName}`, lib[configName][itemName], `
card.${cardConfigName}.${configName}.${itemName}`, item);
            }
            if (configName === "card" && lib[configName][itemName].derivation) {
              lib.cardPack.mode_derivation ??= [];
              lib.cardPack.mode_derivation.push(itemName);
            }
          }
        }
        break;
    }
  }
}
function loadCardPile() {
  if (lib.config.mode === "connect") {
    lib.cardPackList = {};
  } else {
    let pilecfg = lib.config.customcardpile[get.config("cardpilename") || "当前牌堆"];
    if (pilecfg) {
      lib.config.bannedpile = get.copy(pilecfg[0] || {});
      lib.config.addedpile = get.copy(pilecfg[1] || {});
    } else {
      lib.config.bannedpile = {};
      lib.config.addedpile = {};
    }
  }
}
function loadCharacter(character) {
  let name = character.name;
  if (character.character) {
    const characterPack = lib.characterPack[name];
    if (characterPack) {
      Object.assign(characterPack, character.character);
    } else {
      lib.characterPack[name] = character.character;
    }
  }
  for (let key in character) {
    let value = character[key];
    switch (key) {
      case "name":
      case "mode":
      case "forbid":
        break;
      case "connect":
        lib.connectCharacterPack.push(name);
        break;
      case "character":
        if (!lib.config.characters.includes(name) && lib.config.mode !== "connect") {
          if (lib.config.mode === "chess" && get.config("chess_mode") === "leader" && get.config("chess_leader_allcharacter")) {
            for (const charaName in value) {
              lib.hiddenCharacters.push(charaName);
            }
          } else if (lib.config.mode !== "boss" || name !== "boss") {
            break;
          }
        }
      // [falls through]
      default:
        if (Array.isArray(lib[key]) && Array.isArray(value)) {
          lib[key].addArray(value);
          break;
        }
        for (let key2 in value) {
          let value2 = value[key2];
          if (key === "character") {
            if (lib.config.forbidai_user && lib.config.forbidai_user.includes(key2)) {
              lib.config.forbidai.add(key2);
            }
            if (Array.isArray(value2)) {
              if (!value2[4]) {
                value2[4] = [];
              }
              if (value2[4].includes("boss") || value2[4].includes("hiddenboss")) {
                lib.config.forbidai.add(key2);
              }
              for (const skill of value2[3]) {
                lib.skilllist.add(skill);
              }
            } else {
              if (value2.isBoss || value2.isHiddenBoss) {
                lib.config.forbidai.add(key2);
              }
              if (value2.skills) {
                for (const skill of value2.skills) {
                  lib.skilllist.add(skill);
                }
              }
            }
          }
          if (key === "skill" && key2[0] === "_" && (lib.config.mode !== "connect" ? !lib.config.characters.includes(name) : !character.connect)) {
            continue;
          }
          if (key === "translate" && key2 === name) {
            lib[key][`${key2}_character_config`] = value2;
          } else {
            if (lib[key][key2] == null) {
              if (key === "skill" && !value2.forceLoad && lib.config.mode === "connect" && !character.connect) {
                lib[key][key2] = {
                  nopop: value2.nopop,
                  derivation: value2.derivation
                };
              } else if (key === "character") {
                lib.character[key2] = value2;
              } else {
                Object.defineProperty(lib[key], key2, Object.getOwnPropertyDescriptor(character[key], key2));
              }
              if (key === "card" && lib[key][key2].derivation) {
                if (!lib.cardPack.mode_derivation) {
                  lib.cardPack.mode_derivation = [key2];
                } else {
                  lib.cardPack.mode_derivation.push(key2);
                }
              }
            } else if (Array.isArray(lib[key][key2]) && Array.isArray(value2)) {
              lib[key][key2].addArray(value2);
            } else {
              console.log(`duplicated ${key} in character ${name}:
${key2}:
lib.${key}.${key2}`, lib[key][key2], `
character.${name}.${key}.${key2}`, value2);
            }
          }
        }
        break;
    }
  }
}
async function loadExtension(extension) {
  if (!extension[5] && lib.config.mode === "connect") {
    return;
  }
  try {
    _status.extension = extension[0];
    _status.evaluatingExtension = extension[3];
    if (typeof extension[1] == "function") {
      try {
        await extension[1].call(extension, extension[2], extension[4]);
      } catch (e) {
        console.log(`加载《${extension[0]}》扩展的content时出现错误。`, e);
        if (!lib.config.ignore_error) {
          alert(`加载《${extension[0]}》扩展的content时出现错误。
该错误本身可能并不影响扩展运行。您可以在“设置→通用→无视扩展报错”中关闭此弹窗。
错误信息: 
${e instanceof Error ? e.stack : String(e)}`);
        }
      }
    }
    if (extension[6]) {
      if (isClass(extension[6])) {
        const classInstance = new extension[6]();
        const proto = Object.getPrototypeOf(classInstance);
        const methods = Object.getOwnPropertyNames(proto).filter((methodName) => typeof proto[methodName] === "function" && methodName !== "constructor");
        methods.forEach((methodName) => {
          lib.arenaReady?.push(proto[methodName].bind(classInstance));
        });
      } else {
        lib.arenaReady?.push(extension[6]);
      }
    }
    if (extension[4] && !extension[4].nopack) {
      if (typeof extension[4].character?.character == "object" && Object.keys(extension[4].character.character).length > 0) {
        const content = { ...extension[4].character };
        content.name = extension[0];
        content.translate ??= {};
        content.translate[content.name] ??= extension[0];
        if (content.mode === "guozhan") {
          lib.characterGuozhanFilter.add(content.name);
        }
        for (const [charaName, character] of Object.entries(content.character)) {
          if (lib.config.forbidai_user && lib.config.forbidai_user.includes(charaName)) {
            lib.config.forbidai.add(charaName);
          }
          if (Array.isArray(character)) {
            if (!character[4]) {
              character[4] = [];
            }
            if (!character[4].some((str) => typeof str == "string" && /^(?:db:extension-.+?|ext|img|character):.+/.test(str))) {
              const img = extension[3] ? `db:extension-${extension[0]}:${charaName}.jpg` : `ext:${extension[0]}/${charaName}.jpg`;
              character[4].add(img);
            }
            if (!character[4].some((str) => typeof str == "string" && /^die:.+/.test(str))) {
              const audio = `die:ext:${extension[0]}/${charaName}.mp3`;
              character[4].add(audio);
            }
            if (character[4].includes("boss") || character[4].includes("hiddenboss")) {
              lib.config.forbidai.add(charaName);
            }
            for (const skill of character[3]) {
              lib.skilllist.add(skill);
            }
          } else {
            if (!character.img) {
              const characterImage = `extension/${extension[0]}/${charaName}.jpg`;
              character.img = characterImage;
            }
            if (!character.dieAudios) {
              character.dieAudios = [];
              const characterDieAudio = `ext:${extension[0]}/${charaName}.mp3`;
              character.dieAudios.push(characterDieAudio);
            }
            if (character.isBoss || character.isHiddenBoss) {
              lib.config.forbidai.add(charaName);
            }
            if (character.skills) {
              for (const skill of character.skills) {
                lib.skilllist.add(skill);
              }
            }
          }
        }
        if (typeof content.skill == "object") {
          for (const skillInfo of Object.values(content.skill)) {
            extSkillInject(extension[0], skillInfo);
          }
        }
        if (lib.imported.character) {
          lib.imported.character[extension[0]] = content;
        }
        if (!lib.config[`@Experimental.extension.${extension[0]}.character`]) {
          game.saveConfig(`@Experimental.extension.${extension[0]}.character`, true);
          lib.config.characters.add(extension[0]);
          await game.promises.saveConfigValue("characters");
        }
        loadCharacter(content);
      }
      if (typeof extension[4].card?.card == "object" && Object.keys(extension[4].card.card).length > 0) {
        const content = { ...extension[4].card };
        content.name = extension[0];
        content.translate ??= {};
        content.translate[content.name] ??= extension[0];
        for (const [cardName, card] of Object.entries(content.card)) {
          if (card.audio === true) {
            card.audio = `ext:${extension[0]}`;
          }
          if (!card.image) {
            if (card.fullskin || card.fullimage) {
              const suffix = card.fullskin ? "png" : "jpg";
              if (extension[3]) {
                card.image = `db:extension-${extension[0]}:${cardName}.${suffix}`;
              } else {
                card.image = `ext:${extension[0]}/${cardName}.${suffix}`;
              }
            }
          }
        }
        if (typeof content.skill == "object") {
          for (const skillInfo of Object.values(content.skill)) {
            extSkillInject(extension[0], skillInfo);
          }
        }
        if (lib.imported.card) {
          lib.imported.card[extension[0]] = content;
        }
        if (!lib.config[`@Experimental.extension.${extension[0]}.card`]) {
          game.saveConfig(`@Experimental.extension.${extension[0]}.card`, true);
          lib.config.cards.add(extension[0]);
          await game.promises.saveConfigValue("cards");
        }
        loadCard(content);
      }
      if (typeof extension[4].skill?.skill == "object" && Object.keys(extension[4].skill.skill).length > 0) {
        for (const [skillName, skillInfo] of Object.entries(extension[4].skill.skill)) {
          if (lib.skill[skillName]) {
            console.log(`duplicated skill in extension ${extension[0]}:
${skillName}:
lib.skill.${skillName}`, lib.skill[skillName], `
extension.${extension[0]}.skill.skill.${skillName}`, skillInfo);
            continue;
          }
          extSkillInject(extension[0], skillInfo);
          lib.skill[skillName] = skillInfo;
        }
        if (typeof extension[4].skill.translate == "object") {
          for (const [transName, translate] of Object.entries(extension[4].skill.translate)) {
            if (lib.translate[transName]) {
              console.log(`duplicated translate in extension ${extension[0]}:
${transName}:
lib.translate.${transName}`, lib.translate[transName], `
extension.${extension[0]}.skill.translate.${transName}`, translate);
              continue;
            }
            lib.translate[transName] = translate;
          }
        }
      }
    }
    delete _status.extension;
    delete _status.evaluatingExtension;
  } catch (e) {
    console.error(e);
  }
}
function loadMode(mode) {
  mixinLibrary(mode, lib);
  mixinGeneral(mode, "game", game);
  mixinGeneral(mode, "ui", ui);
  mixinGeneral(mode, "get", get);
  mixinGeneral(mode, "ai", ai);
  ["onwash", "onover"].forEach((name) => {
    if (game[name]) {
      lib[name]?.push(game[name]);
      delete game[name];
    }
  });
  if (typeof mode.init == "function") {
    mode.init();
  }
}
function loadPlay(playConfig) {
  const i = playConfig.name;
  if (lib.config.hiddenPlayPack.includes(i)) {
    return;
  }
  if (playConfig.forbid && playConfig.forbid.includes(lib.config.mode)) {
    return;
  }
  if (playConfig.mode && !playConfig.mode.includes(lib.config.mode)) {
    return;
  }
  lib.element = mixinElement(playConfig, lib.element);
  mixinGeneral(playConfig, "game", game);
  mixinGeneral(playConfig, "ui", ui);
  mixinGeneral(playConfig, "get", get);
  for (const [configName, configItem] of Object.entries(playConfig)) {
    switch (configName) {
      case "name":
      case "mode":
      case "forbid":
      case "init":
      case "element":
      case "game":
      case "get":
      case "ui":
      case "arenaReady":
        break;
      default:
        for (const [itemName, item] of Object.entries(configItem)) {
          if (configName !== "translate" || itemName !== i) {
            if (lib[configName][itemName] != null) {
              console.log(`duplicated ${configName} in play ${i}:
${itemName}:
lib.${configName}.${itemName}`, lib[configName][itemName], `
play.${i}.${configName}.${itemName}`, item);
            }
            lib[configName][itemName] = item;
          }
        }
        break;
    }
  }
  if (typeof playConfig.init == "function") {
    playConfig.init();
  }
  if (typeof playConfig.arenaReady == "function") {
    lib.arenaReady?.push(playConfig.arenaReady);
  }
}
function extSkillInject(extName, skillInfo) {
  if (typeof skillInfo.audio == "number" || typeof skillInfo.audio == "boolean") {
    skillInfo.audio = `ext:${extName}:${Number(skillInfo.audio)}`;
  }
}
function mixinGeneral(config, name, where) {
  if (!config[name]) {
    return;
  }
  for (let [key, value] of Object.entries(config[name])) {
    if (["ui", "ai"].includes(name)) {
      if (typeof value == "object") {
        if (where[key] == void 0) {
          where[key] = {};
        }
        for (let [key2, value2] of Object.entries(value)) {
          where[key][key2] = value2;
        }
      } else {
        where[key] = value;
      }
    } else {
      where[key] = value;
    }
  }
}
function mixinLibrary(config, lib2) {
  const KeptWords = ["name", "element", "game", "ai", "ui", "get", "config", "onreinit", "start", "startBefore"];
  lib2.element = mixinElement(config, lib2.element);
  lib2.config.banned = lib2.config[`${lib2.config.mode}_banned`] || [];
  lib2.config.bannedcards = lib2.config[`${lib2.config.mode}_bannedcards`] || [];
  lib2.rank = window.noname_character_rank;
  delete window.noname_character_rank;
  Object.keys(window.noname_character_replace).forEach((i) => lib2.characterReplace[i] = window.noname_character_replace[i]);
  delete window.noname_character_replace;
  Object.keys(window.noname_character_perfectPairs).forEach((i) => lib2.perfectPair[i] = window.noname_character_perfectPairs[i]);
  delete window.noname_character_perfectPairs;
  for (let name in config) {
    if (KeptWords.includes(name)) {
      continue;
    }
    if (lib2[name] == null) {
      lib2[name] = Array.isArray(config[name]) ? [] : {};
    }
    Object.assign(lib2[name], config[name]);
  }
}
function mixinElement(config, element) {
  let newElement = { ...element };
  if (config.element) {
    for (let name in config.element) {
      if (!newElement[name]) {
        newElement[name] = [];
      }
      let source = config.element[name];
      let target = newElement[name];
      for (let key in source) {
        if (key === "init") {
          if (!target.inits) {
            target.inits = [];
          }
          target.inits.push(source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }
  return newElement;
}
export {
  loadCard,
  loadCardPile,
  loadCharacter,
  loadExtension,
  loadMode,
  loadPlay
};
