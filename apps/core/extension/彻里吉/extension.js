import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"彻里吉",content:function(config,pack){
},precontent:function(){
},config:{},help:{},package:{
    character:{
        character:{
            mb_cheliji: ['male', 'qun', 4, ['mbqucheng','mbqiangyong']],
        },
        translate: {
			mb_cheliji: "彻里吉",
        },
    },
    card:{
        card:{},
        translate:{},
        list:[],
    },
    skill:{
        skill:{
    mbqucheng: {
    audio: 2,
    locked: true,
    mod: {
        targetInRange: function(card, player, target) {
            if (card.name == 'sha') return true;
        },
        playerEnabled: function(card, player, target) {
            if (card.name != 'sha') return;
            if (card.storage && card.storage.mbqucheng) return;
            var prev = player.getPrevious();
            var next = player.getNext();
            if (target != prev && target != next) return false;
        },
    },
    trigger: { player: 'useCardAfter' },
    forced: true,
    filter: function(event, player) {
        if (event.card.name != 'sha') return false;
        if (!event.targets || event.targets.length != 1) return false;
        
        var target = event.targets[0];
        var isPrevDirection;
        if (event.card.storage && event.card.storage.mbqucheng_direction) {
            isPrevDirection = event.card.storage.mbqucheng_direction == 'prev';
        } else {
            isPrevDirection = target == player.getPrevious();
            if (!isPrevDirection && target != player.getNext()) return false;
        }
        var damaged = player.getHistory('sourceDamage', function(evt) {
            return evt.card == event.card;
        }).length > 0;
        if (damaged) return false;
        var checkTarget = isPrevDirection ? target.getPrevious() : target.getNext();
        if (checkTarget == player) return false;
        
        return player.canUse({ 
            name: 'sha', 
            storage: { mbqucheng: true, mbqucheng_direction: isPrevDirection ? 'prev' : 'next' } 
        }, checkTarget, false);
    },
    content: function() {
        var target = trigger.targets[0];
        var isPrevDirection;
        if (trigger.card.storage && trigger.card.storage.mbqucheng_direction) {
            isPrevDirection = trigger.card.storage.mbqucheng_direction == 'prev';
        } else {
            isPrevDirection = target == player.getPrevious();
        }
        
        var toUse = isPrevDirection ? target.getPrevious() : target.getNext();
        
        if (toUse) {
            player.useCard({ 
                name: 'sha', 
                storage: { 
                    mbqucheng: true, 
                    mbqucheng_direction: isPrevDirection ? 'prev' : 'next' 
                } 
            }, toUse, false).addCount = false;
        }
    },
    ai: {
        threaten: 1.2,
    },
},
    mbqiangyong: {
    audio: 2,
    locked: true,
    trigger: { source: 'damageBegin1' },
    filter: function(event, player) {
        return event.card && event.card.name == 'sha';
    },
    forced: true,
    content: function() {
        'step 0'
        var target = trigger.player;
        var num = player.getHistory('useCard', function(evt) {
            return evt.card.name == 'sha';
        }).length;
        event.num = num;
        
        if (num > 0 && target.countCards('he') > 0) {
            player.discardPlayerCard(target, num, 'he', true);
        } else {
            event._result = { bool: false };
        }
        'step 1'
        var target = trigger.player;
        if (target.countCards('h') == 0) {
            trigger.num++;
        }
    },
    ai: {
        threaten: 1.5,
    },
},

},
                translate:{
			mbqucheng: '驱乘',
			mbqucheng_info: '锁定技，你使用【杀】无距离限制，且不因此技能使用的【杀】只能指定上家/下家为目标。当你使用指定唯一目标的【杀】结算后，若此【杀】目标角色的上家/下家不是你且未造成伤害，此【杀】不计入次数，然后你视为对其的上家/下家使用一张普通【杀】。',
			mbqiangyong: '羌勇',
			mbqiangyong_info: '锁定技，你使用【杀】造成伤害时，弃置受伤角色的X张牌(X为本回合你使用【杀】的次数)，然后若其没有手牌，此【杀】伤害+1。',
        },
    },
    intro:"",
    author:"v",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};
