import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"德莱厄斯",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "恐惧新星":["male","qun",6,["reqiangxi","new_reluoyi","retieji","xinliegong"],["des:爆炸输出"]],
            "勇敢的心":["male","qun",2,["fengliang","niepan","fuli","buqu","xwj_xhuoying_rebusi","xwj_xhuoying_zhengbao","xwj_xhuoying_nishou"],["forbidai","des:死不掉"]],
            "生化骑士":["male","qun",6,["xwj_xhuoying_yingmo","xwj_xhuoying_kuilei","xwj_xhuoying_fuzhi"],["forbidai","des:就是牛逼"]],
            "热血班长":["male","qun",5,["xinkuanggu","xinlvli","choujue","rezaiqi"],[]],
            "神王":["male","qun",8,["luanwu","xinfencheng","xwj_xhuoying_zibao","qinyin"],["des:杀！"]],
        },
        translate:{
            "恐惧新星":"恐惧新星",
            "勇敢的心":"勇敢的心",
            "生化骑士":"生化骑士",
            "热血班长":"热血班长",
            "神王":"神王",
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
    intro:"本人诺手迷所以制作了不同皮肤的诺手。特性各不相同。需搭配火影包玩",
    author:"程咬金",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["神王.jpg"],"card":[],"skill":[]}}};