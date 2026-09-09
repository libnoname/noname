import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"苦情树下",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "涂山容容":["female","shen",3,["狐念之术","斗转星移"],["des:算无遗策的涂山二当家，有千面妖容的称号，被称为涂山的“最强智囊”。负责涂山收入，随身携带算盘。保护涂山苏苏，并逐步进行涂山苏苏和白月初再世情缘的计划。<br/><br/> 温柔腹黑，具有极高的智商，属于军师一类的角色，其他人经常被她蒙在鼓里不知道发生了什么，被称为“算无遗策的涂山二当家”，并有“千面妖容”的称号。<br/><br/>  手里一直拿着一只算盘，遇到“需要提供服务”的场合就会记账。十分尊敬两位姐姐，护短。对苏苏非常照顾和信任，甚至不惜因此与涂山雅雅对立，并支持她与白月初的恋情，总之，容容一直在扮演类似于苏苏妈妈的治愈系角色。<br/><br/> 若自己看重的人被欺负，则会记仇并等待时机报仇，如徒弟颜如玉被黑狐女王吸走四成妖力时，涂山容容便表示不会放过她 。不易动怒，遇事十分冷静沉着。"]],
            "西门吹沙":["male","shen",3,["雪雾御风扇"],["des:绰号“玉面风君”，擅长御风克敌。平时坐在轮椅上，展现出儒雅的一面。为了得到东方月初的血脉不惜冒着危险进入涂山领地。<br/><br/> 表面上看起来温文尔雅，实际上城府很深 。多疑 ，只能共患难，不可共富贵，如与虎鹤双仙在危险时可一起度过困难，但在必要时，如独吞东方月初时，亦会处心积虑地除掉对方。<br/><br/>"]],
            "翠玉灵":["female","shen",3,["心疗术","灵移之术"],["des:蛭妖之王，水蛭精一族的族长，妖界著名的医师，专长血液再生和控制型的妖术，可以自由在妖怪形态和人类形态之间切换，与涂山交好，栖息在涂山，涂山容容的治愈术就是由她传授作为。<br/><br/> 作为妖界著名的医师，翠玉灵专长血液再生和控制型的妖术，出场费很高，并表示“如果不是红红出马我才不会出诊”。和红红认识多年，但从未被她拜托过，因此对于东方月初和涂山红红的关系很感兴趣。身为血液专家，翠玉灵很快判断出了东方月初的灵血体质。<br/><br/> 在红红与一气道盟的金面火神金人凤交涉时，翠玉灵说出了自己身为“蛭妖之王”的身份，并揭穿了火神长期以来的阴谋。随后翠玉灵通过自己控制血液的技术强行抽出火神体内的神血，认为“这血液与这副肮脏皮囊不相称”。"]],
            "樊云飞":["male","shen",4,["沙暴袭","千年御水珠","万尘归宗"],["des:西狐，在人类妖怪战力排行榜上位列传说四皇之一。西西域狐族的皇子，后成为西西域狐皇。梵云飞又蠢又呆，口吃。虽是一只沙妖，但是不怕水。与冰将军厉雪扬有一段情缘。在厉雪扬临死前，于苦情树下签订了再世续缘。<br/><br/> 起初是个白痴，又蠢又呆，品味差，还有口吃。没有进取心，一直按照父亲安排地去做。但梵云飞一旦下定决心，就不畏艰难、即使伤害到了自己也要坚持去做。遇到厉雪扬后，有了自己的主见；即使国民反对，依然要将千年御水珠带在身边。此外，梵云飞是妻管严，一句“对不起，我下次不敢了”是口吃的梵云飞唯一能快速流利说出来的话。"]],
            "百妖魔君":["male","shen",4,["暗魅潜影"],["des:黑狐女王的手下，左使四大法王之首，擅长隐藏自己强大的妖气实施潜行活动。"]],
            "白月初":["male","shen",3,["道法符","纯质阳炎","虚空之泪"],["des:一名学生，被一气道盟严格控制，在这期间，隐藏实力。后从一气道盟逃脱，与涂山苏苏相遇并联手完成红线仙任务。实际上，白月初是道界最强之人东方月初的转世，除了拥有涂山红红的妖力之外，自身也有着非比寻常的力量，精通各式道法<br/><br/> 聪明隐忍，是个大吃货，到了嘴里的食物不管有没有问题都会吃下去，尽管在食物上吃过多次亏，如被下麻药。喜欢哄骗苏苏要东西吃。 有些欺软怕硬，有时会欺负苏苏，但遇到红红会秒怂，是典型的妻管严。<br/><br/> 因为穷苦多年，故变得十分贪财，相当吝啬；也十分羡慕有钱人，如王富贵。<br/><br/> 但是在一千多年以前，所有修道之人成立了一个前所未有的强大联盟，就叫一气道盟。这个联盟一直存在至今，长盛不衰，内里人才济济。<br/><br/> 其中又以王、李、张三家为最强，也最富有。因白月初是东方月初的转世，故而被一气道盟找到并归属于一气道盟，由王家负责监管 。后被涂山要走，不再是一气道盟的人。"]],
            "颜如玉":["male","shen",4,["望月掌","千颜"],["des:颜如玉原形是空陷山的牛鬼，空陷山牛鬼世世代代与火焰为伴，肉体极耐高温 。师承涂山容容，以外族之根基学习涂山之术，有绰号“千颜铁掌”。但当十五月圆之夜，在满月之辉的照耀下，涂山之术随纯月之光而去，他便会妖力消失殆尽，现出原形。<br/><br/> 学成后离开涂山，成为千颜采花大盗。纵横西域十多年，专拐无知女性，八岁到八十岁都不放过。后因被黑狐附身，成为黑狐界十大杰出青年之首、风头正劲的千貌郎君。<br/><br/> 因为本体太丑，所以颜如玉在颜值上有着执着，并有天赋。本性善良，但因为是妖，所以不了解人间规矩，做了许多错事 ，同时也并不在意人类怎么看。直到心中有了在意的人，颜如玉便下定决心改变自己。"]],
            "石宽":["male","shen",4,["引灵之术","北斗神拳"],["des:北帝，在人类妖怪战力排行榜上位列传说四皇之一，为北山妖帝，诨号毁灭天君。小时候是御妖国公主的侍卫，与公主互生情愫并在苦情树下许愿。<br/><br/> 后来公主为了消除石宽以及御妖国千万妖怪的“御妖子母符”而嫁给他人，却不幸死于叛乱者之手，临死前将子母符的解除之法告诉了石宽，封其为妖帝，请他保护好御妖国人民。<br/><br/> 石宽木讷少言，有极强的决心。因为喜欢御妖国公主，每日刻苦练拳，一心只想着永远保护公主。却从未想过要与公主在一起，把这份心意隐藏在心里。为了公主，可以不要自己的手臂甚至做好死的觉悟也要毁掉苦情巨树，让公主解脱。"]],
            "涂山苏苏":["female","shen",3,["纯爱天篇","绝缘之爪"],["des:呆萌迷糊的小狐妖，总是携带各种零食。法力低微，总是被评价为笨蛋蠢货，所以一直有个心愿就是成为一名正式红线仙来证明自己是真正的狐妖。<br/><br/> 实际上，涂山苏苏是涂山红红失去妖力和记忆而变成的女孩。在一气道盟和涂山的安排下，与白月初相遇并联手解决红线仙的任务。<br/><br/> 涂山狐妖一族以绝强的妖力、无上的妩媚、机敏的头脑傲立于众妖之中。涂山是涂山狐妖居住地，也是传说的“红仙界”，与一气道盟和南国等是平行而治的势力之一。<br/><br/> 涂山苏苏来自于涂山狐妖一族，实际上是因失去记忆和全部妖力而变成幼女形态的妖界最强之人——涂山红红。可以借白月初的血变回涂山红红。"]],
            "三尾黑魉":["male","shen",4,["蛊惑之尾"],["des:黑狐娘娘的手下之一，曾附身在颜如玉身上。"]],
            "王富贵":["male","shen",3,["四象镜","无尽沙漏","王权剑意"],["des:一气道盟中的王家少爷，自称“泡妹王”，以有钱为傲。王富贵起初负责监管白月初，也是白月初的死对头；之后因白月初不归一气道盟管，便宣告他自由。此外，王富贵是王权富贵的转世，而王权富贵与清瞳有再续前缘之约；于是王富贵与清瞳也有感情纠葛。<br/><br/> 传说在一千多年以前，所有修道之人成立了一个前所未有的强大联盟，就叫一气道盟。这个联盟一直存在至今，长盛不衰，内里人才济济。其中又以王、李、张三家为最强，也最富有。<br/><br/> 王富贵是一气道盟王家的大少爷，同时也是王权富贵的转世。<br/><br/> 王富贵颇为自信，也算自负，因为富有所以以此为豪，花钱大方，时常瞧不起白月初这类穷人。喜欢泡妞，不会丢下女方置于危险不顾。<br/><br/>最讨厌的就是别人叫他全名，因为他发现无论他获得什么成就，只要这个成就化作前缀落在后面的“王富贵”上，都显得愚蠢透顶 。<br/><br/>也最讨厌妖怪，实际上是因为对前世王权富贵斩杀太多妖怪而产生的愧疚之情。"]],
            "厉雪扬":["female","shen",4,["冰凌枪击","千年御水珠","天罡寒玉"],["des:人称冰将军，武器为冰凌雪枪。从人贩子手中救出梵云飞，对梵云飞一见钟情。经历种种磨难后嫁给了梵云飞。八十年后，与梵云飞在苦情树下结下再世情缘，祈求来世再继续相爱。<br/><br/> 厉雪扬性格豪爽，有胆识有气魄，颇有巾帼不让须眉的气概。虽然大大咧咧，但还是有少女心，口是心非；见到喜欢的人会脸红。对梵云飞偶有暴力之举，但对他也十分护短。"]],
            "王权富贵":["male","shen",4,["王权剑斩"],["des:王权世家的少年天才，王权霸业与东方淮竹的儿子，实力为王权世家最强者，史上最强道门兵人，一气道盟的终极兵器。因被家族作为道门兵人培养，生活没有自由，从而对清瞳的展示出来的外面的世界产生向往。后因清瞳和心中之道离开家门险失性命，最终还是被父亲放走。与清瞳签订再世续缘，转世后名为王富贵。<br/><br/> 天地初开万物生，万物灵长是为人，人以智见长，妖以力为优。人类总是被妖怪欺负，终于苍天开眼，人类发现了抗妖之物，谓之法宝。<br/><br/> 同时，诞生了第一个会使用法宝的家族，人们称他们为“王权”。王权世家是天下第一除妖世家，故有为“天地一剑，王权世家”之称。<br/><br/> 因从小到大被父亲当兵器培养，所以王权富贵看上去孤傲清冷，默默地执行父亲的命令，对指定的妖类一律斩杀。王权富贵并非见妖就杀，他内心十分善良，于是会为妖族的清瞳疗伤。从小不能出门，待过的地方除了家里就只有轿子，于是他渴望自由 。<br/><br/> 王权富贵为了自由，甚至愿意抛弃生命。由于清瞳给予王权富贵的关怀令他不再不问原由地去除妖，有了自己的坚持和道义，即使违抗了父亲。"]],
            "涂山雅雅":["female","shen",3,["妖气搜寻","无尽酒壶","绝对零域"],["des:九尾天狐，亦是妖盟的盟主。涂山雅雅有着强大的寒气妖力，在姐姐涂山红红离开后成为涂山第一战力。<br/><br/> 外表高傲冷漠，一觉得无聊的时候就会犯困，一切以自己的喜好为中心。非常仰慕姐姐，视其为自己的偶像，故而对于弱到毫无妖力的涂山苏苏，雅雅对其到底是不是姐姐而产生怀疑。<br/><br/>   涂山狐妖一族以绝强的妖力、无上的妩媚、机敏的头脑傲立于众妖之中 。涂山是涂山狐妖居住地，也是传说的“红仙界”，与一气道盟和南国等是平行而治的势力之一。<br/><br/> 涂山雅雅来自于涂山狐妖一族。在姐姐涂山红红不在时，由涂山雅雅守护涂山，并且担任了妖盟的盟主。"]],
            "金人凤":["male","shen",4,["换血妖术","纯质阳炎 "],["des:师从东方盟主，道界的泰山北斗。体内有着夺自东方盟主灵血，会使用灭妖神火“纯质阳炎”。<br/><br/> 因被涂山红红打至残废，再加上当年丑事被东方月初揭穿，金面火神对涂山红红和东方月初恨之入骨，便找到黑狐女王请她杀死二人，最后死于黑狐娘娘手中。<br/><br/> 在江湖人面前装成正义的化身，美名传扬；实则道貌岸然，下流无耻，不忠不孝，不仁不义 。追求名利，为了达到自己的目的，骗一女妖习得换血妖法，不惜杀掉收养自己并传授绝学的师父，更想占有两个小师妹。<br/><br/> 结果未能得逞，便传播东方一族的秘密令江湖中人追抢两个师妹，导致东方一族几近家破人亡。"]],
            "SP石宽":["male","shen",4,["毁灭的天地"],["des:北帝，在人类妖怪战力排行榜上位列传说四皇之一，为北山妖帝，诨号毁灭天君。小时候是御妖国公主的侍卫，与公主互生情愫并在苦情树下许愿。  后来公主为了消除石宽以及御妖国千万妖怪的“御妖子母符”而嫁给他人，却不幸死于叛乱者之手，临死前将子母符的解除之法告诉了石宽，封其为妖帝，请他保护好御妖国人民。  石宽木讷少言，有极强的决心。因为喜欢御妖国公主，每日刻苦练拳，一心只想着永远保护公主。却从未想过要与公主在一起，把这份心意隐藏在心里。为了公主，可以不要自己的手臂甚至做好死的觉悟也要毁掉苦情巨树，让公主解脱。"]],
            "涂山红红":["female","shen",4,["绝缘之爪 ","驱魔三式"],["des:东狐，在人类妖怪战力排行榜上位列传说四皇之一。涂山狐妖之王，亦是妖盟盟主。有温柔善良一面，也有霸气冷漠的一面。涂山红红有着强大到无与伦比的妖力，令众妖闻风丧胆，一直都是涂山第一人，深得妹妹涂山雅雅敬佩。<br/><br/>  幼年时曾经误杀了自己的救命恩人而一度陷入低潮。在救了东方月初后，内心有所放开，但因为心结不肯接受东方月初的表白。东方月初为了她的梦想离开涂山五十年，最后因某件变故，涂山红红面对自己的内心，与东方月初在苦情巨树下许下了来世再见的愿望。<br/><br/> 涂山狐妖一族以绝强的妖力、无上的妩媚、机敏的头脑傲立于众妖之中 。涂山是涂山狐妖居住地，也是传说的“红仙界”，与一气道盟和南国等是平行而治的势力之一。<br/><br/> 涂山红红来自于涂山，是涂山之主、狐妖之王，亦是妖盟的盟主，更是妖界最强之人 。在苦情树下启动转世续缘仪式后，失去所有妖力和记忆后变为涂山苏苏。<br/><br/> 霸气冷漠，但有温柔的一面。若所看重的人遇到危险，红红会不惜一切代价也会保护。不喜欢欠人钱，也遵循从不欠人恩情的原则。<br/><br/> 作为涂山之主，红红活得伟岸公正，所以对于欢都落兰要求与东方月初的转世平丘月初在苦情树下进行再世续缘仪式，红红无私到同意，生生地放走了自己唯一的希望。"]],
        },
        translate:{
            "涂山容容":"涂山容容",
            "西门吹沙":"西门吹沙",
            "翠玉灵":"翠玉灵",
            "樊云飞":"樊云飞",
            "百妖魔君":"百妖魔君",
            "白月初":"白月初",
            "颜如玉":"颜如玉",
            "石宽":"石宽",
            "涂山苏苏":"涂山苏苏",
            "三尾黑魉":"三尾黑魉",
            "王富贵":"王富贵",
            "厉雪扬":"厉雪扬",
            "王权富贵":"王权富贵",
            "涂山雅雅":"涂山雅雅",
            "金人凤":"金人凤",
            "SP石宽":"SP石宽",
            "涂山红红":"涂山红红",
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
            "狐念之术":{
                trigger:{
                    global:"changeHp",
                },
                filter:function(event,player){
        return event.player.hp==3&&event.player.countCards('h')&&!player.isTurnedOver();
    },
                check:function(event,player){
        return get.attitude(player,event.player)<=-3&&event.player.countCards('h')>3;
    },
                prompt:function(event,player){
        return '是否对'+get.translation(event.player)+'发动【狐念之术】？';
    },
                content:function(){
        player.turnOver();
        player.showCards(trigger.player.getCards('h'));
        player.gain(trigger.player,trigger.player.getCards('h',function(card){
            return get.name(card)=='shan'||get.name(card)=='shunshou';
        }),'give');
    },
            },
            "斗转星移":{
                enable:"phaseUse",
                filterTarget:function(card,player,target){
        return target.hp<target.maxHp;
    },
                selectTarget:[1,Infinity],
                filterCard:true,
                usable:1,
                check:function(card){
        var player=_status.currentPhase;
        if(player.countCards('h')>player.hp){
            return 7-get.value(card);
        }
        return 4-get.value(card);
    },
                content:function(){
        "step 0"
        var color=get.color(cards[0]);
        target.judge(function(card){
            return get.color(card)==color?1:0;
        });
        "step 1"
        if(result.bool){
            target.recover(2);
        }
    },
                ai:{
                    order:3,
                    result:{
                        target:function(player,target){
                return get.recoverEffect(target);
            },
                    },
                    threaten:1.5,
                },
            },
            "雪雾御风扇":{
                trigger:{
                    player:"drawBegin",
                },
                direct:true,
                filter:function(event,player){
        return !player.isMaxHandcard();
    },
                content:function(){
        'step 0'
        var nh=player.countCards('h');
        var num=game.countPlayer(function(current){
            return current.countCards('h')>nh;
        });
        player.chooseTarget(get.prompt('雪雾御风扇'),[1,num],function(card,player,target){
            return target.countCards('h')>nh;
        }).ai=function(target){
            return 0.5-get.attitude(player,target);
        }
        'step 1'
        if(result.bool){
            event.cards=[];
            event.list=result.targets.slice(0);
            event.list.sort(lib.sort.seat);
            player.logSkill('雪雾御风扇',result.targets);
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.list.length){
            event.list.shift().chooseToDiscard('h',2,true);
        }
        else{
            event.goto(4);
        }
        'step 3'
        if(result.bool&&result.cards.length){
            event.cards.push(result.cards[0]);
        }
        event.goto(2);
        'step 4'
        if(event.cards.length){
            player.chooseCardButton('选择并获得一张牌',event.cards).ai=function(button){
                return get.value(button.link);
            };
        }
        else{
            event.finish();
        }
        'step 5'
        if(result.bool){
            player.gain(result.links,'gain2');
        }
    },
                ai:{
                    expose:0.2,
                },
            },
            "心疗术":{
                enable:"phaseUse",
                usable:1,
                filterCard:{
                    color:"black",
                },
                filter:function(event,player){
        if(!player.countCards('h',{color:'black'})) return false;
        var players=game.filterPlayer();
        var min=players[0].hp;
        for(var i=0;i<players.length;i++){
            min=Math.min(min,players[i].hp);
        }
        for(var i=0;i<players.length;i++){
            if(players[i].hp==min&&players[i].isDamaged()) return true;
        }
        return false;
    },
                prompt:function(){
        var players=game.filterPlayer();
        var targets=[];
        var min=players[0].hp;
        for(var i=0;i<players.length;i++){
            min=Math.min(min,players[i].hp);
        }
        for(var i=0;i<players.length;i++){
            if(players[i].hp==min&&players[i].hp<players[i].maxHp){
                targets.push(players[i]);
            }
        }
        return '令'+get.translation(targets)+'回复一点体力';
    },
                check:function(card){
        return 8-get.value(card);
    },
                filterTarget:function(card,player,target){
        return target.isDamaged()&&target.isMinHp();
    },
                selectTarget:-1,
                content:function(){
        target.recover();
    },
                ai:{
                    expose:0.1,
                    order:9,
                    threaten:1.4,
                    result:{
                        player:function(player,target){
                var players=game.filterPlayer();
                var num=0;
                var min=players[0].hp;
                for(var i=0;i<players.length;i++){
                    min=Math.min(min,players[i].hp);
                }
                for(var i=0;i<players.length;i++){
                    if(players[i].hp==min&&players[i].hp<players[i].maxHp){
                        num+=get.recoverEffect(players[i],player,player);
                    }
                }
                return num;
            },
                    },
                },
            },
            "灵移之术":{
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                filter:function(event,player){
        return player.hasSkill('灵移之术_used');
    },
                content:function(){
        player.discoverCard();
    },
                subSkill:{
                    used:{
                        sub:true,
                    },
                    count:{
                        trigger:{
                            player:"useCard",
                        },
                        silent:true,
                        filter:function(event,player){
                return _status.currentPhase==player&&get.type(event.card)=='basic';
            },
                        content:function(){
                player.addTempSkill('灵移之术_used');
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                group:"灵移之术_count",
            },
            "沙暴袭":{
                enable:"phaseUse",
                unique:true,
                mark:true,
                skillAnimation:true,
                animationColor:"fire",
                init:function(player){
        player.storage=false;
    },
                filter:function(event,player){
        if(player.storage) return false;
        if(player.countCards('he',{color:'red'})<2) return false;
        return true;
    },
                filterTarget:function(card,player,target){
        return player.canUse('guohe',target);
    },
                filterCard:{
                    color:"red",
                },
                selectCard:2,
                position:"he",
                check:function(card){
        return 7-get.value(card);
    },
                selectTarget:-1,
                multitarget:true,
                multiline:true,
                line:"fire",
                content:function(){
        'step 0'
        targets.sort(lib.sort.seat);
        player.awakenSkill('沙暴袭');
        player.storage.huoyu=true;
        player.useCard({name:'guohe'},targets).animate=false;
        'step 1'
        player.useCard({name:'guohe'},targets).animate=false;
    },
                ai:{
                    order:7,
                    result:{
                        target:function(player,target){
                if(player.hasUnknown()) return 0;
                return get.effect(target,{name:'guohe'},player,target);
            },
                    },
                },
                intro:{
                    content:"limited",
                },
            },
            "千年御水珠":{
                enable:"phaseUse",
                usable:1,
                filter:function(event,player){
        if(event.filterCard({name:'sha'},player,event)||
            event.filterCard({name:'jiu'},player,event)||
            event.filterCard({name:'tao'},player,event)){
            return player.hasCard(function(card){
                return get.type(card)=='basic';
            });
        }
        return false;
    },
                chooseButton:{
                    dialog:function(event,player){
            var list=[];
            if(event.filterCard({name:'sha'},player,event)){
                list.push(['基本','','sha']);
                list.push(['基本','','sha','fire']);
                list.push(['基本','','sha','thunder']);
            }
            for(var i=0;i<lib.inpile.length;i++){
                if(lib.inpile[i]!='sha'&&
                    lib.card[lib.inpile[i]].type=='basic'&&
                    event.filterCard({name:lib.inpile[i]},player,event)){
                    list.push(['基本','',lib.inpile[i]]);
                }
            }
            return ui.create.dialog('造物',[list,'vcard'],'hidden');
        },
                    check:function(button){
            var player=_status.event.player;
            var card={name:button.link[2],nature:button.link[3]};
            if(game.hasPlayer(function(current){
                return player.canUse(card,current)&&get.effect(current,card,player,player)>0;
            })){
                switch(button.link[2]){
                    case 'tao':return 5;
                    case 'xuejibingbao': return 4;
                    case 'jiu':return 3.01;
                    case 'sha':
                        if(button.link[3]=='fire') return 2.95;
                        else if(button.link[3]=='fire') return 2.92;
                        else return 2.9;
                    default:return 2+_status.event.getRand()*2;
                }
            }
            return 0;
        },
                    backup:function(links,player){
            return {
                filterCard:function(card){
                    return get.type(card)=='basic';
                },
                viewAs:{name:links[0][2],nature:links[0][3]},
                popname:true,
                ai1:function(card){
                    return 6-get.value(card);
                }
            }
        },
                    prompt:function(links,player){
            return '将一张基本牌当作'+get.translation(links[0][3]||'')+get.translation(links[0][2])+'使用';
        },
                },
                ai:{
                    order:function(){
            var player=_status.event.player;
            var event=_status.event;
            if(event.filterCard({name:'jiu'},player,event)&&get.effect(player,{name:'jiu'})>0){
                return 3.1;
            }
            return 2.9;
        },
                    result:{
                        player:1,
                    },
                },
            },
            "万尘归宗":{
                trigger:{
                    global:"useCard",
                },
                priority:15,
                filter:function (event,player){
return event.card.name=='sha'&&event.player!=player&&event.targets.contains(player);
},
                content:function (){
"step 0"
player.discard(player.get('h'));
player.judge();
"step 1"
if(result.color=='red'){
trigger.player.gain(result.card);trigger.untrigger();
trigger.finish();
}
else{
player.gain(result.card);
}
},
            },
            "暗魅潜影":{
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('暗魅潜影'),'获得一名其他角色的两张牌，然后其摸两张牌。',function(card,player,target){
            if(player==target) return false;
            return target.countGainableCards(player,'he')>0;
        }).set('ai',function(target){
            return 10-get.attitude(_status.event.player,target);
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
            player.logSkill('暗魅潜影',target);
            player.gainPlayerCard(target,'he',2,true);
        }
        else event.finish();
        'step 2'
        target.draw(2);
    },
                trigger:{
                    player:["useCard","respond"],
                },
                direct:true,
                filter:function (event,player){
        return event.card.name=='shan';
    },
            },
            "道法符":{
                srlose:true,
                trigger:{
                    player:"phaseJieshuEnd",
                },
                filter:function (event, player) {
        return player.countCards('h', { type: 'basic' }) > 0;
      },
                direct:true,
                content:function () {
        'step 0'
        player.chooseToDiscard('是否发动【道法符】？', function (card) {
          return get.type(card) == 'basic';
        }).ai = function (card) {
          if (jlsg.needKongcheng(player) && player.countCards('h') == 1) return 10 - get.value(card);
          return 5 - get.useful(card);
        }
        'step 1'
        if (result.bool) {
          player.chooseControlList([
            "摸一张牌",
            "额外出牌阶段"
          ], true).set('ai', function (event, player) {
            if (player.num('h') > 2) return 1;
            if (jlsg.needKongcheng(player, true)) return 1;
            return 0;
          });
        } else {
          event.finish();
        }
        'step 2'
        player.logSkill("jlsg_wuqin");
        if (result.index == 0) {
          player.draw(1);
        } else {
          player.getStat().card = {};
          player.getStat().skill = {};
          player.phaseUse();
        }
      },
            },
            "纯质阳炎":{
                trigger:{
                    player:"damage",
                },
                filter:function(event,player){
        return event.num>0&&event.source&&event.source.isAlive();
    },
                check:function(event,player){
        return get.attitude(player,event.source)<=0;
    },
                content:function(){                    
       var chat=[''].randomGet();
player.say(chat); 
            trigger.source.damage(trigger.num,'fire');
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
                // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
            },
                    },
                },
            },
            "虚空之泪":{
                trigger:{
                    player:"useCard",
                },
                frequent:true,
                filter:function (event){
        return (get.type(event.card)=='trick'&&event.cards[0]&&event.cards[0]==event.card);
    },
                content:function (){
          "step 0"
        player.chooseTarget(get.prompt('虚空之泪'),function(card,player,target){
            return player!=target&&target.countCards('he')>0;
        }).set('autodelay',trigger.name=='respond'?0.5:1).ai=function(target){
            return -get.attitude(player,target);
        };
        "step 1"
        if(result.bool){
            player.logSkill('虚空之泪',result.targets);
            player.discardPlayerCard(result.targets[0],true);
            
            
        }
        else{
            event.finish();
        }        
        
        'step 2'
        var card=result.cards[0];
      if(get.color(card)=='red'){
            
            player.draw();
    }
      
    },
                ai:{
                    threaten:1.4,
                    noautowuxie:true,
                },
            },
            "望月掌":{
                nobracket:true,
                trigger:{
                    global:["respondAfter","useCardAfter"],
                },
                filter:function(event,player){
        if(!event.respondTo) return false;
        if(event.player==player) return false;
        if(event.respondTo[0]!=player) return false;
        return true;
    },
                init:function(player){
        player.storage=[];
    },
                popup:false,
                content:function(){
        player.storage.push(trigger.player);
        player.popup('望月掌','fire');
        
        player.draw(2);
    },
                group:["望月掌_update"],
                subSkill:{
                    update:{
                        popup:false,
                        forced:true,
                        trigger:{
                            global:"phaseBefore",
                        },
                        content:function(){
                player.storage=[];
            },
                        sub:true,
                    },
                },
            },
            "千颜":{
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                filter:function(event,player){
        return event.source&&event.source.countCards('e')>0;
    },
                content:function(){
        "step 0"
        var att=get.attitude(player,trigger.source);
        player.choosePlayerCard('e',get.prompt('千颜'),trigger.source).ai=function(button){
            if(att<=0){
                return get.equipValue(button.link);
            }
            return 0;
        }
        "step 1"
        if(result.bool){
            player.logSkill('千颜',trigger.source);
            player.equip(result.links[0]);
            trigger.source.$give(result.links[0],player,false);
        }
    },
                ai:{
                    "maixie_defend":true,
                },
            },
            "引灵之术":{
                mod:{
                    cardname:function(card,player,name){
            if(card.name=='shan'&&player.hp==2) return 'sha';
        },
                    cardUsable:function(card,player,num){
            if(card.name=='sha'&&player.hp==2) return Infinity;
        },
                    targetEnabled:function(card,player,target,now){
            if(target.hp==2){
                if(card.name=='sha') return false;
            }
        },
                },
                ai:{
                    skillTagFilter:function(player){
            if(!player.countCards('h','shan')) return false;
            if(player.hp!=2) return false;
        },
                    respondSha:true,
                },
                trigger:{
                    player:["useCard1","respond"],
                },
                firstDo:true,
                forced:true,
                filter:function(event,player){
        return event.card.name=='sha'&&!event.skill&&
        event.cards.length==2&&event.cards[0].name=='shan';
    },
                content:function(){},
            },
            "北斗神拳":{
                trigger:{
                    global:"roundStart",
                },
                direct:true,
                filter:function(event,player){
        if(player.countCards('he')==0) return false;
        return game.hasPlayer(function(current){
            return (current!=player&&get.distance(player,current,'attack')<=1&&player.hp<=current.hp);
        });
    },
                content:function(){
        "step 0"
        var next=player.chooseCardTarget({
            position:'he',
            filterTarget:function(card,player,target){
                return get.distance(player,target,'attack')<=1&&
                    player!=target&&player.hp<=target.hp;
            },
            filterCard:lib.filter.cardDiscardable,
            ai1:function(card){
                return 9-get.value(card);
            },
            ai2:function(target){
                return get.damageEffect(target,player,player);
            },
            prompt:get.prompt('北斗神拳')
        });
        "step 1"
        if(result.bool){
            player.discard(result.cards);
            player.logSkill('北斗神拳',result.targets);
            result.targets[0].damage(1);
        }
    },
                ai:{
                    expose:0.3,
                },
            },
            "纯爱天篇":{
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                content:function (){
        "step 0"
        event.count=trigger.num;
        "step 1"
        player.chooseTarget(get.prompt('纯爱天篇'),'令一名角色摸一张牌。然后若其手牌数大于体力上限，你摸两张牌').set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>2){
                if((target.maxHp-target.countCards('h'))>2) return 2*att;
                return att;
            }
            return att/3;
        });
        "step 2"
        if(result.bool){
            event.current=result.targets[0];
            player.logSkill('纯爱天篇',event.current);
            player.line(event.current,'thunder');
            event.current.draw();
            event.count--;
        }
        else event.finish();
        "step 3"
        if(event.current.countCards('h')>event.current.maxHp){
            player.draw(2);
        }
        if(event.count>0) event.goto(1);
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'damage')&&target.hp>1){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    var max=0;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(get.attitude(target,players[i])>0){
                            max=Math.max(Math.min(5,players[i].hp)-players[i].countCards('h'),max);
                        }
                    }
                    switch(max){
                        case 0:return 2;
                        case 1:return 1.5;
                        case 2:return [1,2];
                        default:return [0,max];
                    }
                }
                if((card.name=='tao'||card.name=='caoyao')&&
                    target.hp>1&&target.countCards('h')<=target.hp) return [0,0];
            },
                    },
                },
            },
            "绝缘之爪":{
                mod:{
                    targetEnabled:function (card,player,target,now){
            if(target.countCards('j')>0&&player!=target){
                if(get.tag(card,'damage')) return false;
            }
        },
                },
                trigger:{
                    target:"useCardToEnd",
                },
                forced:true,
                filter:function (event,player){
        return get.type(event.card)=='delay'&&player.countCards('j')>0;
    },
                content:function (){},
            },
            "蛊惑之尾":{
                trigger:{
                    player:"shaDamage",
                },
                filter:function (event,player){
        return player.isAlive()&&player.countCards('he')>0;
    },
                content:function (){
        'step 0'
        player.chooseToDiscard('he',true);
        'step 1'
        if(result.bool){
            event.cards=get.cards(4);
            player.showCards(event.cards);
        }
        else{
            event.finish();
        }
        'step 2'
        var gained=[];
        var tothrow=[];
        for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i],'trick')=='trick'){
                gained.push(event.cards[i]);
            }
            else{
                tothrow.push(event.cards[i]);
            }
        }
        player.gain(gained,'gain2');
        game.cardsDiscard(tothrow);
    },
                ai:{
                    threaten:1.5,
                },
            },
            "四象镜":{
                trigger:{
                    player:"phaseUseBegin",
                },
                frequent:true,
                filter:function(event,player){
        return !player.isMaxHandcard();
    },
                content:function(){
        var num=0;
        for(var i=0;i<game.players.length;i++){
            if(game.players[i]!=player){
                num=Math.max(num,game.players[i].countCards('h'));
            }
        }
        var dh=num-player.countCards('h');
        if(dh>0){
            player.draw(dh);
        }
    },
            },
            "无尽沙漏":{
                enable:"chooseToUse",
                filter:function(event,player){
        return player.countCards('e')>0;
    },
                filterCard:true,
                position:"e",
                viewAs:{
                    name:"wuzhong",
                },
                prompt:"将一张装备区内的牌当无中生有使用",
                check:function(card){
        var player=_status.currentPhase;
        if(player.countCards('he',{subtype:get.subtype(card)})>1){
            return 11-get.equipValue(card);
        }
        if(player.countCards('h')<player.hp){
            return 6-get.value(card);
        }
        return 2-get.equipValue(card);
    },
                ai:{
                    order:9,
                    threaten:1.1,
                    wuxie:function(target,card,player,viewer){
            if(get.attitude(viewer,target)>0&&target.countCards('h','sha')){
                if(!target.countCards('h')||target.hp==1||Math.random()<0.7) return 0;
            }
        },
                    basic:{
                        order:9,
                        useful:[5,1],
                        value:5,
                    },
                    result:{
                        "target_use":function(player,target){
                if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                        target:function(player,target){
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondSha:1,
                        damage:1,
                        multitarget:1,
                        multineg:1,
                        draw:2,
                    },
                },
            },
            "王权剑意":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function(card,player,target){
        return target!=player&&target.countCards('h');
    },
                filter:function(event,player){
        return player.countCards('h');
    },
                content:function(){
        'step 0'
        player.chooseToCompare(target);
        'step 1'
        if(result.bool){
            target.damage(2);
            player.loseHp()
        }
    },
                ai:{
                    order:8,
                    result:{
                        target:function(player,target){
                return get.damageEffect(target,player,target);
            },
                    },
                },
            },
            "冰凌枪击":{
                trigger:{
                    player:"useCardAfter",
                },
                direct:true,
                filter:function (event,player){
        if(_status.currentPhase!=player) return false;
        if(get.type(event.card)!='basic') return false;
        return player.getHistory('useCard',function(evt){
            return get.type(evt.card)=='basic';
        }).length<=1;
    },
                content:function(){
        "step 0"
        player.chooseControlList(['使'+get.translation(trigger.card)+'不计入次数限制','本回合内使用牌无距离限制']).set('ai',function(event,player){
            var card=_status.event.getTrigger().card;
            if(card.name=='sha'||card.name=='jiu') return 0;
            return 1;
        }).set('prompt','冰凌枪击：请选择1项');
        "step 1"
        if(result.control!='cancel2') {
            player.logSkill('冰凌枪击');
            if(result.index==0){
                player.getStat().card={}
            }
            else if(result.index==1){
                player.addTempSkill('冰凌枪击_dis');
            }
        }
    },
                subSkill:{
                    dis:{
                        charlotte:true,
                        mod:{
                            targetInRange:function (card,player,target){
                    return true;
                },
                        },
                        sub:true,
                    },
                },
            },
            "天罡寒玉":{
                trigger:{
                    player:"recoverBegin",
                },
                forced:true,
                content:function(){
        'step 0'
        var card=get.discardPile(function(card){
            return card.name=='wuxie';
        });
        if(card) player.gain(card,'gain2');
        'step 1'
        game.updateRoundNumber();
        var next=player.phaseUse();
        event.next.remove(next);
        trigger.next.push(next);
    },
            },
            "王权剑斩":{
                enable:"phaseUse",
                filterCard:true,
                filterTarget:function(card,player,target){
        return player!=target&&player.inRange(target);
    },
                selectTarget:-1,
                multitarget:true,
                multiline:true,
                position:"he",
                usable:1,
                content:function(){
            "step 0"
            player.judge();
            "step 1"
            player.storage=result.number;
            "step 2"
            event.targets=targets.slice(0);
            event.targets.sort(lib.sort.seat);
                if(event.targets.length){
                    var target=event.targets.shift();
                    event.target=target;
                    var res=get.damageEffect(target,player,target,'fire');
                    target.chooseToDiscard('he',function(card){
                        return get.number(card)<=player.storage.mengyan
                    },'弃置一张点数不大于判定牌的手牌').set('ai',function(card){
       return 1;
    });
                }
                else{
                    event.finish();
                }
            "step 3"
                if(!result.bool){
                    target.damage(2);
                    event.goto(2);
                }    
                else{
                event.goto(2);
                }                            
       },
                ai:{
                    result:{
                        player:1,
                    },
                    order:7,
                },
            },
            "妖气搜寻":{
                mod:{
                    wuxieRespondable:function (card,player,target,current){
            if(player!=current&&player.countCards('h')>=current.countCards('h')){
                return false;
            }
        },
                },
                ai:{
                    norespond:true,
                    skillTagFilter:function (player,tag,arg){
            if(tag=='norespond'&&Array.isArray(arg)){
                if(player.countCards('h')>=arg[1].countCards('h')) return true;
            }
            return false;
        },
                },
            },
            "无尽酒壶":{
                trigger:{
                    source:"damageEnd",
                },
                filter:function(event,player){
        return event.card&&event.card.name=='sha'&&_status.currentPhase==player;
    },
                content:function(){
        player.getStat().card.sha--;
    },
            },
            "绝对零域":{
                mod:{
                    targetEnabled:function(card, player, target, now) {
            if (player.isEmpty(2) && (card.name == 'sha' || card.name == 'shunshou')) return false;
        },
                },
            },
            "换血妖术":{
                trigger:{
                    player:"dyingAfter",
                },
                filter:function(event,player){
        return event.source&&event.source.isIn()&&event.source.hp>0;
    },
                logTarget:"source",
                content:function(){
        trigger.source.loseHp();
    },
                ai:{
                    threaten:function(player,target){
            if(target.hp==1) return 0.6;
            return 1;
        },
                    effect:{
                        target:function(card,player,target,current){
                if(!target.hasFriend()) return;
                if(target.hp<=1&&get.tag(card,'damage')) return [1,0,0,-1];
            },
                    },
                },
            },
            "纯质阳炎 ":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function(card,player,target){
        return target!=player&&target.countCards('h');
    },
                filter:function(event,player){
        return player.countCards('h');
    },
                content:function(){
        'step 0'
        player.chooseToCompare(target);
        'step 1'
        if(result.bool){
            target.damage(1,'fire');
        }
    },
                ai:{
                    order:8,
                    result:{
                        target:function(player,target){
                return get.damageEffect(target,player,target);
            },
                    },
                },
            },
            "毁灭的天地":{
                shaRelated:true,
                trigger:{
                    source:"damageSource",
                },
                filter:function(event,player){
        if(event._notrigger.contains(event.player)) return false;
        return (event.card&&event.card.name=='sha'&&event.getParent().name=='sha'&&
            event.player.isAlive()&&
            player.canCompare(event.player));
    },
                check:function(event,player){
        return get.attitude(player,event.player)<0&&player.countCards('h')>1;
    },
                content:function(){
        "step 0"
        player.chooseToCompare(trigger.player);
        "step 1"
        if(result.bool&&trigger.player.countGainableCards(player,'he')){
            player.gainPlayerCard(trigger.player,3,true,'he');
        }
    },
            },
            "绝缘之爪 ":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function(card,player,target){
        return player!=target&&target.countCards('e')>0;
    },
                content:function(){
        'step 0'
        player.discardPlayerCard(target,'e',2,true);
        'step 1'
        game.asyncDraw([player,target]);
    },
                ai:{
                    order:8,
                    threaten:1.5,
                    result:{
                        target:-1,
                        player:0.5,
                    },
                },
            },
            "驱魔三式":{
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                subSkill:{
                    count:{
                        trigger:{
                            player:"useCard",
                        },
                        silent:true,
                        filter:function(event,player){
                return _status.currentPhase==player;
            },
                        content:function(){
                if(!player.storage){
                    player.storage=[];
                }
                var suit=get.suit(trigger.card);
                if(suit){
                    player.storage.add(suit);
                }
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                    set:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        silent:true,
                        content:function(){
                delete player.storage.yunyin;
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                filter:function(event,player){
        if(!player.storage) return true;
        var hs=player.getCards('h');
        for(var i=0;i<hs.length;i++){
            if(!player.storage.contains(get.suit(hs[i]))) return true;
        }
        return false;
    },
                group:["驱魔三式_count","驱魔三式_set"],
                content:function(){
        'step 0'
        player.chooseToDiscard(get.prompt('驱魔三式'),function(card){
            if(!player.storage.yunyin) return true;
            return !player.storage.yunyin.contains(get.suit(card));
        }).set('logSkill','驱魔三式').ai=function(card){
            return 9-get.value(card);
        }
        'step 1'
        if(!result.bool){
            event.finish();
            return;
        }
        var list=[];
        for(var i=0;i<lib.inpile.length;i++){
            var name=lib.inpile[i];
            var type=get.type(name);
            if(type=='trick'||type=='basic'){
                if(lib.filter.cardEnabled({name:name},player)){
                    list.push([get.translation(type),'',name]);
                }
            }
        }
        var dialog=ui.create.dialog('驱魔三式',[list,'vcard']);
        var taoyuan=0,nanman=0;
        var players=game.filterPlayer();
        for(var i=0;i<players.length;i++){
            var eff1=get.effect(players[i],{name:'taoyuan'},player,player);
            var eff2=get.effect(players[i],{name:'nanman'},player,player);
            if(eff1>0){
                taoyuan++;
            }
            else if(eff1<0){
                taoyuan--;
            }
            if(eff2>0){
                nanman++;
            }
            else if(eff2<0){
                nanman--;
            }
        }
        player.chooseButton(dialog).ai=function(button){
            var name=button.link[2];
            if(Math.max(taoyuan,nanman)>1){
                if(taoyuan>nanman) return name=='taoyuan'?1:0;
                return name=='nanman'?1:0;
            }
            if(player.countCards('h')<player.hp&&player.hp>=2){
                return name=='wuzhong'?1:0;
            }
            if(player.hp<player.maxHp&&player.hp<3){
                return name=='tao'?1:0;
            }
            return name=='zengbin'?1:0;
        }
        'step 2'
        if(result.bool){
            player.chooseUseTarget(true,result.links[0][2]);
        }
    },
                ai:{
                    threaten:1.5,
                },
            },
        },
        translate:{
            "狐念之术":"狐念之术",
            "狐念之术_info":"一名角色的体力值变为3时，若你的武将牌正面朝上。你可以翻面，展示其所有手牌，获得其中所有的【顺手牵羊】和【闪】。",
            "斗转星移":"斗转星移",
            "斗转星移_info":"出牌阶段限一次，你可以弃置一张手牌，令任意名角色判定一次。若判定颜色与你弃置的牌相同，其回复2点体力。",
            "雪雾御风扇":"雪雾御风扇",
            "雪雾御风扇_info":"每当你从牌堆摸牌时，你可以令任意名手牌数大于你的角色各弃置两张手牌。你可以从这些角色弃置的第一张牌中选择并获得其中一张牌。",
            "心疗术":"心疗术",
            "心疗术_info":"出牌阶段限一次，你可以弃置一张黑色手牌，令所有体力值最少（或之一）的角色各回复1点体力。",
            "灵移之术":"灵移之术",
            "灵移之术_info":"结束阶段开始时，若你本回合内使用过基本牌，你可以发现一张牌。",
            "沙暴袭":"沙暴袭",
            "沙暴袭_info":"限定技，出牌阶段，你可以弃置两张红色牌，视为对所有其他角色依次使用两张【过河拆桥】。",
            "千年御水珠":"千年御水珠",
            "千年御水珠_info":"出牌阶段限一次，你可以将一张基本牌当任意一张基本牌使用。",
            "万尘归宗":"万尘归宗",
            "万尘归宗_info":"当你成为【杀】的目标时，你可以弃置所有手牌，然后判定一次。若为红色，此【杀】对你无效，使用者获得判定牌；若为黑色，你获得此判定牌。",
            "暗魅潜影":"暗魅潜影",
            "暗魅潜影_info":"当你使用或打出一张【闪】时，你可以获得一名其他角色的两张牌，然后其摸两张牌。",
            "道法符":"道法符",
            "道法符_info":"结束阶段开始时，你可以弃置一张基本牌。然后选择一项：①摸一张牌；②执行一个额外的出牌阶段。",
            "纯质阳炎":"纯质阳炎",
            "纯质阳炎_info":"当你受到一次伤害时，你可以令伤害来源受到等量的火焰伤害。",
            "虚空之泪":"虚空之泪",
            "虚空之泪_info":"当你使用一张普通锦囊牌时，你可以弃置一名其他角色的一张牌，若弃置的牌为红色，你摸一张牌。",
            "望月掌":"望月掌",
            "望月掌_info":"每当你使用的牌被其他角色响应后，你可以摸两张牌。",
            "千颜":"千颜",
            "千颜_info":"当你受到伤害后，你可以获得伤害来源装备区内的一张牌，然后使用之。",
            "引灵之术":"引灵之术",
            "引灵之术_info":"锁定技，若你的体力值为2，你的【闪】均视为【杀】，你使用【杀】无次数限制，且你不能成为【杀】的目标。",
            "北斗神拳":"北斗神拳",
            "北斗神拳_info":"每轮游戏开始时，你可以弃置一张牌，对攻击范围内一名体力值大于你的其他角色造成1点伤害。",
            "纯爱天篇":"纯爱天篇",
            "纯爱天篇_info":"每当你受到1点伤害后，你可以令一名角色摸一张牌。若其手牌数大于体力上限，你摸两张牌。",
            "绝缘之爪":"绝缘之爪",
            "绝缘之爪_info":"锁定技，当你的判定区内有牌时，你不能成为其他角色使用的伤害类的牌。",
            "蛊惑之尾":"蛊惑之尾",
            "蛊惑之尾_info":"当你使用【杀】造成伤害时，你可以弃置一张牌。然后亮出牌堆顶的四张牌，获得其中所有的锦囊牌。",
            "四象镜":"四象镜",
            "四象镜_info":"出牌阶段开始时，你可以将手牌数补至全场唯一最多（或之一）。",
            "无尽沙漏":"无尽沙漏",
            "无尽沙漏_info":"出牌阶段，你可以将一张装备区内的牌当【无中生有】使用。",
            "王权剑意":"王权剑意",
            "王权剑意_info":"出牌阶段限一次，你可以与一名其他角色进行拼点。若你赢，你对其造成2点伤害，然后你失去1点体力。",
            "冰凌枪击":"冰凌枪击",
            "冰凌枪击_info":"你的回合内，当你使用第一张基本牌结算后，你可以选择一项：①令此牌不计入使用限制；②你使用牌无距离限制，直到回合结束。",
            "天罡寒玉":"天罡寒玉",
            "天罡寒玉_info":"锁定技，当你回复体力时，你从弃牌堆中获得一张【无懈可击】且执行一个额外的出牌阶段。",
            "王权剑斩":"王权剑斩",
            "王权剑斩_info":"出牌阶段限一次，你可以弃置一张牌并判定一次。然后令你攻击范围内的所有角色各选择一项：①弃置一张点数不大于判定牌的手牌；②令你对其造成2点伤害。",
            "妖气搜寻":"妖气搜寻",
            "妖气搜寻_info":"锁定技，当你使用牌指定其他角色为目标时，若其手牌数不大于你，其不能响应此牌。",
            "无尽酒壶":"无尽酒壶",
            "无尽酒壶_info":"出牌阶段，每当你使用【杀】造成伤害后，你可以额外使用一张【杀】，直到回合结束。",
            "绝对零域":"绝对零域",
            "绝对零域_info":"锁定技，装备区内没有防具牌的其他角色不能对你使用【杀】和【顺手牵羊】。",
            "换血妖术":"换血妖术",
            "换血妖术_info":"当你解除濒死状态后，你可以令你处于濒死状态的角色失去1点体力。",
            "纯质阳炎 ":"纯质阳炎 ",
            "纯质阳炎 _info":"出牌阶段限一次，你可以与一名其他角色拼点。若你赢，你对其造成1点火焰伤害。",
            "毁灭的天地":"毁灭的天地",
            "毁灭的天地_info":"当你使用【杀】造成伤害后，你可以与受伤角色拼点。若你赢，你获得其三张牌。",
            "绝缘之爪 ":"绝缘之爪 ",
            "绝缘之爪 _info":"出牌阶段限一次，你可以弃置一名角色装备区内的两张牌，然后你与其各摸一张牌。",
            "驱魔三式":"驱魔三式",
            "驱魔三式_info":"结束阶段开始时，你可以弃置一张本回合未使用过花色的手牌，视为使用一张基本牌或普通锦囊牌。",
        },
    },
    intro:"相传在很久以前，有一个地方叫做凤凰山，凤凰山下有一对年轻的男女相爱了，男的叫做桦生，女的叫做丹儿，但两人却因为身份原因始终不能正大光明的在一起。桦生是一个工匠，而丹儿是地主家的女儿，地主不允许自己的女儿跟身份低贱的工匠相爱。<br/><br/>于是两人只能悄悄在凤凰山下的小河边幽会，这样持续了一段时间，最终这一切还是被地主发现了。地主强行拆开了桦生和丹儿，但是丹儿却仍然只倾心桦生一人。地主一怒之下派人杀掉了桦生，想要丹儿彻底死了这条心，得知桦生被杀的丹儿万念俱灰，不久后她也悬念自尽了，并且留下遗书表示，若生不能和桦生结成连理，死后也要跟他相守。<br/><br/>可恶的地主不但不悔，反而还派人将两人分别埋在了小河的两岸，让他们隔河相望，死也不能在一起。可地主没想到，没过多久这两人份上各长出了一棵树，它们的枝头越过了小河长到了一起，就好像桦生和丹儿的灵魂依偎在了一起。这棵树也因此得名“相思树”。<br/><br/>“相思树”是象征爱情的树，但也正如它在动漫中的另外一个名字一样，这棵树还是一颗“苦情树”。桦生和丹儿的爱情是一出悲剧，这也让我们联想到白月初和苏苏这一对，在转世续缘中还有一条规定是，假如续缘失败，则人妖之间必须定下“此生无缘”的合约，妖不得再干扰人的生活。<br/><br/>",
    author:"长涯清歌",
    diskURL:"",
    forumURL:"",
    version:"1.9",
},files:{"character":["涂山红红.jpg"],"card":[],"skill":[]}}};