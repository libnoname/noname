import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"诸神之战",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "黑暗支配者加坦杰厄":["none","shen",10,["asyouzhang","huituo","bolang","erda3","xiyong","hongxi","AM_chaoxi","hhudun","boss_xiongshou","yizhong","lielongjiliu","tianzhong3","nyhzr冰裂龟甲ol","boss_lingqu","zyile_kuoshan","huanwu","毛泽东","cygd_shier","复列相光束炮","免疫失效","免疫变身","免疫混乱","免疫禁锢","即死无效"],["zhu","boss","forbidai","bossallowed"]],
            "玛伽加坦杰厄":["none","shen",11,["圣_huituo","zyile_xianluo","erda3","zyile_xiongyi","hongxi","hhudun","AM_zhongyan","boss_xiongshou","xieneng","yizhong","duzhang","chongsheng","lielonghuachen","lielongdinu","qianggu","boss_futai","普通抗性","免疫普通即死","qwa_抗性","tianzhong3","zyile_kuoshan","zyile_chizhu","huanwu","胸部集束炮","免疫失效","免疫混乱","免疫禁锢","免疫变身","砂缚柩","砂瀑送葬","即死无效","毛泽东","cygd_shier","boss_lingqu"],["zhu","boss","forbidai","bossallowed"]],
            "超古代邪神加坦杰厄":["male","shen",12,["cygd_shier","asyouzhang","sanying_huoxin","圣_huituo","zyile_xianluo","jingu","erda3","zyile_xiongyi","hongxi","yuansu","普通抗性","免疫普通即死","hhudun","AM_zhongyan","AM_jueyu","boss_xiongshou","AM_chenji","xieneng","圣_weimu","huoshou","qwa_抗性","lielonghuachen","qianggu","woliu","boss_shemian","lianpo","mieshi","tianzhong3","boss_lingqu","zyile_kuoshan","冷雨_动漫包_恩奇都_完全形态","胸部集束炮","即死无效","毛泽东","免疫变身","免疫禁锢","免疫失效","免疫混乱","huanwu","boss_nailuo"],["zhu","boss","forbidai","bossallowed"]],
            "暴君泰兰特":["none","shen",4,["kivazhengfu","kivaxiaozhan","cygd_shier","YXW强攻","qingtian","shanjia","sanying_hengxing","zyile_xiongyi","普通抗性","免疫普通即死","qizhou","boss_xiongshou","ws肆暴","yizhong","qwa_抗性","lielongweiyan","lielonghanxi","boss_xiaoshou","gongao","juyi","sgk_zhiji","即死无效","毛泽东","免疫变身","免疫失效","免疫混乱","免疫禁锢"],["zhu","boss","forbidai","bossallowed"]],
            "EX泰拉特":["none","shen",5,["cygd_shier","YXW狂暴","YXW强攻","qingtian","sgk_zhiji","sanying_hengxing","zyile_xiongyi","qizhou","sgk_fenwei","nyhzr恐惧镰刀","nyhzr镰刀挥舞","免疫普通即死","qwa_抗性","lielongweiyan","boss_xiongshou","lielonghanxi","hanyong","kivazhengfu","kivaxiaozhan","shanjia","ws肆暴","yizhong","即死无效","毛泽东","免疫变身","免疫失效","免疫混乱","免疫禁锢"],["zhu","boss","forbidai","bossallowed"]],
            "迪莫杰厄":["female","shen",13,["免疫禁锢","免疫普通即死","qwa_抗性","即死无效","免疫变身","免疫失效","免疫混乱","毛泽东","cygd_shier","YXW压制","zyile_maisha","zyile_xianluo","zyile_youshi","yuehun","d2_bingjian","erda3","zyile_xiongyi","hongxi","shengteng","yuansu","bingjianx","普通抗性","AM_zhongyan","AM_jueyu","ws混沌","AM_chenji","xieneng","mieshi","smts","d2_mohua","zyile_henhe","zyile_xianyu","tianzhong3","d2_yuannu","xmojian","zyile_kuoshan","zyile_changan","zyile_chizhu","zyile_wuxiang","zyile_moyi","biri","AM_zhinian","d2_gongsheng","圣_gongao","sanying_huoxin"],["zhu","boss","forbidai","bossallowed"]],
            "古兰特王":["none","shen",5,["kivazhenjin","kivagangtie","YXW压制","jijia","zihui","chongzhuang","erda3","hhudun","boss_jiguan","boss_nitai","免疫禁锢","免疫普通即死","qwa_抗性","即死无效","免疫变身","免疫失效","免疫混乱","毛泽东","cygd_shier","普通抗性","zyile_moyi","zaiqi"],["zhu","boss","forbidai","bossallowed"]],
            "超级古兰特王":["none","shen",6,["kivatiexue","kivazhuaji","kivazhenjin","kivazhengfu","kivaxiaozhan","cygd_shier","kivagangtie","kivajingong","kivajingu","YXW压制","jijia","tuijin","zihui","chongzhuang","erda3","qizhou","hhudun","boss_chiying","wushuang","zaiqi","hgyhd","qianghuax","boss_jiguan","zyile_moyi","普通抗性","毛泽东","免疫禁锢","免疫普通即死","qwa_抗性","即死无效","免疫变身","免疫失效","免疫混乱"],["zhu","boss","forbidai","bossallowed"]],
            "超级亡灵古兰特王":["none","shen",8,["kivazhenjin","kivazhuaji","kivazhengfu","kivaxiaozhan","cygd_shier","kivagangtie","kivajingu","YXW压制","shanjia","jijia","tuijin","zihui","chongzhuang","erda3","zyile_xiongyi","hongxi","starzhouxia","starshanduan","hhudun","gwjinli","boss_chiying","boss_jiguan","chongsheng","xieneng","qianghuax","hanyong","冷雨_动漫包_恩奇都_完全形态","无限剑","免疫禁锢","免疫普通即死","qwa_抗性","即死无效","免疫变身","免疫失效","免疫混乱","毛泽东","普通抗性","zyile_moyi","冷雨_动漫包_阿蒂拉_军神之剑","diy_xiaohun"],["zhu","boss","forbidai","bossallowed"]],
            "玛伽古兰特王":["none","shen",9,["kivatiexue","FenixSkill0","cygd_shier","kivagangtie","YXW强攻","YXW压制","YXW狂暴","mobao","zyile_xianluo","jijia","tuijin","zihui","chongzhuang","erda3","boss_jiguan","boss_didongjg","hongxi","hhudun","gwjinli","MYjiguan","MYpojia","xieneng","chongsheng","lielongmoyan","lielonghuachen","lielongdinu","hgyhd","nyhzr大地护盾ol","qianghuax","boss_lingqu","胸部集束炮","zyile_moyi","普通抗性","毛泽东","免疫禁锢","免疫普通即死","qwa_抗性","即死无效","免疫变身","免疫失效","免疫混乱","wumou"],["zhu","boss","forbidai","bossallowed"]],
            "宇宙恐龙杰顿":["male","wei",3,["cygd_shier"],["zhu","boss","forbidai","bossallowed"]],
        },
        translate:{
            "黑暗支配者加坦杰厄":"黑暗支配者加坦杰厄",
            "玛伽加坦杰厄":"玛伽加坦杰厄",
            "超古代邪神加坦杰厄":"超古代邪神加坦杰厄",
            "暴君泰兰特":"暴君泰兰特",
            "EX泰拉特":"EX泰拉特",
            "迪莫杰厄":"迪莫杰厄",
            "古兰特王":"古兰特王",
            "超级古兰特王":"超级古兰特王",
            "超级亡灵古兰特王":"超级亡灵古兰特王",
            "玛伽古兰特王":"玛伽古兰特王",
            "宇宙恐龙杰顿":"宇宙恐龙杰顿",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
        },
        translate:{
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["宇宙恐龙杰顿.jpg"],"card":[],"skill":[]}}};