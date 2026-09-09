import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"阴曹地府",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "yin_wenyang":["male","wei",5,["xinlvli","choujue","tianyi"],[]],
            "yin_caoying":["female","wei",4,["xinfu_lingren","xinfu_fujian","minigongxin"],[]],
            "yin_caochun":["male","wei",4,["xinshanjia","fulin"],[]],
            "yin_guozhao":["female","wei",3,["pianchong","zunwei","zhiheng"],[]],
            "yin_zhaoxiang":["female","shu",4,["refanghun","refuhan","olyajiao"],[]],
            "yin_guansuo":["male","shu",4,["xinzhengnan","xiefang","gongao"],[]],
            "yin_puyuan":["male","shu",4,["pytianjiang","pyzhuren","xinfu_jingxie1","qiaosi"],[]],
            "yin_machao":["male","shu",4,["mashu","retieji","zhuiji","ol_shichou","xiongyi","xiaoxi_hansui"],[]],
            "yin_huanggai":["male","wu",4,["苦肉","zhaxiang","益壮"],[]],
            "yin_xusheng":["male","wu",4,["repojun","jiaozi"],[]],
            "yin_lingtong":["male","wu",4,["decadexuanfeng","yongjin","dujin"],[]],
            "yin_liuzan":["male","wu",4,["fenyin","refenyin","liji"],[]],
            "yin_xushao":["male","qun",4,["pingjian","rehuashen","rexinsheng"],[]],
            "yin_xurong":["male","qun",4,["xinfu_xionghuo","xinfu_shajue","reyanzhu"],[]],
            "yin_zhangqiying":["female","qun",3,["xinfu_falu","xinfu_dianhua","xinfu_zhenyi","jieyuan"],[]],
            "yin_simahui":["male","qun",3,["xinfu_jianjie","xinfu_chenghao","xinfu_yinshi","yeyan"],[]],
            "yin_simayi":["male","shen",4,["renjie","sbaiyin","lianpo","隐帝"],["wei"]],
            "yin_lvbu":["male","shen",6,["mashu","wushuang","baonu","wumou","ol_shenfen","神威","神戟","神武","修罗"],["qun"]],
            "yin_zhouyu":["male","shen",4,["业炎","qinyin","火神"],["wu"]],
            "yin_liubei":["male","shen",6,["nzry_longnu","nzry_jieying","longyin","飞龙","鸾凤"],["shu"]],
            "yin_caocao":["male","shen",3,["new_guixin","feiying","new_rejianxiong","fangzhu","xinjiewei","shebian"],["wei"]],
            "yin_zhaoyun":["male","shen",2,["绝境","relonghun","zhanjiang"],["qun"]],
            "yin_lvmeng":["male","shen",3,["shelie","minigongxin","克己","谋断"],["wu"]],
            "yin_zhugeliang":["male","shen",3,["qixing","minikuangfeng","dawu","reguanxing","奇门"],["shu"]],
            "yin_ganning":["male","shen","3/6",["drlt_poxi","drlt_jieying","鸦落","魂矢"],["wu"]],
            "yin_caopi":["male","shen",5,["chuyuan","dengji","承天"],["wei"]],
            "yin_guanyu":["male","shen",5,["wushen","new_wuhun","索命"],[]],
            "yin_zhangjiao":["male","shen",3,["xinleiji","xinguidao","雷法"],["qun"]],
        },
        translate:{
            "yin_wenyang":"阴文鸯",
            "yin_caoying":"阴曹婴",
            "yin_caochun":"阴曹纯",
            "yin_guozhao":"阴郭照",
            "yin_zhaoxiang":"阴赵襄",
            "yin_guansuo":"阴关索",
            "yin_puyuan":"阴浦元",
            "yin_machao":"阴马超",
            "yin_huanggai":"阴黄盖",
            "yin_xusheng":"阴徐盛",
            "yin_lingtong":"阴凌统",
            "yin_liuzan":"阴留赞",
            "yin_xushao":"阴许劭",
            "yin_xurong":"阴徐荣",
            "yin_zhangqiying":"阴张琪瑛",
            "yin_simahui":"阴司马徽",
            "yin_simayi":"三分归晋",
            "yin_lvbu":"修罗战神",
            "yin_zhouyu":"赤壁火神",
            "yin_liubei":"章武烈帝",
            "yin_caocao":"超世英杰",
            "yin_zhaoyun":"神龙降世",
            "yin_lvmeng":"兼资文武",
            "yin_zhugeliang":"孟章诛邪",
            "yin_ganning":"锦龙覆江",
            "yin_caopi":"神文圣武",
            "yin_guanyu":"炼狱鬼神",
            "yin_zhangjiao":"大贤良师",
        },
    },
    card:{
        card:{
            "赤血青锋":{
                type:"equip",
                fullskin:true,
                modeimage:"boss",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                skills:["chixueqingfeng"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "赤焰镇魂琴":{
                type:"equip",
                fullskin:true,
                subtype:"equip1",
                modeimage:"boss",
                distance:{
                    attackFrom:-3,
                },
                skills:["chiyanzhenhunqin"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:5,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "鬼龙斩月刀":{
                type:"equip",
                fullskin:true,
                modeimage:"boss",
                subtype:"equip1",
                distance:{
                    attackFrom:-2,
                },
                skills:["guilongzhanyuedao"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "国风玉袍":{
                type:"equip",
                modeimage:"boss",
                subtype:"equip2",
                nomod:true,
                nopower:true,
                unique:true,
                skills:["guofengyupao"],
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullskin:true,
            },
            "红棉百花袍":{
                type:"equip",
                subtype:"equip2",
                modeimage:"boss",
                ai:{
                    basic:{
                        equipValue:7,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["hongmianbaihuapao_skill"],
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "金乌落日弓":{
                type:"equip",
                subtype:"equip1",
                skills:["iwasawa_crowbow"],
                modeimage:"boss",
                distance:{
                    attackFrom:-8,
                },
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "绝尘金戈":{
                fullskin:true,
                type:"equip",
                subtype:"equip3",
                distance:{
                    globalTo:2,
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                ai:{
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:7,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
            },
            "玲珑狮蛮带":{
                type:"equip",
                subtype:"equip2",
                modeimage:"boss",
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["linglongshimandai_skill"],
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "灵蛇簪":{
                type:"equip",
                subtype:"equip5",
                skills:["lingsheji"],
                modeimage:"boss",
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "鸾凤和鸣剑":{
                type:"equip",
                fullskin:true,
                modeimage:"boss",
                subtype:"equip1",
                distance:{
                    attackFrom:-2,
                },
                skills:["longfenghemingjian"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "七彩神鹿":{
                fullskin:true,
                modeimage:"boss",
                type:"equip",
                subtype:"equip4",
                distance:{
                    globalFrom:-1,
                },
                skills:["qicaishenlu"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:4,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "奇门八卦":{
                type:"equip",
                fullskin:true,
                modeimage:"boss",
                subtype:"equip2",
                skills:["qimenbagua"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "禅让诏书":{
                type:"equip",
                subtype:"equip5",
                skills:["shanrangzhaoshu"],
                modeimage:"boss",
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "束发紫金冠":{
                type:"equip",
                subtype:"equip5",
                modeimage:"boss",
                ai:{
                    basic:{
                        equipValue:9,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["shufazijinguan_skill"],
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "无双方天戟":{
                type:"equip",
                modeimage:"boss",
                subtype:"equip1",
                distance:{
                    attackFrom:-3,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["wushuangfangtianji_skill"],
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "刑天破军斧":{
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-3,
                },
                skills:["noda_axe"],
                modeimage:"boss",
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "修罗炼狱戟":{
                type:"equip",
                fullskin:true,
                subtype:"equip1",
                modeimage:"boss",
                distance:{
                    attackFrom:-3,
                },
                skills:["xiuluolianyuji"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
            "虚妄之冕":{
                type:"equip",
                fullskin:true,
                subtype:"equip5",
                modeimage:"boss",
                skills:["xuwangzhimian"],
                nomod:true,
                nopower:true,
                unique:true,
                ai:{
                    equipValue:9,
                    basic:{
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        equipValue:1,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
            },
        },
        translate:{
            "赤血青锋":"赤血青锋",
            "赤血青锋_info":"锁定技，你使用【杀】结算结束前，目标角色不能使用或打出手牌，且此【杀】无视其防具",
            "赤焰镇魂琴":"赤焰镇魂琴",
            "赤焰镇魂琴_info":"锁定技，你造成的伤害均视为具有火属性",
            "鬼龙斩月刀":"鬼龙斩月刀",
            "鬼龙斩月刀_info":"锁定技，你使用的红色【杀】不能被【闪】响应",
            "国风玉袍":"国风玉袍",
            "国风玉袍_info":"锁定技，你不能成为其他角色使用普通锦囊牌的目标",
            "红棉百花袍":"红棉百花袍",
            "红棉百花袍_info":"锁定技，防止你受到的属性伤害。",
            "金乌落日弓":"金乌落日弓",
            "金乌落日弓_info":"当你于出牌阶段内一次性失去了两张以上的手牌后，你可以弃置一名其他角色等量的牌。",
            "绝尘金戈":"绝尘金戈",
            "绝尘金戈_info":"锁定技，其他角色计算与你的距离+2。",
            "玲珑狮蛮带":"玲珑狮蛮带",
            "玲珑狮蛮带_info":"当其他角色使用牌指定你为唯一目标后，你可以进行一次判定，若判定结果为红桃，则此牌对你无效。",
            "灵蛇簪":"灵蛇簪",
            "灵蛇簪_info":"出牌阶段结束时，你可选择：1.摸一张牌。2.将一张武将牌置于武将牌上，并于回合结束后获得此牌。",
            "鸾凤和鸣剑":"鸾凤和鸣剑",
            "鸾凤和鸣剑_info":"你使用的【雷杀】或【火杀】指定目标后，可令对方选择弃置一张牌或令你摸一张牌",
            "七彩神鹿":"七彩神鹿",
            "七彩神鹿_info":"锁定技，你计算与其他角色的距离时-1，当你造成属性伤害时，你令此伤害+1。",
            "奇门八卦":"奇门八卦",
            "奇门八卦_info":"锁定技，其他角色使用的【杀】对你无效",
            "禅让诏书":"禅让诏书",
            "禅让诏书_info":"其他角色于回合外获得牌后，若是其本回合内第一次获得牌，则你可以选择一项：交给其一张牌，或令其交给你一张牌。",
            "束发紫金冠":"束发紫金冠",
            "束发紫金冠_info":"准备阶段，你可以对一名其他角色造成1点伤害。",
            "无双方天戟":"无双方天戟",
            "无双方天戟_info":"你使用【杀】对目标角色造成伤害后，可以摸一张牌或弃置目标角色一张牌。",
            "刑天破军斧":"刑天破军斧",
            "刑天破军斧_info":"当你于出牌阶段内使用牌指定唯一目标后，你可弃置两张牌。若如此做，其本回合内不能使用或打出牌且其防具技能无效。",
            "修罗炼狱戟":"修罗炼狱戟",
            "修罗炼狱戟_info":"你使用【杀】可以额外指定任意名攻击范围内的其他角色为目标；锁定技，你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力",
            "虚妄之冕":"虚妄之冕",
            "虚妄之冕_info":"锁定技，摸牌阶段，你额外摸两张牌；你的手牌上限-1",
        },
        list:[],
    },
    skill:{
        skill:{
            "益壮":{
                trigger:{
                    player:"recoverAfter",
                },
                content:function(){
        player.draw(2)
    },
            },
            "业炎":{
                forceDie:true,
                enable:"phaseUse",
                usable:1,
                audio:"ext:阴曹地府:3",
                animationColor:"metal",
                skillAnimation:"legend",
                filterTarget:function(card,player,target){
        var length=ui.selected.cards.length;
        return (length==0||length==4);
    },
                filterCard:function(card){
        var suit=get.suit(card);
        for(var i=0;i<ui.selected.cards.length;i++){
            if(get.suit(ui.selected.cards[i])==suit) return false;
        }
        return true;
    },
                complexCard:true,
                selectCard:[0,4],
                line:"fire",
                check:function (){return -1},
                selectTarget:function (){
        if(ui.selected.cards.length==4) return [1,2];
        if(ui.selected.cards.length==0) return [1,3];
        game.uncheck('target');
        return [1,3];
    },
                multitarget:true,
                multiline:true,
                content:function (){
        "step 0"
        player.awakenSkill('yeyan');
        event.num=0;
        targets.sortBySeat();
        "step 1"
        if(cards.length==4) event.goto(2);
        else {
            if(event.num<targets.length){
            targets[event.num].damage('fire',1,'nocard');
            event.num++;
        }
        if(event.num==targets.length) event.finish();
        else event.redo();
        }
        "step 2"
        player.loseHp(3);
        if(targets.length==1) event.goto(4);
        else{
            player.chooseTarget('请选择受到2点伤害的角色',true,function(card,player,target){
                return _status.event.targets.contains(target)
            }).set('ai',function(target){
                return 1;
            }).set('forceDie',true).set('targets',targets);
        }
        "step 3"
        if(event.num<targets.length){
            var dnum=1;
            if(result.bool&&result.targets&&targets[event.num]==result.targets[0]) dnum=2;
            targets[event.num].damage('fire',dnum,'nocard');
            event.num++;
        }
        if(event.num==targets.length) event.finish();
        else event.redo();
        "step 4"
        player.chooseControl("2点","3点").set('prompt','请选择伤害点数').set('ai',function(){
            return "3点";
        }).set('forceDie',true);
        "step 5"
        targets[0].damage('fire',result.control=="2点"?2:3,'nocard'); 
    },
                ai:{
                    order:1,
                    fireAttack:true,
                    result:{
                        target:function(player,target){
                if(target.hasSkillTag('nofire')) return 0;
                if(lib.config.mode=='versus') return -1;
                if(player.hasUnknown()) return 0;
                return get.damageEffect(target,player);
            },
                    },
                },
            },
            "神武":{
                audio:"ext:阴曹地府:2",
                enable:"phaseUse",
                filter:function(event,player){
        if(player.countCards('h')==0) return false;
        if(!player.hasSkill('qiangxix')) return true;
        if(!player.hasSkill('retieji')) return true;
        if(!player.hasSkill('rexuanfeng')) return true;
        if(!player.hasSkill('wansha')) return true;
        return false;
    },
                filterCard:true,
                position:"he",
                check:function(card){
        if(get.position(card)=='e'&&_status.event.player.hasSkill('rexuanfeng')) return 16-get.value(card);
        return 7-get.value(card);
    },
                content:function(){
        'step 0'
        var list=[];
        if(!player.hasSkill('qiangxix')) list.push('qiangxix');
        if(!player.hasSkill('retieji')) list.push('retieji');
        if(!player.hasSkill('rexuanfeng')) list.push('rexuanfeng');
        if(!player.hasSkill('wansha')) list.push('wansha');
        if(list.length==1){
            player.addTempSkill(list[0]);
            event.finish();
        }
        else{
            player.chooseControl(list,function(){
                if(list.contains('rexuanfeng')&&player.countCards('he',{type:'equip'})) return 'rexuanfeng';
                if(!player.getStat().skill.qiangxix){
                    if(player.hasSkill('qiangxix')&&player.getEquip(1)&&list.contains('rexuanfeng')) return 'rexuanfeng';
                    if(list.contains('wansha')||list.contains('qiangxix')){
                        var players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(players[i].hp==1&&get.attitude(player,players[i])<0){
                                if(list.contains('wansha')) return 'wansha';
                                if(list.contains('qiangxix')) return 'qiangxix';
                            }
                        }
                    }
                }
                if(list.contains('qiangxix')) return 'qiangxix';
                if(list.contains('wansha')) return 'wansha';
                if(list.contains('rexuanfeng')) return 'rexuanfeng';
                return 'retieji';
            }).set('prompt','选择获得一项技能直到回合结束');
        }
        'step 1'
        player.addTempSkill(result.control);
        player.popup(get.translation(result.control));
    },
                ai:{
                    order:function(){
            var player=_status.event.player;
            if(player.countCards('e',{type:'equip'})) return 10;
            if(!player.getStat().skill.qiangxix){
                if(player.hasSkill('qiangxix')&&player.getEquip(1)&&!player.hasSkill('rexuanfeng')) return 10;
                if(player.hasSkill('wansha')) return 1;
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(players[i].hp==1&&get.attitude(player,players[i])<0) return 10;
                }
            }
            return 1;
        },
                    result:{
                        player:function(player){
                if(player.countCards('e',{type:'equip'})) return 1;
                if(!player.getStat().skill.qiangxix){
                    if(player.hasSkill('qiangxix')&&player.getEquip(1)&&!player.hasSkill('rexuanfeng')) return 1;
                    if(!player.hasSkill('wansha')||!player.hasSkill('qiangxix')){
                        var players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(players[i].hp==1&&get.attitude(player,players[i])<0) return 1;
                        }
                    }
                }
                return 0;
            },
                    },
                },
            },
            "神威":{
                audio:"ext:阴曹地府:2",
                unique:true,
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function(){
        trigger.num+=Math.min(3,game.players.length-1);
    },
                mod:{
                    maxHandcard:function(player,current){
            return current+Math.min(3,game.players.length-1);
        },
                },
            },
            "神戟":{
                mod:{
                    selectTarget:function(card,player,range){
            if(range[1]==-1) return;
            if(card.name=='sha') range[1]+=2;
        },
                    cardUsable:function(card,player,num){
            if(card.name=='sha') return num+1;
        },
                },
            },
            "火神":{
                trigger:{
                    player:"damageBegin1",
                },
                forced:true,
                unique:true,
                filter:function(event){
        return event.nature=='fire';
    },
                content:function(){
        trigger.cancel();
        player.recover();
    },
                ai:{
                    effect:{
                        target:function(card){
                if(get.tag(card,'fireDamage')){
                    return [0,2];
                }
            },
                    },
                },
            },
            "苦肉":{
                audio:"ext:阴曹地府:2",
                enable:"phaseUse",
                prompt:"失去一点体力",
                content:function(){
        "step 0"
        player.loseHp(1);
    },
                ai:{
                    basic:{
                        order:1,
                    },
                    result:{
                        player:function(player){
                if(player.countCards('h')>=player.hp-1) return -1;
                if(player.hp<3) return -1;
                return 1;
            },
                    },
                },
            },
            "隐帝":{
                audio:"ext:阴曹地府:2",
                trigger:{
                    player:"phaseDrawBegin2",
                },
                forced:true,
                filter:function(event,player){
        return !event.numFixed;
    },
                content:function(){
        trigger.num+=2;
    },
                ai:{
                    threaten:1.5,
                },
                mod:{
                    maxHandcardBase:function(player,num){
            return num-=1;
        },
                },
            },
            "克己":{
                audio:"keji",
                forced:true,
                trigger:{
                    player:"phaseDiscardBegin",
                },
                filter:function (event,player){
        var list=[];
        player.getHistory('useCard',function(evt){
            if(evt.isPhaseUsing(player)){
                var color=get.color(evt.card);
                if(color!='nocolor') list.add(color);
            }
        });
        return list.length<=1;
    },
                content:function (){
        player.addTempSkill('keji_add','phaseAfter');
    },
            },
            "谋断":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                audio:"botu",
                filter:function (event,player){
                    var history=player.getHistory('useCard');
                    var suits=[];
                    var types=[];
                    for(var i=0;i<history.length;i++){
                        var suit=get.suit(history[i].card);
                        if(suit) suits.add(suit);
                        types.add(get.type(history[i].card))
                    }
                    return suits.length>=4||types.length>=3;
                },
                check:function(event,player){
                    return player.canMoveCard(true);
                },
                content:function (){
                    player.moveCard();
                },
            },
            "奇门":{
                mod:{
                    targetEnabled:function(card,player,target,now){
            if(target.countCards('h')==0){
                if(card.name=='sha') return false;
            }
            else{
                if(get.type(card)=='trick'||get.type(card)=='delay') return false;
            }
        },
                },
                ai:{
                    noh:true,
                    skillTagFilter:function(player,tag){
            if(tag=='noh'){
                if(player.countCards('h')!=0) return false;
            }
        },
                },
            },
            "绝境":{
                mod:{
                    maxHandcard:function(player,num){
            return 3+num;
        },
                },
                audio:"ext:阴曹地府:2",
                trigger:{
                    player:["dying","dyingAfter"],
                },
                forced:true,
                content:function(){
        player.draw(2);
    },
            },
            "修罗":{
                audio:"ext:阴曹地府:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                direct:true,
                filter:function(event,player){
        return player.countCards('j')>0;
    },
                content:function(){
        "step 0"
        var next=player.discardPlayerCard(player,2,'hj','是否一张手牌来弃置一张花色相同的判定牌？');
        next.filterButton=function(button){
            var card=button.link;
            if(!lib.filter.cardDiscardable(card,player)) return false;
            if(ui.selected.buttons.length==0) return true;
            if(get.position(ui.selected.buttons[0].link)=='h'){
                if(get.position(card)!='j') return false;
            }
            if(get.position(ui.selected.buttons[0].link)=='j'){
                if(get.position(card)!='h') return false;
            }
            return get.suit(card)==get.suit(ui.selected.buttons[0].link)
        };
        next.ai=function(button){
            var card=button.link;
            if(get.position(card)=='h'){
                return 11-get.value(card);
            }
            if(card.name=='lebu') return 5;
            if(card.name=='bingliang') return 4;
            if(card.name=='guiyoujie') return 3;
            return 2;
        };
        next.logSkill='xiuluo';
        "step 1"
        if(result.bool&&player.countCards('j')) event.goto(0);
    },
            },
            "飞龙":{
                trigger:{
                    player:"useCardToPlayered",
                },
                audio:"ext:阴曹地府:true",
                logTarget:"target",
                check:function(event,player){
        if(get.attitude(player,event.target)>0) return true;
        var target=event.target;
        return target.countCards('h')==0||!target.hasSkillTag('noh');
    },
                filter:function(event,player){
        if(event.card.name=='sha'&&event.card.nature=='fire') return true;
        return false;
    },
                content:function(){
        "step 0"
        trigger.target.chooseToDiscard('弃置一张手牌，或令'+get.translation(player)+'摸一张牌').set('ai',function(card){
            var trigger=_status.event.getTrigger();
            return -get.attitude(trigger.target,trigger.player)-get.value(card);
        });
        "step 1"
        if(result.bool==false) player.draw();
    },
            },
            "鸾凤":{
                audio:"ext:阴曹地府:2",
                trigger:{
                    player:"loseMaxHpAfter",
                },
                forced:true,
                filter:function(event,player){
        return player.maxHp>0;
    },
                content:function(){
        player.draw(player.maxHp);
    },
            },
            "鸦落":{
                trigger:{
                    player:"loseAfter",
                },
                direct:true,
                filter:function(event,player){
        return event.hs&&event.hs.length>1&&player.isPhaseUsing();
    },
                content:function(){
        'step 0'
        event.num=trigger.hs.length;
        player.chooseTarget(get.prompt('鸦落'),'弃置一名其他角色的'+get.cnNumber(event.num)+'张牌',function(card,player,target){
            return player!=target&&target.countDiscardableCards(player,'he')>0;
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(target.countDiscardableCards(_status.event.player,'he')>=_status.event.getParent().num) att=att*2;
            return -att;
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('iwasawa_crowbow',target);
            player.discardPlayerCard(target,'he',true,num);
        }
    },
            },
            "魂矢":{
                audio:"ext:阴曹地府:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                direct:true,
                filter:function(event,player){
        return game.hasPlayer(function(current){
            return current!=player&&current.hp<=player.hp;
        });
    },
                content:function(){
        "step 0"
        player.chooseTarget(get.prompt('xinfu_langxi'),'对一名体力值不大于你的其他角色造成1-3点随机伤害',function(card,player,target){
            return target.hp<=player.hp&&target!=player;
        }).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        "step 1"
        if(result.bool&&result.targets&&result.targets.length){
            player.logSkill('xinfu_langxi',result.targets);
            var num=[1,2,3].randomGet();
            if(get.isLuckyStar(player)) num=2;
            player.line(result.targets[0],'green');
            result.targets[0].damage(num);
        }
    },
                ai:{
                    expose:0.25,
                    threaten:1.7,
                },
            },
            "承天":{
                trigger:{
                    global:"gainEnd",
                },
                direct:true,
                filter:function(event,player){
        return event.player!=player&&event.player!=_status.currentPhase&&event.player.getHistory('gain')[0]==event&&player.countCards('he')+event.player.countCards('he')>0;
    },
                content:function(){
        'step 0'
        event.target=trigger.player;
        var list=[];
        if(player.countCards('he')>1) list.push('交给其一张牌');
        if(trigger.player.countCards('he')>0) list.push('令其交给你一张牌');
        event.list=list;
        player.chooseControl('cancel2').set('choiceList',list).set('prompt',get.prompt('承天',trigger.player)).set('ai',function(){
            if(get.attitude(_status.event.player,_status.event.getTrigger().player)<0) return _status.event.getParent().list.length-1;
            return 'cancel2';
        });
        'step 1'
        if(result.control=='cancel2'){
            event.finish();return;
        }
        player.logSkill('shanrangzhaoshu',target);
        if(event.list[result.index][0]=='令'){
            event.player=target;
            event.target=player;
        }
        'step 2'
        player.chooseCard('he',true).set('filterCard',function(card,player){
            if(player!=_status.event.getTrigger().player) return card!=player.getEquip('shanrangzhaoshu');
            return true;
        });
        'step 3'
        if(result.cards&&result.cards.length) target.gain(result.cards,player,'giveAuto');
    },
            },
            "雷法":{
                trigger:{
                    source:"damageSource",
                },
                filter:function(event,player){
        return get.distance(player,event.player)<=1&&event.num>0;
    },
                content:function(){
        
        player.draw(trigger.num);
        
    },
            },
            "索命":{
                audio:"ext:阴曹地府:1",
                trigger:{
                    source:"damageBegin1",
                },
                filter:function(event){
        return         event.card&&event.card.name=='sha'&&get.color(event.card)=='red'&&event.notLink()&&event.player.hasMark('new_wuhun_mark');
    },
                forced:true,
                content:function(){
        trigger.num+=trigger.player.countMark('new_wuhun_mark');
    },
            },
        },
        translate:{
            "益壮":"益壮",
            "益壮_info":"当你回复体力时，你可以摸2张牌。",
            "业炎":"业炎",
            "业炎_info":"出牌阶段限一次，你可以对一至三名角色造成至多共3点火焰伤害（你可以任意分配每名目标角色受到的伤害点数），若你将对一名角色分配2点或更多的火焰伤害，你须先弃置四张不同花色的手牌再失去3点体力。",
            "神武":"神武",
            "神武_info":"出牌阶段，你可以弃置一张牌，然后获得一项：“强袭”、“铁骑”(界)、“旋风”、“完杀”，直到回合结束",
            "神威":"神威",
            "神威_info":"锁定技，摸牌阶段，你额外摸X张牌，你的手牌上限+X（X为场上其他角色的数目且至多为3）",
            "神戟":"神戟",
            "神戟_info":"锁定技，你使用【杀】指定的目标数上限+2，次数上限+1。",
            "火神":"火神",
            "火神_info":"锁定技，你防止即将受到的火焰伤害，改为回复1点体力",
            "苦肉":"苦肉",
            "苦肉_info":"出牌阶段，你可以失去一点体力。",
            "隐帝":"隐帝",
            "隐帝_info":"锁定技，摸牌阶段摸牌时，你额外摸一张牌；你的手牌上限为你的体力上限。",
            "克己":"克己",
            "克己_info":"锁定技，若你没有在出牌阶段内使用过颜色不同的牌，则你本回合的手牌上限+4。",
            "谋断":"谋断",
            "谋断_info":"结束阶段，若你于本回合内使用过四种花色或三种类别的牌，则你可以移动场上的一张牌。",
            "奇门":"奇门",
            "奇门_info":"锁定技，当你有手牌时，你不能成为锦囊牌的目标。当你没有手牌时，你不能成为杀的目标。",
            "绝境":"绝境",
            "绝境_info":"锁定技，你的手牌上限+3；当你进入或脱离濒死状态时，你摸2张牌。",
            "修罗":"修罗",
            "修罗_info":"准备阶段，你可以弃置一张牌，然后弃置你判定区内一张同花色的牌。你可以重复此流程。",
            "飞龙":"飞龙",
            "飞龙_info":"当你使用【火杀】指定一名其他角色后，你可以令其选择一项：1.弃置一张手牌；2.令你摸一张牌。",
            "鸾凤":"鸾凤",
            "鸾凤_info":"当你减1点体力上限后，你可以摸X张牌（X为你的体力上限）。",
            "鸦落":"鸦落",
            "鸦落_info":"你的出牌阶段内，你一次性失去2张及以上手牌时，你可以选择一名其他角色，并弃置其X张牌，X为你本次失去的牌的数量。",
            "魂矢":"魂矢",
            "魂矢_info":"准备阶段，你可以对一名体力小于或等于你的其他角色造成0～2点随机伤害。",
            "承天":"承天",
            "承天_info":"每回合，其他角色于其回合外首次获得牌时，你可给其一张牌，或令其给你一张牌。",
            "雷法":"雷法",
            "雷法_info":"当你造成雷电伤害后，你可以摸一张牌。",
            "索命":"索命",
            "索命_info":"锁定技，当你使用红色【杀】造成伤害时，此伤害+X(X为目标梦魇标记数)。",
        },
    },
    intro:"",
    author:"高田悠学姐",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["yin_lvbu.jpg","yin_liuzan.jpg","yin_xushao.jpg","yin_zhangjiao.jpg","yin_guozhao.jpg","yin_caopi.jpg","yin_ganning.jpg","yin_caoying.jpg","yin_zhaoxiang.jpg","yin_lingtong.jpg","yin_zhangqiying.jpg","yin_guansuo.jpg","yin_machao.jpg","yin_xusheng.jpg","yin_simahui.jpg","yin_puyuan.jpg","yin_huanggai.jpg","yin_xurong.jpg","yin_zhaoyun.jpg","yin_wenyang.jpg","yin_caocao.jpg","yin_liubei.jpg","yin_zhugeliang.jpg","yin_simayi.jpg","yin_zhouyu.jpg","yin_caochun.jpg","yin_guanyu.jpg","yin_lvmeng.jpg"],"card":["赤焰镇魂琴.png","赤血青锋.png","鬼龙斩月刀.png","国风玉袍.png","红棉百花袍.png","金乌落日弓.png","绝尘金戈.png","玲珑狮蛮带.png","灵蛇簪.png","鸾凤和鸣剑.png","七彩神鹿.png","奇门八卦.png","禅让诏书.png","束发紫金冠.png","无双方天戟.png","刑天破军斧.png","修罗炼狱戟.png","虚妄之冕.png"],"skill":[]}}};