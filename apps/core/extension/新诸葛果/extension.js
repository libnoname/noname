import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"新诸葛果",content:function(config,pack){
},precontent:function(){
},config:{},help:{},package:{
    character:{
        character:{
            mb_zhugeguo: ['female', 'shu', 3, ['mbqirang','mbyuhua']],
        },
        translate: {
			mb_zhugeguo: "诸葛果",
        },
    },
    card:{
        card:{},
        translate:{},
        list:[],
    },
    skill:{
        skill:{
    mbqirang:{
    audio:'qirang',
    trigger:{player:'equipEnd'},
    frequent:true,
    content:function(){
        var card=get.cardPile(function(card){
            return get.type(card,'trick')=='trick';
        });
        if(card){
            player.gain(card,'gain2').gaintag.add('mbqirang');
            player.addSkill('mbqirang_use');
        }
    },
    ai:{
        effect:{
            target:function(card,player,target,current){
                if(get.type(card)=='equip'&&!get.cardtag(card,'gifts')) return [1,3];
            }
        },
        threaten:1.3
    },
    subSkill:{
        use:{
            audio:'mbqirang',
            trigger:{player:'useCard2'},
            forced:true,
            filter:function(event,player){
    if(get.type2(event.card)!='trick') return false;
    if(!player.hasHistory('lose',function(evt){
        if(evt.getParent()!=event) return false;
        for(var i in evt.gaintag_map){
            if(evt.gaintag_map[i].contains('mbqirang')) return true;
        }
        return false;
    })) return false;
    return true;
},
            content:function(){
                player.draw();
                game.log(player,'使用',trigger.card,'时摸了一张牌');
            },
            mod:{
                targetInRange:function(card,player,target){
                    if(!card.cards) return;
                    for(var i of card.cards){
                        if(i.hasGaintag('mbqirang')) return true;
                    }
                },
            },
        },
    },
},
	mbyuhua:{
    trigger:{player:'phaseJieshuBegin'},
    forced:true,
    audio:'yuhua',
    filter:function(event,player){
        return player.countCards('h')>player.hp;
    },
    content:function(){
        'step 0'
        var types=[];
        player.getCards('h').forEach(function(card){
            types.add(get.type2(card));
        });
        var num=Math.min(5,types.length);
        var cards=get.cards(num);
        game.cardsGotoOrdering(cards);
        var next=player.chooseToMove();
        next.set('list',[
            ['牌堆顶',cards],
            ['牌堆底'],
        ]);
        next.set('prompt','羽化：点击将牌移动到牌堆顶或牌堆底');
        next.processAI=function(list){
            var cards=list[0][1],player=_status.event.player;
            var att=get.sgn(get.attitude(player,player));
            var top=[];
            var judges=player.getCards('j');
            var stopped=false;
            if(!player.hasWuxie()){
                for(var i=0;i<judges.length;i++){
                    var judge=get.judge(judges[i]);
                    cards.sort(function(a,b){
                        return (judge(b)-judge(a))*att;
                    });
                    if(judge(cards[0])*att<0){
                        stopped=true;break;
                    }
                    else{
                        top.unshift(cards.shift());
                    }
                }
            }
            var bottom;
            if(!stopped){
                cards.sort(function(a,b){
                    return (get.value(b,player)-get.value(a,player))*att;
                });
                while(cards.length){
                    if((get.value(cards[0],player)<=5)==(att>0)) break;
                    top.unshift(cards.shift());
                }
            }
            bottom=cards;
            return [top,bottom];
        }
        'step 1'
        var top=result.moved[0];
        var bottom=result.moved[1];
        top.reverse();
        for(var i=0;i<top.length;i++){
            ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
        }
        for(i=0;i<bottom.length;i++){
            ui.cardPile.appendChild(bottom[i]);
        }
        player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
        game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
        game.updateRoundNumber();
        game.delayx();
    },
    mod:{
        ignoredHandcard:function(card,player){
            if(get.type(card)!='basic'){
                return true;
            }
        },
        cardDiscardable:function(card,player,name){
            if(name=='phaseDiscard'&&get.type(card)!='basic') return false;
        }
    },
},
},
                translate:{
			mbqirang: '祈禳',
			mbqirang_info: '有装备牌置入你的装备区时，你可从牌堆中获得一张锦囊牌，你使用此锦囊牌时无距离限制并摸一张牌。',
			mbyuhua: '羽化',
			mbyuhua_info: '锁定技,你的非基本牌不计入手牌上限；结束阶段，若你手牌数大于体力值，你观看牌堆顶 X 张牌( X 为你手牌类别数），将其中任意数量的牌置于牌堆顶，其余的牌置于牌堆底。',
        },
    },
    intro:"",
    author:"v",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};
