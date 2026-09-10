import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"崔芙",content:function(config,pack){ 
    game.playhy =(function(){
	var TAG='hy_xishang';
	lib.hy_clearExposeTrash=function(pl){
		if(!pl) return;
		var cls=['exposedhandcards','hy_exposedhand','hy_exposedhandcards','exposedhand','exposedcard_box','exposedhandcards_box'];
		for(var i=0;i<cls.length;i++){
			var arr=pl.getElementsByClassName(cls[i]);
			while(arr && arr[0]) arr[0].remove();
		}
		if(pl.node){
			if(pl.node.exposedhandcards){pl.node.exposedhandcards.remove();pl.node.exposedhandcards=null;}
			if(pl.node.hy_exposedhand){pl.node.hy_exposedhand.remove();pl.node.hy_exposedhand=null;}
			if(pl.node.exposedhand){pl.node.exposedhand.remove();pl.node.exposedhand=null;}
			if(pl.node.exposedhand){pl.node.exposedhand.remove();pl.node.exposedhand=null;}
		}
	};
	lib.hy_getExposeText=function(card){
		if(card && card.hasGaintag && card.hasGaintag(TAG)){
			return get.translation(card.name).slice(0,2);
		}
		return '？';
	};
	lib.hy_updateExposeBox=function(pl){
		if(!pl||pl.isDead()) return;
		if(pl==game.me) return;
		if(!pl.hasSkill||!pl.hasSkill('hy_xishang')) return;
		lib.hy_clearExposeTrash(pl);
		if(!pl.shoupai){
			pl.shoupai=ui.create.div('.gshoupai',pl);
			pl.shoupai.onclick = function () {
	var hs = pl.getCards('h');
	if (!hs.length) return;
	var pop = ui.create.div('.popup-container', ui.window);
	var d = ui.create.dialog('hidden');
	d.static = true;
	d.id = 'cooperationDialog';
	d.add('手牌区');
	d.addSmall(hs, true);
	for (var i = 0; i < d.buttons.length; i++) {
		var b = d.buttons[i];
		var c = b.link;
		if (!(c && c.hasGaintag && c.hasGaintag(TAG))) {
			b.className = 'button card';
			b.innerHTML = '';
		}
	}
	d.open();
	pop.addEventListener('click', function () {
		pop.delete(200);
		d.close();
		d.delete(200);
	});
};
		}
		var hs2=pl.getCards('h');
		pl.shoupai.innerHTML='';
		for(var j=0;j<hs2.length;j++){
			if(j<=3){
				pl.shoupai.innerHTML+=lib.hy_getExposeText(hs2[j])+'<br>';
			}else if(j==4){
				pl.shoupai.innerHTML+='…';
				break;
			}
		}
	};
	lib.skill._hy_exposed_ui={
		trigger:{
			player:["gainEnd","loseEnd","dieBefore","useCardEnd","respondEnd","gameDraw"],
			global:"gameStart"
		},
		silent:true,
		forced:true,
		charlotte:true,
		content:function(){
			for(var i=0;i<game.players.length;i++){
				lib.hy_updateExposeBox(game.players[i]);
			}
			if(event.triggername=='dieBefore'&&trigger.player&&trigger.player.shoupai){
				trigger.player.shoupai.remove();
				trigger.player.shoupai=null;
			}
		}
	};
})();
},precontent:function(){
lib.init.css(lib.assetURL + 'extension/手杀武将/apk/崔芙','extension');
},config:{},help:{},package:{
    character:{
        character:{
        "hy_xinxianying":["female","wei",3,["hy_jiejie","hy_qingshi"],[]],//势辛宪英
        "hy_cuifu":["female","wei",3,["hy_caiqiu","hy_xishang"],[]],//崔芙
            "hy_cuifu1":["female","wei",3,[],["unseen"]],
            "hy_cuifu2":["female","wei",3,[],["unseen"]],
            "hy_cuifu3":["female","wei",3,[],["unseen"]],
        },
        translate:{
        "hy_xinxianying":"势辛宪英",
        "hy_cuifu":"崔芙",
        "hy_cuifu1":"霓裳·桂殿",
        "hy_cuifu2":"纱裙·东郊",
        "hy_cuifu3":"轻衫·绣阁",
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
        //清识
        "hy_qingshi":{
                audio:"ext:手杀武将/apk/崔芙/audio:4",
                trigger:{
                    player:"damageAfter",
                },
                popup:true,
                content:function(){
        player.useSkill('hy_qingshi_do');
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    order:7,
                    result:{
                        target:function(player,target){
                var att=get.attitude(player,target);
                if(att>0) return 1;
                if(att<0&&target.countCards('h')>0) return -1;
                return 0;
            },
                    },
                },
                subSkill:{
                    do:{
                        popup:true,
                        content:function(){
                'step 0'
                var fixed=(event.targets&&event.targets.length)?event.targets[0]:null;
                if(!fixed){
                    player.chooseTarget("请选择一名角色",true).set('ai',function(target){
                        var player=_status.event.player;
                        var att=get.attitude(player,target);
                        var pc=player.countCards('h'),tc=target.countCards('h');
                        if(att>0){ if(pc<=2) return att*2; return att*0.5; }
                        if(att<0){ if(pc>=3&&tc>0) return -att*(1+tc*0.5); if(pc<=1) return 0; return -att*0.5; }
                        return 0;
                    });
                }else{
                    event._result={bool:true,targets:[fixed]};
                }
                'step 1'
                if(result.bool&&result.targets.length>0){
                    var target=result.targets[0];
                    player.line(target);
                    if(get.attitude(player,target)>0){
                        player.draw();
                        target.draw();
                    }else{
                        player.chooseToDiscard('hej',1,true);
                        player.discardPlayerCard(target,'hej',1,true);
                    }
                }
            },
                        sub:true,
                        parentskill:"hy_qingshi",
                    },
                },
            },
            //诫节
        "hy_jiejie":{
                audio:"ext:手杀武将/apk/崔芙/audio:2",
                global:"hy_jiejie_g",
                group:"hy_jiejie_reset",
                subSkill:{
                    g:{
                        audio:"hy_jiejie",
                        enable:"phaseUse",
                        usable:1,
                        charlotte:true,
                        filter:function(event,player){
                return player.isIn()&&player.countCards('h')>=1&&game.hasPlayer(p=>p.hasSkill('hy_jiejie')&&p.isIn());
            },
                        content:function(){
                'step 0'
                var targets=game.filterPlayer(current=>current.hasSkill('hy_jiejie')&&current.isIn());
                if(targets.length==1){
                    event.owner=targets[0];
                    event.goto(2);
                }else if(targets.length>0){
                    player.chooseTarget(true,'选择【诫节】的目标',function(card,player,target){
                        return _status.event.list.includes(target);
                    }).set('list',targets).set('ai',function(target){
                        return get.attitude(_status.event.player,target);
                    });
                }else{
                    event.finish();
                }
                'step 1'
                if(result.bool&&result.targets&&result.targets.length){
                    event.owner=result.targets[0];
                }else{
                    event.finish();
                }
                'step 2'
                if(!event.owner||!event.owner.isIn()){
                    event.finish();
                    return;
                }
                player.logSkill('hy_jiejie',event.owner);
                if(!game.hy_jiejie_qingshi_count){
                    game.hy_jiejie_qingshi_count=0;
                }
                var currentHand=player.getCards('h')||[];
                var suitTypes={};
                for(var i=0;i<currentHand.length;i++){
                    var s=get.suit(currentHand[i]);
                    if(s) suitTypes[s]=true;
                }
                event.suitTypeCount=Object.keys(suitTypes).length;
                if(event.owner==game.me){
                    event.dialog=ui.create.dialognew('#hy_jiejie_dialog');
                    var eventtitle=ui.create.div('.newTitle1',event.dialog);
                    eventtitle.innerHTML='诫节';
                    eventtitle.innerHTML+='<img src="'+lib.assetURL+'extension/手杀武将/apk/崔芙/assets/image/arrow.png" style="width:30px;height:25px;margin-bottom:1px;left:2px;zoom: 1.4;"/>';
                    var targetname=ui.create.div('.targetname1',event.dialog);
                    targetname.innerText=get.translation(player.name);
                    var targetarea=ui.create.div('.targetarea1',event.dialog);
                    event.dialog.add(player.getCards('h'),'','',targetarea);
                    var hint=ui.create.div('.Footerxxgg',event.dialog);
                    hint.innerHTML='';
                    var cards=player.getCards('h')||[];
                    var suitCount={heart:0,spade:0,club:0,diamond:0};
                    for(var i1=0;i1<cards.length;i1++){
                        var su=get.suit(cards[i1]);
                        if(su&&suitCount[su]!==undefined){ suitCount[su]++; }
                    }
                    var suitInfo=ui.create.div('.Footerxxgg2',event.dialog);
                    suitInfo.innerHTML='当前<span style="color:#66FF66">'+get.translation(player.name)+'</span>的手牌花色数量为: <span style="color:#FF0000">♥</span>'+suitCount.heart+', <span style="color:#FF0000">♦</span>'+suitCount.diamond+', <span style="color:#555555">♠</span>'+suitCount.spade+', <span style="color:#555555">♣</span>'+suitCount.club;
                    var hint2=ui.create.div('.Footerxxgg3',event.dialog);
                    hint2.innerHTML='选择一种花色,弃置其余花色牌或获得所选花色牌';
                    var btnContainer=ui.create.div('.hy_jiejie_btn_container',event.dialog);
                    var b1=document.createElement('div'); b1.className='hy_jiejie_btn'; b1.textContent='红桃'; b1.onclick=function(){event.suit='heart';event.dialog.remove();delete _status.imchoosing;game.resume2();}; btnContainer.appendChild(b1);
                    var b2=document.createElement('div'); b2.className='hy_jiejie_btn'; b2.textContent='方块'; b2.onclick=function(){event.suit='diamond';event.dialog.remove();delete _status.imchoosing;game.resume2();}; btnContainer.appendChild(b2);
                    var b3=document.createElement('div'); b3.className='hy_jiejie_btn'; b3.textContent='黑桃'; b3.onclick=function(){event.suit='spade';event.dialog.remove();delete _status.imchoosing;game.resume2();}; btnContainer.appendChild(b3);
                    var b4=document.createElement('div'); b4.className='hy_jiejie_btn'; b4.textContent='梅花'; b4.onclick=function(){event.suit='club';event.dialog.remove();delete _status.imchoosing;game.resume2();}; btnContainer.appendChild(b4);
                    var b5=document.createElement('div'); b5.className='hy_jiejie_btn'; b5.textContent='取消'; b5.onclick=function(){event.suit='cancel2';event.dialog.remove();delete _status.imchoosing;game.resume2();}; btnContainer.appendChild(b5);
                    _status.imchoosing=true;
                    game.pause2();
                    return;
                }else{
                    var att=get.attitude(event.owner,player)||0;
                    var cards2=player.getCards('h')||[];
                    var suits={};
                    for(var i2=0;i2<cards2.length;i2++){
                        var s2=get.suit(cards2[i2]);
                        if(s2) suits[s2]=(suits[s2]||0)+1;
                    }
                    var autoSuit='spade';
                    if(att>0||event.owner===player){
                        var sc=Object.keys(suits).length;
                        if(sc>=4){
                            event.suit='cancel2';
                        }else{
                            var shaCount={};
                            for(var j=0;j<cards2.length;j++){
                                if(cards2[j].name=='sha'){
                                    var s3=get.suit(cards2[j]);
                                    if(s3) shaCount[s3]=(shaCount[s3]||0)+1;
                                }
                            }
                            var best=null;
                            for(var k in shaCount){ if(shaCount[k]>=2){ best=k; break; } }
                            if(best){
                                var hasEnemy=false;
                                var inRange=game.filterPlayer(function(cur){
                                    return cur!=player&&player.inRange(cur);
                                });
                                for(var t=0;t<inRange.length;t++){
                                    if(get.attitude(player,inRange[t])<0){ hasEnemy=true; break; }
                                }
                                if(hasEnemy){
                                    autoSuit=best;
                                }else{
                                    var allS=['spade','heart','club','diamond'],found=false;
                                    for(var t2=0;t2<allS.length;t2++){
                                        if(!suits[allS[t2]]){ autoSuit=allS[t2]; found=true; break; }
                                    }
                                    if(!found){
                                        var minSuit=null,minNum=Infinity;
                                        for(var k2 in suits){ if(suits[k2]<minNum){minNum=suits[k2];minSuit=k2;} }
                                        autoSuit=minSuit||'spade';
                                    }
                                }
                            }else{
                                var allS2=['spade','heart','club','diamond'],found2=false;
                                for(var t3=0;t3<allS2.length;t3++){
                                    if(!suits[allS2[t3]]){ autoSuit=allS2[t3]; found2=true; break; }
                                }
                                if(!found2){
                                    var minSuit2=null,minNum2=Infinity;
                                    for(var k3 in suits){ if(suits[k3]<minNum2){minNum2=suits[k3];minSuit2=k3;} }
                                    autoSuit=minSuit2||'spade';
                                }
                            }
                            event.suit=autoSuit;
                        }
                    }else{
                        var maxSuit=null,maxNum=0;
                        for(var k4 in suits){ if(suits[k4]>maxNum){ maxNum=suits[k4]; maxSuit=k4; } }
                        autoSuit=maxSuit||'spade';
                        event.suit=autoSuit;
                    }
                }
                'step 3'
                if(event.suit==='cancel2'){
                    event.finish();
                    return;
                }
                player.popup(event.suit);
                game.log(player,'选择了','#g'+get.translation(event.suit));
                var hasSuit=false;
                var cur=player.getCards('h')||[];
                for(var i3=0;i3<cur.length;i3++){
                    if(get.suit(cur[i3])==event.suit){ hasSuit=true; break; }
                }
                event.hasSuit=hasSuit;
                if(player.playerid){
                    if(!player.hasSkill('hy_jiejie_record')){
                        player.addTempSkill('hy_jiejie_record','roundStart');
                    }
                    player.storage.hy_jiejie_record=event.suitTypeCount;
                    player.syncStorage('hy_jiejie_record');
                    player.markSkill('hy_jiejie_record');
                }
                'step 4'
                if(event.hasSuit){
                    var allCards=player.getCards('h')||[];
                    var discardCards=allCards.filter(function(card){
                        return get.suit(card)!=event.suit;
                    });
                    if(discardCards.length>0){
                        player.discard(discardCards);
                    }
                    player.addTempSkill('hy_jiejie_unlimited',{player:'phaseEnd'});
                    player.storage=player.storage||{};
                    player.storage.hy_jiejie_unlimited=player.storage.hy_jiejie_unlimited||[];
                    player.storage.hy_jiejie_unlimited.push(event.suit);
                }else{
                    var gainCards=[];
                    if(ui.cardPile&&ui.cardPile.childNodes){
                        for(var i4=0;i4<ui.cardPile.childNodes.length;i4++){
                            var c1=ui.cardPile.childNodes[i4];
                            if(c1&&get.suit(c1)==event.suit){ gainCards.push(c1); }
                        }
                    }
                    if(ui.discardPile&&ui.discardPile.childNodes){
                        for(var i5=0;i5<ui.discardPile.childNodes.length;i5++){
                            var c2=ui.discardPile.childNodes[i5];
                            if(c2&&get.suit(c2)==event.suit){ gainCards.push(c2); }
                        }
                    }
                    if(gainCards.length>0){
                        player.gain(gainCards.randomGet(),'gain2');
                    }
                }
                'step 5'
                if(!player.playerid){
                    event.finish();
                    return;
                }
                var allPlayers=game.filterPlayer();
                var maxNum=0,maxPlayers=[];
                for(var i6=0;i6<allPlayers.length;i6++){
                    var p=allPlayers[i6];
                    if(p.storage.hy_jiejie_record===undefined) continue;
                    var cnt=p.storage.hy_jiejie_record;
                    if(cnt>maxNum){
                        maxNum=cnt; maxPlayers=[p];
                    }else if(cnt==maxNum&&cnt>0){
                        maxPlayers.push(p);
                    }
                }
                if(maxPlayers.length==1&&maxPlayers[0]==player&&game.hy_jiejie_qingshi_count<2){
                    game.hy_jiejie_qingshi_count++;
                    if(lib.skill.hy_qingshi&&event.owner){
                        event.owner.useSkill('hy_qingshi_do',[player]);
                        
                    }
                }
            },
                        ai:{
                            order:10,
                            result:{
                                player:function(player){
                        var target=game.findPlayer(p=>p.hasSkill('hy_jiejie')&&p.isIn());
                        if(!target) return 0;
                        var cards=player.getCards('h')||[];
                        var suits={};
                        for(var i=0;i<cards.length;i++){
                            var s=get.suit(cards[i]);
                            if(s) suits[s]=(suits[s]||0)+1;
                        }
                        var suitCount=Object.keys(suits).length;
                        var att=get.attitude(target,player);
                        if(att>0&&suitCount>=4) return -10;
                        return att>0?1:-1;
                    },
                            },
                        },
                        sub:true,
                        parentskill:"hy_jiejie",
                    },
                    record:{
                        charlotte:true,
                        onremove:true,
                        intro:{
                            content:function(storage,player){
                    return '本轮查看时手牌花色种类数:'+storage;
                },
                            markcount:function(storage,player){
                    return storage||0;
                },
                        },
                        sub:true,
                        parentskill:"hy_jiejie",
                    },
                    unlimited:{
                        charlotte:true,
                        init:function(player){
                if(!player.storage) player.storage={};
                if(!player.storage.hy_jiejie_unlimited) player.storage.hy_jiejie_unlimited=[];
            },
                        onremove:function(player){
                if(player.storage){
                    delete player.storage.hy_jiejie_unlimited;
                }
            },
                        mod:{
                            cardUsable:function(card,player){
                    if(player&&player.storage&&player.storage.hy_jiejie_unlimited&&player.storage.hy_jiejie_unlimited.includes(get.suit(card))){
                        return Infinity;
                    }
                },
                        },
                        sub:true,
                        parentskill:"hy_jiejie",
                    },
                    reset:{
                        trigger:{
                            global:"roundStart",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        lastDo:true,
                        content:function(){
                game.hy_jiejie_qingshi_count=0;
                
            },
                        sub:true,
                        parentskill:"hy_jiejie",
                    },
                },
            },
"hy_caiqiu":{
    audio:"ext:手杀武将/apk/崔芙/audio/崔芙:4",
    trigger:{
        global:"roundStart",
    },
    direct:true,
    filter:function(event,player){
        return true;
    },
    check:function(event,player){
        return player.hp>1||player.countCards('h')<2;
    },
    onremove:true,
    intro:{
        content:function(storage,player){
            if(!storage||storage.length==0) return '尚未记录任何牌名';
            return '已记录:'+storage.map(name=>get.translation(name)).join('、');
        },
        markcount:function(storage,player){
            return storage?storage.length:0;
        },
    },
    content:function(){
        "step 0"
        var num=game.players.length + game.dead.length;
        var cards=get.cards(num);
        event.cards=cards;
        event.selectedCards=[];
        if(player==game.me||player.isUnderControl(true)){
            event.dialog=ui.create.dialognew('#newdialog2');
            var eventtitle=ui.create.div('.newTitle2',event.dialog);
            eventtitle.innerHTML='裁裘<img src='+lib.assetURL+'extension/十周年UI/assets/image/arrow.png'+' style=width:30px;height:25px;margin-bottom:5px;left:2px;/>';
            var targetname=ui.create.div('.targetname2',event.dialog);
            targetname.innerText='牌堆顶';
            var myname=ui.create.div('.myname2',event.dialog);
            myname.innerText=get.translation(player.name);
            var targetarea=ui.create.div('.targetarea2',event.dialog);
            var myarea=ui.create.div('.myarea2',event.dialog);
            var mybuttons=ui.create.div('.buttons',myarea);
            event.dialog.add(cards,'','',targetarea);
            event.mybuttons=mybuttons;
            event.cardMap=new Map();
            event.buttonMap=new Map();
            event.placeholderMap=new Map();
            var chooseButton=player.chooseButton([0,num],event.dialog).set('newconfirm1',true);
            chooseButton.set('custom',{
                add:{},
                replace:{
                    button:function(button){
                        var card=button.link;
                        if(event.selectedCards.includes(card)){
                            event.selectedCards.remove(card);
                            var placeholder=event.placeholderMap.get(card);
                            if(placeholder&&placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                            event.placeholderMap.delete(card);
                            button.style.transition='opacity 0.8s ease, transform 0.8s ease';
                            button.style.opacity='1';
                            button.style.transform='translateY(0)';
                            button.style.pointerEvents='auto';
                            var cardCopy=event.cardMap.get(card);
                            if(cardCopy&&cardCopy.parentNode){
                                cardCopy.style.transform='translateY(-200px)';
                                cardCopy.style.opacity='0';
                                setTimeout(function(){if(cardCopy.parentNode) mybuttons.removeChild(cardCopy);},800);
                            }
                            event.cardMap.delete(card);
                            event.buttonMap.delete(card);
                        }else{
                            event.selectedCards.push(card);
                            event.buttonMap.set(card,button);
                            var placeholder=document.createElement('div');
                            placeholder.style.width=button.offsetWidth+'px';
                            placeholder.style.height=button.offsetHeight+'px';
                            placeholder.style.display='inline-block';
                            placeholder.style.visibility='hidden';
                            button.parentNode.insertBefore(placeholder,button);
                            event.placeholderMap.set(card,placeholder);
                            button.style.transition='opacity 0.8s ease, transform 0.8s ease';
                            button.style.pointerEvents='none';
                            var cardCopy=card.cloneNode(true);
                            cardCopy.link=card;
                            cardCopy.classList.remove('selectable');
                            cardCopy.classList.remove('selected');
                            cardCopy.style.transform='translateY(-200px)';
                            cardCopy.style.opacity='0';
                            cardCopy.style.transition='all 0.8s ease';
                            cardCopy.style.cursor='pointer';
                            cardCopy.onclick=function(){
                                if(event.selectedCards.includes(card)){
                                    event.selectedCards.remove(card);
                                    var placeholder=event.placeholderMap.get(card);
                                    if(placeholder&&placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                                    event.placeholderMap.delete(card);
                                    button.style.transition='opacity 0.8s ease, transform 0.8s ease';
                                    button.style.opacity='1';
                                    button.style.transform='translateY(0)';
                                    button.style.pointerEvents='auto';
                                    cardCopy.style.transform='translateY(-200px)';
                                    cardCopy.style.opacity='0';
                                    setTimeout(function(){if(cardCopy.parentNode) mybuttons.removeChild(cardCopy);},800);
                                    event.cardMap.delete(card);
                                    event.buttonMap.delete(card);
                                }
                            };
                            mybuttons.appendChild(cardCopy);
                            event.cardMap.set(card,cardCopy);
                            setTimeout(function(){
                                button.style.opacity='0';
                                button.style.transform='translateY(200px)';
                                cardCopy.style.transform='translateY(0)';
                                cardCopy.style.opacity='1';
                            },50);
                        }
                    }
                }
            });
            chooseButton.set('ai',function(button){
                var card=button.link;
                if(card.name=='sha' || card.name=='shan' || card.name=='wuxie'){
                    return 0;
                }
                return 1;
            });
        }else{
            var arr=cards.slice(0).filter(function(card){
                return card.name!='sha' && card.name!='shan' && card.name!='wuxie';
            });
            var limit=Math.min(num,arr.length);
            event.selectedCards=arr.slice(0,limit);
            event.goto(1);
        }
        "step 1"
        var gainCards=event.selectedCards.slice(0);
        if(gainCards.length>0){
            player.logSkill('hy_caiqiu');
            player.gain(gainCards,'gain2');
            event.cards.removeArray(gainCards);
            if(!player.storage.hy_caiqiu) player.storage.hy_caiqiu=[];
            for(var i=0;i<gainCards.length;i++){
                if(!player.storage.hy_caiqiu.includes(gainCards[i].name)){
                    player.storage.hy_caiqiu.push(gainCards[i].name);
                }
            }
            player.markSkill('hy_caiqiu');
            player.addTempSkill('hy_caiqiu_effect',{global:'roundStart'});
           
        }
        while(event.cards.length){
            ui.cardPile.insertBefore(event.cards.pop(),ui.cardPile.firstChild);
        }
    },
    group:"hy_caiqiu_clear",
    subSkill:{
        effect:{
            audio:"hy_caiqiu",
            trigger:{
                global:"useCardAfter",
            },
            forced:true,
            charlotte:true,
            filter:function(event,player){
                if(event.player===player) return false;
                if(!player.storage.hy_caiqiu) return false;
                return player.storage.hy_caiqiu.includes(event.card.name);
            },
            content:function(){
                player.loseHp();
            },
            sub:true,
            parentskill:"hy_caiqiu",
        },
        clear:{
            trigger:{
                global:"roundFinish",
            },
            forced:true,
            charlotte:true,
            popup:false,
            content:function(){
                delete player.storage.hy_caiqiu;
                player.unmarkSkill('hy_caiqiu');
            },
            sub:true,
            parentskill:"hy_caiqiu",
        },
    },
},

hyweizhuang_gui:{
    audio:"ext:手杀武将/apk/崔芙/audio/崔芙:4",
    mark:true,
    marktext:"褽装",
    init:function(player){
        if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
    },
    intro:{
        name:"褽装（桂殿）",
        content:function(storage,player){
            if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
            var num=game.countPlayer();
            var s=player.storage.hyweizhuang_gui;
            var str=[];
            str.push("减值已使用次数："+(s.count||0)+"/"+(num+1));
            str.push("加值已使用次数："+(s.addCount||0)+"/"+(num+1));
            str.push("已累积明置牌："+(s.total||0)+"/"+(num+1));
            if(s.draw) str.push("摸牌数："+s.draw);
            if(s.sha) str.push("杀次数："+s.sha);
            if(s.limit) str.push("手牌上限："+s.limit);
            return str.join("<br>")||"无";
        },
    },
    trigger:{
                    global:"phaseEnd",
                },
               filter:function(event, player){
    if(!event.player || event.player.isDead()) return false;
    if(event.player.countCards('e') > 0) return true;
    if(event.player == player){
        if(player.countCards('h', function(card){
            return card.hasGaintag('hy_xishang');
        }) > 0) return true;
        if(player.countCards('e') > 0) return true;
    }
    return false;
},
    content:function(){
        "step 0"
        if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};

        event.list=["摸牌阶段摸牌数","出杀次数","手牌上限","体力值"];
        event.map={"摸牌阶段摸牌数":"draw","出杀次数":"sha","手牌上限":"limit","体力值":"hp"};

        var dialog=ui.create.dialognew("#tts_beijing");
        dialog.style.position="relative";

        var title=ui.create.div(".newTitle1",dialog);
        title.innerHTML="褽装";

        var box=ui.create.div(".tts_grid",dialog);

        var selected=null;
        for(let i=0;i<event.list.length;i++){
            let node=ui.create.div(".tts_xuanxiang",box);
            node.innerHTML=event.list[i];
            node.link=event.list[i];

            node.addEventListener("touchstart",function(){this.classList.add("select");});
            node.addEventListener("touchmove",function(e){
                var t=e.touches[0];
                var el=document.elementFromPoint(t.clientX,t.clientY);
                if(el!==this) this.classList.remove("select");
                else if(!this.classList.contains("select")) this.classList.add("select");
            });
            node.addEventListener("touchend",function(e){
                this.classList.remove("select");
                var t=e.changedTouches[0];
                var el=document.elementFromPoint(t.clientX,t.clientY);
                if(el!==this) return;

                if(selected&&selected!==this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                }else if(selected&&selected===this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                    game.check();
                    return;
                }
                selected=this;
                selected.classList.add("selected");
                ui.selected.buttons.push(selected);
                game.check();
            });
            node.addEventListener("click",function(){
                if(_status.touchmode) return;

                if(selected&&selected!==this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                }else if(selected&&selected===this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                    game.check();
                    return;
                }
                selected=this;
                selected.classList.add("selected");
                ui.selected.buttons.push(selected);
                game.check();
            });

            dialog.buttons.add(node);
        }

        var footer=ui.create.div(".tts_footer",dialog);
        footer.innerHTML="你已触发<span class='tts_blue'>褽装</span>，请令其中一项数值-1";

        if(player==game.me){
            if(ui.confirm) ui.confirm.close();
            ui.create.confirm("oc");
            ui.confirm.classList.add("newconfirm18");
        }

        player.chooseButton(dialog).set("selectButton",[1,1]).set("ai",function(button){
            if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
            var s=player.storage.hyweizhuang_gui;
            if(button.link=="体力值") return (player.hp<=1&&player.hasSkill("hy_caiqiu"))?3:0.1;
            if(button.link=="摸牌阶段摸牌数") return (s.draw>-1)?2:0.2;
            if(button.link=="出杀次数") return (s.sha>-1)?1.8:0.2;
            if(button.link=="手牌上限") return (s.limit>-1)?1.6:0.2;
            return 0.1;
        });

        "step 1"
        if(!result.bool){event.finish();return;}
        if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
        var s=player.storage.hyweizhuang_gui;

        var choice=result.links[0];
        var key=event.map[choice];

        if(key=="draw") s.draw--;
        else if(key=="sha") s.sha--;
        else if(key=="limit") s.limit--;
        else if(key=="hp") player.loseHp();

        player.updateMarks();

        "step 2"
        if(player.hasSkill("hy_caiqiu")) player.useSkill("hy_caiqiu");
    },
    mod:{
        maxHandcard:function(player,num){
            if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
            var s=player.storage.hyweizhuang_gui;
            if(s.limit) return num+s.limit;
        },
        cardUsable:function(card,player,num){
            if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
            var s=player.storage.hyweizhuang_gui;
            if(card.name=="sha"&&s.sha) return num+s.sha;
        },
    },
    group:["hyweizhuang_gui_draw","hyweizhuang_gui_count"],
    subSkill:{
        draw:{
            trigger:{
                player:"phaseDrawBegin2",
            },
            forced:true,
            filter:function(event,player){
                if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
                return player.storage.hyweizhuang_gui.draw&&!event.numFixed;
            },
            content:function(){
                trigger.num+=player.storage.hyweizhuang_gui.draw;
            },
            sub:true,
        },
        count:{
    audio:"hyweizhuang_gui",
    trigger:{
        player:["gainAfter","loseBegin"],
        global:["equipAfter","addJudgeAfter"],
    },
    forced:true,
    filter:function(event,player){
        if(event.name=='loseBegin' && event.player==player){
            if(!event.cards) return false;
            return event.cards.some(function(card){
                return card.hasGaintag("hy_xishang");
            });
        }
        if(event.name=='equip') return true;
        if(event.name=='addJudge') return true;
        if(event.name=='gain' && event.player==player){
            if(!event.cards) return false;
            return event.cards.some(function(card){
                return card.hasGaintag("hy_xishang");
            });
        }
        return false;
    },
    content:function(){
        "step 0"
        if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
        var s=player.storage.hyweizhuang_gui;
        var num=game.countPlayer();
        
        if(trigger.name=='loseBegin'){
            player.storage.hyweizhuang_gui_equip_flag=true;
            event.finish();
            return;
        }
        
        var add=0;
        if(trigger.name=='equip'){
            if(trigger.player==player && player.storage.hyweizhuang_gui_equip_flag){
                delete player.storage.hyweizhuang_gui_equip_flag;
                event.finish();
                return;
            }
            delete player.storage.hyweizhuang_gui_equip_flag;
            add=1;
        }else if(trigger.name=='addJudge'){
            add=1;
        }else if(trigger.name=='gain'){
            add=trigger.cards.filter(function(card){
                return card.hasGaintag("hy_xishang");
            }).length;
        }
        
        s.total+=add;
        
        if(s.addCount>=num+1||s.total<num+1){
            player.updateMarks();
            event.finish();
            return;
        }
        
        s.total-=(num+1);
        s.addCount++;
   
        
        event.list=["摸牌阶段摸牌数","出杀次数","手牌上限","体力值"];
        event.map={"摸牌阶段摸牌数":"draw","出杀次数":"sha","手牌上限":"limit","体力值":"hp"};

        var dialog=ui.create.dialognew("#tts_beijing");
        dialog.style.position="relative";

        var title=ui.create.div(".newTitle1",dialog);
        title.innerHTML="褽装";

        var box=ui.create.div(".tts_grid",dialog);

        var selected=null;
        for(let i=0;i<event.list.length;i++){
            let node=ui.create.div(".tts_xuanxiang",box);
            node.innerHTML=event.list[i];
            node.link=event.list[i];

            node.addEventListener("touchstart",function(){this.classList.add("select");});
            node.addEventListener("touchmove",function(e){
                var t=e.touches[0];
                var el=document.elementFromPoint(t.clientX,t.clientY);
                if(el!==this) this.classList.remove("select");
                else if(!this.classList.contains("select")) this.classList.add("select");
            });
            node.addEventListener("touchend",function(e){
                this.classList.remove("select");
                var t=e.changedTouches[0];
                var el=document.elementFromPoint(t.clientX,t.clientY);
                if(el!==this) return;

                if(selected&&selected!==this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                }else if(selected&&selected===this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                    game.check();
                    return;
                }
                selected=this;
                selected.classList.add("selected");
                ui.selected.buttons.push(selected);
                game.check();
            });
            node.addEventListener("click",function(){
                if(_status.touchmode) return;

                if(selected&&selected!==this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                }else if(selected&&selected===this){
                    selected.classList.remove("selected");
                    var idx=ui.selected.buttons.indexOf(selected);
                    if(idx>-1) ui.selected.buttons.splice(idx,1);
                    selected=null;
                    game.check();
                    return;
                }
                selected=this;
                selected.classList.add("selected");
                ui.selected.buttons.push(selected);
                game.check();
            });

            dialog.buttons.add(node);
        }

        var footer=ui.create.div(".tts_footer",dialog);
        footer.innerHTML="你已触发<span class='tts_blue'>褽装</span>，请令其中一项数值+1";

        if(player==game.me){
            if(ui.confirm) ui.confirm.close();
            ui.create.confirm("oc");
            ui.confirm.classList.add("newconfirm18");
        }

        player.chooseButton(dialog).set("selectButton",[1,1]).set("ai",function(button){
            if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
            var s=player.storage.hyweizhuang_gui;
            if(button.link=="体力值") return (player.hp<player.maxHp)?3:0.5;
            if(button.link=="摸牌阶段摸牌数") return (s.draw<2)?2.2:1;
            if(button.link=="出杀次数") return (s.sha<2)?2:0.9;
            if(button.link=="手牌上限") return 1.6;
            return 0.5;
        });

        "step 1"
        if(!result.bool){player.updateMarks();event.finish();return;}
        if(!player.storage.hyweizhuang_gui) player.storage.hyweizhuang_gui={count:0,addCount:0,total:0,draw:0,sha:0,limit:0};
        var s=player.storage.hyweizhuang_gui;

        var choice=result.links[0];
        var key=event.map[choice];

        if(key=="draw") s.draw++;
        else if(key=="sha") s.sha++;
        else if(key=="limit") s.limit++;
        else if(key=="hp") player.recover();

        player.updateMarks();
    },
    sub:true,
},
    },
},
"hyweizhuang_dong":{
	audio:"ext:手杀武将/apk/崔芙/audio/崔芙:6",
    group:["hyweizhuang_dong_1","hyweizhuang_dong_2","hyweizhuang_dong_3","hyweizhuang_dong_4","hyweizhuang_dong_5","hyweizhuang_dong_6"],
    mark:true,
    marktext:"褽装",
    intro:{
        content:function(storage,player){
            var types=[];
            player.getCards('h').forEach(c=>{
                if(c.hasGaintag('hy_xishang')){
                    var type=get.type2(c);
                    if(!types.includes(type)) types.push(type);
                }
            });
            player.getCards('e').forEach(c=>{
                var type=get.type2(c);
                if(!types.includes(type)) types.push(type);
            });
            return '明置牌类别数：'+types.length;
        },
    },
    "_updateMark":function(player){
        if(!player.marks||!player.marks.hyweizhuang_dong) player.markSkill("hyweizhuang_dong");
        var markNode=player.marks&&player.marks.hyweizhuang_dong;
        var arr=player.storage.hyweizhuang_dong_order||[];
        var txt="褽装"+(arr.length?(" "+arr.join("")):"");
        if(markNode&&markNode.firstChild) markNode.firstChild.innerHTML=txt;
    },
    subSkill:{
        "1":{
            audio:"hyweizhuang_dong",
            trigger:{
                source:"damageBegin1",
                player:"recoverBegin",
            },
            forced:true,
            filter:function(event,player){
                if(player.storage.hyweizhuang_dong_basic) return false;
                if(event.name=='damage'){
                    if(!event.card||event.card.name!='sha') return false;
                }
                if(event.name=='recover'){
                    if(!event.card||event.card.name!='tao') return false;
                }
                var types=[];
                player.getCards('h').forEach(c=>{
                    if(c.hasGaintag('hy_xishang')){
                        var type=get.type2(c);
                        if(!types.includes(type)) types.push(type);
                    }
                });
                player.getCards('e').forEach(c=>{
                    var type=get.type2(c);
                    if(!types.includes(type)) types.push(type);
                });
                return types.length>=1;
            },
            content:function(){
                trigger.num++;
                player.storage.hyweizhuang_dong_basic=true;
                if(!player.storage.hyweizhuang_dong_order) player.storage.hyweizhuang_dong_order=[];
                if(!player.storage.hyweizhuang_dong_order.includes("基")) player.storage.hyweizhuang_dong_order.push("基");
                lib.skill.hyweizhuang_dong._updateMark(player);
            },
            sub:true,
            parentskill:"hyweizhuang_dong",
        },
        "2":{
            audio:"hyweizhuang_dong",
            trigger:{
                player:"useCardAfter",
            },
            forced:true,
            filter:function(event,player){
                if(player.storage.hyweizhuang_dong_basic) return false;
                if(event.card.name!='jiu') return false;
                var types=[];
                player.getCards('h').forEach(c=>{
                    if(c.hasGaintag('hy_xishang')){
                        var type=get.type2(c);
                        if(!types.includes(type)) types.push(type);
                    }
                });
                player.getCards('e').forEach(c=>{
                    var type=get.type2(c);
                    if(!types.includes(type)) types.push(type);
                });
                return types.length>=1;
            },
            content:function(){
                if(player.storage.jiu==null) player.storage.jiu=0;
                player.storage.jiu++;
                player.storage.hyweizhuang_dong_basic=true;
                if(!player.storage.hyweizhuang_dong_order) player.storage.hyweizhuang_dong_order=[];
                if(!player.storage.hyweizhuang_dong_order.includes("基")) player.storage.hyweizhuang_dong_order.push("基");
                lib.skill.hyweizhuang_dong._updateMark(player);
            },
            sub:true,
            parentskill:"hyweizhuang_dong",
        },
        "3":{
            audio:"hyweizhuang_dong",
            trigger:{
                player:"useCardToTargeted",
            },
            direct:true,
            filter:function(event,player){
                if(player.storage.hyweizhuang_dong_trick) return false;
                if(get.type(event.card)!='trick') return false;
                if(!event.isFirstTarget) return false;
                var types=[];
                player.getCards('h').forEach(c=>{
                    if(c.hasGaintag('hy_xishang')){
                        var type=get.type2(c);
                        if(!types.includes(type)) types.push(type);
                    }
                });
                player.getCards('e').forEach(c=>{
                    var type=get.type2(c);
                    if(!types.includes(type)) types.push(type);
                });
                if(types.length<2) return false;
                return event.targets.some(function(target){
                    return target.countCards('he')>0;
                });
            },
            content:function(){
                'step 0'
                var targets=trigger.targets.filter(function(target){
                    return target.countCards('he')>0;
                });
                player.chooseTarget('是否获得其中一名目标角色的一张牌？',function(card,player,target){
                    return _status.event.targets.includes(target);
                }).set('targets',targets).set('ai',function(target){
                    return -get.attitude(player,target);
                });
                'step 1'
                if(result.bool){
                    var target=result.targets[0];
                    player.logSkill('hyweizhuang_dong_3',target);
                    player.gainPlayerCard(target,'he',true);
                    player.storage.hyweizhuang_dong_trick=true;
                    if(!player.storage.hyweizhuang_dong_order) player.storage.hyweizhuang_dong_order=[];
                    if(!player.storage.hyweizhuang_dong_order.includes("锦")) player.storage.hyweizhuang_dong_order.push("锦");
                    lib.skill.hyweizhuang_dong._updateMark(player);
                }
            },
            sub:true,
            parentskill:"hyweizhuang_dong",
        },
        "4":{
            audio:"hyweizhuang_dong",
            trigger:{
                player:"useCardAfter",
            },
            direct:true,
            filter:function(event,player){
                if(player.storage.hyweizhuang_dong_equip) return false;
                if(get.type(event.card)!='equip') return false;
                var types=[];
                player.getCards('h').forEach(c=>{
                    if(c.hasGaintag('hy_xishang')){
                        var type=get.type2(c);
                        if(!types.includes(type)) types.push(type);
                    }
                });
                player.getCards('e').forEach(c=>{
                    var type=get.type2(c);
                    if(!types.includes(type)) types.push(type);
                });
                if(types.length<3) return false;
                return game.hasPlayer(function(current){
                    return current.getCards('h').some(function(c){
                        return c.hasGaintag&&c.hasGaintag('hy_xishang');
                    })&&(!current.storage.hyweizhuang_dong_used||!current.storage.hyweizhuang_dong_used.includes(player));
                });
            },
            content:function(){
                'step 0'
                var targets=game.filterPlayer(function(current){
                    return current.getCards('h').some(function(c){
                        return c.hasGaintag&&c.hasGaintag('hy_xishang');
                    })&&(!current.storage.hyweizhuang_dong_used||!current.storage.hyweizhuang_dong_used.includes(player));
                });
                player.chooseTarget('是否令一名有明置牌的角色摸两张牌？',function(card,player,target){
                    return _status.event.targets.includes(target);
                }).set('targets',targets).set('ai',function(target){
                    return get.attitude(player,target);
                });
                'step 1'
                if(result.bool){
                    var target=result.targets[0];
                    player.logSkill('hyweizhuang_dong_4',target);
                    target.draw(2);
                    if(!target.storage.hyweizhuang_dong_used) target.storage.hyweizhuang_dong_used=[];
                    target.storage.hyweizhuang_dong_used.push(player);
                    player.storage.hyweizhuang_dong_equip=true;
                    if(!player.storage.hyweizhuang_dong_order) player.storage.hyweizhuang_dong_order=[];
                    if(!player.storage.hyweizhuang_dong_order.includes("装")) player.storage.hyweizhuang_dong_order.push("装");
                    lib.skill.hyweizhuang_dong._updateMark(player);
                }
            },
            sub:true,
            parentskill:"hyweizhuang_dong",
        },
        "5":{
            trigger:{
                global:"phaseAfter",
            },
            silent:true,
            charlotte:true,
            filter:function(event,player){
                return player.storage.hyweizhuang_dong_used||player.storage.hyweizhuang_dong_basic||player.storage.hyweizhuang_dong_trick||player.storage.hyweizhuang_dong_equip||player.storage.hyweizhuang_dong_order;
            },
            content:function(){
                delete player.storage.hyweizhuang_dong_used;
                delete player.storage.hyweizhuang_dong_basic;
                delete player.storage.hyweizhuang_dong_trick;
                delete player.storage.hyweizhuang_dong_equip;
                delete player.storage.hyweizhuang_dong_order;
                lib.skill.hyweizhuang_dong._updateMark(player);
            },
            sub:true,
            parentskill:"hyweizhuang_dong",
            forced:true,
            popup:false,
        },
        "6":{
            audio:"hyweizhuang_dong",
            trigger:{
                player:"recoverBegin",
            },
            forced:true,
            filter:function(event,player){
                if(player.storage.hyweizhuang_dong_basic) return false;
                if(!event.card||event.card.name!='jiu') return false;
                var types=[];
                player.getCards('h').forEach(c=>{
                    if(c.hasGaintag('hy_xishang')){
                        var type=get.type2(c);
                        if(!types.includes(type)) types.push(type);
                    }
                });
                player.getCards('e').forEach(c=>{
                    var type=get.type2(c);
                    if(!types.includes(type)) types.push(type);
                });
                return types.length>=1;
            },
            content:function(){
                trigger.num++;
                player.storage.hyweizhuang_dong_basic=true;
                if(!player.storage.hyweizhuang_dong_order) player.storage.hyweizhuang_dong_order=[];
                if(!player.storage.hyweizhuang_dong_order.includes("基")) player.storage.hyweizhuang_dong_order.push("基");
                lib.skill.hyweizhuang_dong._updateMark(player);
            },
            sub:true,
            parentskill:"hyweizhuang_dong",
        },
    },
},
"hyweizhuang_xiu":{
    audio:"ext:手杀武将/apk/崔芙/audio/崔芙:6",
    mark:true,
    marktext:"褽装 绣阁",
    intro:{
        name:"褽装(绣阁)",
        content:function(storage,player){
            var suits=[];
            player.getCards('h').forEach(function(card){
                if(card.hasGaintag('hy_xishang')){
                    var s=get.suit(card);
                    if(!suits.includes(s)) suits.push(s);
                }
            });
            player.getCards('e').forEach(function(card){
                var s=get.suit(card);
                if(!suits.includes(s)) suits.push(s);
            });
            var suitStyle={
                diamond:"<span style='color:red;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♦</span>",
                heart:"<span style='color:red;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♥</span>",
                spade:"<span style='color:black;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♠</span>",
                club:"<span style='color:black;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♣</span>"
            };
            var icons="";
            for(var i=0;i<suits.length;i++){
                icons+=(suitStyle[suits[i]]||get.translation(suits[i])||"");
            }
            var str='明置牌花色数:'+suits.length+(icons?(" "+icons):"");
            if(suits.length>=4) str+='<br>展示替代弃置';
            var usedCards=player.storage.hyweizhuang_xiu_used||[];
            if(usedCards.length>0){
                str+='<br>已用:';
                for(var j=0;j<usedCards.length;j++){
                    str+=get.translation(usedCards[j]);
                    if(j<usedCards.length-1) str+=' ';
                }
            }
            return str;
        },
    },
    "_updateMark":function(player){
        if(!player.marks||!player.marks.hyweizhuang_xiu) player.markSkill("hyweizhuang_xiu");
        var markNode=player.marks&&player.marks.hyweizhuang_xiu;
        var suits=player.storage.hyweizhuang_xiu_suits||[];
        var suitStyle={
            diamond:"<span style='color:red;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♦</span>",
            heart:"<span style='color:red;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♥</span>",
            spade:"<span style='color:black;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♠</span>",
            club:"<span style='color:black;opacity:0.8;font-size:0.9em;line-height:1;text-shadow:-0.5px -0.5px 0 #fff,0.5px -0.5px 0 #fff,-0.5px 0.5px 0 #fff,0.5px 0.5px 0 #fff;'>♣</span>"
        };
        var icons="";
        for(var i=0;i<suits.length;i++){
            icons+=(suitStyle[suits[i]]||get.translation(suits[i])||"");
        }
        var usedCards=player.storage.hyweizhuang_xiu_used||[];
        var usedText="";
        if(usedCards.length>0){
            for(var j=0;j<usedCards.length;j++){
                usedText+=get.translation(usedCards[j]);
            }
        }
        var txt=(suits.length>=4)?("褽装展示"+(usedText?" "+usedText:"")):("褽装"+(icons?(" "+icons):"")+(usedText?" "+usedText:""));
        if(markNode&&markNode.firstChild) markNode.firstChild.innerHTML=txt;
    },
    enable:["chooseToUse","chooseToRespond"],
    filter:function(event,player){
        var subtypes=['equip1','equip2','equip3','equip4'];
        var names=['sha','shan','tao','jiu'];
        var usedCards=player.storage.hyweizhuang_xiu_used||[];
        for(var i=0;i<4;i++){
            if(usedCards.includes(names[i])) continue;
            if(player.countCards('he',{subtype:subtypes[i]})>0){
                var card=get.autoViewAs({name:names[i],storage:{hyweizhuang_xiu:true}},player.getCards('he',{subtype:subtypes[i]}));
                if(event.filterCard(card,player,event)) return true;
            }
        }
        return false;
    },
    chooseButton:{
        dialog:function(event,player){
            var list=[];
            var subtypes=['equip1','equip2','equip3','equip4'];
            var names=['sha','shan','tao','jiu'];
            var usedCards=player.storage.hyweizhuang_xiu_used||[];
            for(var i=0;i<4;i++){
                if(usedCards.includes(names[i])) continue;
                if(player.countCards('he',{subtype:subtypes[i]})>0){
                    var card=get.autoViewAs({name:names[i],storage:{hyweizhuang_xiu:true}},player.getCards('he',{subtype:subtypes[i]}));
                    if(event.filterCard(card,player,event)){
                        list.push(['基本','',names[i]]);
                    }
                }
            }
            return ui.create.dialog('褽装',[list,'vcard']);
        },
        filter:function(button,player){
            var evt=_status.event.getParent();
            var subtypes=['equip1','equip2','equip3','equip4'];
            var names=['sha','shan','tao','jiu'];
            var idx=names.indexOf(button.link[2]);
            if(idx<0) return false;
            var usedCards=player.storage.hyweizhuang_xiu_used||[];
            if(usedCards.includes(names[idx])) return false;
            var card=get.autoViewAs({name:names[idx],storage:{hyweizhuang_xiu:true}},player.getCards('he',{subtype:subtypes[idx]}));
            return evt.filterCard(card,player,evt);
        },
        backup:function(links,player){
            return {
                audio:'hyweizhuang_xiu',
                filterCard:function(card,player){
                    var name=lib.skill.hyweizhuang_xiu_backup.cardName;
                    var subtype='equip1';
                    if(name=='shan') subtype='equip2';
                    if(name=='tao') subtype='equip3';
                    if(name=='jiu') subtype='equip4';
                    return get.subtype(card)==subtype;
                },
                selectCard:1,
                position:'he',
                check:function(card){
                    return 7-get.value(card);
                },
                cardName:links[0][2],
                viewAs:{
                    name:links[0][2],
                    isCard:true,
                    storage:{
                        hyweizhuang_xiu:true,
                    },
                },
                precontent:function(){
                    event.getParent().addCount = false;
                    player.logSkill('hyweizhuang_xiu');
                    if(!player.storage.hyweizhuang_xiu_used) player.storage.hyweizhuang_xiu_used=[];
                    player.storage.hyweizhuang_xiu_used.push(lib.skill.hyweizhuang_xiu_backup.cardName);
                    lib.skill.hyweizhuang_xiu._updateMark(player);
                    var suits=[];
                    player.getCards('h').forEach(function(card){
                        if(card.hasGaintag('hy_xishang')){
                            var s=get.suit(card);
                            if(!suits.includes(s)) suits.push(s);
                        }
                    });
                    player.getCards('e').forEach(function(card){
                        var s=get.suit(card);
                        if(!suits.includes(s)) suits.push(s);
                    });
                    var canShow=suits.length>=4;
                    var suit=get.suit(event.result.cards[0]);
                    player.storage.hyweizhuang_xiu_drawsuit=suit;
                    if(canShow){
                        player.showCards(get.translation(player)+'发动了【褽装】',event.result.cards.slice(0));
                    }
                    else{
                        player.discard(event.result.cards);
                    }
                    event.result.cards=[];
                    event.result.card.cards=[];
                    delete event.result.card.suit;
                    delete event.result.card.number;
                },
                ai:{
                    result:{
                        player:1,
                    },
                },
            }
        },
        prompt:function(links,player){
            return '弃置/展示一张装备牌,视为使用'+get.translation(links[0][2]);
        },
    },
    ai:{
        order:8,
        result:{
            player:1,
        },
        respondShan:true,
    },
    mod:{
        targetInRange:function(card){
            if(card.storage&&card.storage.hyweizhuang_xiu) return true;
        },
        cardUsable:function(card){
            if(card.storage&&card.storage.hyweizhuang_xiu) return Infinity;
        },
    },
    group:["hyweizhuang_xiu_draw","hyweizhuang_xiu_mark","hyweizhuang_xiu_clear"],
    subSkill:{
        mark:{
            trigger:{
                player:["gainAfter","loseAfter","equipAfter","loseAsyncAfter","useCardAfter","respondAfter"],
            },
            silent:true,
            charlotte:true,
            forced:true,
            popup:false,
            lastDo:true,
            content:function(){
                var suits=[];
                player.getCards('h').forEach(function(card){
                    if(card.hasGaintag('hy_xishang')){
                        var s=get.suit(card);
                        if(!suits.includes(s)) suits.push(s);
                    }
                });
                player.getCards('e').forEach(function(card){
                    var s=get.suit(card);
                    if(!suits.includes(s)) suits.push(s);
                });
                player.storage.hyweizhuang_xiu_suits=suits;
                lib.skill.hyweizhuang_xiu._updateMark(player);
            },
            sub:true,
            parentskill:"hyweizhuang_xiu",
        },
        draw:{
            trigger:{
                player:["useCardAfter","respondAfter"],
            },
            forced:true,
            filter:function(event,player){
                return event.card&&event.card.storage&&event.card.storage.hyweizhuang_xiu&&player.storage.hyweizhuang_xiu_drawsuit;
            },
            content:function(){
                var suit=player.storage.hyweizhuang_xiu_drawsuit;
                delete player.storage.hyweizhuang_xiu_drawsuit;
                var cards=[];
                for(var i=0;i<ui.cardPile.childNodes.length;i++){
                    if(get.suit(ui.cardPile.childNodes[i])==suit){
                        cards.push(ui.cardPile.childNodes[i]);
                        break;
                    }
                }
                if(cards.length) player.gain(cards,'gain2');
            },
            sub:true,
            parentskill:"hyweizhuang_xiu",
        },
        clear:{
            trigger:{
                global:"phaseEnd",
            },
            forced:true,
            silent:true,
            charlotte:true,
            popup:false,
            content:function(){
                player.storage.hyweizhuang_xiu_used=[];
                lib.skill.hyweizhuang_xiu._updateMark(player);
            },
            sub:true,
            parentskill:"hyweizhuang_xiu",
        },
        backup:{
            sub:true,
            parentskill:"hyweizhuang_xiu",
        },
    },
},
            "hy_xishang":{
                audio:"ext:手杀武将/apk/崔芙/audio/崔芙:8",
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                filter:function(event,player){
  return (event.name!='phase'||game.phaseNumber==0);
 },
                content:function(){
    'step 0'
var list=[
    ['hy_cuifu1','hyweizhuang_gui'],
    ['hy_cuifu2','hyweizhuang_dong'],
    ['hy_cuifu3','hyweizhuang_xiu']
];
var characters=[];
for(var i=0;i<list.length;i++){
    characters.push(list[i][0]);
}
player.chooseButton([
    '请选择一个褽装形态',
    [characters,'character']
],true).set('ai',function(button){
    var alivePlayers = game.countPlayer();
    if(alivePlayers >= 5){
        return button.link == 'hy_cuifu1' ? 1 : 0;
    }else{
        var hasTeammate = game.hasPlayer(function(current){
            return current != _status.event.player && current != _status.event.player && current.identity == _status.event.player.identity;
        });
        if(hasTeammate){
            return button.link == 'hy_cuifu3' ? 1 : 0;
        }else{
            return button.link == 'hy_cuifu2' ? 1 : 0;
        }
    }
});
    'step 1'
    if(result.bool){
        var characterName=result.links[0];
        var skillMap={
            'hy_cuifu1':'hyweizhuang_gui',
            'hy_cuifu2':'hyweizhuang_dong',
            'hy_cuifu3':'hyweizhuang_xiu'
        };
        var skillName=skillMap[characterName];
        
        player.addSkill(skillName);
        game.broadcastAll(function(p,name){
            p.node.avatar.setBackground(name,'character');
            if(p==game.me&&ui.fakeme) ui.fakeme.style.backgroundImage=p.node.avatar.style.backgroundImage;
        },player,characterName);
        game.delay(2);
    }
},
                group:"hy_xishang_tag",
                subSkill:{
                    tag:{
                        trigger:{
                            player:"gainAfter",
                        },
                        forced:true,
                        filter:function(event,player){
    if(event.getParent&&event.getParent().name=='draw') return false;
    return event.cards&&event.cards.some(card=>player.getCards('h').includes(card));
   },
                        content:function(){
    var cards=trigger.cards.filter(card=>player.getCards('h').includes(card));
    if(cards.length) player.addGaintag(cards,'hy_xishang');
   },
                        sub:true,
                        parentskill:"hy_xishang",
                    },
                },
            },
        },
        translate:{
        "hy_qingshi":"清识",
            "hy_qingshi_info":"当你受到伤害后，你可以选择一名角色，然后若你与其阵营：相同，你和其各摸一张牌；不同，你和其各弃置一张牌",
            "hy_jiejie":"诫节",
            "hy_jiejie_info":"每名角色的出牌阶段限一次，其可以令你观看其手牌，然后你可以选择一种花色，若其手牌：包含此花色，其弃置所有不为此花色的手牌，本回合使用此花色的牌无次数限制；不含此花色，其从牌堆或弃牌堆中获得一张此花色的牌。然后每轮限两次，若其本轮以此法令你观看的牌包含的花色数唯一最多，你对其发动一次“清识”。",
            "hy_caiqiu":"裁裘",
            "hy_caiqiu_info":"每轮开始时，你观看牌堆顶X张牌（X为游戏人数），然后你可以获得其中任意张牌。若如此做，当其他角色本轮使用与你因此获得的牌同名的牌结算结束后，你失去1点体力",
            "hy_xishang":"袭裳",
            "hy_xishang_info":"锁定技，游戏开始时，你选择一种形态；你不因摸牌获得的牌均明置，且你的明置牌于被获得和弃置时不可见",
            "hyweizhuang_gui":"褽装",
            "hyweizhuang_gui_info":"有明置牌的角色的结束阶段，你可以令以下一项数值-1，然后发动一次“裁裘”：1.摸牌阶段摸牌数；2.出【杀】次数；3.手牌上限；4.体力值。每局游戏限X+1次，每有X+1张牌被明置后（X为存活角色数），你令以上一项数值+1",
            "hyweizhuang_dong":"褽装",
            "hyweizhuang_dong_info":"每回合每项限一次，若你明置牌包含的类别数大于等于：1，你使用基本牌的数值+1； 2，你使用锦囊牌指定目标后，可以获得其中一名目标角色的一张牌； 3，你使用装备牌结算结束后，你可以令一名有明置牌的角色摸两张牌",
            "hyweizhuang_xiu":"褽装",
            "hyweizhuang_xiu_info":"每回合每项各限一次，你可以弃置一张武器牌，视为使用一张【杀】；你可以弃置一张防具牌，视为使用一张【闪】；你可以弃置一张防御坐骑牌，视为使用一张【桃】；你可以弃置一张进攻坐骑牌，视为使用一张【酒】。你以此法使用虚拟牌无次数限制且不计入次数，且结算结束后获得一张弃置牌花色的牌。如果你明置的牌包含四种花色，将本技能中的弃置改为展示",
        },
    },
    intro:"",
author:"<img style=width:80px;border-radius:100%; src=" + lib.assetURL + "extension/手杀武将/apk/崔芙/author/haoyue.jpg></img>   <b><small><strong>皓月</strong></small></b>",

    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};