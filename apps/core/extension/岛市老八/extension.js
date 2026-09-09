import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"岛市老八",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            kuaishoudaoshilaoba:["male","shen",5,["laobachongsheng","laobachibaba","laobahuojimian","laobaxiaohanbao","laobamichang","laobapayapigu"],["forbidai","des:美食界里我老八，人人称我美食家；大声大喊奥利给！所有东西都下胃！奥利给！！！干！就完了！！！！！！"]],
        },
        translate:{
            kuaishoudaoshilaoba:"岛市老八",
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
            laobachongsheng:{
                audio:"ext:岛市老八:3",
                trigger:{
                    player:"die",
                },
                priority:99,
                noCopy:true,
                noAdd:true,
                noLose:true,
                noGain:true,
                noDeprive:true,
                noclear:true,
                noremove:true,
                locked:true,
                forced:true,
                nobracket:true,
                unique:true,
                superCharlotte:true,
                forceDie:true,
                content:function(){
        game.delay();
        player.say('大声大喊奥利给！所有东西都下胃！');
        player.revive();
        player.recover(player.maxHp-player.hp);
    },
            },
            laobachibaba:{
                audio:"ext:岛市老八:3",
                enable:"phaseUse",
                noremove:true,
                usable:true,
                nobracket:true,
                content:function (){
     "step 0"
        event.current=player.next;
        event.currented=[];
        "step 1"
        event.currented.push(event.current);
        event.current.animate('target');        
        "step 2" 
        var num=Math.round([1.1,2.3,2.2,1,2.1,3].randomGet());
        event.current.loseHp(num);
        event.current.say('吐了..');
        event.current=event.current.next;
        if(!event.currented.contains(event.current)){
            game.delay(4);
            event.goto(1);
        }else{
            player.say('咳～咳咳～～咳～～～');
            player.die();              
        };
    },
            },
            laobahuojimian:{
                audio:"ext:岛市老八:2",
                enable:"phaseUse",
                noremove:true,
                nobracket:true,
                usable:1,
                content:function (){
     "step 0"
        event.current=player.next;
        event.currented=[];
        "step 1"
        event.currented.push(event.current);
        event.current.animate('target');        
        "step 2" 
        var num=Math.round([1,1.2,1.1,0].randomGet());
        event.current.say('看着就辣...');
        event.current.chooseToDiscard('h',true,num);
        event.current=event.current.next;
        if(event.current!=player&&!event.currented.contains(event.current)){
            game.delay(3);
            event.goto(1);
        }else{
            player.say('(辣坏了...)');
            player.damage('fire');
        };
    },
            },
            laobaxiaohanbao:{
                audio:"ext:岛市老八:2",
                enable:"phaseUse",
                noremove:true,
                nobracket:true,
                usable:1,
                content:function (){
        "step 0"
        player.storage.xiaohanbao=0;
        event.current=player.next;
        event.currented=[];
        "step 1"
        event.currented.push(event.current);
        event.current.animate('target');        
        "step 2" 
        var num=Math.round([1,1.2,1.1,0].randomGet());
        if(num==1){
            event.current.say('行!');
            player.storage.xiaohanbao++;
        }else{
            event.current.say('不行..');
        };
        event.current=event.current.next;
        if(event.current!=player&&!event.currented.contains(event.current)){
            game.delay(3);
            event.goto(1);
        }else{
            player.draw(player.storage.xiaohanbao);
            player.say('必须行！');
        };
    },
            },
            laobamichang:{
                audio:"ext:岛市老八:2",
                enable:"phaseUse",
                noremove:true,
                nobracket:true,
                usable:1,
                content:function (){
        "step 0"
        player.storage.laobamichang=0;
        event.current=player.next;
        event.currented=[];
        "step 1"
        event.currented.push(event.current);
        event.current.animate('target');        
        "step 2" 
        var num=Math.round([1,2.2,2.1,0,2].randomGet());
        event.current.recover();
        event.current.popup('爱心给了');
        event.current.chooseToDiscard('h',true,num);
        player.storage.laobamichang+=num;
        event.current=event.current.next;
        if(event.current!=player&&!event.currented.contains(event.current)){
            game.delay(3);
            event.goto(1);
        }else{           
            player.recover();
            player.draw(Math.round(0.5*player.storage.laobamichang));
        };
    },
            },
            laobapayapigu:{
                audio:"ext:岛市老八:2",
                enable:"phaseUse",
                noremove:true,
                nobracket:true,
                usable:1,
                filter:function(event,player){
        return player.countCards('h')>1;
    },
                filterCard:true,
                position:"h",
                selectCard:2,
                content:function (){
     "step 0"
        event.current=player.next;
        event.currented=[];
        "step 1"
        event.currented.push(event.current);
        event.current.animate('target');        
        "step 2" 
        var num=Math.round([1,1.2,1.1,0].randomGet());
        event.current.say('有点恶心..');
        event.current.damage(num);
        event.current=event.current.next;
        if(event.current!=player&&!event.currented.contains(event.current)){
            game.delay(4);
            event.goto(1);
        }else{
            player.say('扒鸭屁股是块宝！');
        };
    },
            },
        },
        translate:{
            laobachongsheng:"重生",
            "laobachongsheng_info":"锁定技，死亡时会满血复活。",
            laobachibaba:"吃粑粑",
            "laobachibaba_info":"出牌阶段限一次，老八开始吃粑粑（虽然不是同一时间...），所有其他角色依次慢慢损失一到三点体力（非等概率），然后老八直接死亡一次（呕.呕.呕..）。",
            laobahuojimian:"火鸡面",
            "laobahuojimian_info":"出牌阶段限一次，老八可以开始表演吃火鸡面，所有其他角色依次高概率弃置一张手牌，然后你受到一点火属性伤害。",
            laobaxiaohanbao:"晓汉堡",
            "laobaxiaohanbao_info":"出牌阶段限一次，老八可以开始表演制作老八秘制小汉堡，所有其他角色依次评价：行/不行，然后你摸X张牌（X为说行的人数）。",
            laobamichang:"米肠",
            "laobamichang_info":"出牌阶段限一次，老八可以开始表演吃米肠，所有其他角色依次回复一点体力并高概率弃置两张手牌，然后你回复一点体力并摸X张牌（X为弃牌数量的一半，向上取整）。",
            laobapayapigu:"趴鸭屁股",
            "laobapayapigu_info":"出牌阶段限一次，老八可以弃两张手牌开始表演吃趴鸭屁股，所有其他角色依次高概率受到一点伤害。",
        },
    },
    intro:"",
    author:"太元",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["kuaishoudaoshilaoba.jpg"],"card":[],"skill":[]},editable:false,}};
