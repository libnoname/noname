const characterAppend = {
    mjs_pen_qihuangong: "尊王攘夷匡天下，首开霸业九合侯。",
    mjs_pen_guanzhong: "一箭之仇辅霸业，九合诸侯尊天王。",
    mjs_pen_baoshuya: "脱囚进贤真知己，让位高风铸霸基。",
    mjs_pen_wenjiang: "文采风流鲁道荡，兄妹殊途血溅车。",
    mjs_pen_yanying: "三朝高节力行俭，使楚舌战补衮功。",
    mjs_pen_zouji: "鼓琴讽谏琴瑟治，修法治平霸业兴。",
    mjs_pen_bianque: "望闻问切开脉祖，齐侯讳疾见毫光。",
    mjs_pen_tianji: "赛马筹谋显智略，荐贤走楚记桂陵。",
    mjs_pen_kuangzhang: "函谷垂沙震四方，百战威名动秦关。",
    mjs_pen_zouyan: "谈天推演阴阳理，五德终始论兴亡。",
    mjs_pen_tianrangju: "斩贾立威振三军，燕晋退师复疆土。",
};
function addStyleCenter(content) {
    let styleCenter = `<span style=\"font-family: huangcao\">“${content}”</span>`;
    return styleCenter;
}
Object.keys(characterAppend).forEach(key => characterAppend[key] = addStyleCenter(characterAppend[key]));
export default characterAppend;
