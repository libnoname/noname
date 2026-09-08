import { lib } from "noname";

const characters = {
    mjs_new_zhongjun: {
        sex: "male",
        hp: 4,
        group: "xihan",
        skills: ["mjsqiru", "mjsnewqingying"],
        trashBin: ["epic"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_weijie: {
        sex: "male",
        hp: 3,
        group: "xijin",
        skills: ["mjsnewfengshenxiuyi", "mjszhuyuzaice", "mjssimengchengji"],
        trashBin: ["junk"],
        maxHandcardBase: 6,
        dieAudios: [],
    },
    mjs_new_wangyuanji: {
        sex: "female",
        hp: 4,
        group: "xijin",
        skills: ["mjsnewzhujianyishi", "mjsqianchongjiexia", "mjsgongzhifangji"],
        trashBin: ["legend"],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_new_xusheng: {
        sex: "male",
        hp: 6,
        group: "wu",
        skills: ["mjsruxupojun", "mjsnewbailiyicheng"],
        trashBin: ["junk"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_new_chengong: {
        sex: "male",
        hp: 4,
        group: "donghan",
        skills: ["mjsnewqiguantouyi", "mjscezhimingyi"],
        trashBin: ["rare"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_chengong: {
        sex: "male",
        hp: 4,
        group: "donghan",
        skills: ["mjsnewqiguantouyi", "mjscezhimingyi"],
        trashBin: ["rare"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_pangtong: {
        sex: "male",
        hp: 3,
        group: "shu",
        skills: ["mjstiesuolianzhou", "mjsnewrushusance", "mjsyuzhanjizu"],
        trashBin: ["legend"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_gongsunzan: {
        sex: "male",
        hp: 6,
        group: "donghan",
        skills: ["mjsnewbaimayicong", "mjszhujingzigu"],
        trashBin: ["junk"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_new_lingtong: {
        sex: "male",
        hp: 6,
        group: "wu",
        skills: ["mjsnewzongmatidao", "mjsyuxuefenwei"],
        trashBin: ["junk"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_new_xiangyan: {
        sex: "male",
        hp: 6,
        group: "chu",
        skills: ["mjspoqinfengrui", "mjsnewchusuisaihu"],
        trashBin: ["epic"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_new_lumochou: {
        sex: "female",
        hp: 4,
        group: "chu",
        skills: ["mjsnewyangchunbaixue", "mjsnewqingyinwangyou"],
        trashBin: ["rare"],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_new_hanxin: {
        sex: "male",
        hp: 5,
        group: "xihan",
        skills: ["mjsshimianmaifu", "mjsnewbeishuiyizhan", "mjsdengtanbaijiang"],
        trashBin: ["legend"],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_new_lisi: {
        sex: "male",
        hp: 4,
        group: "daqin",
        skills: ["mjsnewfanshumingfa", "mjsjianzhizhuke"],
        trashBin: ["epic"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_baiqi: {
        sex: "male",
        hp: 6,
        group: "daqin",
        skills: ["mjsliaodihebian", "mjsnewchuqiwuqiong", "mjsjianmie"],
        trashBin: ["legend"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_new_yingzheng: {
        sex: "male",
        hp: 5,
        group: "daqin",
        skills: ["mjsnewyitongliuhe", "mjsqinnuqishe", "mjswanlichangcheng"],
        trashBin: ["legend"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_wangjian: {
        sex: "male",
        hp: 6,
        group: "daqin",
        skills: ["mjshengsaosanjin", "mjsnewqingtian", "mjschiduancunchang"],
        trashBin: ["legend"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_new_gaojianli: {
        sex: "male",
        hp: 4,
        group: "yan",
        skills: ["mjsnewjizhuerge", "mjsnewbianzhizhisheng", "mjszhuangshiquxi"],
        trashBin: ["rare"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_junwanghou: {
        sex: "female",
        hp: 5,
        group: "qi",
        skills: ["mjshuiyanshilang", "mjsoldshiqinjinshen", "mjsoldqiaojieyuhuan"],
        trashBin: ["rare"],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_new_hanfei: {
        sex: "male",
        hp: 4,
        group: "han",
        skills: ["mjsfabuagui", "mjsshiyibeibian", "mjsnewbuqixiugu"],
        trashBin: ["epic"],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_new_chenajiao: {
        sex: "female",
        hp: 4,
        group: "xihan",
        skills: ["mjsnewjinwucangjiao", "mjsqianjinmaifu"],
        trashBin: ["rare"],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_new_zhoubo: {
        sex: "male",
        hp: 6,
        group: "xihan",
        skills: ["mjsxiaozouwange", "mjsnewxuepingzhulv"],
        trashBin: ["rare"],
        maxHandcardBase: 3,
        dieAudios: [],
    },
};

for (let i in characters) {
    const name = `mjs${i.slice("mjs_new".length)}`;
    characters[i].trashBin.push(`ext:名将杀/image/character/${lib.config.extension_名将杀_outcrop}/${name}.jpg`);
    characters[i].dieAudios.addArray([`ext:名将杀/audio/die/${name}.mp3`, `ext:名将杀/audio/die/${name}2.mp3`]);
    if (lib.characterReplace) {
        if (!lib.characterReplace[name]) {
            lib.characterReplace[name] = [name, i];
        } else {
            lib.characterReplace[name].push(i);
        }
    }
}

const characters2 = {
    
};

for (let i in characters2) {
    characters2[i].trashBin.push(`ext:名将杀/image/character/full/${i}.jpg`);
}

Object.assign(characters, characters2);

const characters3 = {
    
}

for (let i in characters3) {
    const name = `mjs_${i.slice(8)}`;
    characters3[i].trashBin.push(`ext:名将杀/image/character/${lib.config.extension_名将杀_outcrop}/${name}.jpg`);
    characters3[i].dieAudios.push(name);
    if (lib.characterReplace) {
        if (!lib.characterReplace[name]) {
            lib.characterReplace[name] = [name, i];
        } else {
            lib.characterReplace[name].push(i);
        }
    }
}

Object.assign(characters, characters3);

const characters4 = {
    mjs_pen_qihuangong: {
        sex: "male",
        hp: 5,
        group: "qi",
        skills: ["mjs_penshigoubaixiang", "mjs_penzunwangrangyi", "mjs_penjiuhezhuhou"],
        trashBin: [],
        maxHandcardBase: 4,
        dieAudios: [],
        names: "姜|小白",
    },
    mjs_pen_guanzhong: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penyikuangtianxia", "mjs_pentonghuojicai"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_pen_baoshuya: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penfenjinrangli", "mjs_penjianxianziyi"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_pen_wenjiang: {
        sex: "female",
        hp: 4,
        group: "qi",
        skills: ["mjs_penyounvtongche", "mjs_penludaoyoudang"],
        trashBin: [],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_pen_yanying: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penjuyuweizhi", "mjs_penertaoshasanshi"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_pen_zouji: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penchaofukuijing", "mjs_penmentingnajian"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_pen_bianque: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penwangwenwenqie", "mjs_penhuanxinyixue"],
        trashBin: [],
        maxHandcardBase: 4,
        dieAudios: [],
    },
    mjs_pen_tianji: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penchisizhengxian", "mjs_penweiweijiuzhao"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_pen_kuangzhang: {
        sex: "male",
        hp: 6,
        group: "qi",
        skills: ["mjs_penbianzhihunqin", "mjs_penqiaofuwendu", "mjs_penhuangupoguan"],
        trashBin: [],
        maxHandcardBase: 3,
        dieAudios: [],
    },
    mjs_pen_zouyan: {
        sex: "male",
        hp: 4,
        group: "qi",
        skills: ["mjs_penwudeshizhong", "mjs_pendajiuzhoushuo", "mjs_penchuilvshengnuan"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_pen_tianrangju: {
        sex: "male",
        hp: 6,
        group: "qi",
        skills: ["mjs_penzhanjialiwei", "mjs_penfuxunshizu"],
        trashBin: [],
        maxHandcardBase: 3,
        dieAudios: [],
    },
};

for (const i in characters4) {
    characters4[i].isHiddenBoss = true;
}
Object.assign(characters, characters4);

const characters5 = {
    mjs_10170_shangyang: {
        sex: "male",
        hp: 4,
        group: "daqin",
        skills: ["mjs1017001", "mjs1017002"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10240_shangyang: {
        sex: "male",
        hp: 4,
        group: "daqin",
        skills: ["mjs1024001", "mjs1024002"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10389_shangyang: {
        sex: "male",
        hp: 4,
        group: "daqin",
        skills: ["mjs1038901", "mjs1038902"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10514_shangyang: {
        sex: "male",
        hp: 4,
        group: "daqin",
        skills: ["mjs1051401", "mjs1051402"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10604_shangyang: {
        sex: "male",
        hp: 4,
        group: "daqin",
        skills: ["mjs1060401", "mjs1060402"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10381_mozi: {
        sex: "male",
        hp: 4,
        group: "song",
        skills: ["mjs1038101", "mjs1038102"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10601_mozi: {
        sex: "male",
        hp: 4,
        group: "song",
        skills: ["mjs1060101", "mjs1060102", "mjs1060103"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10627_mozi: {
        sex: "male",
        hp: 4,
        group: "song",
        skills: ["mjs1062701", "mjs1062702"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10700_mozi: {
        sex: "male",
        hp: 4,
        group: "song",
        skills: ["mjs1070001", "mjs1070002"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
    mjs_10726_mozi: {
        sex: "male",
        hp: 4,
        group: "song",
        skills: ["mjs1072601", "mjs1072602"],
        trashBin: [],
        maxHandcardBase: 5,
        dieAudios: [],
    },
};

for (const i in characters5) {
    characters5[i].isHiddenBoss = true;
}
Object.assign(characters, characters5);

export default characters;
