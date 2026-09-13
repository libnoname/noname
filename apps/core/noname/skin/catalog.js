// Cosmetic artwork already shipped with core. No runtime reference to source archives.
export const skinCatalog = Object.fromEntries(["caocao", "guanyu", "zhaoyun", "diaochan", "sunshangxiang", "zhouyu", "daqiao", "zhugeliang"].map(id => [id, [{ name: "界限突破", path: `image/character/re_${id}.jpg`, source: "本体立绘" }]]));
skinCatalog.hlhj_daiyu = [
    { name: "潇湘竹影", path: "image/hlhj/theme/daiyu-bamboo.png", source: "红楼幻境" },
    { name: "绛珠归梦", path: "image/hlhj/theme/daiyu-dream.png", source: "红楼幻境" },
];
