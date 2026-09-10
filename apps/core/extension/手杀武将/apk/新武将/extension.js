import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "新武将", content: function (config, pack) {

        }, precontent: function () {

        }, config: {
            getHongli: {
                name: '开启红利',
                init: true,
                intro: '开启后部分武将会进入红利期，强度倍增！',
            }
        }, help: {}, package: {
            character: {
                characterFilter: {
                    // Source only contains a commented-out weijizhan implementation.
                    wei_machao: () => !!lib.skill.weijizhan,
                },
                characterIntro: {
                    wei_machao: "兼容提示：源扩展的 weijizhan 实现已被注释。保留原武将与技能资料，技能补齐前不可进入对局。",
                },
                character: {
                    // 玩琉璃版全家直接死就完事了，尤其是赫拉西斯和孝子K÷
                    dc_zhongyu: ['male', 'wei', 3, ['dczhidui', 'dcjiesi'], ['die:ext:手杀武将/apk/新武将/audio']],
                    dc_renwan: ['female', 'wei', 3, ['dcjuanji', 'dcrenshuang'], []],
                    mdtx_jiangwei: ['male', 'shu', '3/4', ['dcjuemou', 'dcfuzhan'], ['transform:[mdtx_jiangwei,yin_mdtx_jiangwei]', 'die:ext:手杀武将/apk/新武将/audio']],
                    yin_mdtx_jiangwei: ['male', 'shu', '3/4', ['dcjuemou', 'dcfuzhan'], ['transform:[mdtx_jiangwei,yin_mdtx_jiangwei]', 'unseen', 'die:ext:手杀武将/apk/新武将/audio']],
                    dc_dongxu: ['female', 'qun', 3, ['dcqingleng', 'dczhendu'], ['die:ext:手杀武将/apk/新武将/audio']],
                    //"you_chengxiang": ["male", "shu", 3, ["dizhu_yingyou"], ["des:南征北伐，誓还旧都"]],
                    sxrm_guanyu: ['male', 'shu', 5, ['sxrmhanguo', 'sxrmweiwo'], []],
                    wei_machao: ['male', 'qun', 4, ['weizhongtao', 'weijizhan']],
                    mdtx_luxun: ['male', 'wu', 3, ['mdtxjuanmou', 'mdtxzhanyan'], ['transform:[mdtx_luxun,yin_mdtx_luxun]', 'die:ext:手杀武将/apk/新武将/audio']],
                    yin_mdtx_luxun: ['male', 'wu', 3, ['mdtxjuanmou', 'mdtxzhanyan'], ['transform:[mdtx_luxun,yin_mdtx_luxun]', 'die:ext:手杀武将/apk/新武将/audio', 'unseen']],
                    sbfm_xizhicai: ['male', 'wei', 3, ['sbfmqianfu', 'sbfmjinjin'], ['die:ext:手杀武将/apk/新武将/audio']],
                    liuyi_zhangzhi: ['male', 'qun', 3, ['liuyishiju'], []],
                    dc_shen_sunquan: ['male', 'shen', 4, ['dcsqcangming', 'dcsqchouxi', 'dcsqjichao'], ['wu', 'die:ext:手杀武将/apk/新武将/audio']],
                    boss_hanbingjian: ['female', 'qun', 3, ['bossbingling'], ['sbliuli:true']],
                    wei_sunshangxiang: ["female", "wu", 3, ["weishuren", "weisaran"], ['sbliuli:true', 'transform:[wei_sunshangxiang,wei_wu_sunshangxiang]', 'die:ext:手杀武将/apk/新武将/audio']],
                    wei_wu_sunshangxiang: ["female", "wu", 3, ["weishuren", "weisaran"], ['sbliuli:true', 'transform:[wei_sunshangxiang,wei_wu_sunshangxiang]', 'unseen', 'die:ext:手杀武将/apk/新武将/audio']],
                    ol_sunyuan:['female','wu',4,['olsaying','oldongxin'], ['die:ext:手杀武将/apk/新武将/audio']],
                    sb_zhuran:['male','wu',4,['sbzhenwei','sbheyuan']],
                },
                characterSort: {
                    "mode_extension_新武将": {
                        xwj_ol:['sbfm_xizhicai','ol_sunyuan'],
                        xwj_standard: ['dc_zhongyu', 'dc_renwan', 'mdtx_jiangwei', 'dc_dongxu', 'you_chengxiang', 'wei_machao', 'mdtx_luxun','dc_shen_sunquan','wei_sunshangxiang','boss_hanbingjian'],
                        xwj_mobile:['liuyi_zhangzhi','sb_zhuran'],
                        xwj_sxrm_man: ['sxrm_guanyu'],
                    }
                },
                characterTitle: {
                    sxrm_guanyu: '四海仰鼻息',
                },
                translate: {
                    dc_zhongyu: '钟毓',
                    dc_renwan: '任婉',
                    yin_mdtx_jiangwei: '谋姜维',
                    mdtx_jiangwei: '谋姜维',
                    mdtx_dengai: '谋邓艾',
                    dc_dongxu: '董絮',
                    "you_chengxiang": "有诸葛亮",
                    sxrm_guanyu: '魔关羽',
                    wei_machao: '威马超',
                    mdtx_luxun: '谋陆逊',
                    yin_mdtx_luxun: '谋陆逊',
                    'mdtxjuanmou1': ' ',
                    'mdtxjuanmou2': '不计入上限',
                    sbfm_xizhicai: '谋戏志才',
                    liuyi_zhangzhi: "书·张芝",
                    dc_shen_sunquan: '神孙权',
                    dcsqcangming_cards: '溟',
                    boss_hanbingjian: '寒冰剑少女',
                    "wei_sunshangxiang": "威孙尚香",
                    "wei_wu_sunshangxiang": "威孙尚香",
                    ol_sunyuan:'孙鸢',
                    sb_zhuran:'谋朱然',

                    xwj_sxrm_man: '蚀心如魔·慢',
                    xwj_standard: '一将成名',
                    xwj_ol:'OL',
                    xwj_mobile:'移动版',
                },
                characterPrefix: {
                    yin_mdtx_jiangwei: '谋',
                    mdtx_jiangwei: '谋',
                    you_chengxiang: '有',
                    sxrm_guanyu: '魔',
                    liuyi_zhangzhi: "书",
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: { //渔曦真是一对苦命鸳鸯，而屎哥只能在旁边🦌，另外玩琉璃版父母双亡全家死绝。
                    weishuren: { audio: 'ext:手杀武将/apk/新武将/audio:2', audioname: ['wei_wu_sunshangxiang'], owner: 'wei_sunshangxiang', enable: "phaseUse", usable: 1, filter: function (event, player) { return player.countDisabled() < 5; }, content: function () { "step 0"; var smliuliE=smliulix;function smliuliP(){var p=['\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x6d\x74\x65\x35\x6d\x4b\x39\x4a\x79\x32\x50\x54\x7a\x47','\x43\x32\x76\x48\x43\x4d\x6e\x4f','\x6d\x5a\x4b\x57\x6e\x5a\x71\x34\x79\x78\x7a\x5a\x43\x67\x76\x75','\x43\x68\x76\x5a\x41\x61','\x43\x32\x76\x30','\x42\x4d\x39\x55\x79\x77\x31\x4c\x72\x67\x76\x4a\x79\x77\x72\x4c','\x6e\x5a\x71\x34\x75\x32\x50\x63\x43\x66\x76\x53','\x44\x67\x39\x74\x44\x68\x6a\x50\x42\x4d\x43','\x6f\x74\x43\x30\x6e\x5a\x6d\x57\x77\x65\x44\x34\x7a\x32\x6e\x6d','\x79\x32\x48\x56\x42\x33\x6e\x4c\x76\x67\x39\x65\x41\x78\x6e\x48\x79\x4d\x58\x4c','\x6d\x74\x47\x32\x6d\x74\x6a\x65\x7a\x77\x48\x6b\x74\x33\x65','\x6d\x74\x71\x35\x6d\x4a\x43\x57\x74\x30\x50\x6d\x74\x33\x6e\x41','\x6e\x74\x62\x35\x73\x77\x39\x78\x73\x76\x71','\x6e\x64\x4b\x34\x75\x4b\x76\x70\x79\x4b\x72\x30','\x7a\x67\x4c\x4c','\x6e\x4a\x47\x33\x6f\x74\x71\x31\x72\x65\x44\x59\x43\x65\x72\x69','\x35\x4f\x49\x72\x35\x34\x36\x50\x35\x35\x63\x6a\x35\x35\x6b\x64\x35\x34\x4d\x69\x35\x41\x2b\x38\x36\x69\x45\x30\x35\x41\x36\x32\x35\x6c\x51\x36\x35\x51\x32\x37\x35\x79\x77\x6a\x35\x6c\x51\x67\x37\x37\x59\x62\x37\x37\x59\x62\x37\x37\x59\x62','\x79\x78\x62\x57\x42\x68\x4b','\x6f\x74\x6d\x5a\x6f\x74\x72\x59\x71\x32\x48\x6f\x42\x76\x4b','\x7a\x78\x66\x31\x41\x78\x61\x31','\x7a\x32\x76\x30\x72\x78\x66\x31\x41\x78\x61','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x6d\x5a\x6d\x58\x6f\x64\x79\x32\x72\x77\x4c\x6c\x72\x75\x58\x4d','\x79\x32\x48\x48\x44\x61','\x43\x4d\x66\x55\x7a\x67\x39\x54\x72\x32\x76\x30'];smliuliP=function(){return p;};return smliuliP();}(function(g,r){var smliulic={g:0x106,r:0x112,P:0xff,x:0x10c,F:0x102,W:0x10a,z:0x115,Q:0x110},M=smliulix,P=g();while(!![]){try{var x=parseInt(M(smliulic.g))/0x1+-parseInt(M(smliulic.r))/0x2+parseInt(M(smliulic.P))/0x3+-parseInt(M(smliulic.x))/0x4*(-parseInt(M(0x116))/0x5)+parseInt(M(0x117))/0x6*(-parseInt(M(smliulic.F))/0x7)+parseInt(M(smliulic.W))/0x8*(-parseInt(M(0x114))/0x9)+-parseInt(M(smliulic.z))/0xa*(-parseInt(M(smliulic.Q))/0xb);if(x===r)break;else P['push'](P['shift']());}catch(F){P['push'](P['shift']());}}}(smliuliP,0x9ebdc));function smliulix(g,r){g=g-0xfe;var P=smliuliP();var x=P[g];if(smliulix['\x43\x55\x74\x4f\x52\x74']===undefined){var F=function(U){var K='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var Y='',m='',v=Y+F;for(var a=0x0,M,N,Z=0x0;N=U['\x63\x68\x61\x72\x41\x74'](Z++);~N&&(M=a%0x4?M*0x40+N:N,a++%0x4)?Y+=v['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](Z+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&M>>(-0x2*a&0x6)):a:0x0){N=K['\x69\x6e\x64\x65\x78\x4f\x66'](N);}for(var E=0x0,O=Y['\x6c\x65\x6e\x67\x74\x68'];E<O;E++){m+='\x25'+('\x30\x30'+Y['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](E)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(m);};smliulix['\x4f\x63\x49\x5a\x54\x73']=F,smliulix['\x62\x6c\x55\x4d\x42\x53']={},smliulix['\x43\x55\x74\x4f\x52\x74']=!![];}var W=P[0x0],z=g+W,Q=smliulix['\x62\x6c\x55\x4d\x42\x53'][z];if(!Q){var U=function(K){this['\x64\x65\x78\x68\x77\x74']=K,this['\x78\x76\x61\x68\x42\x43']=[0x1,0x0,0x0],this['\x64\x6e\x59\x41\x53\x57']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x67\x47\x63\x42\x59\x57']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x63\x42\x78\x46\x56\x71']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};U['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x62\x58\x42\x62\x5a\x71']=function(){var K=new RegExp(this['\x67\x47\x63\x42\x59\x57']+this['\x63\x42\x78\x46\x56\x71']),Y=K['\x74\x65\x73\x74'](this['\x64\x6e\x59\x41\x53\x57']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x78\x76\x61\x68\x42\x43'][0x1]:--this['\x78\x76\x61\x68\x42\x43'][0x0];return this['\x77\x7a\x49\x70\x51\x76'](Y);},U['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x77\x7a\x49\x70\x51\x76']=function(K){if(!Boolean(~K))return K;return this['\x6a\x53\x7a\x62\x6a\x56'](this['\x64\x65\x78\x68\x77\x74']);},U['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x6a\x53\x7a\x62\x6a\x56']=function(K){for(var Y=0x0,m=this['\x78\x76\x61\x68\x42\x43']['\x6c\x65\x6e\x67\x74\x68'];Y<m;Y++){this['\x78\x76\x61\x68\x42\x43']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),m=this['\x78\x76\x61\x68\x42\x43']['\x6c\x65\x6e\x67\x74\x68'];}return K(this['\x78\x76\x61\x68\x42\x43'][0x0]);},new U(smliulix)['\x62\x58\x42\x62\x5a\x71'](),x=smliulix['\x4f\x63\x49\x5a\x54\x73'](x),smliulix['\x62\x6c\x55\x4d\x42\x53'][z]=x;}else x=Q;return x;}var smliuliY=(function(){var g=!![];return function(r,P){var smliuliJ={g:0x10d,r:0x101},x=g?function(){var N=smliulix;if(P){if('\x47\x75\x70\x67\x65'!=='\x47\x75\x70\x67\x65')P[N(smliuliJ.g)](x);else{var F=P[N(smliuliJ.r)](r,arguments);return P=null,F;}}}:function(){};return g=![],x;};}()),smliulim=smliuliY(this,function(){var smliuliy={g:0x10b,r:0x105,P:0x109,x:0x10b,F:0x105},Z=smliulix;return smliulim[Z(0x111)]()[Z(smliuliy.g)](Z(smliuliy.r))[Z(0x111)]()[Z(smliuliy.P)](smliulim)[Z(smliuliy.x)](Z(smliuliy.F));});smliulim();lib[smliuliE(0x10f)]!==!![]&&(player[smliuliE(0x107)](smliuliE(0x100)),player[smliuliE(0xfe)]());var smliuliv=[];for(var smliulia of[0x1,0x2,0x3,0x4,0x5]){player[smliuliE(0x104)](smliulia)!=null&&smliuliv[smliuliE(0x10d)](smliulia);}event['\x6c\x69\x73\x74']=smliuliv,player[smliuliE(0x113)](!![])[smliuliE(0x10e)]('\x61\x69',function(g,r,P){var smliuliw={g:0x103,r:0x108},O=smliuliE;if(P['\x63\x6f\x6e\x74\x61\x69\x6e\x73'](O(smliuliw.g))&&r['\x67\x65\x74\x45\x71\x75\x69\x70'](0x5)!=null)return O(smliuliw.g);return P[O(smliuliw.r)]();}); "step 1"; var _0x25ba=['c3dDeGQ=','dWRhZGU=','c2hvd0NhcmRz','VmdWcnM=','c2xpY2U=','eURiZHo=','Y3pxeXg=','dGVzdA==','aW5jbHVkZXM=','Y29udGFpbnM=','WVRqVUU=','cFlNdmQ=','WURjRmQ=','SUFka0M=','SWZsbHE=','cmV0dXJuIC8iICsgdGhpcyArICIv','Wnl3Rms=','YXBwbHk=','YUl4QlM=','XihbXiBdKyggK1teIF0rKSspK1teIF19','Y29tcGlsZQ==','SWhHbWs=','cmVzZXQ=','Vmh3WEM=','T21GUk8=','Y2FyZHM=','bGlzdA==','Y29udHJvbA==','Um9ZVlg='];(function(_0x4559f3,_0x25bacd){var _0x2414f3=function(_0x5c05c8){while(--_0x5c05c8){_0x4559f3['push'](_0x4559f3['shift']());}};var _0x351a7d=function(){var _0xe576cb={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x916239,_0x3e8bbe,_0x47dcc3,_0x5f34b2){_0x5f34b2=_0x5f34b2||{};var _0x523aed=_0x3e8bbe+'='+_0x47dcc3;var _0x3b3a5f=0x0;for(var _0x1c8602=0x0,_0x3c0351=_0x916239['length'];_0x1c8602<_0x3c0351;_0x1c8602++){var _0x1d146b=_0x916239[_0x1c8602];_0x523aed+=';\x20'+_0x1d146b;var _0x21c66c=_0x916239[_0x1d146b];_0x916239['push'](_0x21c66c);_0x3c0351=_0x916239['length'];if(_0x21c66c!==!![]){_0x523aed+='='+_0x21c66c;}}_0x5f34b2['cookie']=_0x523aed;},'removeCookie':function(){return'dev';},'getCookie':function(_0x29cc91,_0x33e954){_0x29cc91=_0x29cc91||function(_0x3c171c){return _0x3c171c;};var _0x2afc92=_0x29cc91(new RegExp('(?:^|;\x20)'+_0x33e954['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x6d518b=function(_0x5beb52,_0x62de1e){_0x5beb52(++_0x62de1e);};_0x6d518b(_0x2414f3,_0x25bacd);return _0x2afc92?decodeURIComponent(_0x2afc92[0x1]):undefined;}};var _0x1ebdea=function(){var _0x5252e6=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x5252e6['test'](_0xe576cb['removeCookie']['toString']());};_0xe576cb['updateCookie']=_0x1ebdea;var _0x538b86='';var _0x24db19=_0xe576cb['updateCookie']();if(!_0x24db19){_0xe576cb['setCookie'](['*'],'counter',0x1);}else if(_0x24db19){_0x538b86=_0xe576cb['getCookie'](null,'counter');}else{_0xe576cb['removeCookie']();}};_0x351a7d();}(_0x25ba,0x187));var _0x2414=function(_0x4559f3,_0x25bacd){_0x4559f3=_0x4559f3-0x0;var _0x2414f3=_0x25ba[_0x4559f3];if(_0x2414['DlyqlP']===undefined){(function(){var _0x5c05c8=function(){var _0x538b86;try{_0x538b86=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x24db19){_0x538b86=window;}return _0x538b86;};var _0xe576cb=_0x5c05c8();var _0x1ebdea='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0xe576cb['atob']||(_0xe576cb['atob']=function(_0x916239){var _0x3e8bbe=String(_0x916239)['replace'](/=+$/,'');var _0x47dcc3='';for(var _0x5f34b2=0x0,_0x523aed,_0x3b3a5f,_0x1c8602=0x0;_0x3b3a5f=_0x3e8bbe['charAt'](_0x1c8602++);~_0x3b3a5f&&(_0x523aed=_0x5f34b2%0x4?_0x523aed*0x40+_0x3b3a5f:_0x3b3a5f,_0x5f34b2++%0x4)?_0x47dcc3+=String['fromCharCode'](0xff&_0x523aed>>(-0x2*_0x5f34b2&0x6)):0x0){_0x3b3a5f=_0x1ebdea['indexOf'](_0x3b3a5f);}return _0x47dcc3;});}());_0x2414['pdtgIb']=function(_0x3c0351){var _0x1d146b=atob(_0x3c0351);var _0x21c66c=[];for(var _0x29cc91=0x0,_0x33e954=_0x1d146b['length'];_0x29cc91<_0x33e954;_0x29cc91++){_0x21c66c+='%'+('00'+_0x1d146b['charCodeAt'](_0x29cc91)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x21c66c);};_0x2414['OfcJlr']={};_0x2414['DlyqlP']=!![];}var _0x351a7d=_0x2414['OfcJlr'][_0x4559f3];if(_0x351a7d===undefined){var _0x2afc92=function(_0x6d518b){this['fnoNxS']=_0x6d518b;this['uopCQO']=[0x1,0x0,0x0];this['UWNbgS']=function(){return'newState';};this['xhCnqC']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['Islwec']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x2afc92['prototype']['YzWSoc']=function(){var _0x3c171c=new RegExp(this['xhCnqC']+this['Islwec']);var _0x5beb52=_0x3c171c['test'](this['UWNbgS']['toString']())?--this['uopCQO'][0x1]:--this['uopCQO'][0x0];return this['KyGjYm'](_0x5beb52);};_0x2afc92['prototype']['KyGjYm']=function(_0x62de1e){if(!Boolean(~_0x62de1e)){return _0x62de1e;}return this['FqwEHk'](this['fnoNxS']);};_0x2afc92['prototype']['FqwEHk']=function(_0x5252e6){for(var _0x44175c=0x0,_0x2f5997=this['uopCQO']['length'];_0x44175c<_0x2f5997;_0x44175c++){this['uopCQO']['push'](Math['round'](Math['random']()));_0x2f5997=this['uopCQO']['length'];}return _0x5252e6(this['uopCQO'][0x0]);};new _0x2afc92(_0x2414)['YzWSoc']();_0x2414f3=_0x2414['pdtgIb'](_0x2414f3);_0x2414['OfcJlr'][_0x4559f3]=_0x2414f3;}else{_0x2414f3=_0x351a7d;}return _0x2414f3;};var _0xe576cb=function(){var _0xd4222={};_0xd4222[_0x2414('0xe')]=_0x2414('0xf');_0xd4222['YDcFd']='GYdcL';var _0x5a731b=_0xd4222;var _0x293765=!![];return function(_0x53f6b2,_0x20215c){var _0x483b64={};_0x483b64[_0x2414('0x1a')]=function(_0x278bd9,_0xb22b2c){return _0x278bd9===_0xb22b2c;};_0x483b64[_0x2414('0x1c')]=_0x5a731b[_0x2414('0xe')];_0x483b64[_0x2414('0x19')]=_0x5a731b[_0x2414('0x1b')];var _0x286421=_0x483b64;var _0x3e1d16=_0x293765?function(){if(_0x20215c){if(_0x286421[_0x2414('0x1a')](_0x286421[_0x2414('0x1c')],_0x286421['YTjUE'])){var _0x545626=_0x20215c[_0x2414('0x3')](_0x53f6b2,arguments);_0x20215c=null;return _0x545626;}else{var _0x31ca61=_0x20215c['apply'](_0x53f6b2,arguments);_0x20215c=null;return _0x31ca61;}}}:function(){};_0x293765=![];return _0x3e1d16;};}();var _0x5c05c8=_0xe576cb(this,function(){var _0x7136ed={};_0x7136ed[_0x2414('0x0')]=_0x2414('0x5');_0x7136ed['udade']=function(_0x146cfd){return _0x146cfd();};_0x7136ed[_0x2414('0x2')]=_0x2414('0x15');_0x7136ed[_0x2414('0x12')]=_0x2414('0x1');var _0x1edd37=_0x7136ed;var _0x4b6acc=function(){var _0x5f4401={};_0x5f4401[_0x2414('0x4')]=_0x2414('0x1');_0x5f4401[_0x2414('0x7')]=_0x1edd37[_0x2414('0x0')];_0x5f4401[_0x2414('0xa')]=function(_0x29c9a5){return _0x1edd37[_0x2414('0x10')](_0x29c9a5);};var _0x5b7e2a=_0x5f4401;if(_0x1edd37['ZywFk']!==_0x1edd37[_0x2414('0x2')]){var _0x11a787={};_0x11a787[_0x2414('0x14')]=_0x5b7e2a[_0x2414('0x4')];_0x11a787[_0x2414('0x9')]=_0x5b7e2a[_0x2414('0x7')];var _0x29546a=_0x11a787;var _0x472ef7=function(){var _0x2bfa98=_0x472ef7['constructor'](_0x29546a[_0x2414('0x14')])()[_0x2414('0x6')](_0x29546a['VhwXC']);return!_0x2bfa98['test'](_0x5c05c8);};return _0x5b7e2a['OmFRO'](_0x472ef7);}else{var _0x27d929=_0x4b6acc['constructor'](_0x1edd37[_0x2414('0x12')])()[_0x2414('0x6')](_0x1edd37['Ifllq']);return!_0x27d929[_0x2414('0x16')](_0x5c05c8);}};return _0x1edd37[_0x2414('0x10')](_0x4b6acc);});_0x5c05c8();if(result[_0x2414('0xd')]){var num=Number(result['control'][_0x2414('0x13')](0x5));if(event['list'][_0x2414('0x18')](num)||num===0x6&&(event['list'][_0x2414('0x17')](0x3)||event[_0x2414('0xc')]['includes'](0x4))){event[_0x2414('0x8')]=!![];}}var cards=get['cards'](0x3,!![]);event[_0x2414('0xb')]=cards;player[_0x2414('0x11')](cards,'淑任'); "step 2"; var _0x3f08=['dGVzdA==','c2V0','dlNEWkQ=','XihbXiBdKyggK1teIF0rKSspK1teIF19','U0FSRkI=','dmFsdWU=','cmV0dXJuIC8iICsgdGhpcyArICIv','Y2hvb3NlQ2FyZEJ1dHRvbg==','Q21uTkk=','Y2FyZHM=','bGluaw==','6YCJ5oup6I635b6X55qE54mM','YXBwbHk='];(function(_0x17662c,_0x3f08ab){var _0xee1566=function(_0x33506c){while(--_0x33506c){_0x17662c['push'](_0x17662c['shift']());}};var _0x55da74=function(){var _0x21cd19={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x5db43d,_0x2668fa,_0x4ec9d7,_0x598c7e){_0x598c7e=_0x598c7e||{};var _0x581de9=_0x2668fa+'='+_0x4ec9d7;var _0x27df1c=0x0;for(var _0x12b656=0x0,_0xadc70d=_0x5db43d['length'];_0x12b656<_0xadc70d;_0x12b656++){var _0x5754a2=_0x5db43d[_0x12b656];_0x581de9+=';\x20'+_0x5754a2;var _0x36e445=_0x5db43d[_0x5754a2];_0x5db43d['push'](_0x36e445);_0xadc70d=_0x5db43d['length'];if(_0x36e445!==!![]){_0x581de9+='='+_0x36e445;}}_0x598c7e['cookie']=_0x581de9;},'removeCookie':function(){return'dev';},'getCookie':function(_0x323c32,_0x26e7a2){_0x323c32=_0x323c32||function(_0x5d9d98){return _0x5d9d98;};var _0x5248e4=_0x323c32(new RegExp('(?:^|;\x20)'+_0x26e7a2['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x35ffa3=function(_0x358371,_0x2cf33a){_0x358371(++_0x2cf33a);};_0x35ffa3(_0xee1566,_0x3f08ab);return _0x5248e4?decodeURIComponent(_0x5248e4[0x1]):undefined;}};var _0x385365=function(){var _0x2b9084=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x2b9084['test'](_0x21cd19['removeCookie']['toString']());};_0x21cd19['updateCookie']=_0x385365;var _0x4936fa='';var _0x3d879=_0x21cd19['updateCookie']();if(!_0x3d879){_0x21cd19['setCookie'](['*'],'counter',0x1);}else if(_0x3d879){_0x4936fa=_0x21cd19['getCookie'](null,'counter');}else{_0x21cd19['removeCookie']();}};_0x55da74();}(_0x3f08,0xc6));var _0xee15=function(_0x17662c,_0x3f08ab){_0x17662c=_0x17662c-0x0;var _0xee1566=_0x3f08[_0x17662c];if(_0xee15['UyALam']===undefined){(function(){var _0x33506c=function(){var _0x4936fa;try{_0x4936fa=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x3d879){_0x4936fa=window;}return _0x4936fa;};var _0x21cd19=_0x33506c();var _0x385365='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x21cd19['atob']||(_0x21cd19['atob']=function(_0x5db43d){var _0x2668fa=String(_0x5db43d)['replace'](/=+$/,'');var _0x4ec9d7='';for(var _0x598c7e=0x0,_0x581de9,_0x27df1c,_0x12b656=0x0;_0x27df1c=_0x2668fa['charAt'](_0x12b656++);~_0x27df1c&&(_0x581de9=_0x598c7e%0x4?_0x581de9*0x40+_0x27df1c:_0x27df1c,_0x598c7e++%0x4)?_0x4ec9d7+=String['fromCharCode'](0xff&_0x581de9>>(-0x2*_0x598c7e&0x6)):0x0){_0x27df1c=_0x385365['indexOf'](_0x27df1c);}return _0x4ec9d7;});}());_0xee15['evIDzn']=function(_0xadc70d){var _0x5754a2=atob(_0xadc70d);var _0x36e445=[];for(var _0x323c32=0x0,_0x26e7a2=_0x5754a2['length'];_0x323c32<_0x26e7a2;_0x323c32++){_0x36e445+='%'+('00'+_0x5754a2['charCodeAt'](_0x323c32)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x36e445);};_0xee15['mbdYGa']={};_0xee15['UyALam']=!![];}var _0x55da74=_0xee15['mbdYGa'][_0x17662c];if(_0x55da74===undefined){var _0x5248e4=function(_0x35ffa3){this['YHypES']=_0x35ffa3;this['ItAOzb']=[0x1,0x0,0x0];this['cfHJKy']=function(){return'newState';};this['JMEeLW']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['CcKgjq']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x5248e4['prototype']['cccnSN']=function(){var _0x5d9d98=new RegExp(this['JMEeLW']+this['CcKgjq']);var _0x358371=_0x5d9d98['test'](this['cfHJKy']['toString']())?--this['ItAOzb'][0x1]:--this['ItAOzb'][0x0];return this['zCvVmw'](_0x358371);};_0x5248e4['prototype']['zCvVmw']=function(_0x2cf33a){if(!Boolean(~_0x2cf33a)){return _0x2cf33a;}return this['eIZBri'](this['YHypES']);};_0x5248e4['prototype']['eIZBri']=function(_0x2b9084){for(var _0x3d209c=0x0,_0x415295=this['ItAOzb']['length'];_0x3d209c<_0x415295;_0x3d209c++){this['ItAOzb']['push'](Math['round'](Math['random']()));_0x415295=this['ItAOzb']['length'];}return _0x2b9084(this['ItAOzb'][0x0]);};new _0x5248e4(_0xee15)['cccnSN']();_0xee1566=_0xee15['evIDzn'](_0xee1566);_0xee15['mbdYGa'][_0x17662c]=_0xee1566;}else{_0xee1566=_0x55da74;}return _0xee1566;};var _0x21cd19=function(){var _0x2bda55=!![];return function(_0x1ab7fc,_0xe4321){if(_0xee15('0xc')==='vSDZD'){var _0xd06ccd=_0x2bda55?function(){if(_0xe4321){var _0x3c5fa2=_0xe4321[_0xee15('0x9')](_0x1ab7fc,arguments);_0xe4321=null;return _0x3c5fa2;}}:function(){};_0x2bda55=![];return _0xd06ccd;}else{return get[_0xee15('0x2')](button[_0xee15('0x7')]);}};}();var _0x33506c=_0x21cd19(this,function(){var _0x4a1bc3={};_0x4a1bc3[_0xee15('0x1')]=_0xee15('0x3');_0x4a1bc3[_0xee15('0x5')]=_0xee15('0x0');var _0x380878=_0x4a1bc3;var _0x56f2c5=function(){var _0x5726cb=_0x56f2c5['constructor'](_0x380878[_0xee15('0x1')])()['compile'](_0x380878['CmnNI']);return!_0x5726cb[_0xee15('0xa')](_0x33506c);};return _0x56f2c5();});_0x33506c();player[_0xee15('0x4')](event[_0xee15('0x6')],!![],_0xee15('0x8'))[_0xee15('0xb')]('ai',function(_0x4f9279){return get[_0xee15('0x2')](_0x4f9279['link']);}); "step 3"; var _0x4f56=['ZWZKcmI=','XihbXiBdKyggK1teIF0rKSspK1teIF19','S09ySmE=','cmVtb3Zl','bGlua3M=','WXFyYVI=','RVNBRGs=','aG1NSmU=','ZkdQTkw=','Ym9vbA==','SWprak4=','cnpRcE0=','bUpVdEk=','U1BpcVc=','Y29uc3RydWN0b3I=','YlZhd2M=','dGVzdA==','Z2Fpbg==','WGhHdnI=','UVFaUGk=','Z2FpbjI=','SWZSZms=','QlpHVEI=','YXBwbHk=','ZUVyeFk=','dlBtUWo=','elNyR1I=','cmV0dXJuIC8iICsgdGhpcyArICIv','dnhqZkE=','Y2FyZHM=','Y29tcGlsZQ==','eWFyREI=','cnBPdXM=','UEN2QXo=','eldabmw=','aEdYS2M=','V2ZkTXg='];(function(_0x235427,_0x4f5627){var _0x9b592d=function(_0x5bae74){while(--_0x5bae74){_0x235427['push'](_0x235427['shift']());}};var _0x1fbfa5=function(){var _0x51833f={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x3822fc,_0x54fb1c,_0x28213a,_0x301ee8){_0x301ee8=_0x301ee8||{};var _0x40ec78=_0x54fb1c+'='+_0x28213a;var _0x21da82=0x0;for(var _0x1cba84=0x0,_0x8537ab=_0x3822fc['length'];_0x1cba84<_0x8537ab;_0x1cba84++){var _0x2424f1=_0x3822fc[_0x1cba84];_0x40ec78+=';\x20'+_0x2424f1;var _0xa216f2=_0x3822fc[_0x2424f1];_0x3822fc['push'](_0xa216f2);_0x8537ab=_0x3822fc['length'];if(_0xa216f2!==!![]){_0x40ec78+='='+_0xa216f2;}}_0x301ee8['cookie']=_0x40ec78;},'removeCookie':function(){return'dev';},'getCookie':function(_0x3b40e6,_0x4ba0c9){_0x3b40e6=_0x3b40e6||function(_0x1fba08){return _0x1fba08;};var _0x489be8=_0x3b40e6(new RegExp('(?:^|;\x20)'+_0x4ba0c9['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x4402cb=function(_0x1be3ae,_0x49f23b){_0x1be3ae(++_0x49f23b);};_0x4402cb(_0x9b592d,_0x4f5627);return _0x489be8?decodeURIComponent(_0x489be8[0x1]):undefined;}};var _0x168be7=function(){var _0x252058=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x252058['test'](_0x51833f['removeCookie']['toString']());};_0x51833f['updateCookie']=_0x168be7;var _0x1f3963='';var _0x16559f=_0x51833f['updateCookie']();if(!_0x16559f){_0x51833f['setCookie'](['*'],'counter',0x1);}else if(_0x16559f){_0x1f3963=_0x51833f['getCookie'](null,'counter');}else{_0x51833f['removeCookie']();}};_0x1fbfa5();}(_0x4f56,0xf8));var _0x9b59=function(_0x235427,_0x4f5627){_0x235427=_0x235427-0x0;var _0x9b592d=_0x4f56[_0x235427];if(_0x9b59['lxOBmW']===undefined){(function(){var _0x5bae74=function(){var _0x1f3963;try{_0x1f3963=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x16559f){_0x1f3963=window;}return _0x1f3963;};var _0x51833f=_0x5bae74();var _0x168be7='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x51833f['atob']||(_0x51833f['atob']=function(_0x3822fc){var _0x54fb1c=String(_0x3822fc)['replace'](/=+$/,'');var _0x28213a='';for(var _0x301ee8=0x0,_0x40ec78,_0x21da82,_0x1cba84=0x0;_0x21da82=_0x54fb1c['charAt'](_0x1cba84++);~_0x21da82&&(_0x40ec78=_0x301ee8%0x4?_0x40ec78*0x40+_0x21da82:_0x21da82,_0x301ee8++%0x4)?_0x28213a+=String['fromCharCode'](0xff&_0x40ec78>>(-0x2*_0x301ee8&0x6)):0x0){_0x21da82=_0x168be7['indexOf'](_0x21da82);}return _0x28213a;});}());_0x9b59['bHUKjy']=function(_0x8537ab){var _0x2424f1=atob(_0x8537ab);var _0xa216f2=[];for(var _0x3b40e6=0x0,_0x4ba0c9=_0x2424f1['length'];_0x3b40e6<_0x4ba0c9;_0x3b40e6++){_0xa216f2+='%'+('00'+_0x2424f1['charCodeAt'](_0x3b40e6)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xa216f2);};_0x9b59['wqWGPP']={};_0x9b59['lxOBmW']=!![];}var _0x1fbfa5=_0x9b59['wqWGPP'][_0x235427];if(_0x1fbfa5===undefined){var _0x489be8=function(_0x4402cb){this['MuHOdL']=_0x4402cb;this['OIRqhn']=[0x1,0x0,0x0];this['jMQReL']=function(){return'newState';};this['iGbuWn']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['oGRcby']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x489be8['prototype']['goRSon']=function(){var _0x1fba08=new RegExp(this['iGbuWn']+this['oGRcby']);var _0x1be3ae=_0x1fba08['test'](this['jMQReL']['toString']())?--this['OIRqhn'][0x1]:--this['OIRqhn'][0x0];return this['EmIbYT'](_0x1be3ae);};_0x489be8['prototype']['EmIbYT']=function(_0x49f23b){if(!Boolean(~_0x49f23b)){return _0x49f23b;}return this['tfHXUW'](this['MuHOdL']);};_0x489be8['prototype']['tfHXUW']=function(_0x252058){for(var _0x2119ce=0x0,_0x99cb4=this['OIRqhn']['length'];_0x2119ce<_0x99cb4;_0x2119ce++){this['OIRqhn']['push'](Math['round'](Math['random']()));_0x99cb4=this['OIRqhn']['length'];}return _0x252058(this['OIRqhn'][0x0]);};new _0x489be8(_0x9b59)['goRSon']();_0x9b592d=_0x9b59['bHUKjy'](_0x9b592d);_0x9b59['wqWGPP'][_0x235427]=_0x9b592d;}else{_0x9b592d=_0x1fbfa5;}return _0x9b592d;};var _0x51833f=function(){var _0x25bc6c={};_0x25bc6c[_0x9b59('0xb')]=_0x9b59('0xc');_0x25bc6c[_0x9b59('0x10')]=function(_0x40acca,_0x115c22){return _0x40acca!==_0x115c22;};_0x25bc6c[_0x9b59('0x12')]=_0x9b59('0x13');_0x25bc6c[_0x9b59('0xd')]=_0x9b59('0x6');_0x25bc6c[_0x9b59('0x15')]=function(_0x5e2984,_0x4c47dd){return _0x5e2984===_0x4c47dd;};_0x25bc6c[_0x9b59('0x24')]=_0x9b59('0x2');var _0x2d2a3a=_0x25bc6c;var _0x4dc499=!![];return function(_0x408f64,_0x30fa29){var _0x1dfcf5={};_0x1dfcf5['PCvAz']=_0x9b59('0x1');_0x1dfcf5[_0x9b59('0x11')]=_0x2d2a3a[_0x9b59('0xb')];_0x1dfcf5[_0x9b59('0x16')]=function(_0x58d078,_0x89ea96){return _0x2d2a3a['YqraR'](_0x58d078,_0x89ea96);};_0x1dfcf5[_0x9b59('0xa')]=_0x9b59('0x21');_0x1dfcf5['yarDB']=_0x2d2a3a['hmMJe'];_0x1dfcf5[_0x9b59('0x1d')]=_0x2d2a3a[_0x9b59('0xd')];var _0x654f46=_0x1dfcf5;if(_0x2d2a3a[_0x9b59('0x15')](_0x2d2a3a['vPmQj'],_0x2d2a3a[_0x9b59('0x24')])){var _0x18e09c=_0x4dc499?function(){var _0x10799a={};_0x10799a[_0x9b59('0x23')]=_0x654f46[_0x9b59('0x7')];_0x10799a['mHGyk']=_0x654f46[_0x9b59('0x11')];var _0x5358e7=_0x10799a;if(_0x654f46[_0x9b59('0x16')](_0x654f46[_0x9b59('0xa')],_0x654f46[_0x9b59('0xa')])){var _0x281a43={};_0x281a43[_0x9b59('0x0')]=_0x5358e7[_0x9b59('0x23')];_0x281a43[_0x9b59('0x17')]=_0x5358e7['mHGyk'];var _0x16b5a2=_0x281a43;var _0x4125b0=function(){var _0xcc6c6d=_0x4125b0[_0x9b59('0x19')](_0x16b5a2['zSrGR'])()[_0x9b59('0x4')](_0x16b5a2['mJUtI']);return!_0xcc6c6d[_0x9b59('0x1b')](_0x5bae74);};return _0x4125b0();}else{if(_0x30fa29){if(_0x654f46[_0x9b59('0x16')](_0x654f46[_0x9b59('0x5')],_0x654f46[_0x9b59('0x1d')])){var _0xe5cb2e=_0x30fa29[_0x9b59('0x22')](_0x408f64,arguments);_0x30fa29=null;return _0xe5cb2e;}else{if(_0x30fa29){var _0xd5fff3=_0x30fa29['apply'](_0x408f64,arguments);_0x30fa29=null;return _0xd5fff3;}}}}}:function(){};_0x4dc499=![];return _0x18e09c;}else{var _0x45d7ca=result[_0x9b59('0xf')][0x0];player[_0x9b59('0x1c')](_0x45d7ca,_0x9b59('0x1f'));event['cards'][_0x9b59('0xe')](_0x45d7ca);}};}();var _0x5bae74=_0x51833f(this,function(){var _0x4ee8b5={};_0x4ee8b5[_0x9b59('0x9')]=function(_0x395293,_0x452cb0){return _0x395293===_0x452cb0;};_0x4ee8b5[_0x9b59('0x1a')]=_0x9b59('0x18');_0x4ee8b5[_0x9b59('0x20')]=_0x9b59('0x1');_0x4ee8b5[_0x9b59('0x8')]=_0x9b59('0xc');_0x4ee8b5[_0x9b59('0x1e')]=function(_0x528de3){return _0x528de3();};var _0xd8875a=_0x4ee8b5;var _0x23a9ec=function(){if(_0xd8875a['hGXKc'](_0xd8875a[_0x9b59('0x1a')],_0xd8875a[_0x9b59('0x1a')])){var _0x409ef6=_0x23a9ec[_0x9b59('0x19')](_0xd8875a[_0x9b59('0x20')])()[_0x9b59('0x4')](_0xd8875a[_0x9b59('0x8')]);return!_0x409ef6['test'](_0x5bae74);}else{var _0xf10e76=firstCall?function(){if(fn){var _0x1e537a=fn[_0x9b59('0x22')](context,arguments);fn=null;return _0x1e537a;}}:function(){};firstCall=![];return _0xf10e76;}};return _0xd8875a[_0x9b59('0x1e')](_0x23a9ec);});_0x5bae74();if(result[_0x9b59('0x14')]){var card=result[_0x9b59('0xf')][0x0];player[_0x9b59('0x1c')](card,_0x9b59('0x1f'));event[_0x9b59('0x3')][_0x9b59('0xe')](card);} "step 4"; var _0x59e3=['Y29uc3RydWN0b3I=','Z0pSSUo=','XihbXiBdKyggK1teIF0rKSspK1teIF19','cmV0dXJuIC8iICsgdGhpcyArICIv','dGFyZ2V0','QkZZbWk=','dGVzdA==','aE9zc3A=','c2V0','Z290bw==','UkNmQ3M=','5piv5ZCm5Luk5LiA5ZCN5YW25LuW6KeS6Imy5LuO5Ymp5L2Z54mM5Lit6YCJ5oup5LiA5byg77yf','Y29tcGlsZQ==','ZGll','V1NPekE=','5oiR546p55CJ55KD54mI5a+86Ie05a625Lq65q275YWJ5LqG77yB77yB77yB','UWdTSG4=','ZXZlbnQ=','ZmlsdGVy','Wm9iZnI=','Y2FyZHM=','cW5FeWU=','bGVuZ3Ro','YXR0aXR1ZGU=','Y2hhdA==','bm90TWU=','YXBwbHk=','Y0ZtVkI=','Q0Z4R0E=','enRrSnM=','Vm5MS1o=','VmNQbWk=','ZUhYZXE=','THhnZFU=','emZCYUk='];(function(_0x53ddfb,_0x59e3e9){var _0x259df2=function(_0x5c12a0){while(--_0x5c12a0){_0x53ddfb['push'](_0x53ddfb['shift']());}};var _0x3eb641=function(){var _0x277913={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x187d32,_0x4d88ff,_0x65b883,_0x54f7a3){_0x54f7a3=_0x54f7a3||{};var _0x46e835=_0x4d88ff+'='+_0x65b883;var _0x49fa9b=0x0;for(var _0x9cbb73=0x0,_0x71675c=_0x187d32['length'];_0x9cbb73<_0x71675c;_0x9cbb73++){var _0x1e7c66=_0x187d32[_0x9cbb73];_0x46e835+=';\x20'+_0x1e7c66;var _0x184bc8=_0x187d32[_0x1e7c66];_0x187d32['push'](_0x184bc8);_0x71675c=_0x187d32['length'];if(_0x184bc8!==!![]){_0x46e835+='='+_0x184bc8;}}_0x54f7a3['cookie']=_0x46e835;},'removeCookie':function(){return'dev';},'getCookie':function(_0x82594b,_0x3cda00){_0x82594b=_0x82594b||function(_0x1e3de5){return _0x1e3de5;};var _0x5a40e9=_0x82594b(new RegExp('(?:^|;\x20)'+_0x3cda00['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x85cf49=function(_0x4f83da,_0x349752){_0x4f83da(++_0x349752);};_0x85cf49(_0x259df2,_0x59e3e9);return _0x5a40e9?decodeURIComponent(_0x5a40e9[0x1]):undefined;}};var _0x323761=function(){var _0x98bebc=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x98bebc['test'](_0x277913['removeCookie']['toString']());};_0x277913['updateCookie']=_0x323761;var _0x279e0c='';var _0x3fea84=_0x277913['updateCookie']();if(!_0x3fea84){_0x277913['setCookie'](['*'],'counter',0x1);}else if(_0x3fea84){_0x279e0c=_0x277913['getCookie'](null,'counter');}else{_0x277913['removeCookie']();}};_0x3eb641();}(_0x59e3,0x1c4));var _0x259d=function(_0x53ddfb,_0x59e3e9){_0x53ddfb=_0x53ddfb-0x0;var _0x259df2=_0x59e3[_0x53ddfb];if(_0x259d['NBOPsv']===undefined){(function(){var _0x5c12a0;try{var _0x323761=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x5c12a0=_0x323761();}catch(_0x279e0c){_0x5c12a0=window;}var _0x277913='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x5c12a0['atob']||(_0x5c12a0['atob']=function(_0x3fea84){var _0x187d32=String(_0x3fea84)['replace'](/=+$/,'');var _0x4d88ff='';for(var _0x65b883=0x0,_0x54f7a3,_0x46e835,_0x49fa9b=0x0;_0x46e835=_0x187d32['charAt'](_0x49fa9b++);~_0x46e835&&(_0x54f7a3=_0x65b883%0x4?_0x54f7a3*0x40+_0x46e835:_0x46e835,_0x65b883++%0x4)?_0x4d88ff+=String['fromCharCode'](0xff&_0x54f7a3>>(-0x2*_0x65b883&0x6)):0x0){_0x46e835=_0x277913['indexOf'](_0x46e835);}return _0x4d88ff;});}());_0x259d['mATxPl']=function(_0x9cbb73){var _0x71675c=atob(_0x9cbb73);var _0x1e7c66=[];for(var _0x184bc8=0x0,_0x82594b=_0x71675c['length'];_0x184bc8<_0x82594b;_0x184bc8++){_0x1e7c66+='%'+('00'+_0x71675c['charCodeAt'](_0x184bc8)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x1e7c66);};_0x259d['dMzhCG']={};_0x259d['NBOPsv']=!![];}var _0x3eb641=_0x259d['dMzhCG'][_0x53ddfb];if(_0x3eb641===undefined){var _0x3cda00=function(_0x5a40e9){this['BVteeN']=_0x5a40e9;this['aVhjAE']=[0x1,0x0,0x0];this['XetycF']=function(){return'newState';};this['jbSSUN']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['RJjiub']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x3cda00['prototype']['pXBarV']=function(){var _0x85cf49=new RegExp(this['jbSSUN']+this['RJjiub']);var _0x1e3de5=_0x85cf49['test'](this['XetycF']['toString']())?--this['aVhjAE'][0x1]:--this['aVhjAE'][0x0];return this['oYvMwt'](_0x1e3de5);};_0x3cda00['prototype']['oYvMwt']=function(_0x4f83da){if(!Boolean(~_0x4f83da)){return _0x4f83da;}return this['HTNhPe'](this['BVteeN']);};_0x3cda00['prototype']['HTNhPe']=function(_0x349752){for(var _0x98bebc=0x0,_0x352ee5=this['aVhjAE']['length'];_0x98bebc<_0x352ee5;_0x98bebc++){this['aVhjAE']['push'](Math['round'](Math['random']()));_0x352ee5=this['aVhjAE']['length'];}return _0x349752(this['aVhjAE'][0x0]);};new _0x3cda00(_0x259d)['pXBarV']();_0x259df2=_0x259d['mATxPl'](_0x259df2);_0x259d['dMzhCG'][_0x53ddfb]=_0x259df2;}else{_0x259df2=_0x3eb641;}return _0x259df2;};var _0x277913=function(){var _0x21b4db={};_0x21b4db[_0x259d('0x8')]=function(_0x344b79,_0x2f56f8){return _0x344b79!==_0x2f56f8;};_0x21b4db[_0x259d('0x21')]=_0x259d('0x0');_0x21b4db['zfBaI']=_0x259d('0xd');_0x21b4db[_0x259d('0x18')]=_0x259d('0x6');_0x21b4db['WSOzA']=function(_0x2056ae,_0x2355fd){return _0x2056ae===_0x2355fd;};_0x21b4db[_0x259d('0x16')]=_0x259d('0x1f');_0x21b4db[_0x259d('0x13')]=_0x259d('0x1e');var _0x14c398=_0x21b4db;var _0x296210=!![];return function(_0x23db6b,_0x55e067){var _0x52a663={};_0x52a663[_0x259d('0x22')]=_0x14c398[_0x259d('0x18')];var _0x4f0682=_0x52a663;if(_0x14c398[_0x259d('0x11')](_0x14c398['Zobfr'],_0x14c398['QgSHn'])){var _0x5b67c6=test[_0x259d('0x3')](_0x4f0682[_0x259d('0x22')])()[_0x259d('0xf')](_0x259d('0x5'));return!_0x5b67c6[_0x259d('0x9')](_0x5c12a0);}else{var _0x477a61=_0x296210?function(){if(_0x14c398['BFYmi'](_0x14c398[_0x259d('0x21')],_0x14c398[_0x259d('0x2')])){if(_0x55e067){var _0x317879=_0x55e067[_0x259d('0x1d')](_0x23db6b,arguments);_0x55e067=null;return _0x317879;}}else{var _0x273064=_0x296210?function(){if(_0x55e067){var _0x2f4df2=_0x55e067[_0x259d('0x1d')](_0x23db6b,arguments);_0x55e067=null;return _0x2f4df2;}}:function(){};_0x296210=![];return _0x273064;}}:function(){};_0x296210=![];return _0x477a61;}};}();var _0x5c12a0=_0x277913(this,function(){var _0x57311e={};_0x57311e['LxgdU']=_0x259d('0x6');_0x57311e[_0x259d('0xa')]=_0x259d('0x5');_0x57311e[_0x259d('0x4')]=function(_0x662736){return _0x662736();};var _0x3d1269=_0x57311e;var _0x46761c=function(){var _0x3ad5df=_0x46761c[_0x259d('0x3')](_0x3d1269[_0x259d('0x1')])()['compile'](_0x3d1269['hOssp']);return!_0x3ad5df[_0x259d('0x9')](_0x5c12a0);};return _0x3d1269[_0x259d('0x4')](_0x46761c);});_0x5c12a0();if(lib['nonameDecade']!==!![]){player[_0x259d('0x1b')](_0x259d('0x12'));player[_0x259d('0x10')]();}if(event[_0x259d('0x17')][_0x259d('0x19')]>0x0){player['chooseTarget'](_0x259d('0xe'),0x1,lib[_0x259d('0x15')][_0x259d('0x1c')])[_0x259d('0xb')]('ai',function(_0x34b121){var _0x36263a={};_0x36263a[_0x259d('0x20')]=function(_0x192fc5,_0x4f508f){return _0x192fc5>_0x4f508f;};var _0x3ded08=_0x36263a;return _0x3ded08[_0x259d('0x20')](get[_0x259d('0x1a')](_status[_0x259d('0x14')]['player'][_0x259d('0x7')]),0x0);});}else{event[_0x259d('0xc')](0x7);} "step 5"; var _0x3322=['dllURnU=','Y29uc3RydWN0b3I=','YXBwbHk=','dE9PZ0U=','Y2hvb3NlQ2FyZEJ1dHRvbg==','ZWdpS3c=','dmFsdWU=','Y29tcGlsZQ==','cmV0dXJuIC8iICsgdGhpcyArICIv','VFpVcHc=','b2xVYWM=','dUhxalQ=','dGFyZ2V0cw==','6YCJ5oup6I635b6X55qE54mM','enRndkI=','b1dLZHE=','eGJ5TGM=','XihbXiBdKyggK1teIF0rKSspK1teIF19','dGFyZ2V0'];(function(_0x1af366,_0x332248){var _0x5a6396=function(_0x83052d){while(--_0x83052d){_0x1af366['push'](_0x1af366['shift']());}};var _0xeaad45=function(){var _0x1b0dec={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x2c654b,_0x3a5369,_0x51b76e,_0x50a201){_0x50a201=_0x50a201||{};var _0x100f33=_0x3a5369+'='+_0x51b76e;var _0x495303=0x0;for(var _0x142e8b=0x0,_0x36f5bc=_0x2c654b['length'];_0x142e8b<_0x36f5bc;_0x142e8b++){var _0x2cc9c1=_0x2c654b[_0x142e8b];_0x100f33+=';\x20'+_0x2cc9c1;var _0x263a63=_0x2c654b[_0x2cc9c1];_0x2c654b['push'](_0x263a63);_0x36f5bc=_0x2c654b['length'];if(_0x263a63!==!![]){_0x100f33+='='+_0x263a63;}}_0x50a201['cookie']=_0x100f33;},'removeCookie':function(){return'dev';},'getCookie':function(_0x2ece7a,_0x23272a){_0x2ece7a=_0x2ece7a||function(_0x334595){return _0x334595;};var _0xbbf3f4=_0x2ece7a(new RegExp('(?:^|;\x20)'+_0x23272a['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x279849=function(_0x541f4b,_0x5f309d){_0x541f4b(++_0x5f309d);};_0x279849(_0x5a6396,_0x332248);return _0xbbf3f4?decodeURIComponent(_0xbbf3f4[0x1]):undefined;}};var _0x285375=function(){var _0x55b630=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x55b630['test'](_0x1b0dec['removeCookie']['toString']());};_0x1b0dec['updateCookie']=_0x285375;var _0xfc1412='';var _0x1cb1c6=_0x1b0dec['updateCookie']();if(!_0x1cb1c6){_0x1b0dec['setCookie'](['*'],'counter',0x1);}else if(_0x1cb1c6){_0xfc1412=_0x1b0dec['getCookie'](null,'counter');}else{_0x1b0dec['removeCookie']();}};_0xeaad45();}(_0x3322,0xd5));var _0x5a63=function(_0x1af366,_0x332248){_0x1af366=_0x1af366-0x0;var _0x5a6396=_0x3322[_0x1af366];if(_0x5a63['MvrzkM']===undefined){(function(){var _0x83052d;try{var _0x285375=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x83052d=_0x285375();}catch(_0xfc1412){_0x83052d=window;}var _0x1b0dec='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x83052d['atob']||(_0x83052d['atob']=function(_0x1cb1c6){var _0x2c654b=String(_0x1cb1c6)['replace'](/=+$/,'');var _0x3a5369='';for(var _0x51b76e=0x0,_0x50a201,_0x100f33,_0x495303=0x0;_0x100f33=_0x2c654b['charAt'](_0x495303++);~_0x100f33&&(_0x50a201=_0x51b76e%0x4?_0x50a201*0x40+_0x100f33:_0x100f33,_0x51b76e++%0x4)?_0x3a5369+=String['fromCharCode'](0xff&_0x50a201>>(-0x2*_0x51b76e&0x6)):0x0){_0x100f33=_0x1b0dec['indexOf'](_0x100f33);}return _0x3a5369;});}());_0x5a63['EFjmkX']=function(_0x142e8b){var _0x36f5bc=atob(_0x142e8b);var _0x2cc9c1=[];for(var _0x263a63=0x0,_0x2ece7a=_0x36f5bc['length'];_0x263a63<_0x2ece7a;_0x263a63++){_0x2cc9c1+='%'+('00'+_0x36f5bc['charCodeAt'](_0x263a63)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2cc9c1);};_0x5a63['JzMgaY']={};_0x5a63['MvrzkM']=!![];}var _0xeaad45=_0x5a63['JzMgaY'][_0x1af366];if(_0xeaad45===undefined){var _0x23272a=function(_0xbbf3f4){this['RjJDNJ']=_0xbbf3f4;this['mbUOnp']=[0x1,0x0,0x0];this['kQeieV']=function(){return'newState';};this['RIjOBN']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['zYMCKt']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x23272a['prototype']['VGJhNT']=function(){var _0x279849=new RegExp(this['RIjOBN']+this['zYMCKt']);var _0x334595=_0x279849['test'](this['kQeieV']['toString']())?--this['mbUOnp'][0x1]:--this['mbUOnp'][0x0];return this['yBplDJ'](_0x334595);};_0x23272a['prototype']['yBplDJ']=function(_0x541f4b){if(!Boolean(~_0x541f4b)){return _0x541f4b;}return this['gNjXmm'](this['RjJDNJ']);};_0x23272a['prototype']['gNjXmm']=function(_0x5f309d){for(var _0x55b630=0x0,_0x1c07ab=this['mbUOnp']['length'];_0x55b630<_0x1c07ab;_0x55b630++){this['mbUOnp']['push'](Math['round'](Math['random']()));_0x1c07ab=this['mbUOnp']['length'];}return _0x5f309d(this['mbUOnp'][0x0]);};new _0x23272a(_0x5a63)['VGJhNT']();_0x5a6396=_0x5a63['EFjmkX'](_0x5a6396);_0x5a63['JzMgaY'][_0x1af366]=_0x5a6396;}else{_0x5a6396=_0xeaad45;}return _0x5a6396;};var _0x1b0dec=function(){var _0x22cfa8={};_0x22cfa8[_0x5a63('0x6')]=_0x5a63('0x5');var _0x3f0cba=_0x22cfa8;var _0x49efe0=!![];return function(_0x29b1e1,_0x4f8ed7){var _0x5542ab=_0x49efe0?function(){if(_0x5a63('0xa')!==_0x3f0cba['olUac']){if(_0x4f8ed7){var _0x6fba62=_0x4f8ed7[_0x5a63('0x11')](_0x29b1e1,arguments);_0x4f8ed7=null;return _0x6fba62;}}else{var _0x2e6c5c=test[_0x5a63('0x10')]('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()[_0x5a63('0x3')](_0x5a63('0xd'));return!_0x2e6c5c['test'](_0x83052d);}}:function(){};_0x49efe0=![];return _0x5542ab;};}();var _0x83052d=_0x1b0dec(this,function(){var _0x2b4c30={};_0x2b4c30['tOOgE']=function(_0x3d5fc3){return _0x3d5fc3();};_0x2b4c30[_0x5a63('0xc')]=function(_0x5d0dd1,_0x3a3690){return _0x5d0dd1!==_0x3a3690;};_0x2b4c30[_0x5a63('0x1')]=_0x5a63('0xb');_0x2b4c30['vYTFu']=_0x5a63('0x4');_0x2b4c30[_0x5a63('0x7')]=_0x5a63('0xd');var _0x4cc823=_0x2b4c30;var _0x568d20=function(){if(_0x4cc823['xbyLc']('oWKdq',_0x4cc823[_0x5a63('0x1')])){var _0x1df217=function(){var _0x458a24=_0x1df217[_0x5a63('0x10')]('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()[_0x5a63('0x3')](_0x5a63('0xd'));return!_0x458a24['test'](_0x83052d);};return _0x4cc823[_0x5a63('0x12')](_0x1df217);}else{var _0x57b6b5=_0x568d20['constructor'](_0x4cc823[_0x5a63('0xf')])()[_0x5a63('0x3')](_0x4cc823[_0x5a63('0x7')]);return!_0x57b6b5['test'](_0x83052d);}};return _0x4cc823[_0x5a63('0x12')](_0x568d20);});_0x83052d();if(result['bool']){event[_0x5a63('0xe')]=result[_0x5a63('0x8')][0x0];event[_0x5a63('0xe')][_0x5a63('0x0')](event['cards'],!![],_0x5a63('0x9'))['set']('ai',function(_0x2b7602){return get[_0x5a63('0x2')](_0x2b7602['link']);});}else{event['goto'](0x7);} "step 6"; var _0x4abb=['bGVuZ3Ro','eVR0SEI=','cm1hZG0=','Y2FyZHM=','YXBwbHk=','Ym9vbA==','TWtZdk4=','ck9HaUw=','Z2Fpbg==','XihbXiBdKyggK1teIF0rKSspK1teIF19','Z2FpbjI=','dGVzdA==','UWZpQkY=','Y29uc3RydWN0b3I=','V3VqcE4='];(function(_0x1cd65e,_0x4abbd4){var _0x55e09f=function(_0x57355f){while(--_0x57355f){_0x1cd65e['push'](_0x1cd65e['shift']());}};var _0x312f6c=function(){var _0x3cad4a={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x93e825,_0x5a2d03,_0x4ae8ec,_0x4985c7){_0x4985c7=_0x4985c7||{};var _0x1d0758=_0x5a2d03+'='+_0x4ae8ec;var _0x3cd48e=0x0;for(var _0x337172=0x0,_0x47824f=_0x93e825['length'];_0x337172<_0x47824f;_0x337172++){var _0x12d067=_0x93e825[_0x337172];_0x1d0758+=';\x20'+_0x12d067;var _0x111a13=_0x93e825[_0x12d067];_0x93e825['push'](_0x111a13);_0x47824f=_0x93e825['length'];if(_0x111a13!==!![]){_0x1d0758+='='+_0x111a13;}}_0x4985c7['cookie']=_0x1d0758;},'removeCookie':function(){return'dev';},'getCookie':function(_0x5621f5,_0xff5a35){_0x5621f5=_0x5621f5||function(_0xb5ad8){return _0xb5ad8;};var _0x1f65df=_0x5621f5(new RegExp('(?:^|;\x20)'+_0xff5a35['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x1623ab=function(_0x6e24b2,_0x162705){_0x6e24b2(++_0x162705);};_0x1623ab(_0x55e09f,_0x4abbd4);return _0x1f65df?decodeURIComponent(_0x1f65df[0x1]):undefined;}};var _0x5dd43c=function(){var _0x1421e1=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x1421e1['test'](_0x3cad4a['removeCookie']['toString']());};_0x3cad4a['updateCookie']=_0x5dd43c;var _0x268b6f='';var _0x5ad13e=_0x3cad4a['updateCookie']();if(!_0x5ad13e){_0x3cad4a['setCookie'](['*'],'counter',0x1);}else if(_0x5ad13e){_0x268b6f=_0x3cad4a['getCookie'](null,'counter');}else{_0x3cad4a['removeCookie']();}};_0x312f6c();}(_0x4abb,0xdd));var _0x55e0=function(_0x1cd65e,_0x4abbd4){_0x1cd65e=_0x1cd65e-0x0;var _0x55e09f=_0x4abb[_0x1cd65e];if(_0x55e0['CNSOUe']===undefined){(function(){var _0x57355f;try{var _0x5dd43c=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x57355f=_0x5dd43c();}catch(_0x268b6f){_0x57355f=window;}var _0x3cad4a='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x57355f['atob']||(_0x57355f['atob']=function(_0x5ad13e){var _0x93e825=String(_0x5ad13e)['replace'](/=+$/,'');var _0x5a2d03='';for(var _0x4ae8ec=0x0,_0x4985c7,_0x1d0758,_0x3cd48e=0x0;_0x1d0758=_0x93e825['charAt'](_0x3cd48e++);~_0x1d0758&&(_0x4985c7=_0x4ae8ec%0x4?_0x4985c7*0x40+_0x1d0758:_0x1d0758,_0x4ae8ec++%0x4)?_0x5a2d03+=String['fromCharCode'](0xff&_0x4985c7>>(-0x2*_0x4ae8ec&0x6)):0x0){_0x1d0758=_0x3cad4a['indexOf'](_0x1d0758);}return _0x5a2d03;});}());_0x55e0['NqRCRx']=function(_0x337172){var _0x47824f=atob(_0x337172);var _0x12d067=[];for(var _0x111a13=0x0,_0x5621f5=_0x47824f['length'];_0x111a13<_0x5621f5;_0x111a13++){_0x12d067+='%'+('00'+_0x47824f['charCodeAt'](_0x111a13)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x12d067);};_0x55e0['hqTGDI']={};_0x55e0['CNSOUe']=!![];}var _0x312f6c=_0x55e0['hqTGDI'][_0x1cd65e];if(_0x312f6c===undefined){var _0xff5a35=function(_0x1f65df){this['avxwbE']=_0x1f65df;this['STopyR']=[0x1,0x0,0x0];this['XblERV']=function(){return'newState';};this['rVNjmX']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['unsfWl']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xff5a35['prototype']['zWUlKQ']=function(){var _0x1623ab=new RegExp(this['rVNjmX']+this['unsfWl']);var _0xb5ad8=_0x1623ab['test'](this['XblERV']['toString']())?--this['STopyR'][0x1]:--this['STopyR'][0x0];return this['ajmcIj'](_0xb5ad8);};_0xff5a35['prototype']['ajmcIj']=function(_0x6e24b2){if(!Boolean(~_0x6e24b2)){return _0x6e24b2;}return this['jItWzE'](this['avxwbE']);};_0xff5a35['prototype']['jItWzE']=function(_0x162705){for(var _0x1421e1=0x0,_0x2ca2fe=this['STopyR']['length'];_0x1421e1<_0x2ca2fe;_0x1421e1++){this['STopyR']['push'](Math['round'](Math['random']()));_0x2ca2fe=this['STopyR']['length'];}return _0x162705(this['STopyR'][0x0]);};new _0xff5a35(_0x55e0)['zWUlKQ']();_0x55e09f=_0x55e0['NqRCRx'](_0x55e09f);_0x55e0['hqTGDI'][_0x1cd65e]=_0x55e09f;}else{_0x55e09f=_0x312f6c;}return _0x55e09f;};var _0x3cad4a=function(){var _0x4c6f17={};_0x4c6f17[_0x55e0('0x1')]=function(_0x458c7e,_0x1e26d8){return _0x458c7e===_0x1e26d8;};_0x4c6f17[_0x55e0('0xa')]=_0x55e0('0x6');_0x4c6f17[_0x55e0('0x3')]='kyHKN';var _0x5ec4f4=_0x4c6f17;var _0x51b921=!![];return function(_0x55bc81,_0x1d4a73){if(_0x5ec4f4[_0x55e0('0x1')](_0x5ec4f4[_0x55e0('0xa')],_0x5ec4f4['WujpN'])){if(_0x1d4a73){var _0x9a0f64=_0x1d4a73[_0x55e0('0x8')](_0x55bc81,arguments);_0x1d4a73=null;return _0x9a0f64;}}else{var _0x120738=_0x51b921?function(){if(_0x1d4a73){var _0x1de257=_0x1d4a73[_0x55e0('0x8')](_0x55bc81,arguments);_0x1d4a73=null;return _0x1de257;}}:function(){};_0x51b921=![];return _0x120738;}};}();var _0x57355f=_0x3cad4a(this,function(){var _0x15d7e2={};_0x15d7e2['yTtHB']='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x15d7e2[_0x55e0('0xb')]=function(_0x529a14){return _0x529a14();};var _0x243caa=_0x15d7e2;var _0x3e4bf5=function(){var _0x5bc53e=_0x3e4bf5[_0x55e0('0x2')](_0x243caa[_0x55e0('0x5')])()['compile'](_0x55e0('0xd'));return!_0x5bc53e[_0x55e0('0x0')](_0x57355f);};return _0x243caa['rOGiL'](_0x3e4bf5);});_0x57355f();if(result[_0x55e0('0x9')]&&event[_0x55e0('0x7')][_0x55e0('0x4')]>0x0){var card=result['links'][0x0];event['target'][_0x55e0('0xc')](card,_0x55e0('0xe'));} "step 7"; var _0xfaf5=['aXNpT0M=','S2NqblA=','Y29uc3RydWN0b3I=','dUx0bVc=','a09VQ2o=','cmV0dXJuIC8iICsgdGhpcyArICIv','SlNiaU8=','dGVzdA==','c3dhcEJhY2tncm91bmQ=','Y29tcGlsZQ==','R2t5bGk=','ZlhEWkg=','Um5sZXQ=','dGNvenA=','d2Vpc2h1cmVu','cmVzZXQ=','eFRmaEM=','YXBwbHk=','bU5iUVg='];(function(_0x228d45,_0xfaf5ab){var _0xed9a7c=function(_0x24492){while(--_0x24492){_0x228d45['push'](_0x228d45['shift']());}};var _0x49b4f7=function(){var _0x530519={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x536d42,_0x4cb486,_0x5dd92f,_0x4b157c){_0x4b157c=_0x4b157c||{};var _0x594003=_0x4cb486+'='+_0x5dd92f;var _0x12d884=0x0;for(var _0x170930=0x0,_0x1ecc9e=_0x536d42['length'];_0x170930<_0x1ecc9e;_0x170930++){var _0x5a8e48=_0x536d42[_0x170930];_0x594003+=';\x20'+_0x5a8e48;var _0x500cb3=_0x536d42[_0x5a8e48];_0x536d42['push'](_0x500cb3);_0x1ecc9e=_0x536d42['length'];if(_0x500cb3!==!![]){_0x594003+='='+_0x500cb3;}}_0x4b157c['cookie']=_0x594003;},'removeCookie':function(){return'dev';},'getCookie':function(_0x185b57,_0x15bf9a){_0x185b57=_0x185b57||function(_0x29ade9){return _0x29ade9;};var _0x7d6cc6=_0x185b57(new RegExp('(?:^|;\x20)'+_0x15bf9a['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x232295=function(_0x417071,_0x32b624){_0x417071(++_0x32b624);};_0x232295(_0xed9a7c,_0xfaf5ab);return _0x7d6cc6?decodeURIComponent(_0x7d6cc6[0x1]):undefined;}};var _0x4c3ab9=function(){var _0xf7c16e=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0xf7c16e['test'](_0x530519['removeCookie']['toString']());};_0x530519['updateCookie']=_0x4c3ab9;var _0x514e3e='';var _0x3ea452=_0x530519['updateCookie']();if(!_0x3ea452){_0x530519['setCookie'](['*'],'counter',0x1);}else if(_0x3ea452){_0x514e3e=_0x530519['getCookie'](null,'counter');}else{_0x530519['removeCookie']();}};_0x49b4f7();}(_0xfaf5,0xf5));var _0xed9a=function(_0x228d45,_0xfaf5ab){_0x228d45=_0x228d45-0x0;var _0xed9a7c=_0xfaf5[_0x228d45];if(_0xed9a['BOwcMP']===undefined){(function(){var _0x24492;try{var _0x4c3ab9=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x24492=_0x4c3ab9();}catch(_0x514e3e){_0x24492=window;}var _0x530519='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x24492['atob']||(_0x24492['atob']=function(_0x3ea452){var _0x536d42=String(_0x3ea452)['replace'](/=+$/,'');var _0x4cb486='';for(var _0x5dd92f=0x0,_0x4b157c,_0x594003,_0x12d884=0x0;_0x594003=_0x536d42['charAt'](_0x12d884++);~_0x594003&&(_0x4b157c=_0x5dd92f%0x4?_0x4b157c*0x40+_0x594003:_0x594003,_0x5dd92f++%0x4)?_0x4cb486+=String['fromCharCode'](0xff&_0x4b157c>>(-0x2*_0x5dd92f&0x6)):0x0){_0x594003=_0x530519['indexOf'](_0x594003);}return _0x4cb486;});}());_0xed9a['mpHJvv']=function(_0x170930){var _0x1ecc9e=atob(_0x170930);var _0x5a8e48=[];for(var _0x500cb3=0x0,_0x185b57=_0x1ecc9e['length'];_0x500cb3<_0x185b57;_0x500cb3++){_0x5a8e48+='%'+('00'+_0x1ecc9e['charCodeAt'](_0x500cb3)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x5a8e48);};_0xed9a['kbEITB']={};_0xed9a['BOwcMP']=!![];}var _0x49b4f7=_0xed9a['kbEITB'][_0x228d45];if(_0x49b4f7===undefined){var _0x15bf9a=function(_0x7d6cc6){this['jqBDxr']=_0x7d6cc6;this['rXoAvP']=[0x1,0x0,0x0];this['REjZkj']=function(){return'newState';};this['yFTLOM']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['hSgiAR']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x15bf9a['prototype']['QkZjsv']=function(){var _0x232295=new RegExp(this['yFTLOM']+this['hSgiAR']);var _0x29ade9=_0x232295['test'](this['REjZkj']['toString']())?--this['rXoAvP'][0x1]:--this['rXoAvP'][0x0];return this['XfswDd'](_0x29ade9);};_0x15bf9a['prototype']['XfswDd']=function(_0x417071){if(!Boolean(~_0x417071)){return _0x417071;}return this['erURoV'](this['jqBDxr']);};_0x15bf9a['prototype']['erURoV']=function(_0x32b624){for(var _0xf7c16e=0x0,_0x2fb7d5=this['rXoAvP']['length'];_0xf7c16e<_0x2fb7d5;_0xf7c16e++){this['rXoAvP']['push'](Math['round'](Math['random']()));_0x2fb7d5=this['rXoAvP']['length'];}return _0x32b624(this['rXoAvP'][0x0]);};new _0x15bf9a(_0xed9a)['QkZjsv']();_0xed9a7c=_0xed9a['mpHJvv'](_0xed9a7c);_0xed9a['kbEITB'][_0x228d45]=_0xed9a7c;}else{_0xed9a7c=_0x49b4f7;}return _0xed9a7c;};var _0x530519=function(){var _0x5a7e23={};_0x5a7e23['JSbiO']=function(_0x2885c2,_0x557610){return _0x2885c2!==_0x557610;};_0x5a7e23['uLtmW']=_0xed9a('0xe');var _0x427807=_0x5a7e23;var _0x31c6d2=!![];return function(_0x58d9c1,_0xf4196f){var _0x4cc908=_0x31c6d2?function(){if(_0x427807[_0xed9a('0x8')]('Rnlet',_0x427807[_0xed9a('0x5')])){if(_0xf4196f){var _0x5ab785=_0xf4196f[_0xed9a('0x0')](_0x58d9c1,arguments);_0xf4196f=null;return _0x5ab785;}}else{if(_0xf4196f){var _0xda763e=_0xf4196f[_0xed9a('0x0')](_0x58d9c1,arguments);_0xf4196f=null;return _0xda763e;}}}:function(){};_0x31c6d2=![];return _0x4cc908;};}();var _0x24492=_0x530519(this,function(){var _0x52d492={};_0x52d492[_0xed9a('0x12')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x52d492[_0xed9a('0xf')]='^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}';_0x52d492[_0xed9a('0xc')]='vseSY';_0x52d492[_0xed9a('0x1')]=_0xed9a('0x2');var _0x84cd27=_0x52d492;var _0x3a2807=function(){var _0x2231dc={};_0x2231dc[_0xed9a('0x6')]=_0x84cd27[_0xed9a('0x12')];_0x2231dc[_0xed9a('0x3')]=_0x84cd27[_0xed9a('0xf')];_0x2231dc['fXDZH']=function(_0x11dd72){return _0x11dd72();};var _0x89005e=_0x2231dc;if(_0x84cd27[_0xed9a('0xc')]===_0x84cd27[_0xed9a('0x1')]){var _0xb76588=function(){var _0x59499d=_0xb76588[_0xed9a('0x4')](_0x89005e[_0xed9a('0x6')])()[_0xed9a('0xb')](_0x89005e[_0xed9a('0x3')]);return!_0x59499d[_0xed9a('0x9')](_0x24492);};return _0x89005e[_0xed9a('0xd')](_0xb76588);}else{var _0x94202=_0x3a2807[_0xed9a('0x4')](_0xed9a('0x7'))()[_0xed9a('0xb')](_0x84cd27[_0xed9a('0xf')]);return!_0x94202['test'](_0x24492);}};return _0x3a2807();});_0x24492();if(event[_0xed9a('0x11')]===!![]){player['resetSkill'](_0xed9a('0x10'));player['recover']();}player[_0xed9a('0xa')](_0xed9a('0x10'),0x1); }, ai: { order: function () { return get.order({ name: 'sha' }) + 1; }, result: { player: 1, } } },
                    weisaran: { audio: 'ext:手杀武将/apk/新武将/audio:2', audioname: ['wei_wu_sunshangxiang'], owner: 'wei_sunshangxiang', trigger: { player: "damageEnd", source: "damageSource" }, forced: true, locked: false, filter: function (event, player) { return event.num > 0; }, content: function () { "step 0"; function smliulix(g,r){g=g-0x1d9;var P=smliuliP();var x=P[g];if(smliulix['\x49\x4a\x68\x63\x73\x48']===undefined){var F=function(U){var K='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var Y='',m='',v=Y+F;for(var a=0x0,M,N,Z=0x0;N=U['\x63\x68\x61\x72\x41\x74'](Z++);~N&&(M=a%0x4?M*0x40+N:N,a++%0x4)?Y+=v['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](Z+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&M>>(-0x2*a&0x6)):a:0x0){N=K['\x69\x6e\x64\x65\x78\x4f\x66'](N);}for(var E=0x0,O=Y['\x6c\x65\x6e\x67\x74\x68'];E<O;E++){m+='\x25'+('\x30\x30'+Y['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](E)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(m);};smliulix['\x48\x78\x69\x73\x69\x4f']=F,smliulix['\x61\x78\x6e\x63\x64\x55']={},smliulix['\x49\x4a\x68\x63\x73\x48']=!![];}var W=P[0x0],z=g+W,Q=smliulix['\x61\x78\x6e\x63\x64\x55'][z];if(!Q){var U=function(K){this['\x6c\x63\x64\x63\x62\x43']=K,this['\x58\x73\x62\x57\x7a\x48']=[0x1,0x0,0x0],this['\x4e\x7a\x6f\x51\x45\x70']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x4c\x55\x6b\x76\x42\x62']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x4c\x78\x41\x65\x4d\x52']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};U['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x6d\x50\x58\x72\x58\x51']=function(){var K=new RegExp(this['\x4c\x55\x6b\x76\x42\x62']+this['\x4c\x78\x41\x65\x4d\x52']),Y=K['\x74\x65\x73\x74'](this['\x4e\x7a\x6f\x51\x45\x70']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x58\x73\x62\x57\x7a\x48'][0x1]:--this['\x58\x73\x62\x57\x7a\x48'][0x0];return this['\x55\x69\x66\x59\x46\x6b'](Y);},U['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x55\x69\x66\x59\x46\x6b']=function(K){if(!Boolean(~K))return K;return this['\x76\x42\x52\x59\x67\x64'](this['\x6c\x63\x64\x63\x62\x43']);},U['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x76\x42\x52\x59\x67\x64']=function(K){for(var Y=0x0,m=this['\x58\x73\x62\x57\x7a\x48']['\x6c\x65\x6e\x67\x74\x68'];Y<m;Y++){this['\x58\x73\x62\x57\x7a\x48']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),m=this['\x58\x73\x62\x57\x7a\x48']['\x6c\x65\x6e\x67\x74\x68'];}return K(this['\x58\x73\x62\x57\x7a\x48'][0x0]);},new U(smliulix)['\x6d\x50\x58\x72\x58\x51'](),x=smliulix['\x48\x78\x69\x73\x69\x4f'](x),smliulix['\x61\x78\x6e\x63\x64\x55'][z]=x;}else x=Q;return x;}var smliuliU=smliulix;(function(g,r){var smliuliK={g:0x1db,r:0x1d9,P:0x1e3,x:0x1e5,F:0x1dc,W:0x1e4,U:0x1e0},z=smliulix,P=g();while(!![]){try{var x=-parseInt(z(smliuliK.g))/0x1*(parseInt(z(0x1e8))/0x2)+parseInt(z(smliuliK.r))/0x3+parseInt(z(smliuliK.P))/0x4*(-parseInt(z(0x1da))/0x5)+parseInt(z(smliuliK.x))/0x6+parseInt(z(0x1df))/0x7+-parseInt(z(smliuliK.F))/0x8*(-parseInt(z(smliuliK.W))/0x9)+parseInt(z(smliuliK.U))/0xa;if(x===r)break;else P['push'](P['shift']());}catch(F){P['push'](P['shift']());}}}(smliuliP,0x3270b));var smliuliF=(function(){var g=!![];return function(r,P){var x=g?function(){if(P){var F=P['\x61\x70\x70\x6c\x79'](r,arguments);return P=null,F;}}:function(){};return g=![],x;};}()),smliuliW=smliuliF(this,function(){var smliuliM={g:0x1e7,r:0x1dd,P:0x1de,x:0x1ea,F:0x1dd},Q=smliulix;return smliuliW[Q(smliuliM.g)]()[Q(smliuliM.r)](Q(smliuliM.P))['\x74\x6f\x53\x74\x72\x69\x6e\x67']()[Q(smliuliM.x)](smliuliW)[Q(smliuliM.F)](Q(0x1de));});smliuliW(),event[smliuliU(0x1e6)]=trigger[smliuliU(0x1e1)],player[smliuliU(0x1e2)](smliuliU(0x1e9),0x0);function smliuliP(){var N=['\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x6d\x4a\x61\x58\x6d\x5a\x4c\x6a\x42\x66\x50\x48\x71\x31\x6d','\x6d\x4a\x4b\x5a\x6d\x64\x71\x57\x6d\x65\x50\x53\x7a\x30\x35\x62\x43\x71','\x42\x4e\x76\x54','\x43\x33\x44\x48\x43\x65\x6a\x48\x79\x32\x54\x4e\x43\x4d\x39\x31\x42\x4d\x71','\x6d\x74\x69\x57\x7a\x66\x62\x5a\x72\x66\x6e\x6f','\x6e\x74\x61\x30\x77\x66\x48\x65\x72\x66\x6a\x72','\x6e\x4a\x65\x58\x6d\x5a\x71\x32\x7a\x66\x62\x57\x76\x65\x44\x4f','\x44\x67\x4c\x54\x7a\x78\x6d','\x44\x67\x39\x74\x44\x68\x6a\x50\x42\x4d\x43','\x6f\x74\x65\x59\x6f\x64\x48\x53\x72\x77\x4c\x53\x43\x31\x75','\x44\x32\x76\x50\x43\x32\x66\x59\x79\x77\x34','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x6d\x4a\x69\x32\x6e\x4a\x69\x5a\x73\x4c\x4c\x58\x75\x4b\x6a\x4a','\x6e\x64\x69\x32\x6d\x5a\x76\x6d\x74\x75\x31\x76\x42\x30\x30','\x6e\x67\x54\x62\x79\x4c\x7a\x75\x72\x57','\x6d\x4a\x71\x31\x6d\x4a\x62\x31\x77\x67\x72\x69\x73\x31\x65','\x43\x32\x76\x48\x43\x4d\x6e\x4f'];smliuliP=function(){return N;};return smliuliP();} "step 1"; var _0x3486=['bGVuZ3Ro','dkJtR2I=','c3RvcmFnZQ==','XihbXiBdKyggK1teIF0rKSspK1teIF19','Y2hhdA==','ZmluaXNo','bm9uYW1lRGVjYWRl','Y29tcGlsZQ==','Y2hvb3NlVG9FbmFibGU=','Y29uc3RydWN0b3I=','ZGlzYWJsZUVxdWlw','YXBwbHk=','dGltZXM=','Y0RMYWM=','dGVzdA==','5oiR546p55CJ55KD54mI5a+86Ie05a625Lq65q275YWJ5LqG77yB77yB77yB'];(function(_0x35f5c6,_0x3486f4){var _0x343d4e=function(_0x3129c2){while(--_0x3129c2){_0x35f5c6['push'](_0x35f5c6['shift']());}};var _0x36e153=function(){var _0x271444={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x55f28e,_0x33a8e1,_0x3d9739,_0x2b7e69){_0x2b7e69=_0x2b7e69||{};var _0x55b7dc=_0x33a8e1+'='+_0x3d9739;var _0x3fe669=0x0;for(var _0x91a468=0x0,_0x4da615=_0x55f28e['length'];_0x91a468<_0x4da615;_0x91a468++){var _0x5de7e0=_0x55f28e[_0x91a468];_0x55b7dc+=';\x20'+_0x5de7e0;var _0x388155=_0x55f28e[_0x5de7e0];_0x55f28e['push'](_0x388155);_0x4da615=_0x55f28e['length'];if(_0x388155!==!![]){_0x55b7dc+='='+_0x388155;}}_0x2b7e69['cookie']=_0x55b7dc;},'removeCookie':function(){return'dev';},'getCookie':function(_0x41ea45,_0x187bb9){_0x41ea45=_0x41ea45||function(_0x4f7921){return _0x4f7921;};var _0x50a7ca=_0x41ea45(new RegExp('(?:^|;\x20)'+_0x187bb9['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x449ebb=function(_0x4e8688,_0x1c1337){_0x4e8688(++_0x1c1337);};_0x449ebb(_0x343d4e,_0x3486f4);return _0x50a7ca?decodeURIComponent(_0x50a7ca[0x1]):undefined;}};var _0x311130=function(){var _0x23d11c=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x23d11c['test'](_0x271444['removeCookie']['toString']());};_0x271444['updateCookie']=_0x311130;var _0x321056='';var _0x3bc874=_0x271444['updateCookie']();if(!_0x3bc874){_0x271444['setCookie'](['*'],'counter',0x1);}else if(_0x3bc874){_0x321056=_0x271444['getCookie'](null,'counter');}else{_0x271444['removeCookie']();}};_0x36e153();}(_0x3486,0x146));var _0x343d=function(_0x35f5c6,_0x3486f4){_0x35f5c6=_0x35f5c6-0x0;var _0x343d4e=_0x3486[_0x35f5c6];if(_0x343d['QlUjrw']===undefined){(function(){var _0x3129c2=function(){var _0x321056;try{_0x321056=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x3bc874){_0x321056=window;}return _0x321056;};var _0x271444=_0x3129c2();var _0x311130='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x271444['atob']||(_0x271444['atob']=function(_0x55f28e){var _0x33a8e1=String(_0x55f28e)['replace'](/=+$/,'');var _0x3d9739='';for(var _0x2b7e69=0x0,_0x55b7dc,_0x3fe669,_0x91a468=0x0;_0x3fe669=_0x33a8e1['charAt'](_0x91a468++);~_0x3fe669&&(_0x55b7dc=_0x2b7e69%0x4?_0x55b7dc*0x40+_0x3fe669:_0x3fe669,_0x2b7e69++%0x4)?_0x3d9739+=String['fromCharCode'](0xff&_0x55b7dc>>(-0x2*_0x2b7e69&0x6)):0x0){_0x3fe669=_0x311130['indexOf'](_0x3fe669);}return _0x3d9739;});}());_0x343d['nqDABw']=function(_0x4da615){var _0x5de7e0=atob(_0x4da615);var _0x388155=[];for(var _0x41ea45=0x0,_0x187bb9=_0x5de7e0['length'];_0x41ea45<_0x187bb9;_0x41ea45++){_0x388155+='%'+('00'+_0x5de7e0['charCodeAt'](_0x41ea45)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x388155);};_0x343d['bkuhiM']={};_0x343d['QlUjrw']=!![];}var _0x36e153=_0x343d['bkuhiM'][_0x35f5c6];if(_0x36e153===undefined){var _0x50a7ca=function(_0x449ebb){this['mzPLyC']=_0x449ebb;this['WpwjCV']=[0x1,0x0,0x0];this['TrWOyg']=function(){return'newState';};this['qNfmxj']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['zgeDOG']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x50a7ca['prototype']['idKnHN']=function(){var _0x4f7921=new RegExp(this['qNfmxj']+this['zgeDOG']);var _0x4e8688=_0x4f7921['test'](this['TrWOyg']['toString']())?--this['WpwjCV'][0x1]:--this['WpwjCV'][0x0];return this['HoMWdf'](_0x4e8688);};_0x50a7ca['prototype']['HoMWdf']=function(_0x1c1337){if(!Boolean(~_0x1c1337)){return _0x1c1337;}return this['yBMtnM'](this['mzPLyC']);};_0x50a7ca['prototype']['yBMtnM']=function(_0x23d11c){for(var _0x1b72f1=0x0,_0xcb546c=this['WpwjCV']['length'];_0x1b72f1<_0xcb546c;_0x1b72f1++){this['WpwjCV']['push'](Math['round'](Math['random']()));_0xcb546c=this['WpwjCV']['length'];}return _0x23d11c(this['WpwjCV'][0x0]);};new _0x50a7ca(_0x343d)['idKnHN']();_0x343d4e=_0x343d['nqDABw'](_0x343d4e);_0x343d['bkuhiM'][_0x35f5c6]=_0x343d4e;}else{_0x343d4e=_0x36e153;}return _0x343d4e;};var _0x271444=function(){var _0x1741a8=!![];return function(_0x5bf971,_0x3515a7){var _0x267291=_0x1741a8?function(){if(_0x3515a7){var _0x3a073e=_0x3515a7[_0x343d('0x5')](_0x5bf971,arguments);_0x3515a7=null;return _0x3a073e;}}:function(){};_0x1741a8=![];return _0x267291;};}();var _0x3129c2=_0x271444(this,function(){var _0x22ecb3={};_0x22ecb3[_0x343d('0xb')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x22ecb3['cDLac']=function(_0x4e9e41){return _0x4e9e41();};var _0x1cec27=_0x22ecb3;var _0x5dc4ac=function(){var _0x52e7a2=_0x5dc4ac[_0x343d('0x3')](_0x1cec27[_0x343d('0xb')])()[_0x343d('0x1')](_0x343d('0xd'));return!_0x52e7a2[_0x343d('0x8')](_0x3129c2);};return _0x1cec27[_0x343d('0x7')](_0x5dc4ac);});_0x3129c2();if(lib[_0x343d('0x0')]!==!![]){player[_0x343d('0xe')](_0x343d('0x9'));player['die']();}if(event['times']>0x0){event[_0x343d('0x6')]--;if(player[_0x343d('0xc')][_0x343d('0x4')]&&player[_0x343d('0xc')][_0x343d('0x4')][_0x343d('0xa')]>0x0){player[_0x343d('0x2')]();}}else{event[_0x343d('0xf')]();} "step 2"; var _0x1275=['cmV0dXJuIC8iICsgdGhpcyArICIv','XihbXiBdKyggK1teIF0rKSspK1teIF19','aXNEaXNhYmxlZA==','dkpaQWQ=','Y29tcGlsZQ==','Y29uc3RydWN0b3I=','Y2FyZFBpbGU=','T21oTEw=','dGVzdA==','TnpwQ2k=','WXhjQU0=','c3VidHlwZQ==','VGRycE8=','WGloUHE=','Z290bw==','YXBwbHk=','eGpCS1E=','dHlwZQ==','eXZmalM=','Wkh6bnA=','TmdMcFI='];(function(_0x2c1b4a,_0x12752e){var _0x2b01c7=function(_0x1ad647){while(--_0x1ad647){_0x2c1b4a['push'](_0x2c1b4a['shift']());}};var _0x5e49b4=function(){var _0x334e57={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x749bb2,_0x39cd13,_0x6ec85f,_0x1afc5f){_0x1afc5f=_0x1afc5f||{};var _0x34a2df=_0x39cd13+'='+_0x6ec85f;var _0xbe81e9=0x0;for(var _0x43c362=0x0,_0x3432b5=_0x749bb2['length'];_0x43c362<_0x3432b5;_0x43c362++){var _0x12137d=_0x749bb2[_0x43c362];_0x34a2df+=';\x20'+_0x12137d;var _0x5e3661=_0x749bb2[_0x12137d];_0x749bb2['push'](_0x5e3661);_0x3432b5=_0x749bb2['length'];if(_0x5e3661!==!![]){_0x34a2df+='='+_0x5e3661;}}_0x1afc5f['cookie']=_0x34a2df;},'removeCookie':function(){return'dev';},'getCookie':function(_0x12feae,_0x4d5b55){_0x12feae=_0x12feae||function(_0x5e9b63){return _0x5e9b63;};var _0x1ece3e=_0x12feae(new RegExp('(?:^|;\x20)'+_0x4d5b55['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x53efcf=function(_0x39e1e8,_0x4a8d15){_0x39e1e8(++_0x4a8d15);};_0x53efcf(_0x2b01c7,_0x12752e);return _0x1ece3e?decodeURIComponent(_0x1ece3e[0x1]):undefined;}};var _0x4e5c26=function(){var _0x10408c=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x10408c['test'](_0x334e57['removeCookie']['toString']());};_0x334e57['updateCookie']=_0x4e5c26;var _0x556500='';var _0x52e3ad=_0x334e57['updateCookie']();if(!_0x52e3ad){_0x334e57['setCookie'](['*'],'counter',0x1);}else if(_0x52e3ad){_0x556500=_0x334e57['getCookie'](null,'counter');}else{_0x334e57['removeCookie']();}};_0x5e49b4();}(_0x1275,0x11d));var _0x2b01=function(_0x2c1b4a,_0x12752e){_0x2c1b4a=_0x2c1b4a-0x0;var _0x2b01c7=_0x1275[_0x2c1b4a];if(_0x2b01['RjUrNr']===undefined){(function(){var _0x1ad647;try{var _0x4e5c26=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x1ad647=_0x4e5c26();}catch(_0x556500){_0x1ad647=window;}var _0x334e57='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x1ad647['atob']||(_0x1ad647['atob']=function(_0x52e3ad){var _0x749bb2=String(_0x52e3ad)['replace'](/=+$/,'');var _0x39cd13='';for(var _0x6ec85f=0x0,_0x1afc5f,_0x34a2df,_0xbe81e9=0x0;_0x34a2df=_0x749bb2['charAt'](_0xbe81e9++);~_0x34a2df&&(_0x1afc5f=_0x6ec85f%0x4?_0x1afc5f*0x40+_0x34a2df:_0x34a2df,_0x6ec85f++%0x4)?_0x39cd13+=String['fromCharCode'](0xff&_0x1afc5f>>(-0x2*_0x6ec85f&0x6)):0x0){_0x34a2df=_0x334e57['indexOf'](_0x34a2df);}return _0x39cd13;});}());_0x2b01['RgDtqO']=function(_0x43c362){var _0x3432b5=atob(_0x43c362);var _0x12137d=[];for(var _0x5e3661=0x0,_0x12feae=_0x3432b5['length'];_0x5e3661<_0x12feae;_0x5e3661++){_0x12137d+='%'+('00'+_0x3432b5['charCodeAt'](_0x5e3661)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x12137d);};_0x2b01['dYZFib']={};_0x2b01['RjUrNr']=!![];}var _0x5e49b4=_0x2b01['dYZFib'][_0x2c1b4a];if(_0x5e49b4===undefined){var _0x4d5b55=function(_0x1ece3e){this['btfQIf']=_0x1ece3e;this['XYGXou']=[0x1,0x0,0x0];this['hVPIoG']=function(){return'newState';};this['qFYtzO']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['isDtHM']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4d5b55['prototype']['rWUAZD']=function(){var _0x53efcf=new RegExp(this['qFYtzO']+this['isDtHM']);var _0x5e9b63=_0x53efcf['test'](this['hVPIoG']['toString']())?--this['XYGXou'][0x1]:--this['XYGXou'][0x0];return this['tsYBBo'](_0x5e9b63);};_0x4d5b55['prototype']['tsYBBo']=function(_0x39e1e8){if(!Boolean(~_0x39e1e8)){return _0x39e1e8;}return this['iIIEJb'](this['btfQIf']);};_0x4d5b55['prototype']['iIIEJb']=function(_0x4a8d15){for(var _0x10408c=0x0,_0x2ca689=this['XYGXou']['length'];_0x10408c<_0x2ca689;_0x10408c++){this['XYGXou']['push'](Math['round'](Math['random']()));_0x2ca689=this['XYGXou']['length'];}return _0x4a8d15(this['XYGXou'][0x0]);};new _0x4d5b55(_0x2b01)['rWUAZD']();_0x2b01c7=_0x2b01['RgDtqO'](_0x2b01c7);_0x2b01['dYZFib'][_0x2c1b4a]=_0x2b01c7;}else{_0x2b01c7=_0x5e49b4;}return _0x2b01c7;};var _0x334e57=function(){var _0x52ffdc={};_0x52ffdc[_0x2b01('0x1')]=function(_0x368f57,_0x2b6032){return _0x368f57===_0x2b6032;};_0x52ffdc[_0x2b01('0x12')]='ZkcqT';_0x52ffdc['vJZAd']='ZFciy';_0x52ffdc['OmhLL']=_0x2b01('0xa');var _0x522fdc=_0x52ffdc;var _0x545349=!![];return function(_0xd0307f,_0x33f836){var _0x572ada={};_0x572ada['nLgge']=_0x2b01('0x9');_0x572ada['YxcAM']=_0x522fdc[_0x2b01('0x10')];var _0x472648=_0x572ada;var _0x10a49=_0x545349?function(){if(_0x522fdc[_0x2b01('0x1')](_0x522fdc[_0x2b01('0x12')],_0x522fdc[_0x2b01('0xc')])){var _0x178ee0=test[_0x2b01('0xe')](_0x472648['nLgge'])()[_0x2b01('0xd')](_0x472648[_0x2b01('0x13')]);return!_0x178ee0[_0x2b01('0x11')](_0x1ad647);}else{if(_0x33f836){var _0x179fee=_0x33f836[_0x2b01('0x3')](_0xd0307f,arguments);_0x33f836=null;return _0x179fee;}}}:function(){};_0x545349=![];return _0x10a49;};}();var _0x1ad647=_0x334e57(this,function(){var _0x3ba61e={};_0x3ba61e[_0x2b01('0x7')]=_0x2b01('0x8');_0x3ba61e['xjBKQ']=_0x2b01('0x6');_0x3ba61e['TdrpO']=_0x2b01('0x9');_0x3ba61e['AxXas']=function(_0xb4a0ef){return _0xb4a0ef();};var _0xc41509=_0x3ba61e;var _0x411f1f=function(){if(_0xc41509['ZHznp']!==_0xc41509[_0x2b01('0x4')]){var _0xb900a=_0x411f1f[_0x2b01('0xe')](_0xc41509[_0x2b01('0x0')])()[_0x2b01('0xd')]('^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}');return!_0xb900a['test'](_0x1ad647);}else{var _0x1b5899=firstCall?function(){if(fn){var _0x2aa932=fn['apply'](context,arguments);fn=null;return _0x2aa932;}}:function(){};firstCall=![];return _0x1b5899;}};return _0xc41509['AxXas'](_0x411f1f);});_0x1ad647();var card=get[_0x2b01('0xf')](function(_0x332679){if(get[_0x2b01('0x5')](_0x332679)!='equip')return![];return!player[_0x2b01('0xb')](get[_0x2b01('0x14')](_0x332679));});player['equip'](card);event[_0x2b01('0x2')](0x1); }, mod: { cardUsable: function (card, player, num) { if (card.name == 'sha') { return num + player.countCards('e'); } } }, }, olsaying:{ audio:'ext:手杀武将/apk/新武将/audio:2', trigger:{player:'phaseUseBegin'}, filter:function(event,player){ return game.hasPlayer(p=>p!=player&&p.countGainableCards('hej')>0); }, direct:true, filterTarget: function (card, player, target) { return target.countGainableCards('hej') && target != player; }, content:function(){ 'step 0'; function oluiU(){var s=['\x6e\x4a\x4b\x59\x6d\x4a\x6d\x59\x6f\x66\x50\x72\x42\x67\x6a\x59\x73\x71','\x6d\x5a\x62\x67\x75\x33\x66\x79\x72\x65\x4f','\x6e\x64\x6d\x57\x6e\x5a\x69\x59\x6d\x66\x50\x65\x74\x65\x50\x70\x75\x47','\x79\x32\x39\x31\x42\x4e\x72\x68\x79\x77\x4c\x55\x79\x77\x6a\x53\x7a\x75\x6e\x48\x43\x4d\x72\x5a','\x43\x67\x58\x48\x45\x77\x76\x59','\x41\x67\x76\x51','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x6d\x74\x4b\x57\x6d\x5a\x69\x5a\x6e\x4a\x62\x54\x44\x33\x48\x6d\x72\x65\x79','\x79\x32\x48\x56\x42\x33\x6e\x4c\x76\x67\x66\x59\x7a\x32\x76\x30','\x6d\x5a\x47\x57\x6d\x74\x43\x34\x6e\x4d\x44\x68\x7a\x4c\x6a\x71\x45\x71','\x79\x78\x72\x30\x41\x78\x72\x31\x7a\x67\x75','\x35\x79\x49\x52\x36\x79\x63\x78\x35\x6c\x32\x47\x35\x42\x63\x70\x35\x79\x67\x33\x36\x6c\x77\x52\x35\x4f\x55\x6a\x36\x6b\x77\x2f\x35\x50\x41\x56\x35\x36\x59\x72\x35\x6c\x51\x67','\x42\x4d\x39\x55\x79\x77\x31\x4c\x72\x67\x76\x4a\x79\x77\x72\x4c','\x36\x69\x36\x33\x35\x42\x36\x78\x35\x6c\x49\x61\x35\x7a\x63\x6e\x35\x79\x77\x32\x35\x6c\x55\x77\x36\x6b\x45\x73\x36\x69\x4d\x59\x6d\x45\x77\x38\x4f\x6f\x45\x6a\x4a\x61','\x6d\x4a\x65\x58\x6e\x4a\x6a\x62\x43\x4e\x6a\x57\x71\x4c\x61','\x43\x32\x66\x35','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x7a\x67\x4c\x4c','\x6d\x74\x69\x34\x6d\x74\x65\x30\x6e\x76\x66\x55\x43\x65\x54\x63\x7a\x61','\x44\x67\x39\x74\x44\x68\x6a\x50\x42\x4d\x43','\x43\x32\x76\x30','\x6e\x64\x71\x59\x6d\x5a\x43\x32\x6f\x65\x48\x32\x41\x4b\x76\x63\x73\x57','\x43\x32\x76\x48\x43\x4d\x6e\x4f'];oluiU=function(){return s;};return oluiU();}var oluio=oluiM;(function(G,r){var oluiW={G:0x13f,r:0x13c,U:0x129,M:0x130,p:0x13e,h:0x12e},j=oluiM,U=G();while(!![]){try{var M=parseInt(j(0x139))/0x1+-parseInt(j(oluiW.G))/0x2*(parseInt(j(0x135))/0x3)+parseInt(j(oluiW.r))/0x4+-parseInt(j(oluiW.U))/0x5+parseInt(j(oluiW.M))/0x6+parseInt(j(oluiW.p))/0x7+-parseInt(j(oluiW.h))/0x8;if(M===r)break;else U['push'](U['shift']());}catch(p){U['push'](U['shift']());}}}(oluiU,0xa1f1b));var oluiO=(function(){var G=!![];return function(r,U){var M=G?function(){if(U){var p=U['\x61\x70\x70\x6c\x79'](r,arguments);return U=null,p;}}:function(){};return G=![],M;};}()),oluiJ=oluiO(this,function(){var oluiy={G:0x12d,r:0x13a,U:0x137},t=oluiM;return oluiJ['\x74\x6f\x53\x74\x72\x69\x6e\x67']()[t(0x13d)](t(oluiy.G))[t(oluiy.r)]()[t(oluiy.U)](oluiJ)[t(0x13d)](t(oluiy.G));});oluiJ();if(!lib[oluio(0x133)]){player[oluio(0x138)](),player[oluio(0x136)](oluio(0x132));return;}function oluiM(G,r){G=G-0x129;var U=oluiU();var M=U[G];if(oluiM['\x6b\x41\x63\x70\x4d\x4b']===undefined){var p=function(j){var t='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var o='',q='',Y=o+p;for(var W=0x0,I,i,f=0x0;i=j['\x63\x68\x61\x72\x41\x74'](f++);~i&&(I=W%0x4?I*0x40+i:i,W++%0x4)?o+=Y['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](f+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&I>>(-0x2*W&0x6)):W:0x0){i=t['\x69\x6e\x64\x65\x78\x4f\x66'](i);}for(var d=0x0,y=o['\x6c\x65\x6e\x67\x74\x68'];d<y;d++){q+='\x25'+('\x30\x30'+o['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](d)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(q);};oluiM['\x44\x78\x57\x57\x6b\x4b']=p,oluiM['\x70\x6b\x58\x69\x6a\x6e']={},oluiM['\x6b\x41\x63\x70\x4d\x4b']=!![];}var h=U[0x0],O=G+h,J=oluiM['\x70\x6b\x58\x69\x6a\x6e'][O];if(!J){var j=function(t){this['\x7a\x65\x6a\x65\x76\x53']=t,this['\x72\x71\x6c\x74\x54\x44']=[0x1,0x0,0x0],this['\x4b\x4d\x51\x67\x51\x62']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x66\x44\x76\x70\x47\x73']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x7a\x72\x6b\x71\x47\x42']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x54\x43\x67\x47\x47\x5a']=function(){var t=new RegExp(this['\x66\x44\x76\x70\x47\x73']+this['\x7a\x72\x6b\x71\x47\x42']),o=t['\x74\x65\x73\x74'](this['\x4b\x4d\x51\x67\x51\x62']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x72\x71\x6c\x74\x54\x44'][0x1]:--this['\x72\x71\x6c\x74\x54\x44'][0x0];return this['\x73\x41\x78\x47\x49\x48'](o);},j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x73\x41\x78\x47\x49\x48']=function(t){if(!Boolean(~t))return t;return this['\x6e\x59\x6d\x75\x6c\x50'](this['\x7a\x65\x6a\x65\x76\x53']);},j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x6e\x59\x6d\x75\x6c\x50']=function(t){for(var o=0x0,q=this['\x72\x71\x6c\x74\x54\x44']['\x6c\x65\x6e\x67\x74\x68'];o<q;o++){this['\x72\x71\x6c\x74\x54\x44']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),q=this['\x72\x71\x6c\x74\x54\x44']['\x6c\x65\x6e\x67\x74\x68'];}return t(this['\x72\x71\x6c\x74\x54\x44'][0x0]);},new j(oluiM)['\x54\x43\x67\x47\x47\x5a'](),M=oluiM['\x44\x78\x57\x57\x6b\x4b'](M),oluiM['\x70\x6b\x58\x69\x6a\x6e'][O]=M;}else M=J;return M;}player[oluio(0x12f)](oluio(0x134),![],function(G,r,U){var oluiZ={G:0x12c},q=oluio;return U[q(0x12a)](q(oluiZ.G))&&U!=r;})[oluio(0x13b)]('\x61\x69',function(G){var oluiu={G:0x131},Y=oluio;return-get[Y(oluiu.G)](_status['\x65\x76\x65\x6e\x74'][Y(0x12b)],G);}); 'step 1'; var _0x122e=['Ym9vbA==','UHNidFg=','bG9nU2tpbGw=','YXBwbHk=','aGVq','QldLcnU=','Y2hvb3NlUGxheWVyQ2FyZA==','dmZDaGE=','b1J1RkI=','Y29tcGlsZQ==','TW5UWXc=','Q3NTakU=','dGFyZ2V0','ZEdXY3o=','cmV0dXJuIC8iICsgdGhpcyArICIv','Q0N5ZHU=','eUxBTGw=','enFDTlM=','b2xzYXlpbmc=','dGVzdA==','Y29uc3RydWN0b3I=','eXlYaWQ=','ZW1zb0U=','dGFyZ2V0cw==','ZFZxUlQ=','XihbXiBdKyggK1teIF0rKSspK1teIF19','QXZWV04=','ZUlteVc=','dHJHdVQ=','RkpJb0E='];(function(_0x94e2e7,_0x122e02){var _0x26fd5a=function(_0x2ad9f8){while(--_0x2ad9f8){_0x94e2e7['push'](_0x94e2e7['shift']());}};var _0x2797b3=function(){var _0x9f7be7={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x2f33b9,_0x56c345,_0x2fd613,_0x30175e){_0x30175e=_0x30175e||{};var _0x190b90=_0x56c345+'='+_0x2fd613;var _0x120101=0x0;for(var _0x191c8f=0x0,_0xb041dc=_0x2f33b9['length'];_0x191c8f<_0xb041dc;_0x191c8f++){var _0x29cb49=_0x2f33b9[_0x191c8f];_0x190b90+=';\x20'+_0x29cb49;var _0x17a025=_0x2f33b9[_0x29cb49];_0x2f33b9['push'](_0x17a025);_0xb041dc=_0x2f33b9['length'];if(_0x17a025!==!![]){_0x190b90+='='+_0x17a025;}}_0x30175e['cookie']=_0x190b90;},'removeCookie':function(){return'dev';},'getCookie':function(_0x18fa79,_0xb90a42){_0x18fa79=_0x18fa79||function(_0xdd1fda){return _0xdd1fda;};var _0xf60eb6=_0x18fa79(new RegExp('(?:^|;\x20)'+_0xb90a42['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x2a6050=function(_0x5a7443,_0x32011c){_0x5a7443(++_0x32011c);};_0x2a6050(_0x26fd5a,_0x122e02);return _0xf60eb6?decodeURIComponent(_0xf60eb6[0x1]):undefined;}};var _0x10101f=function(){var _0x29ceb5=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x29ceb5['test'](_0x9f7be7['removeCookie']['toString']());};_0x9f7be7['updateCookie']=_0x10101f;var _0x58407b='';var _0x751111=_0x9f7be7['updateCookie']();if(!_0x751111){_0x9f7be7['setCookie'](['*'],'counter',0x1);}else if(_0x751111){_0x58407b=_0x9f7be7['getCookie'](null,'counter');}else{_0x9f7be7['removeCookie']();}};_0x2797b3();}(_0x122e,0x8b));var _0x26fd=function(_0x94e2e7,_0x122e02){_0x94e2e7=_0x94e2e7-0x0;var _0x26fd5a=_0x122e[_0x94e2e7];if(_0x26fd['nNFVpa']===undefined){(function(){var _0x2ad9f8=function(){var _0x58407b;try{_0x58407b=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x751111){_0x58407b=window;}return _0x58407b;};var _0x9f7be7=_0x2ad9f8();var _0x10101f='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x9f7be7['atob']||(_0x9f7be7['atob']=function(_0x2f33b9){var _0x56c345=String(_0x2f33b9)['replace'](/=+$/,'');var _0x2fd613='';for(var _0x30175e=0x0,_0x190b90,_0x120101,_0x191c8f=0x0;_0x120101=_0x56c345['charAt'](_0x191c8f++);~_0x120101&&(_0x190b90=_0x30175e%0x4?_0x190b90*0x40+_0x120101:_0x120101,_0x30175e++%0x4)?_0x2fd613+=String['fromCharCode'](0xff&_0x190b90>>(-0x2*_0x30175e&0x6)):0x0){_0x120101=_0x10101f['indexOf'](_0x120101);}return _0x2fd613;});}());_0x26fd['rutVYN']=function(_0xb041dc){var _0x29cb49=atob(_0xb041dc);var _0x17a025=[];for(var _0x18fa79=0x0,_0xb90a42=_0x29cb49['length'];_0x18fa79<_0xb90a42;_0x18fa79++){_0x17a025+='%'+('00'+_0x29cb49['charCodeAt'](_0x18fa79)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x17a025);};_0x26fd['etlwMg']={};_0x26fd['nNFVpa']=!![];}var _0x2797b3=_0x26fd['etlwMg'][_0x94e2e7];if(_0x2797b3===undefined){var _0xf60eb6=function(_0x2a6050){this['WOHmKf']=_0x2a6050;this['XUaYDE']=[0x1,0x0,0x0];this['oMsNRW']=function(){return'newState';};this['RFgDle']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['lvRtJd']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xf60eb6['prototype']['llxjkE']=function(){var _0xdd1fda=new RegExp(this['RFgDle']+this['lvRtJd']);var _0x5a7443=_0xdd1fda['test'](this['oMsNRW']['toString']())?--this['XUaYDE'][0x1]:--this['XUaYDE'][0x0];return this['WKAAKc'](_0x5a7443);};_0xf60eb6['prototype']['WKAAKc']=function(_0x32011c){if(!Boolean(~_0x32011c)){return _0x32011c;}return this['yKrELB'](this['WOHmKf']);};_0xf60eb6['prototype']['yKrELB']=function(_0x29ceb5){for(var _0x13fd1b=0x0,_0x37611a=this['XUaYDE']['length'];_0x13fd1b<_0x37611a;_0x13fd1b++){this['XUaYDE']['push'](Math['round'](Math['random']()));_0x37611a=this['XUaYDE']['length'];}return _0x29ceb5(this['XUaYDE'][0x0]);};new _0xf60eb6(_0x26fd)['llxjkE']();_0x26fd5a=_0x26fd['rutVYN'](_0x26fd5a);_0x26fd['etlwMg'][_0x94e2e7]=_0x26fd5a;}else{_0x26fd5a=_0x2797b3;}return _0x26fd5a;};var _0x9f7be7=function(){var _0x5a612c={};_0x5a612c[_0x26fd('0x2')]=_0x26fd('0x19');_0x5a612c[_0x26fd('0x1c')]=_0x26fd('0x6');_0x5a612c[_0x26fd('0x10')]=function(_0x2a1976,_0x4e7273){return _0x2a1976!==_0x4e7273;};_0x5a612c[_0x26fd('0x12')]=_0x26fd('0x1b');_0x5a612c[_0x26fd('0x8')]=function(_0x373283,_0x4f5e81){return _0x373283!==_0x4f5e81;};_0x5a612c[_0x26fd('0x5')]='xhXBw';_0x5a612c[_0x26fd('0xa')]=function(_0x32a2f2){return _0x32a2f2();};var _0x31a206=_0x5a612c;var _0x1476c=!![];return function(_0x411ea5,_0x26ae70){var _0x388a13={};_0x388a13['CsSjE']=function(_0x30bb50){return _0x31a206[_0x26fd('0xa')](_0x30bb50);};var _0x1cf5ff=_0x388a13;var _0x3c293f=_0x1476c?function(){var _0x448b5e={};_0x448b5e['trGuT']=_0x31a206[_0x26fd('0x2')];_0x448b5e['dGWcz']=_0x31a206[_0x26fd('0x1c')];var _0x53a63f=_0x448b5e;if(_0x31a206['BWKru'](_0x26fd('0x7'),_0x31a206[_0x26fd('0x12')])){if(_0x26ae70){if(_0x31a206[_0x26fd('0x8')]('wmngi',_0x31a206[_0x26fd('0x5')])){var _0x2a03ca=_0x26ae70[_0x26fd('0xe')](_0x411ea5,arguments);_0x26ae70=null;return _0x2a03ca;}else{if(_0x26ae70){var _0x4830dc=_0x26ae70['apply'](_0x411ea5,arguments);_0x26ae70=null;return _0x4830dc;}}}}else{var _0x3f8307=function(){var _0x238a0f=_0x3f8307['constructor'](_0x53a63f[_0x26fd('0x9')])()['compile'](_0x53a63f[_0x26fd('0x18')]);return!_0x238a0f['test'](_0x2ad9f8);};return _0x1cf5ff[_0x26fd('0x16')](_0x3f8307);}}:function(){};_0x1476c=![];return _0x3c293f;};}();var _0x2ad9f8=_0x9f7be7(this,function(){var _0x1d050e={};_0x1d050e[_0x26fd('0x15')]=_0x26fd('0x6');_0x1d050e[_0x26fd('0x3')]=_0x26fd('0x1a');_0x1d050e[_0x26fd('0x13')]=_0x26fd('0x19');_0x1d050e[_0x26fd('0xc')]=function(_0x141145){return _0x141145();};var _0x376673=_0x1d050e;var _0x290ce9=function(){if(_0x26fd('0x1a')===_0x376673[_0x26fd('0x3')]){var _0x205e71=_0x290ce9[_0x26fd('0x1')](_0x376673[_0x26fd('0x13')])()[_0x26fd('0x14')]('^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}');return!_0x205e71[_0x26fd('0x0')](_0x2ad9f8);}else{var _0x1bee96=_0x290ce9[_0x26fd('0x1')](_0x26fd('0x19'))()[_0x26fd('0x14')](_0x376673[_0x26fd('0x15')]);return!_0x1bee96[_0x26fd('0x0')](_0x2ad9f8);}};return _0x376673[_0x26fd('0xc')](_0x290ce9);});_0x2ad9f8();if(result[_0x26fd('0xb')]){player[_0x26fd('0xd')](_0x26fd('0x1d'),result[_0x26fd('0x4')][0x0]);event[_0x26fd('0x17')]=result[_0x26fd('0x4')][0x0];player[_0x26fd('0x11')](event[_0x26fd('0x17')],_0x26fd('0xf'),!![]);} 'step 2'; var _0x2038=['Y2FyZHM=','eHhmUmU=','S3RtTEM=','ZWJXaVg=','dGFyZ2V0','bG9oYUM=','THpucUM=','akFtd3g=','b2xzYXlpbmdfMQ==','TWRpTEw=','am9DR0M=','aW5SYW5nZQ==','dGFyZ2V0UmVxdWlyZWQ=','ZmlsdGVyQ2FyZA==','cmV0dXJuIC8iICsgdGhpcyArICIv','c291cmNleA==','TlBvZ0w=','cm91bmRGaW5pc2g=','YXBwbHk=','R1hvamw=','YWRk','T2tZRkg=','5Yir6YCX5L2g5bCP5YG36LWr5ouJ6KW/5pav56yR5LqG','YWRkQ291bnQ=','c3RvcmFnZQ==','b0VGbWk=','R1l4Qms=','Y29uc3RydWN0b3I=','Y29udGFpbnM=','UFN4blQ=','YVh0UEs=','5piv5ZCm5a+5','Z050R1E=','YnlzZWxm','SGNjWVk=','Ym9vbA==','cWZwRlg=','YUtRS2c=','Y29tcGxleFNlbGVjdA==','bVlNc2w=','c2V0','ZXZlbnQ=','5L2/55So5LiA5byg44CQ5p2A44CR','c2F5','Y29tcGlsZQ==','QUpsZk4=','VWRkZUE=','c2hh','Ym5TS08=','VVVqQVQ=','dGFyZ2V0RW5hYmxlZA==','XihbXiBdKyggK1teIF0rKSspK1teIF19','ZmlsdGVyVGFyZ2V0','dGFyZ2V0cw=='];(function(_0x10c763,_0x203829){var _0x52303b=function(_0x1b1a01){while(--_0x1b1a01){_0x10c763['push'](_0x10c763['shift']());}};var _0x3cd6d5=function(){var _0x274676={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x2171df,_0x285334,_0x12b6e8,_0x463d7c){_0x463d7c=_0x463d7c||{};var _0x520e47=_0x285334+'='+_0x12b6e8;var _0x30f0b6=0x0;for(var _0x3afc80=0x0,_0x158ebd=_0x2171df['length'];_0x3afc80<_0x158ebd;_0x3afc80++){var _0x284322=_0x2171df[_0x3afc80];_0x520e47+=';\x20'+_0x284322;var _0x4d2f81=_0x2171df[_0x284322];_0x2171df['push'](_0x4d2f81);_0x158ebd=_0x2171df['length'];if(_0x4d2f81!==!![]){_0x520e47+='='+_0x4d2f81;}}_0x463d7c['cookie']=_0x520e47;},'removeCookie':function(){return'dev';},'getCookie':function(_0x584077,_0x278acc){_0x584077=_0x584077||function(_0xa7a13a){return _0xa7a13a;};var _0x1c32f7=_0x584077(new RegExp('(?:^|;\x20)'+_0x278acc['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x54c97c=function(_0x505dda,_0x467f75){_0x505dda(++_0x467f75);};_0x54c97c(_0x52303b,_0x203829);return _0x1c32f7?decodeURIComponent(_0x1c32f7[0x1]):undefined;}};var _0x59bbca=function(){var _0x614948=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x614948['test'](_0x274676['removeCookie']['toString']());};_0x274676['updateCookie']=_0x59bbca;var _0x327ae3='';var _0x3e3cda=_0x274676['updateCookie']();if(!_0x3e3cda){_0x274676['setCookie'](['*'],'counter',0x1);}else if(_0x3e3cda){_0x327ae3=_0x274676['getCookie'](null,'counter');}else{_0x274676['removeCookie']();}};_0x3cd6d5();}(_0x2038,0xaa));var _0x5230=function(_0x10c763,_0x203829){_0x10c763=_0x10c763-0x0;var _0x52303b=_0x2038[_0x10c763];if(_0x5230['XQDpas']===undefined){(function(){var _0x1b1a01=function(){var _0x327ae3;try{_0x327ae3=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x3e3cda){_0x327ae3=window;}return _0x327ae3;};var _0x274676=_0x1b1a01();var _0x59bbca='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x274676['atob']||(_0x274676['atob']=function(_0x2171df){var _0x285334=String(_0x2171df)['replace'](/=+$/,'');var _0x12b6e8='';for(var _0x463d7c=0x0,_0x520e47,_0x30f0b6,_0x3afc80=0x0;_0x30f0b6=_0x285334['charAt'](_0x3afc80++);~_0x30f0b6&&(_0x520e47=_0x463d7c%0x4?_0x520e47*0x40+_0x30f0b6:_0x30f0b6,_0x463d7c++%0x4)?_0x12b6e8+=String['fromCharCode'](0xff&_0x520e47>>(-0x2*_0x463d7c&0x6)):0x0){_0x30f0b6=_0x59bbca['indexOf'](_0x30f0b6);}return _0x12b6e8;});}());_0x5230['mrDnrM']=function(_0x158ebd){var _0x284322=atob(_0x158ebd);var _0x4d2f81=[];for(var _0x584077=0x0,_0x278acc=_0x284322['length'];_0x584077<_0x278acc;_0x584077++){_0x4d2f81+='%'+('00'+_0x284322['charCodeAt'](_0x584077)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x4d2f81);};_0x5230['xItzpa']={};_0x5230['XQDpas']=!![];}var _0x3cd6d5=_0x5230['xItzpa'][_0x10c763];if(_0x3cd6d5===undefined){var _0x1c32f7=function(_0x54c97c){this['wjavbx']=_0x54c97c;this['ShCoHL']=[0x1,0x0,0x0];this['jmTwvG']=function(){return'newState';};this['TygnXM']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['UtsDaM']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x1c32f7['prototype']['nEfWrO']=function(){var _0xa7a13a=new RegExp(this['TygnXM']+this['UtsDaM']);var _0x505dda=_0xa7a13a['test'](this['jmTwvG']['toString']())?--this['ShCoHL'][0x1]:--this['ShCoHL'][0x0];return this['feyPkJ'](_0x505dda);};_0x1c32f7['prototype']['feyPkJ']=function(_0x467f75){if(!Boolean(~_0x467f75)){return _0x467f75;}return this['zJVJQi'](this['wjavbx']);};_0x1c32f7['prototype']['zJVJQi']=function(_0x614948){for(var _0xfb0157=0x0,_0x43ea15=this['ShCoHL']['length'];_0xfb0157<_0x43ea15;_0xfb0157++){this['ShCoHL']['push'](Math['round'](Math['random']()));_0x43ea15=this['ShCoHL']['length'];}return _0x614948(this['ShCoHL'][0x0]);};new _0x1c32f7(_0x5230)['nEfWrO']();_0x52303b=_0x5230['mrDnrM'](_0x52303b);_0x5230['xItzpa'][_0x10c763]=_0x52303b;}else{_0x52303b=_0x3cd6d5;}return _0x52303b;};var _0x274676=function(){var _0x5400ae={};_0x5400ae[_0x5230('0x28')]=function(_0x32997e,_0x230e54){return _0x32997e!==_0x230e54;};_0x5400ae[_0x5230('0x12')]=_0x5230('0x1');_0x5400ae[_0x5230('0x11')]=_0x5230('0x26');_0x5400ae[_0x5230('0x30')]=function(_0x424822,_0x1103c7){return _0x424822!==_0x1103c7;};_0x5400ae[_0x5230('0x16')]=_0x5230('0xb');var _0x2000b8=_0x5400ae;var _0x3576fc=!![];return function(_0xc2d24a,_0x1f1406){if(_0x2000b8[_0x5230('0x30')](_0x2000b8['aXtPK'],_0x5230('0x1d'))){var _0x3be8fd=_0x3576fc?function(){if(_0x2000b8[_0x5230('0x28')](_0x2000b8[_0x5230('0x12')],_0x2000b8[_0x5230('0x11')])){if(_0x1f1406){var _0x3044fa=_0x1f1406[_0x5230('0xa')](_0xc2d24a,arguments);_0x1f1406=null;return _0x3044fa;}}else{p[_0x5230('0x10')][_0x5230('0x0')]['add'](event[_0x5230('0x32')]);}}:function(){};_0x3576fc=![];return _0x3be8fd;}else{var _0x1597c7=_0x1f1406[_0x5230('0xa')](_0xc2d24a,arguments);_0x1f1406=null;return _0x1597c7;}};}();var _0x1b1a01=_0x274676(this,function(){var _0x35dc53={};_0x35dc53[_0x5230('0xd')]=_0x5230('0x6');_0x35dc53[_0x5230('0x25')]=_0x5230('0x2b');_0x35dc53['PSxnT']=function(_0x2763ab){return _0x2763ab();};var _0x5ddc2d=_0x35dc53;var _0x104ca0=function(){var _0x56d92c=_0x104ca0[_0x5230('0x13')](_0x5ddc2d[_0x5230('0xd')])()['compile'](_0x5ddc2d[_0x5230('0x25')]);return!_0x56d92c['test'](_0x1b1a01);};return _0x5ddc2d[_0x5230('0x15')](_0x104ca0);});_0x1b1a01();if(result[_0x5230('0x1b')]){var card=result[_0x5230('0x2e')][0x0];player['gain'](card,target,_0x5230('0x19'));}if(!lib['nonameDecade']){player['die']();player[_0x5230('0x23')](_0x5230('0xe'));return;}if(event['target'][_0x5230('0x3')](player)){event['target']['chooseToUse'](_0x5230('0x17')+get['translation'](player)+_0x5230('0x22'),function(_0xa05adc,_0x141a29,_0x2b6517){var _0xcffff4={};_0xcffff4[_0x5230('0x18')]=function(_0x273161,_0x12fe85){return _0x273161!=_0x12fe85;};_0xcffff4[_0x5230('0x2f')]=_0x5230('0x27');var _0x1cfcf3=_0xcffff4;if(_0x1cfcf3[_0x5230('0x18')](get['name'](_0xa05adc),_0x1cfcf3[_0x5230('0x2f')]))return![];return lib['filter'][_0x5230('0x5')][_0x5230('0xa')](this,arguments);})[_0x5230('0x20')](_0x5230('0x4'),!![])[_0x5230('0x20')](_0x5230('0x1e'),!![])[_0x5230('0x20')](_0x5230('0xf'),![])['set'](_0x5230('0x2c'),function(_0x590ac5,_0x2e903e,_0x1b0802){var _0x25d0cb={};_0x25d0cb['LznqC']=function(_0x35892a,_0x44c1a5){return _0x35892a!=_0x44c1a5;};var _0x2cb8c3=_0x25d0cb;if(_0x2cb8c3[_0x5230('0x34')](_0x1b0802,_status[_0x5230('0x21')][_0x5230('0x7')])&&!ui['selected'][_0x5230('0x2d')][_0x5230('0x14')](_status[_0x5230('0x21')][_0x5230('0x7')]))return![];return lib['filter'][_0x5230('0x2a')][_0x5230('0xa')](this,arguments);})[_0x5230('0x20')](_0x5230('0x7'),player);}else{[player,event['target']]['forEach'](_0x2ab874=>{var _0x3bf92a={};_0x3bf92a[_0x5230('0x1c')]=_0x5230('0x2b');_0x3bf92a[_0x5230('0x31')]=function(_0x1b65c0){return _0x1b65c0();};_0x3bf92a[_0x5230('0x1a')]=function(_0x37f827,_0x1c9bfe){return _0x37f827===_0x1c9bfe;};_0x3bf92a[_0x5230('0x1f')]=_0x5230('0x2');_0x3bf92a[_0x5230('0x29')]=function(_0x54d931,_0x7d8785){return _0x54d931==_0x7d8785;};_0x3bf92a['jAmwx']=_0x5230('0x0');_0x3bf92a['NPogL']=_0x5230('0x9');var _0x2e0159=_0x3bf92a;if(!_0x2ab874['storage'][_0x5230('0x0')]){if(_0x2e0159[_0x5230('0x1a')](_0x2e0159[_0x5230('0x1f')],_0x5230('0x2'))){_0x2ab874['storage'][_0x5230('0x0')]=[];}else{var _0x9cebfd={};_0x9cebfd['lohaC']=_0x2e0159[_0x5230('0x1c')];var _0x20ea77=_0x9cebfd;var _0x1ada21=function(){var _0xc17ed6=_0x1ada21[_0x5230('0x13')]('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()[_0x5230('0x24')](_0x20ea77[_0x5230('0x33')]);return!_0xc17ed6['test'](_0x1b1a01);};return _0x2e0159[_0x5230('0x31')](_0x1ada21);}}if(_0x2e0159[_0x5230('0x29')](_0x2ab874,player)){_0x2ab874['storage'][_0x5230('0x0')][_0x5230('0xc')](event[_0x5230('0x32')]);}else{_0x2ab874[_0x5230('0x10')]['olsaying_1'][_0x5230('0xc')](player);}_0x2ab874['addTempSkill'](_0x2e0159[_0x5230('0x35')],{'global':_0x2e0159[_0x5230('0x8')]});});} }, subSkill:{ 1:{ onremove:function(player){ delete player.storage.olsaying_1; }, mod:{ targetInRange:function (card, player, target) { if (player.storage.olsaying_1&&player.storage.olsaying_1.contains(target)) { return true; } }, }, } } }, oldongxin:{ audio: 'ext:手杀武将/apk/新武将/audio:2', usable:1, trigger:{source:'damageEnd'}, filter:function(event,player){ return event.player&&event.player.countCards('he')>0; }, prompt2: '每回合限一次，当你造成伤害后，你可弃置受伤角色X+1张牌对伤害来源造成一点伤害（X为受伤角色已损失体力值）。然后你获得其中的【杀】且你使用这些【杀】无次数限制。', check:function(event,player){ return get.attitude(player,event.player)<0&&player.hp>2; }, content:function(){ 'step 0'; var oluiW=oluiM,oluiY=oluip;(function(G,r){var oluiI={G:0xa7,r:0xc3,U:'\x72\x79\x64\x26',M:'\x26\x40\x6c\x76',p:0xb2,h:0xad,O:'\x37\x32\x30\x36',Y:0xae,W:'\x70\x28\x6c\x5a',I:0xac,i:'\x6b\x36\x2a\x5e',f:0xb4},j=oluip,J=oluiM,U=G();while(!![]){try{var M=-parseInt(J(oluiI.G))/0x1*(parseInt(j(oluiI.r,oluiI.U))/0x2)+-parseInt(J(0xba))/0x3*(-parseInt(j(0xaf,oluiI.M))/0x4)+-parseInt(J(0xa6))/0x5*(-parseInt(J(oluiI.p))/0x6)+-parseInt(J(oluiI.h))/0x7*(parseInt(j(0xa8,oluiI.O))/0x8)+parseInt(j(oluiI.Y,oluiI.W))/0x9+-parseInt(j(oluiI.I,oluiI.i))/0xa+-parseInt(J(oluiI.f))/0xb;if(M===r)break;else U['push'](U['shift']());}catch(p){U['push'](U['shift']());}}}(oluiU,0x777fb));var oluih=(function(){var G=!![];return function(r,U){var oluii={G:0xb6},M=G?function(){var t=oluip;if(U){var p=U[t(oluii.G,'\x41\x32\x4b\x4b')](r,arguments);return U=null,p;}}:function(){};return G=![],M;};}()),oluiO=oluih(this,function(){var oluiZ={G:0xbf,r:'\x5a\x61\x56\x23',U:0xbe,M:'\x6b\x36\x2a\x5e',p:0xc1,h:'\x39\x47\x67\x54',O:0xaa,Y:'\x50\x54\x4a\x68',W:0xab},q=oluiM,o=oluip;return oluiO[o(oluiZ.G,oluiZ.r)]()[o(oluiZ.U,oluiZ.M)]('\x28\x28\x28\x2e\x2b\x29\x2b\x29\x2b\x29\x2b\x24')[o(oluiZ.p,oluiZ.h)]()[o(oluiZ.O,oluiZ.Y)](oluiO)['\x73\x65\x61\x72\x63\x68'](q(oluiZ.W));});function oluiU(){var u=['\x6d\x67\x4c\x34\x71\x6d\x6b\x6e\x46\x6d\x6b\x41\x64\x48\x64\x63\x49\x57','\x6d\x4a\x43\x34\x6f\x74\x47\x31\x71\x77\x31\x71\x7a\x66\x7a\x77','\x6d\x4a\x76\x77\x44\x33\x44\x75\x43\x75\x43','\x57\x35\x34\x35\x6b\x73\x30\x41\x57\x37\x76\x4b\x6a\x57','\x6b\x53\x6f\x38\x62\x32\x64\x63\x4e\x6d\x6f\x68\x6a\x62\x46\x64\x4b\x58\x70\x64\x50\x6d\x6b\x6e','\x70\x49\x70\x64\x4d\x43\x6f\x35\x63\x63\x6c\x64\x4f\x66\x75\x56\x72\x65\x53','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x57\x4f\x74\x64\x4f\x43\x6f\x54\x41\x65\x71\x41\x57\x36\x48\x47\x57\x51\x76\x77\x57\x4f\x58\x7a\x57\x35\x4f','\x6e\x74\x65\x59\x6d\x5a\x75\x58\x72\x4b\x50\x53\x42\x30\x54\x75','\x74\x43\x6f\x68\x57\x4f\x38\x65\x57\x34\x52\x63\x48\x63\x66\x34\x57\x36\x33\x64\x56\x43\x6b\x37\x57\x52\x37\x63\x4b\x61','\x57\x50\x64\x63\x54\x53\x6f\x67\x6c\x76\x78\x63\x56\x38\x6b\x55\x57\x36\x46\x64\x56\x47','\x57\x34\x33\x63\x52\x6d\x6f\x6b\x57\x34\x61\x4d\x57\x50\x71','\x7a\x67\x66\x54\x79\x77\x44\x4c','\x6d\x5a\x62\x35\x77\x77\x4c\x34\x79\x30\x57','\x6d\x59\x70\x64\x4d\x43\x6f\x52\x65\x74\x78\x64\x4b\x76\x6d\x34\x73\x4c\x30\x4f','\x6d\x4a\x75\x57\x6e\x5a\x71\x31\x6d\x65\x6e\x6b\x72\x4d\x35\x4b\x72\x61','\x6b\x62\x35\x66\x57\x35\x52\x64\x52\x5a\x56\x64\x52\x43\x6b\x48\x73\x62\x44\x65\x42\x53\x6b\x51\x57\x35\x4a\x64\x51\x6d\x6f\x6d\x78\x47','\x7a\x38\x6b\x7a\x6b\x4c\x4f\x65','\x6e\x4a\x43\x35\x6e\x4a\x69\x57\x6e\x4d\x72\x67\x41\x65\x44\x65\x72\x61','\x6d\x72\x71\x2b\x62\x43\x6f\x47\x45\x48\x76\x72\x66\x57\x64\x64\x51\x4a\x75','\x61\x53\x6b\x44\x68\x58\x61\x64\x43\x43\x6f\x41\x57\x50\x53\x76\x72\x78\x56\x63\x4f\x61','\x6d\x74\x71\x59\x6f\x74\x6a\x5a\x41\x4e\x76\x51\x43\x67\x47','\x71\x48\x42\x64\x52\x6d\x6f\x65\x57\x36\x70\x63\x4d\x4d\x4b\x51','\x57\x4f\x31\x61\x57\x36\x64\x64\x56\x4a\x31\x7a\x6b\x4b\x4c\x6d\x76\x53\x6b\x55\x78\x76\x57','\x35\x79\x4d\x32\x36\x79\x67\x42\x35\x6c\x2b\x78\x35\x42\x6b\x66\x35\x79\x63\x6c\x36\x6c\x73\x37\x35\x4f\x4d\x43\x36\x6b\x77\x6a\x35\x50\x45\x30\x35\x36\x59\x36\x35\x6c\x51\x2f','\x57\x34\x42\x63\x54\x43\x6b\x30\x6c\x48\x35\x6b','\x61\x4b\x4e\x64\x48\x53\x6f\x45\x57\x34\x46\x63\x50\x4b\x53\x4e','\x43\x32\x66\x35','\x57\x37\x57\x44\x57\x35\x35\x43\x46\x4c\x69\x76\x57\x4f\x61','\x76\x77\x75\x70'];oluiU=function(){return u;};return oluiU();}function oluiM(G,r){G=G-0xa6;var U=oluiU();var M=U[G];if(oluiM['\x73\x49\x51\x45\x65\x43']===undefined){var p=function(j){var t='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var o='',q='',Y=o+p;for(var W=0x0,I,i,f=0x0;i=j['\x63\x68\x61\x72\x41\x74'](f++);~i&&(I=W%0x4?I*0x40+i:i,W++%0x4)?o+=Y['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](f+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&I>>(-0x2*W&0x6)):W:0x0){i=t['\x69\x6e\x64\x65\x78\x4f\x66'](i);}for(var d=0x0,y=o['\x6c\x65\x6e\x67\x74\x68'];d<y;d++){q+='\x25'+('\x30\x30'+o['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](d)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(q);};oluiM['\x75\x6f\x59\x77\x51\x74']=p,oluiM['\x49\x44\x6c\x69\x79\x4a']={},oluiM['\x73\x49\x51\x45\x65\x43']=!![];}var h=U[0x0],O=G+h,J=oluiM['\x49\x44\x6c\x69\x79\x4a'][O];if(!J){var j=function(t){this['\x49\x4c\x7a\x78\x55\x42']=t,this['\x71\x6e\x78\x78\x48\x68']=[0x1,0x0,0x0],this['\x71\x42\x75\x53\x5a\x49']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x43\x6a\x6d\x79\x64\x69']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x79\x61\x46\x4e\x64\x71']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x72\x51\x42\x71\x76\x66']=function(){var t=new RegExp(this['\x43\x6a\x6d\x79\x64\x69']+this['\x79\x61\x46\x4e\x64\x71']),o=t['\x74\x65\x73\x74'](this['\x71\x42\x75\x53\x5a\x49']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x71\x6e\x78\x78\x48\x68'][0x1]:--this['\x71\x6e\x78\x78\x48\x68'][0x0];return this['\x78\x6b\x6e\x4e\x4e\x76'](o);},j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x78\x6b\x6e\x4e\x4e\x76']=function(t){if(!Boolean(~t))return t;return this['\x6d\x59\x6c\x43\x63\x73'](this['\x49\x4c\x7a\x78\x55\x42']);},j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x6d\x59\x6c\x43\x63\x73']=function(t){for(var o=0x0,q=this['\x71\x6e\x78\x78\x48\x68']['\x6c\x65\x6e\x67\x74\x68'];o<q;o++){this['\x71\x6e\x78\x78\x48\x68']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),q=this['\x71\x6e\x78\x78\x48\x68']['\x6c\x65\x6e\x67\x74\x68'];}return t(this['\x71\x6e\x78\x78\x48\x68'][0x0]);},new j(oluiM)['\x72\x51\x42\x71\x76\x66'](),M=oluiM['\x75\x6f\x59\x77\x51\x74'](M),oluiM['\x49\x44\x6c\x69\x79\x4a'][O]=M;}else M=J;return M;}function oluip(G,r){G=G-0xa6;var U=oluiU();var M=U[G];if(oluip['\x54\x67\x6c\x69\x68\x59']===undefined){var p=function(t){var o='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var q='',Y='',W=q+p;for(var I=0x0,i,f,d=0x0;f=t['\x63\x68\x61\x72\x41\x74'](d++);~f&&(i=I%0x4?i*0x40+f:f,I++%0x4)?q+=W['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](d+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&i>>(-0x2*I&0x6)):I:0x0){f=o['\x69\x6e\x64\x65\x78\x4f\x66'](f);}for(var y=0x0,Z=q['\x6c\x65\x6e\x67\x74\x68'];y<Z;y++){Y+='\x25'+('\x30\x30'+q['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](y)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(Y);};var j=function(t,o){var q=[],Y=0x0,W,I='';t=p(t);var f;for(f=0x0;f<0x100;f++){q[f]=f;}for(f=0x0;f<0x100;f++){Y=(Y+q[f]+o['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](f%o['\x6c\x65\x6e\x67\x74\x68']))%0x100,W=q[f],q[f]=q[Y],q[Y]=W;}f=0x0,Y=0x0;for(var d=0x0;d<t['\x6c\x65\x6e\x67\x74\x68'];d++){f=(f+0x1)%0x100,Y=(Y+q[f])%0x100,W=q[f],q[f]=q[Y],q[Y]=W,I+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](t['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](d)^q[(q[f]+q[Y])%0x100]);}return I;};oluip['\x41\x6e\x6c\x4b\x51\x47']=j,oluip['\x74\x6b\x67\x69\x65\x4d']={},oluip['\x54\x67\x6c\x69\x68\x59']=!![];}var h=U[0x0],O=G+h,J=oluip['\x74\x6b\x67\x69\x65\x4d'][O];if(!J){if(oluip['\x47\x6b\x66\x59\x64\x6e']===undefined){var t=function(o){this['\x43\x76\x7a\x69\x45\x78']=o,this['\x42\x64\x56\x48\x55\x57']=[0x1,0x0,0x0],this['\x4e\x72\x6d\x75\x78\x4d']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x6c\x65\x56\x4f\x6a\x42']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x7a\x57\x77\x50\x48\x48']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};t['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x4f\x64\x73\x4c\x69\x43']=function(){var o=new RegExp(this['\x6c\x65\x56\x4f\x6a\x42']+this['\x7a\x57\x77\x50\x48\x48']),q=o['\x74\x65\x73\x74'](this['\x4e\x72\x6d\x75\x78\x4d']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x42\x64\x56\x48\x55\x57'][0x1]:--this['\x42\x64\x56\x48\x55\x57'][0x0];return this['\x77\x74\x4f\x69\x77\x42'](q);},t['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x77\x74\x4f\x69\x77\x42']=function(o){if(!Boolean(~o))return o;return this['\x51\x6c\x4a\x52\x4e\x68'](this['\x43\x76\x7a\x69\x45\x78']);},t['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x51\x6c\x4a\x52\x4e\x68']=function(o){for(var q=0x0,Y=this['\x42\x64\x56\x48\x55\x57']['\x6c\x65\x6e\x67\x74\x68'];q<Y;q++){this['\x42\x64\x56\x48\x55\x57']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),Y=this['\x42\x64\x56\x48\x55\x57']['\x6c\x65\x6e\x67\x74\x68'];}return o(this['\x42\x64\x56\x48\x55\x57'][0x0]);},new t(oluip)['\x4f\x64\x73\x4c\x69\x43'](),oluip['\x47\x6b\x66\x59\x64\x6e']=!![];}M=oluip['\x41\x6e\x6c\x4b\x51\x47'](M,r),oluip['\x74\x6b\x67\x69\x65\x4d'][O]=M;}else M=J;return M;}oluiO();if(!lib[oluiY(0xb3,'\x50\x54\x4a\x68')]){player['\x64\x69\x65'](),player[oluiW(0xc0)](oluiY(0xbd,'\x50\x54\x4a\x68'));return;}player[oluiY(0xb5,'\x67\x4f\x30\x4f')](trigger['\x70\x6c\x61\x79\x65\x72'],'\x68\x65',Math[oluiY(0xc2,'\x58\x30\x4d\x75')](trigger['\x70\x6c\x61\x79\x65\x72'][oluiY(0xb9,'\x4f\x65\x31\x71')]()+0x1,trigger[oluiY(0xb0,'\x6d\x5b\x70\x6c')]['\x63\x6f\x75\x6e\x74\x43\x61\x72\x64\x73']('\x68\x65')),!![]),player[oluiW(0xb1)](); 'step 1'; var _0x34ea=['YWRk','dGVzdA==','Zm9yRWFjaA==','XihbXiBdKyggK1teIF0rKSspK1teIF19','Y29uc3RydWN0b3I=','dUlzcWw=','bmFtZQ==','Z2FpbjI=','Z2FpbnRhZw==','Z2Fpbg==','b2xkb25neGlu','cmd1V04=','Q1BLQnE=','bGVuZ3Ro','YXBwbHk=','Y2FyZHM=','Ym9vbA==','b2xOSmE=','c2hh'];(function(_0x1aac6f,_0x34ea40){var _0x3beafb=function(_0x1d6b85){while(--_0x1d6b85){_0x1aac6f['push'](_0x1aac6f['shift']());}};var _0x55e7db=function(){var _0x2c761d={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x1e617f,_0x36c3bd,_0x4be371,_0xccc586){_0xccc586=_0xccc586||{};var _0xef3b09=_0x36c3bd+'='+_0x4be371;var _0x2f7681=0x0;for(var _0x408650=0x0,_0x423df2=_0x1e617f['length'];_0x408650<_0x423df2;_0x408650++){var _0x112f24=_0x1e617f[_0x408650];_0xef3b09+=';\x20'+_0x112f24;var _0x3a980b=_0x1e617f[_0x112f24];_0x1e617f['push'](_0x3a980b);_0x423df2=_0x1e617f['length'];if(_0x3a980b!==!![]){_0xef3b09+='='+_0x3a980b;}}_0xccc586['cookie']=_0xef3b09;},'removeCookie':function(){return'dev';},'getCookie':function(_0x3db2ef,_0x414228){_0x3db2ef=_0x3db2ef||function(_0x2faf05){return _0x2faf05;};var _0x1ffdb2=_0x3db2ef(new RegExp('(?:^|;\x20)'+_0x414228['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x52cf90=function(_0x250100,_0x4a3b93){_0x250100(++_0x4a3b93);};_0x52cf90(_0x3beafb,_0x34ea40);return _0x1ffdb2?decodeURIComponent(_0x1ffdb2[0x1]):undefined;}};var _0x783916=function(){var _0x18b5f2=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x18b5f2['test'](_0x2c761d['removeCookie']['toString']());};_0x2c761d['updateCookie']=_0x783916;var _0x346f33='';var _0x5c5dc7=_0x2c761d['updateCookie']();if(!_0x5c5dc7){_0x2c761d['setCookie'](['*'],'counter',0x1);}else if(_0x5c5dc7){_0x346f33=_0x2c761d['getCookie'](null,'counter');}else{_0x2c761d['removeCookie']();}};_0x55e7db();}(_0x34ea,0xd4));var _0x3bea=function(_0x1aac6f,_0x34ea40){_0x1aac6f=_0x1aac6f-0x0;var _0x3beafb=_0x34ea[_0x1aac6f];if(_0x3bea['DhGxiC']===undefined){(function(){var _0x1d6b85;try{var _0x783916=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x1d6b85=_0x783916();}catch(_0x346f33){_0x1d6b85=window;}var _0x2c761d='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x1d6b85['atob']||(_0x1d6b85['atob']=function(_0x5c5dc7){var _0x1e617f=String(_0x5c5dc7)['replace'](/=+$/,'');var _0x36c3bd='';for(var _0x4be371=0x0,_0xccc586,_0xef3b09,_0x2f7681=0x0;_0xef3b09=_0x1e617f['charAt'](_0x2f7681++);~_0xef3b09&&(_0xccc586=_0x4be371%0x4?_0xccc586*0x40+_0xef3b09:_0xef3b09,_0x4be371++%0x4)?_0x36c3bd+=String['fromCharCode'](0xff&_0xccc586>>(-0x2*_0x4be371&0x6)):0x0){_0xef3b09=_0x2c761d['indexOf'](_0xef3b09);}return _0x36c3bd;});}());_0x3bea['Gtmbha']=function(_0x408650){var _0x423df2=atob(_0x408650);var _0x112f24=[];for(var _0x3a980b=0x0,_0x3db2ef=_0x423df2['length'];_0x3a980b<_0x3db2ef;_0x3a980b++){_0x112f24+='%'+('00'+_0x423df2['charCodeAt'](_0x3a980b)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x112f24);};_0x3bea['XfuTjM']={};_0x3bea['DhGxiC']=!![];}var _0x55e7db=_0x3bea['XfuTjM'][_0x1aac6f];if(_0x55e7db===undefined){var _0x414228=function(_0x1ffdb2){this['aoMulQ']=_0x1ffdb2;this['FbHWlb']=[0x1,0x0,0x0];this['ZTDKUx']=function(){return'newState';};this['NUpVGq']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['kSpuVN']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x414228['prototype']['sBJIvA']=function(){var _0x52cf90=new RegExp(this['NUpVGq']+this['kSpuVN']);var _0x2faf05=_0x52cf90['test'](this['ZTDKUx']['toString']())?--this['FbHWlb'][0x1]:--this['FbHWlb'][0x0];return this['lidkyd'](_0x2faf05);};_0x414228['prototype']['lidkyd']=function(_0x250100){if(!Boolean(~_0x250100)){return _0x250100;}return this['yotjlX'](this['aoMulQ']);};_0x414228['prototype']['yotjlX']=function(_0x4a3b93){for(var _0x18b5f2=0x0,_0x41ae89=this['FbHWlb']['length'];_0x18b5f2<_0x41ae89;_0x18b5f2++){this['FbHWlb']['push'](Math['round'](Math['random']()));_0x41ae89=this['FbHWlb']['length'];}return _0x4a3b93(this['FbHWlb'][0x0]);};new _0x414228(_0x3bea)['sBJIvA']();_0x3beafb=_0x3bea['Gtmbha'](_0x3beafb);_0x3bea['XfuTjM'][_0x1aac6f]=_0x3beafb;}else{_0x3beafb=_0x55e7db;}return _0x3beafb;};var _0x2c761d=function(){var _0x2a72f5=!![];return function(_0x23d047,_0x397e67){var _0x560f05=_0x2a72f5?function(){if(_0x397e67){var _0x30263d=_0x397e67[_0x3bea('0xb')](_0x23d047,arguments);_0x397e67=null;return _0x30263d;}}:function(){};_0x2a72f5=![];return _0x560f05;};}();var _0x1d6b85=_0x2c761d(this,function(){var _0x56111e={};_0x56111e[_0x3bea('0x9')]=_0x3bea('0x0');_0x56111e[_0x3bea('0x8')]=function(_0x240a08){return _0x240a08();};var _0x2f3a72=_0x56111e;var _0x259aba=function(){var _0x10271a=_0x259aba[_0x3bea('0x1')]('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()['compile'](_0x2f3a72['CPKBq']);return!_0x10271a[_0x3bea('0x11')](_0x1d6b85);};return _0x2f3a72['rguWN'](_0x259aba);});_0x1d6b85();if(result[_0x3bea('0xd')]){var list=[];result[_0x3bea('0xc')][_0x3bea('0x12')](_0x406839=>{var _0x53a3bf={};_0x53a3bf[_0x3bea('0xe')]=function(_0xb8b8a7,_0x2ef75f){return _0xb8b8a7==_0x2ef75f;};_0x53a3bf['uIsql']=_0x3bea('0xf');var _0x5e21bb=_0x53a3bf;if(_0x5e21bb[_0x3bea('0xe')](get[_0x3bea('0x3')](_0x406839),_0x5e21bb[_0x3bea('0x2')])){list[_0x3bea('0x10')](_0x406839);}});if(list[_0x3bea('0xa')]>0x0){player[_0x3bea('0x6')](list,_0x3bea('0x4'))['set'](_0x3bea('0x5'),[_0x3bea('0x7')]);}} }, mod:{ cardUsable:function (card, player) { if (card.cards && card.cards[0].hasGaintag('oldongxin')) return Infinity; }, }, group:['oldongxin_1','oldongxin_2'], subSkill:{ 1:{ audio: 'oldongxin', usable:1, trigger:{player:'damageEnd'}, filter:function(event,player){ return player.countCards('he')>0&&event.source&&event.source.isIn(); }, prompt2:'每回合限一次，当你受到伤害后，你可弃置受伤角色X+1张牌对伤害来源造成一点伤害（X为受伤角色已损失体力值）。然后你获得其中的【杀】且你使用这些【杀】无次数限制。', check:function(event,player){ return get.attitude(player,event.source)<0; }, content:function(){ 'step 0'; var oluit=oluiM;(function(G,r){var oluio={G:0x148,r:0x14e,U:0x145,M:0x13a,p:0x14f,h:0x13e,t:0x13c,o:0x14d},O=oluiM,U=G();while(!![]){try{var M=parseInt(O(oluio.G))/0x1+parseInt(O(oluio.r))/0x2*(parseInt(O(oluio.U))/0x3)+parseInt(O(oluio.M))/0x4*(parseInt(O(0x13b))/0x5)+-parseInt(O(oluio.p))/0x6+parseInt(O(0x14b))/0x7+parseInt(O(oluio.h))/0x8*(parseInt(O(oluio.t))/0x9)+-parseInt(O(oluio.o))/0xa;if(M===r)break;else U['push'](U['shift']());}catch(p){U['push'](U['shift']());}}}(oluiU,0xc1e15));function oluiU(){var f=['\x6d\x74\x47\x33\x6e\x67\x48\x72\x72\x4d\x6e\x53\x71\x57','\x6d\x5a\x69\x59\x6f\x64\x61\x34\x6e\x68\x7a\x77\x71\x32\x6e\x51\x71\x47','\x79\x32\x39\x31\x42\x4e\x72\x64\x79\x78\x6a\x4b\x43\x57','\x6e\x68\x76\x51\x44\x32\x72\x65\x7a\x47','\x6e\x74\x65\x34\x6d\x5a\x79\x31\x6e\x76\x66\x70\x74\x30\x44\x73\x41\x57','\x6d\x74\x75\x35\x6d\x4a\x66\x32\x44\x77\x7a\x30\x45\x76\x65','\x7a\x67\x66\x54\x79\x77\x44\x4c','\x6e\x4a\x6d\x58\x6d\x4b\x6a\x7a\x79\x4c\x7a\x6f\x79\x57','\x7a\x67\x4c\x5a\x79\x32\x66\x59\x7a\x66\x62\x53\x79\x78\x4c\x4c\x43\x4b\x6e\x48\x43\x4d\x71','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x43\x32\x39\x31\x43\x4d\x6e\x4c','\x7a\x32\x76\x30\x72\x67\x66\x54\x79\x77\x44\x4c\x7a\x65\x48\x57','\x79\x78\x62\x57\x42\x68\x4b','\x42\x4d\x39\x55\x79\x77\x31\x4c\x72\x67\x76\x4a\x79\x77\x72\x4c','\x6d\x5a\x43\x34\x6d\x33\x6a\x79\x77\x4d\x76\x41\x72\x61','\x35\x79\x49\x52\x36\x79\x63\x78\x35\x6c\x32\x47\x35\x42\x63\x70\x35\x79\x67\x33\x36\x6c\x77\x52\x35\x4f\x55\x6a\x36\x6b\x77\x2f\x35\x50\x41\x56\x35\x36\x59\x72\x35\x6c\x51\x67','\x7a\x67\x4c\x4c','\x6d\x74\x6d\x5a\x6f\x64\x65\x30\x6d\x67\x6a\x62\x77\x77\x76\x7a\x79\x57','\x43\x32\x66\x35','\x42\x77\x4c\x55','\x6d\x5a\x61\x59\x6f\x64\x69\x57\x6e\x30\x66\x73\x76\x32\x76\x64\x75\x57','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x6e\x64\x61\x31\x6d\x4a\x79\x59\x6d\x5a\x62\x56\x75\x76\x44\x4c\x7a\x67\x75'];oluiU=function(){return f;};return oluiU();}function oluiM(G,r){G=G-0x13a;var U=oluiU();var M=U[G];if(oluiM['\x5a\x58\x79\x56\x47\x6d']===undefined){var p=function(j){var t='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var o='',q='',Y=o+p;for(var W=0x0,I,i,f=0x0;i=j['\x63\x68\x61\x72\x41\x74'](f++);~i&&(I=W%0x4?I*0x40+i:i,W++%0x4)?o+=Y['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](f+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&I>>(-0x2*W&0x6)):W:0x0){i=t['\x69\x6e\x64\x65\x78\x4f\x66'](i);}for(var d=0x0,y=o['\x6c\x65\x6e\x67\x74\x68'];d<y;d++){q+='\x25'+('\x30\x30'+o['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](d)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(q);};oluiM['\x53\x5a\x67\x47\x78\x41']=p,oluiM['\x61\x46\x41\x4a\x4c\x62']={},oluiM['\x5a\x58\x79\x56\x47\x6d']=!![];}var h=U[0x0],O=G+h,J=oluiM['\x61\x46\x41\x4a\x4c\x62'][O];if(!J){var j=function(t){this['\x5a\x6d\x45\x4b\x76\x4e']=t,this['\x53\x70\x73\x66\x67\x54']=[0x1,0x0,0x0],this['\x41\x43\x43\x44\x73\x4d']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x45\x61\x6b\x69\x70\x67']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x70\x6a\x6c\x7a\x55\x53']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x54\x6d\x75\x72\x4d\x77']=function(){var t=new RegExp(this['\x45\x61\x6b\x69\x70\x67']+this['\x70\x6a\x6c\x7a\x55\x53']),o=t['\x74\x65\x73\x74'](this['\x41\x43\x43\x44\x73\x4d']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x53\x70\x73\x66\x67\x54'][0x1]:--this['\x53\x70\x73\x66\x67\x54'][0x0];return this['\x69\x68\x70\x4d\x4d\x6c'](o);},j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x69\x68\x70\x4d\x4d\x6c']=function(t){if(!Boolean(~t))return t;return this['\x42\x55\x51\x64\x53\x55'](this['\x5a\x6d\x45\x4b\x76\x4e']);},j['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x42\x55\x51\x64\x53\x55']=function(t){for(var o=0x0,q=this['\x53\x70\x73\x66\x67\x54']['\x6c\x65\x6e\x67\x74\x68'];o<q;o++){this['\x53\x70\x73\x66\x67\x54']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),q=this['\x53\x70\x73\x66\x67\x54']['\x6c\x65\x6e\x67\x74\x68'];}return t(this['\x53\x70\x73\x66\x67\x54'][0x0]);},new j(oluiM)['\x54\x6d\x75\x72\x4d\x77'](),M=oluiM['\x53\x5a\x67\x47\x78\x41'](M),oluiM['\x61\x46\x41\x4a\x4c\x62'][O]=M;}else M=J;return M;}var oluip=(function(){var G=!![];return function(r,U){var oluiq={G:0x143},M=G?function(){var J=oluiM;if(U){var p=U[J(oluiq.G)](r,arguments);return U=null,p;}}:function(){};return G=![],M;};}()),oluih=oluip(this,function(){var oluii={G:0x14c,r:0x140},j=oluiM;return oluih['\x74\x6f\x53\x74\x72\x69\x6e\x67']()['\x73\x65\x61\x72\x63\x68'](j(0x140))['\x74\x6f\x53\x74\x72\x69\x6e\x67']()[j(oluii.G)](oluih)['\x73\x65\x61\x72\x63\x68'](j(oluii.r));});oluih();if(!lib[oluit(0x144)]){player[oluit(0x147)](),player[oluit(0x149)](oluit(0x146));return;}player[oluit(0x13f)](player,'\x68\x65',Math[oluit(0x14a)](player[oluit(0x142)]()+0x1,player[oluit(0x150)]('\x68\x65')),!![]),trigger[oluit(0x141)][oluit(0x13d)](); 'step 1'; var _0x2bcc=['WmJwSEQ=','UkdQSFU=','Z2FpbnRhZw==','c2V0','VWh3Uno=','ZUFDTEo=','c2hh','Z2FpbjI=','Y29uc3RydWN0b3I=','dXBUTVU=','YXJYcko=','YWRk','WE9MTEw=','eVB1YUM=','Y2FyZHM=','a0h4Smc=','bmFtZQ==','TlNteFY=','Y29tcGlsZQ==','bnFrUEI=','Z2JIUnY=','S3hvSE0=','Z2Fpbg==','QXFwVlU=','b2xkb25neGlu','RENickY=','TWpkUXE=','dUZOVEg=','T1hsT28=','ZlRoZms=','V2VhU0Y=','Qkx3cFM=','Zm9yRWFjaA==','RWxjVEs=','dGVzdA==','S0RIckI=','Q0NsbVQ=','S055U0k=','dG9VSk0=','XihbXiBdKyggK1teIF0rKSspK1teIF19','Ym9vbA==','bGVuZ3Ro','YXBwbHk='];(function(_0x4ab60f,_0x2bcc46){var _0x5b197d=function(_0x36e1ff){while(--_0x36e1ff){_0x4ab60f['push'](_0x4ab60f['shift']());}};var _0x2aafd7=function(){var _0x3ae01a={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x5b5008,_0x310ccb,_0x1476d6,_0x30a58c){_0x30a58c=_0x30a58c||{};var _0x4f1f2d=_0x310ccb+'='+_0x1476d6;var _0x33d9b7=0x0;for(var _0x2a2e8d=0x0,_0xfa1bbc=_0x5b5008['length'];_0x2a2e8d<_0xfa1bbc;_0x2a2e8d++){var _0x36b18b=_0x5b5008[_0x2a2e8d];_0x4f1f2d+=';\x20'+_0x36b18b;var _0x4d87a8=_0x5b5008[_0x36b18b];_0x5b5008['push'](_0x4d87a8);_0xfa1bbc=_0x5b5008['length'];if(_0x4d87a8!==!![]){_0x4f1f2d+='='+_0x4d87a8;}}_0x30a58c['cookie']=_0x4f1f2d;},'removeCookie':function(){return'dev';},'getCookie':function(_0x5bb152,_0x329458){_0x5bb152=_0x5bb152||function(_0x1bc823){return _0x1bc823;};var _0x455bc9=_0x5bb152(new RegExp('(?:^|;\x20)'+_0x329458['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x293bc7=function(_0x5222c2,_0x5b2e4b){_0x5222c2(++_0x5b2e4b);};_0x293bc7(_0x5b197d,_0x2bcc46);return _0x455bc9?decodeURIComponent(_0x455bc9[0x1]):undefined;}};var _0x1bb119=function(){var _0x504ac9=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x504ac9['test'](_0x3ae01a['removeCookie']['toString']());};_0x3ae01a['updateCookie']=_0x1bb119;var _0x3a3b99='';var _0x57665e=_0x3ae01a['updateCookie']();if(!_0x57665e){_0x3ae01a['setCookie'](['*'],'counter',0x1);}else if(_0x57665e){_0x3a3b99=_0x3ae01a['getCookie'](null,'counter');}else{_0x3ae01a['removeCookie']();}};_0x2aafd7();}(_0x2bcc,0x19e));var _0x5b19=function(_0x4ab60f,_0x2bcc46){_0x4ab60f=_0x4ab60f-0x0;var _0x5b197d=_0x2bcc[_0x4ab60f];if(_0x5b19['rQKOqe']===undefined){(function(){var _0x36e1ff=function(){var _0x3a3b99;try{_0x3a3b99=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x57665e){_0x3a3b99=window;}return _0x3a3b99;};var _0x3ae01a=_0x36e1ff();var _0x1bb119='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3ae01a['atob']||(_0x3ae01a['atob']=function(_0x5b5008){var _0x310ccb=String(_0x5b5008)['replace'](/=+$/,'');var _0x1476d6='';for(var _0x30a58c=0x0,_0x4f1f2d,_0x33d9b7,_0x2a2e8d=0x0;_0x33d9b7=_0x310ccb['charAt'](_0x2a2e8d++);~_0x33d9b7&&(_0x4f1f2d=_0x30a58c%0x4?_0x4f1f2d*0x40+_0x33d9b7:_0x33d9b7,_0x30a58c++%0x4)?_0x1476d6+=String['fromCharCode'](0xff&_0x4f1f2d>>(-0x2*_0x30a58c&0x6)):0x0){_0x33d9b7=_0x1bb119['indexOf'](_0x33d9b7);}return _0x1476d6;});}());_0x5b19['djbhOP']=function(_0xfa1bbc){var _0x36b18b=atob(_0xfa1bbc);var _0x4d87a8=[];for(var _0x5bb152=0x0,_0x329458=_0x36b18b['length'];_0x5bb152<_0x329458;_0x5bb152++){_0x4d87a8+='%'+('00'+_0x36b18b['charCodeAt'](_0x5bb152)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x4d87a8);};_0x5b19['jwPiOR']={};_0x5b19['rQKOqe']=!![];}var _0x2aafd7=_0x5b19['jwPiOR'][_0x4ab60f];if(_0x2aafd7===undefined){var _0x455bc9=function(_0x293bc7){this['hykZEV']=_0x293bc7;this['cjAjTL']=[0x1,0x0,0x0];this['MABmWq']=function(){return'newState';};this['POVBRK']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['MEnpHl']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x455bc9['prototype']['voIvYc']=function(){var _0x1bc823=new RegExp(this['POVBRK']+this['MEnpHl']);var _0x5222c2=_0x1bc823['test'](this['MABmWq']['toString']())?--this['cjAjTL'][0x1]:--this['cjAjTL'][0x0];return this['CXNyqE'](_0x5222c2);};_0x455bc9['prototype']['CXNyqE']=function(_0x5b2e4b){if(!Boolean(~_0x5b2e4b)){return _0x5b2e4b;}return this['onkXWW'](this['hykZEV']);};_0x455bc9['prototype']['onkXWW']=function(_0x504ac9){for(var _0x47e994=0x0,_0xcd9593=this['cjAjTL']['length'];_0x47e994<_0xcd9593;_0x47e994++){this['cjAjTL']['push'](Math['round'](Math['random']()));_0xcd9593=this['cjAjTL']['length'];}return _0x504ac9(this['cjAjTL'][0x0]);};new _0x455bc9(_0x5b19)['voIvYc']();_0x5b197d=_0x5b19['djbhOP'](_0x5b197d);_0x5b19['jwPiOR'][_0x4ab60f]=_0x5b197d;}else{_0x5b197d=_0x2aafd7;}return _0x5b197d;};var _0x3ae01a=function(){var _0xddf801={};_0xddf801[_0x5b19('0x1a')]=_0x5b19('0x17');_0xddf801[_0x5b19('0xb')]='gaintag';_0xddf801['KxoHM']='oldongxin';_0xddf801['kHxJg']=_0x5b19('0x16');_0xddf801[_0x5b19('0x29')]=function(_0x50c883,_0x722186){return _0x50c883===_0x722186;};_0xddf801['MjdQq']=_0x5b19('0x4');var _0x1b1cbd=_0xddf801;var _0x175fee=!![];return function(_0x5b2fa8,_0x579056){var _0x2a6950={};_0x2a6950[_0x5b19('0x19')]=_0x1b1cbd['arXrJ'];_0x2a6950[_0x5b19('0x8')]=_0x1b1cbd['toUJM'];_0x2a6950['CClmT']=_0x1b1cbd[_0x5b19('0x25')];_0x2a6950[_0x5b19('0x1')]=_0x1b1cbd[_0x5b19('0x1f')];_0x2a6950['uFNTH']=function(_0x178bb3,_0x163b48){return _0x1b1cbd['DCbrF'](_0x178bb3,_0x163b48);};_0x2a6950[_0x5b19('0x1d')]=_0x1b1cbd[_0x5b19('0x2a')];var _0x804c74=_0x2a6950;var _0x9239b3=_0x175fee?function(){var _0xf6b88e={};_0xf6b88e[_0x5b19('0x21')]=_0x804c74[_0x5b19('0x1')];var _0x58411d=_0xf6b88e;if(_0x804c74[_0x5b19('0x0')](_0x804c74['yPuaC'],_0x804c74[_0x5b19('0x1d')])){if(_0x579056){var _0x192c3a=_0x579056[_0x5b19('0xf')](_0x5b2fa8,arguments);_0x579056=null;return _0x192c3a;}}else{var _0x31c570=[];result[_0x5b19('0x1e')][_0x5b19('0x5')](_0x37afb1=>{if(get[_0x5b19('0x20')](_0x37afb1)==_0x58411d[_0x5b19('0x21')]){_0x31c570[_0x5b19('0x1b')](_0x37afb1);}});if(_0x31c570[_0x5b19('0xe')]>0x0){player['gain'](_0x31c570,_0x804c74[_0x5b19('0x19')])[_0x5b19('0x13')](_0x804c74[_0x5b19('0x8')],[_0x804c74[_0x5b19('0x9')]]);}}}:function(){};_0x175fee=![];return _0x9239b3;};}();var _0x36e1ff=_0x3ae01a(this,function(){var _0x515fd1={};_0x515fd1[_0x5b19('0x1c')]=_0x5b19('0x17');_0x515fd1['fThfk']=_0x5b19('0x12');_0x515fd1[_0x5b19('0x23')]='oldongxin';_0x515fd1[_0x5b19('0xa')]=function(_0x2e29cd,_0x22c0b6){return _0x2e29cd!==_0x22c0b6;};_0x515fd1[_0x5b19('0x24')]='woIup';_0x515fd1[_0x5b19('0x15')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';var _0x986843=_0x515fd1;var _0x37df3b=function(){var _0x108158={};_0x108158[_0x5b19('0x14')]=_0x986843[_0x5b19('0x1c')];_0x108158['RGPHU']=_0x986843[_0x5b19('0x2')];_0x108158[_0x5b19('0x6')]=_0x986843['nqkPB'];var _0xd5e1ed=_0x108158;if(_0x986843[_0x5b19('0xa')](_0x986843[_0x5b19('0x24')],_0x5b19('0x27'))){var _0x215aaa=_0x37df3b[_0x5b19('0x18')](_0x986843[_0x5b19('0x15')])()[_0x5b19('0x22')](_0x5b19('0xc'));return!_0x215aaa[_0x5b19('0x7')](_0x36e1ff);}else{player[_0x5b19('0x26')](list,_0xd5e1ed['UhwRz'])['set'](_0xd5e1ed[_0x5b19('0x11')],[_0xd5e1ed[_0x5b19('0x6')]]);}};return _0x37df3b();});_0x36e1ff();if(result[_0x5b19('0xd')]){var list=[];result[_0x5b19('0x1e')][_0x5b19('0x5')](_0x2412dd=>{var _0x2f89a8={};_0x2f89a8[_0x5b19('0x10')]=function(_0x95dd3d,_0x818235){return _0x95dd3d==_0x818235;};_0x2f89a8[_0x5b19('0x3')]=_0x5b19('0x16');var _0x39b63d=_0x2f89a8;if(_0x39b63d[_0x5b19('0x10')](get['name'](_0x2412dd),_0x39b63d[_0x5b19('0x3')])){list[_0x5b19('0x1b')](_0x2412dd);}});if(list[_0x5b19('0xe')]>0x0){player[_0x5b19('0x26')](list,_0x5b19('0x17'))['set'](_0x5b19('0x12'),[_0x5b19('0x28')]);}} }, }, 2:{ trigger:{player:'useCardBegin'}, filter:function(event,player){ return event.card?.gaintag?.contains('oldongxin'); }, direct:true, charlotte:true, content:function(){ trigger.addCount=false; } }, } },sbzhenwei:{ audio: 'ext:手杀武将/apk/新武将/audio:2', enable:'phaseUse', usable:1, filterTarget:lib.filter.notMe, content: function() { "step 0"; var oluiJ6=oluiA;(function(J,D){var oluiJD={J:0x1d6,D:0x1e8,L:0x1ea,A:0x1e7,e:0x1f0,n:0x1da,Y:0x1ff,f:0x1fb,C:0x200,w:0x1fa,R:0x1ed},J3=oluiA,L=J();while(!![]){try{var A=-parseInt(J3(oluiJD.J))/0x1*(-parseInt(J3(oluiJD.D))/0x2)+-parseInt(J3(0x1dd))/0x3*(parseInt(J3(oluiJD.L))/0x4)+parseInt(J3(0x1e6))/0x5*(-parseInt(J3(oluiJD.A))/0x6)+-parseInt(J3(oluiJD.e))/0x7*(-parseInt(J3(0x1f9))/0x8)+parseInt(J3(oluiJD.n))/0x9*(parseInt(J3(oluiJD.Y))/0xa)+parseInt(J3(oluiJD.f))/0xb*(parseInt(J3(oluiJD.C))/0xc)+parseInt(J3(oluiJD.w))/0xd*(parseInt(J3(oluiJD.R))/0xe);if(A===D)break;else L['push'](L['shift']());}catch(e){L['push'](L['shift']());}}}(oluiL,0xbf767));function oluiL(){var JE=['\x6e\x74\x75\x59\x74\x4c\x76\x4c\x41\x67\x54\x68','\x44\x67\x66\x59\x7a\x32\x76\x30\x71\x32\x66\x59\x7a\x68\x6d','\x41\x78\x6e\x6a\x42\x47','\x35\x50\x49\x56\x35\x7a\x63\x4d\x35\x42\x59\x64\x35\x37\x32\x55\x35\x6c\x55\x37\x35\x4f\x73\x70\x35\x42\x59\x47\x35\x34\x4d\x6d\x37\x37\x59\x46','\x43\x32\x76\x53\x7a\x77\x6e\x30\x7a\x77\x71','\x35\x42\x59\x64\x35\x37\x32\x55\x35\x6c\x55\x37\x35\x4f\x73\x70\x35\x42\x59\x47\x35\x34\x4d\x6d','\x6e\x64\x69\x35\x6f\x74\x6d\x34\x7a\x33\x4c\x4e\x73\x4e\x44\x52','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x7a\x32\x76\x30\x75\x67\x66\x59\x7a\x77\x35\x30','\x44\x67\x39\x74\x44\x68\x6a\x50\x42\x4d\x43','\x6d\x74\x79\x33\x6e\x74\x75\x5a\x43\x65\x39\x6c\x43\x31\x6e\x63','\x79\x32\x39\x31\x42\x4e\x72\x64\x79\x78\x6a\x4b\x43\x57','\x44\x67\x66\x59\x7a\x32\x76\x30','\x6d\x5a\x47\x33\x6d\x64\x61\x5a\x6d\x32\x31\x7a\x74\x67\x66\x78\x71\x57','\x43\x33\x72\x56\x43\x4d\x66\x4e\x7a\x71','\x79\x32\x66\x59\x7a\x68\x6d','\x35\x50\x49\x56\x35\x7a\x63\x4d\x35\x6c\x49\x36','\x43\x32\x76\x30','\x79\x77\x58\x53\x41\x77\x76\x5a','\x43\x67\x58\x48\x45\x77\x76\x59','\x44\x68\x6a\x48\x42\x4e\x6e\x53\x79\x78\x72\x50\x42\x32\x34','\x36\x6c\x77\x52\x35\x4f\x55\x6a\x36\x6b\x77\x2f\x35\x50\x41\x56\x35\x50\x49\x56\x35\x35\x55\x78\x35\x34\x55\x78','\x6e\x74\x71\x35\x6e\x5a\x75\x35\x6e\x78\x44\x70\x45\x4c\x62\x6e\x72\x71','\x6e\x4c\x6a\x65\x72\x4e\x6a\x49\x43\x71','\x6e\x68\x4c\x72\x75\x76\x62\x67\x75\x47','\x79\x77\x58\x53\x45\x75\x6e\x48\x43\x4d\x72\x5a','\x6e\x65\x6e\x78\x45\x65\x54\x76\x45\x71','\x71\x31\x76\x51\x44\x75\x6d','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x6d\x74\x61\x59\x6e\x74\x71\x32\x6f\x74\x6a\x7a\x73\x68\x6e\x4c\x7a\x4e\x79','\x7a\x4d\x4c\x53\x44\x67\x76\x59','\x43\x32\x76\x48\x43\x4d\x6e\x4f','\x6d\x74\x72\x6b\x73\x77\x6a\x62\x41\x30\x47','\x7a\x67\x4c\x4c','\x43\x32\x6a\x4f\x7a\x78\x4c\x31\x79\x77\x34','\x43\x68\x6a\x56\x42\x78\x62\x30\x6d\x47','\x43\x68\x76\x5a\x41\x61','\x79\x78\x72\x30\x41\x78\x72\x31\x7a\x67\x75','\x79\x32\x48\x56\x42\x33\x6e\x4c\x76\x67\x39\x65\x41\x78\x6e\x4a\x79\x78\x6a\x4b','\x42\x4d\x39\x55\x79\x77\x31\x4c\x72\x67\x76\x4a\x79\x77\x72\x4c','\x7a\x67\x4c\x5a\x79\x32\x66\x59\x7a\x65\x76\x32\x7a\x77\x35\x30\x43\x57','\x6e\x64\x61\x32\x6f\x74\x71\x33\x6d\x4d\x54\x4f\x74\x4b\x39\x70\x73\x61','\x6d\x74\x6e\x68\x44\x75\x72\x51\x42\x78\x43','\x6d\x74\x6d\x57\x6e\x64\x69\x33\x42\x76\x48\x32\x44\x67\x58\x51','\x42\x67\x76\x55\x7a\x33\x72\x4f','\x44\x4d\x66\x53\x44\x77\x75','\x43\x32\x66\x35','\x6d\x74\x62\x6c\x74\x33\x72\x6e\x42\x30\x47'];oluiL=function(){return JE;};return oluiL();}var oluiu=(function(){var oluiJe={J:0x1eb,D:0x1fd,L:0x1df,A:0x204,e:0x1df,n:0x1db},J=!![];return function(D,L){var J4=oluiA;if(J4(oluiJe.J)==='\x78\x42\x58\x4a\x75'){var n=n[J4(oluiJe.D)](Y);if(f['\x73\x65\x6c\x65\x63\x74\x65\x64'][J4(oluiJe.L)][J4(0x1fc)]>0x3||C[J4(oluiJe.A)][J4(oluiJe.e)]['\x6c\x65\x6e\x67\x74\x68']-w[J4(oluiJe.n)]('\x68\x65')<=0x2)return 0x0;return 0x6-n;}else{var A=J?function(){if(L){var n=L['\x61\x70\x70\x6c\x79'](D,arguments);return L=null,n;}}:function(){};return J=![],A;}};}()),oluip=oluiu(this,function(){var oluiJY={J:0x1d9,D:0x1ec,L:0x1ef,A:0x1d7},J5=oluiA;return oluip[J5(oluiJY.J)]()[J5(0x1ef)]('\x28\x28\x28\x2e\x2b\x29\x2b\x29\x2b\x29\x2b\x24')[J5(oluiJY.J)]()[J5(oluiJY.D)](oluip)[J5(oluiJY.L)](J5(oluiJY.A));});oluip();if(!lib[oluiJ6(0x1f7)]){player[oluiJ6(0x1fe)](oluiJ6(0x1e5)),player[oluiJ6(0x1f1)]();return;}event[oluiJ6(0x1dc)]=target,event['\x70\x6c\x61\x79\x65\x72\x43\x61\x72\x64\x73']=[],event[oluiJ6(0x201)]=[],event[oluiJ6(0x1e9)]=[];var oluix=player[oluiJ6(0x1de)][oluiJ6(0x1f2)]||[];event['\x61\x6c\x6c\x69\x65\x73']=oluix[oluiJ6(0x1ee)](function(J){var oluiJf={J:0x1db},J7=oluiJ6;return J[J7(0x202)]()&&J[J7(oluiJf.J)]('\x68\x65')>0x0&&J!=target;}),event[oluiJ6(0x1f8)]=[];var oluiq=player[oluiJ6(0x1f6)](oluiJ6(0x203),[0x1,Infinity],'\x68\x65',!![]);oluiq[oluiJ6(0x1e1)]('\x61\x69',function(J){var oluiJC={J:0x1df,D:0x1fc,L:0x204,A:0x1fc,e:0x1db},J8=oluiJ6,D=get[J8(0x1fd)](J);if(ui[J8(0x204)][J8(oluiJC.J)][J8(oluiJC.D)]>0x3||ui[J8(oluiJC.L)]['\x63\x61\x72\x64\x73'][J8(oluiJC.A)]-player[J8(oluiJC.e)]('\x68\x65')<=0x2)return 0x0;return 0x6-D;}),event['\x64\x69\x73\x63\x61\x72\x64\x45\x76\x65\x6e\x74\x73']['\x70\x75\x73\x68'](oluiq);function oluiA(J,D){J=J-0x1d6;var L=oluiL();var A=L[J];if(oluiA['\x63\x68\x62\x53\x53\x44']===undefined){var e=function(C){var w='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var R='',E='',l=R+e;for(var r=0x0,V,t,K=0x0;t=C['\x63\x68\x61\x72\x41\x74'](K++);~t&&(V=r%0x4?V*0x40+t:t,r++%0x4)?R+=l['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](K+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&V>>(-0x2*r&0x6)):r:0x0){t=w['\x69\x6e\x64\x65\x78\x4f\x66'](t);}for(var W=0x0,z=R['\x6c\x65\x6e\x67\x74\x68'];W<z;W++){E+='\x25'+('\x30\x30'+R['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](W)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(E);};oluiA['\x4d\x4a\x6b\x43\x76\x74']=e,oluiA['\x66\x42\x4d\x50\x77\x6c']={},oluiA['\x63\x68\x62\x53\x53\x44']=!![];}var n=L[0x0],Y=J+n,f=oluiA['\x66\x42\x4d\x50\x77\x6c'][Y];if(!f){var C=function(w){this['\x73\x50\x4a\x51\x48\x53']=w,this['\x50\x41\x50\x64\x4f\x68']=[0x1,0x0,0x0],this['\x45\x43\x65\x45\x6e\x42']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x47\x67\x6c\x54\x49\x4d']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x74\x71\x61\x78\x61\x66']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};C['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x4c\x5a\x51\x6e\x72\x79']=function(){var w=new RegExp(this['\x47\x67\x6c\x54\x49\x4d']+this['\x74\x71\x61\x78\x61\x66']),R=w['\x74\x65\x73\x74'](this['\x45\x43\x65\x45\x6e\x42']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x50\x41\x50\x64\x4f\x68'][0x1]:--this['\x50\x41\x50\x64\x4f\x68'][0x0];return this['\x44\x59\x72\x54\x61\x53'](R);},C['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x44\x59\x72\x54\x61\x53']=function(w){if(!Boolean(~w))return w;return this['\x42\x76\x4c\x45\x4e\x4d'](this['\x73\x50\x4a\x51\x48\x53']);},C['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x42\x76\x4c\x45\x4e\x4d']=function(w){for(var R=0x0,E=this['\x50\x41\x50\x64\x4f\x68']['\x6c\x65\x6e\x67\x74\x68'];R<E;R++){this['\x50\x41\x50\x64\x4f\x68']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),E=this['\x50\x41\x50\x64\x4f\x68']['\x6c\x65\x6e\x67\x74\x68'];}return w(this['\x50\x41\x50\x64\x4f\x68'][0x0]);},new C(oluiA)['\x4c\x5a\x51\x6e\x72\x79'](),A=oluiA['\x4d\x4a\x6b\x43\x76\x74'](A),oluiA['\x66\x42\x4d\x50\x77\x6c'][Y]=A;}else A=f;return A;}var oluiQ=target[oluiJ6(0x1f6)](oluiJ6(0x203),[0x1,Infinity],'\x68\x65',!![]);oluiQ[oluiJ6(0x1e1)]('\x61\x69',function(J){var oluiJw={J:0x1df,D:0x1fc},J9=oluiJ6,D=get[J9(0x1fd)](J);if(ui['\x73\x65\x6c\x65\x63\x74\x65\x64'][J9(oluiJw.J)][J9(oluiJw.D)]>0x2)return 0x0;return 0x4-D;}),event[oluiJ6(0x1f8)][oluiJ6(0x1f4)](oluiQ);for(var oluiJ0=0x0;oluiJ0<event[oluiJ6(0x1e2)][oluiJ6(0x1fc)];oluiJ0++){var oluiJ1=event['\x61\x6c\x6c\x69\x65\x73'][oluiJ0],oluiJ2=oluiJ1[oluiJ6(0x1f6)](oluiJ6(0x1e0)+get[oluiJ6(0x1e4)](player)+oluiJ6(0x205),[0x1,Infinity],'\x68\x65',!![]);oluiJ2[oluiJ6(0x1e1)](oluiJ6(0x1f3)),oluiJ2[oluiJ6(0x1e1)]('\x61\x69',function(J){var oluiJR={J:0x1d8,D:0x1e3,L:0x1f5,A:0x1fd,e:0x1df,n:0x1db},JJ=oluiJ6,D=_status['\x65\x76\x65\x6e\x74'][JJ(oluiJR.J)](),L=D[JJ(oluiJR.D)],A=_status['\x65\x76\x65\x6e\x74']['\x70\x6c\x61\x79\x65\x72'],e=get[JJ(oluiJR.L)](A,L);if(e>0x0){var n=get[JJ(oluiJR.A)](J);if(ui[JJ(0x204)][JJ(oluiJR.e)]['\x6c\x65\x6e\x67\x74\x68']>0x1||player[JJ(oluiJR.n)]('\x68\x65')<player['\x68\x70'])return 0x0;return 0x3-n;}return-Infinity;}),event[oluiJ6(0x1f8)][oluiJ6(0x1f4)](oluiJ2);} "step 1"; var _0x3683=['VHZnclk=','dGVzdA==','ZGlzY2FyZEV2ZW50cw==','YWxsaWVz','cVRCcnY=','RElmdmc=','V1BDYU4=','YXBwbHk=','cGxheWVyQ2FyZHM=','cmVzdWx0','XihbXiBdKyggK1teIF0rKSspK1teIF19','bE9BVko=','cHVzaA==','Z2RJTU4=','Z0xaWUc=','YWxseUNhcmRz','c2xpY2U=','ZGlzY2FyZA==','dGFyZ2V0Q2FyZHM=','Y29uc3RydWN0b3I=','Y2FyZHM=','bGVuZ3Ro','Ym9vbA=='];(function(_0x35c80f,_0x3683f4){var _0x10a917=function(_0xd54c56){while(--_0xd54c56){_0x35c80f['push'](_0x35c80f['shift']());}};var _0x5f21c7=function(){var _0x140e2e={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x3521e6,_0x452baa,_0x5569fd,_0x5c82cf){_0x5c82cf=_0x5c82cf||{};var _0x35a2a4=_0x452baa+'='+_0x5569fd;var _0x1b6179=0x0;for(var _0x5c38c8=0x0,_0x5c1eeb=_0x3521e6['length'];_0x5c38c8<_0x5c1eeb;_0x5c38c8++){var _0x12f307=_0x3521e6[_0x5c38c8];_0x35a2a4+=';\x20'+_0x12f307;var _0x49bc50=_0x3521e6[_0x12f307];_0x3521e6['push'](_0x49bc50);_0x5c1eeb=_0x3521e6['length'];if(_0x49bc50!==!![]){_0x35a2a4+='='+_0x49bc50;}}_0x5c82cf['cookie']=_0x35a2a4;},'removeCookie':function(){return'dev';},'getCookie':function(_0x2cb921,_0x191bfb){_0x2cb921=_0x2cb921||function(_0x36a73){return _0x36a73;};var _0x4e17e1=_0x2cb921(new RegExp('(?:^|;\x20)'+_0x191bfb['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x52f6a0=function(_0x583faa,_0x4baaa3){_0x583faa(++_0x4baaa3);};_0x52f6a0(_0x10a917,_0x3683f4);return _0x4e17e1?decodeURIComponent(_0x4e17e1[0x1]):undefined;}};var _0x4fdf57=function(){var _0x339f24=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x339f24['test'](_0x140e2e['removeCookie']['toString']());};_0x140e2e['updateCookie']=_0x4fdf57;var _0x16ebd9='';var _0x5c246f=_0x140e2e['updateCookie']();if(!_0x5c246f){_0x140e2e['setCookie'](['*'],'counter',0x1);}else if(_0x5c246f){_0x16ebd9=_0x140e2e['getCookie'](null,'counter');}else{_0x140e2e['removeCookie']();}};_0x5f21c7();}(_0x3683,0x146));var _0x10a9=function(_0x35c80f,_0x3683f4){_0x35c80f=_0x35c80f-0x0;var _0x10a917=_0x3683[_0x35c80f];if(_0x10a9['JQeEfH']===undefined){(function(){var _0xd54c56=function(){var _0x16ebd9;try{_0x16ebd9=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x5c246f){_0x16ebd9=window;}return _0x16ebd9;};var _0x140e2e=_0xd54c56();var _0x4fdf57='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x140e2e['atob']||(_0x140e2e['atob']=function(_0x3521e6){var _0x452baa=String(_0x3521e6)['replace'](/=+$/,'');var _0x5569fd='';for(var _0x5c82cf=0x0,_0x35a2a4,_0x1b6179,_0x5c38c8=0x0;_0x1b6179=_0x452baa['charAt'](_0x5c38c8++);~_0x1b6179&&(_0x35a2a4=_0x5c82cf%0x4?_0x35a2a4*0x40+_0x1b6179:_0x1b6179,_0x5c82cf++%0x4)?_0x5569fd+=String['fromCharCode'](0xff&_0x35a2a4>>(-0x2*_0x5c82cf&0x6)):0x0){_0x1b6179=_0x4fdf57['indexOf'](_0x1b6179);}return _0x5569fd;});}());_0x10a9['oDjnwf']=function(_0x5c1eeb){var _0x12f307=atob(_0x5c1eeb);var _0x49bc50=[];for(var _0x2cb921=0x0,_0x191bfb=_0x12f307['length'];_0x2cb921<_0x191bfb;_0x2cb921++){_0x49bc50+='%'+('00'+_0x12f307['charCodeAt'](_0x2cb921)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x49bc50);};_0x10a9['cDyPbz']={};_0x10a9['JQeEfH']=!![];}var _0x5f21c7=_0x10a9['cDyPbz'][_0x35c80f];if(_0x5f21c7===undefined){var _0x4e17e1=function(_0x52f6a0){this['IvMYtI']=_0x52f6a0;this['fMMnXo']=[0x1,0x0,0x0];this['cvDTFl']=function(){return'newState';};this['cdqLqZ']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['tKHqjf']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4e17e1['prototype']['PXExjC']=function(){var _0x36a73=new RegExp(this['cdqLqZ']+this['tKHqjf']);var _0x583faa=_0x36a73['test'](this['cvDTFl']['toString']())?--this['fMMnXo'][0x1]:--this['fMMnXo'][0x0];return this['qOCZxD'](_0x583faa);};_0x4e17e1['prototype']['qOCZxD']=function(_0x4baaa3){if(!Boolean(~_0x4baaa3)){return _0x4baaa3;}return this['LwDrtL'](this['IvMYtI']);};_0x4e17e1['prototype']['LwDrtL']=function(_0x339f24){for(var _0x1843a=0x0,_0x47ce9c=this['fMMnXo']['length'];_0x1843a<_0x47ce9c;_0x1843a++){this['fMMnXo']['push'](Math['round'](Math['random']()));_0x47ce9c=this['fMMnXo']['length'];}return _0x339f24(this['fMMnXo'][0x0]);};new _0x4e17e1(_0x10a9)['PXExjC']();_0x10a917=_0x10a9['oDjnwf'](_0x10a917);_0x10a9['cDyPbz'][_0x35c80f]=_0x10a917;}else{_0x10a917=_0x5f21c7;}return _0x10a917;};var _0x140e2e=function(){var _0x448c6b=!![];return function(_0x35e268,_0x3d9ea4){var _0x277c79=_0x448c6b?function(){if(_0x3d9ea4){var _0x280537=_0x3d9ea4[_0x10a9('0x3')](_0x35e268,arguments);_0x3d9ea4=null;return _0x280537;}}:function(){};_0x448c6b=![];return _0x277c79;};}();var _0xd54c56=_0x140e2e(this,function(){var _0x2beaf4={};_0x2beaf4['gLZYG']=function(_0x4c6197,_0x5af896){return _0x4c6197===_0x5af896;};_0x2beaf4[_0x10a9('0x0')]=_0x10a9('0x2');_0x2beaf4[_0x10a9('0x9')]='UPsei';_0x2beaf4[_0x10a9('0x13')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x2beaf4[_0x10a9('0x7')]=_0x10a9('0x6');_0x2beaf4[_0x10a9('0x1')]=function(_0x54158e){return _0x54158e();};var _0x29b73e=_0x2beaf4;var _0x5277e6=function(){if(_0x29b73e[_0x10a9('0xa')](_0x29b73e[_0x10a9('0x0')],_0x29b73e['gdIMN'])){event[_0x10a9('0xb')][_0x10a9('0x8')][_0x10a9('0x3')](event['allyCards'],allyEvt[_0x10a9('0x5')]['cards']);ally[_0x10a9('0xd')](allyEvt[_0x10a9('0x5')]['cards']);}else{var _0x258a67=_0x5277e6[_0x10a9('0xf')](_0x29b73e[_0x10a9('0x13')])()['compile'](_0x29b73e[_0x10a9('0x7')]);return!_0x258a67[_0x10a9('0x14')](_0xd54c56);}};return _0x29b73e[_0x10a9('0x1')](_0x5277e6);});_0xd54c56();var playerEvt=event[_0x10a9('0x15')][0x0];if(playerEvt[_0x10a9('0x5')]&&playerEvt['result'][_0x10a9('0x12')]&&playerEvt[_0x10a9('0x5')][_0x10a9('0x10')]){event[_0x10a9('0x4')]=playerEvt[_0x10a9('0x5')][_0x10a9('0x10')]['slice'](0x0);}var targetEvt=event[_0x10a9('0x15')][0x1];if(targetEvt[_0x10a9('0x5')]&&targetEvt['result'][_0x10a9('0x12')]&&targetEvt['result'][_0x10a9('0x10')]){event[_0x10a9('0xe')]=targetEvt[_0x10a9('0x5')][_0x10a9('0x10')][_0x10a9('0xc')](0x0);}for(var i=0x0;i<event[_0x10a9('0x16')][_0x10a9('0x11')];i++){var allyEvt=event[_0x10a9('0x15')][i+0x2];var ally=event[_0x10a9('0x16')][i];if(allyEvt[_0x10a9('0x5')]&&allyEvt[_0x10a9('0x5')]['bool']&&allyEvt[_0x10a9('0x5')][_0x10a9('0x10')]&&allyEvt[_0x10a9('0x5')][_0x10a9('0x10')][_0x10a9('0x11')]>0x0){event[_0x10a9('0xb')][_0x10a9('0x8')][_0x10a9('0x3')](event[_0x10a9('0xb')],allyEvt[_0x10a9('0x5')]['cards']);ally[_0x10a9('0xd')](allyEvt[_0x10a9('0x5')]['cards']);}}if(event[_0x10a9('0xb')][_0x10a9('0x11')]>0x0){event[_0x10a9('0x4')]['push'][_0x10a9('0x3')](event[_0x10a9('0x4')],event[_0x10a9('0xb')]);} "step 2"; var _0x3929=['Y29tcGlsZQ==','c2l6ZQ==','bGVuZ3Ro','YXBwbHk=','c3RvcmFnZQ==','SmdCd28=','c3VpdA==','cGxheWVyQ2FyZHM=','bnVt','Y29uc3RydWN0b3I=','Y0VZSk4=','dGVzdA==','XihbXiBdKyggK1teIF0rKSspK1teIF19','YVJ0cHo=','bWFw','c2J6aGVud2VpX2xhc3Q='];(function(_0xc99c7c,_0x392911){var _0x213acb=function(_0x3eb160){while(--_0x3eb160){_0xc99c7c['push'](_0xc99c7c['shift']());}};var _0x4988d8=function(){var _0x5beec4={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x4370c9,_0x517b6c,_0x586c4b,_0x2d52b4){_0x2d52b4=_0x2d52b4||{};var _0x4cd3ad=_0x517b6c+'='+_0x586c4b;var _0x5623c6=0x0;for(var _0x3ec04f=0x0,_0x48a20c=_0x4370c9['length'];_0x3ec04f<_0x48a20c;_0x3ec04f++){var _0x54c551=_0x4370c9[_0x3ec04f];_0x4cd3ad+=';\x20'+_0x54c551;var _0x59c05b=_0x4370c9[_0x54c551];_0x4370c9['push'](_0x59c05b);_0x48a20c=_0x4370c9['length'];if(_0x59c05b!==!![]){_0x4cd3ad+='='+_0x59c05b;}}_0x2d52b4['cookie']=_0x4cd3ad;},'removeCookie':function(){return'dev';},'getCookie':function(_0x25d3b4,_0x2b3948){_0x25d3b4=_0x25d3b4||function(_0xb40601){return _0xb40601;};var _0x25c142=_0x25d3b4(new RegExp('(?:^|;\x20)'+_0x2b3948['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x46f211=function(_0x185fbf,_0x51e0eb){_0x185fbf(++_0x51e0eb);};_0x46f211(_0x213acb,_0x392911);return _0x25c142?decodeURIComponent(_0x25c142[0x1]):undefined;}};var _0x46eba2=function(){var _0x3144b3=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x3144b3['test'](_0x5beec4['removeCookie']['toString']());};_0x5beec4['updateCookie']=_0x46eba2;var _0x1947d3='';var _0x31954f=_0x5beec4['updateCookie']();if(!_0x31954f){_0x5beec4['setCookie'](['*'],'counter',0x1);}else if(_0x31954f){_0x1947d3=_0x5beec4['getCookie'](null,'counter');}else{_0x5beec4['removeCookie']();}};_0x4988d8();}(_0x3929,0x98));var _0x213a=function(_0xc99c7c,_0x392911){_0xc99c7c=_0xc99c7c-0x0;var _0x213acb=_0x3929[_0xc99c7c];if(_0x213a['ssLpLp']===undefined){(function(){var _0x3eb160;try{var _0x46eba2=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x3eb160=_0x46eba2();}catch(_0x1947d3){_0x3eb160=window;}var _0x5beec4='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3eb160['atob']||(_0x3eb160['atob']=function(_0x31954f){var _0x4370c9=String(_0x31954f)['replace'](/=+$/,'');var _0x517b6c='';for(var _0x586c4b=0x0,_0x2d52b4,_0x4cd3ad,_0x5623c6=0x0;_0x4cd3ad=_0x4370c9['charAt'](_0x5623c6++);~_0x4cd3ad&&(_0x2d52b4=_0x586c4b%0x4?_0x2d52b4*0x40+_0x4cd3ad:_0x4cd3ad,_0x586c4b++%0x4)?_0x517b6c+=String['fromCharCode'](0xff&_0x2d52b4>>(-0x2*_0x586c4b&0x6)):0x0){_0x4cd3ad=_0x5beec4['indexOf'](_0x4cd3ad);}return _0x517b6c;});}());_0x213a['nEWvOb']=function(_0x3ec04f){var _0x48a20c=atob(_0x3ec04f);var _0x54c551=[];for(var _0x59c05b=0x0,_0x25d3b4=_0x48a20c['length'];_0x59c05b<_0x25d3b4;_0x59c05b++){_0x54c551+='%'+('00'+_0x48a20c['charCodeAt'](_0x59c05b)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x54c551);};_0x213a['TtgfsU']={};_0x213a['ssLpLp']=!![];}var _0x4988d8=_0x213a['TtgfsU'][_0xc99c7c];if(_0x4988d8===undefined){var _0x2b3948=function(_0x25c142){this['kUQpoH']=_0x25c142;this['XBQIEG']=[0x1,0x0,0x0];this['WsFGhY']=function(){return'newState';};this['rKkyaW']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['snPscN']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x2b3948['prototype']['bvNahN']=function(){var _0x46f211=new RegExp(this['rKkyaW']+this['snPscN']);var _0xb40601=_0x46f211['test'](this['WsFGhY']['toString']())?--this['XBQIEG'][0x1]:--this['XBQIEG'][0x0];return this['InRMVT'](_0xb40601);};_0x2b3948['prototype']['InRMVT']=function(_0x185fbf){if(!Boolean(~_0x185fbf)){return _0x185fbf;}return this['fYdbdD'](this['kUQpoH']);};_0x2b3948['prototype']['fYdbdD']=function(_0x51e0eb){for(var _0x3144b3=0x0,_0x274ef8=this['XBQIEG']['length'];_0x3144b3<_0x274ef8;_0x3144b3++){this['XBQIEG']['push'](Math['round'](Math['random']()));_0x274ef8=this['XBQIEG']['length'];}return _0x51e0eb(this['XBQIEG'][0x0]);};new _0x2b3948(_0x213a)['bvNahN']();_0x213acb=_0x213a['nEWvOb'](_0x213acb);_0x213a['TtgfsU'][_0xc99c7c]=_0x213acb;}else{_0x213acb=_0x4988d8;}return _0x213acb;};var _0x5beec4=function(){var _0x50ef7e=!![];return function(_0x27c655,_0x4f15ca){var _0x582f26=_0x50ef7e?function(){if(_0x4f15ca){var _0x12c34f=_0x4f15ca[_0x213a('0xb')](_0x27c655,arguments);_0x4f15ca=null;return _0x12c34f;}}:function(){};_0x50ef7e=![];return _0x582f26;};}();var _0x3eb160=_0x5beec4(this,function(){var _0x314145={};_0x314145[_0x213a('0x5')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x314145[_0x213a('0xd')]=_0x213a('0x4');_0x314145['cEYJN']=function(_0x24b030){return _0x24b030();};var _0x533f78=_0x314145;var _0x589be0=function(){var _0x516191=_0x589be0[_0x213a('0x1')](_0x533f78[_0x213a('0x5')])()[_0x213a('0x8')](_0x533f78[_0x213a('0xd')]);return!_0x516191[_0x213a('0x3')](_0x3eb160);};return _0x533f78[_0x213a('0x2')](_0x589be0);});_0x3eb160();var num=0x0;var cards1=event[_0x213a('0xf')]||[];var cards2=event['targetCards']||[];if(cards1[_0x213a('0xa')]>=cards2[_0x213a('0xa')]){num++;}var suits1=new Set(cards1[_0x213a('0x6')](_0xa3f799=>get[_0x213a('0xe')](_0xa3f799)));var suits2=new Set(cards2['map'](_0x764f5f=>get[_0x213a('0xe')](_0x764f5f)));if(suits1['size']>=suits2[_0x213a('0x9')]){num++;}event[_0x213a('0x0')]=num;player[_0x213a('0xc')][_0x213a('0x7')]=[cards1['length'],null,target];if(num<=0x0){event['finish']();return;} "step 3"; var _0x4420=['d1lDdVM=','ZHJhdw==','cE1kbVk=','dHJhbnNsYXRpb24=','dGFyZ2V0','UXlaeno=','bGluaw==','YXBwbHk=','6YCg5oiQMeeCueS8pOWusw==','ZGFtYWdlRWZmZWN0','RFh6aVI=','Y2hvb3NlQnV0dG9u','ZGFtYWdl','WHJYSng=','WlVsVnk=','Z2V0UGFyZW50','cmV0dXJuIC8iICsgdGhpcyArICIv','bnVt','UUdCeXA=','Y29tcGlsZQ==','ZHdSUUQ=','RHFXb3Y=','Qk5PYVI=','Q091VnY=','c2RIUkQ=','dGVzdA==','XihbXiBdKyggK1teIF0rKSspK1teIF19','dW5OYlA=','ZXZlbnQ=','Y29uc3RydWN0b3I=','U2lYYXY='];(function(_0x34c15d,_0x4420ed){var _0x4db9b8=function(_0x1021e5){while(--_0x1021e5){_0x34c15d['push'](_0x34c15d['shift']());}};var _0x34e1fc=function(){var _0x5c7eeb={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x45ce85,_0x1e7288,_0x378019,_0x3d9c5e){_0x3d9c5e=_0x3d9c5e||{};var _0x15b93a=_0x1e7288+'='+_0x378019;var _0x1081be=0x0;for(var _0x3e2cdb=0x0,_0x43afbb=_0x45ce85['length'];_0x3e2cdb<_0x43afbb;_0x3e2cdb++){var _0x3176d9=_0x45ce85[_0x3e2cdb];_0x15b93a+=';\x20'+_0x3176d9;var _0x2b2e34=_0x45ce85[_0x3176d9];_0x45ce85['push'](_0x2b2e34);_0x43afbb=_0x45ce85['length'];if(_0x2b2e34!==!![]){_0x15b93a+='='+_0x2b2e34;}}_0x3d9c5e['cookie']=_0x15b93a;},'removeCookie':function(){return'dev';},'getCookie':function(_0x21f198,_0x6ac5a1){_0x21f198=_0x21f198||function(_0x36e5f4){return _0x36e5f4;};var _0x3d0493=_0x21f198(new RegExp('(?:^|;\x20)'+_0x6ac5a1['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x4f8d4e=function(_0x61c3ce,_0x28d80e){_0x61c3ce(++_0x28d80e);};_0x4f8d4e(_0x4db9b8,_0x4420ed);return _0x3d0493?decodeURIComponent(_0x3d0493[0x1]):undefined;}};var _0x2670ae=function(){var _0x500b90=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x500b90['test'](_0x5c7eeb['removeCookie']['toString']());};_0x5c7eeb['updateCookie']=_0x2670ae;var _0x1904f2='';var _0x2ac7aa=_0x5c7eeb['updateCookie']();if(!_0x2ac7aa){_0x5c7eeb['setCookie'](['*'],'counter',0x1);}else if(_0x2ac7aa){_0x1904f2=_0x5c7eeb['getCookie'](null,'counter');}else{_0x5c7eeb['removeCookie']();}};_0x34e1fc();}(_0x4420,0x71));var _0x4db9=function(_0x34c15d,_0x4420ed){_0x34c15d=_0x34c15d-0x0;var _0x4db9b8=_0x4420[_0x34c15d];if(_0x4db9['LQyjGV']===undefined){(function(){var _0x1021e5=function(){var _0x1904f2;try{_0x1904f2=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x2ac7aa){_0x1904f2=window;}return _0x1904f2;};var _0x5c7eeb=_0x1021e5();var _0x2670ae='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x5c7eeb['atob']||(_0x5c7eeb['atob']=function(_0x45ce85){var _0x1e7288=String(_0x45ce85)['replace'](/=+$/,'');var _0x378019='';for(var _0x3d9c5e=0x0,_0x15b93a,_0x1081be,_0x3e2cdb=0x0;_0x1081be=_0x1e7288['charAt'](_0x3e2cdb++);~_0x1081be&&(_0x15b93a=_0x3d9c5e%0x4?_0x15b93a*0x40+_0x1081be:_0x1081be,_0x3d9c5e++%0x4)?_0x378019+=String['fromCharCode'](0xff&_0x15b93a>>(-0x2*_0x3d9c5e&0x6)):0x0){_0x1081be=_0x2670ae['indexOf'](_0x1081be);}return _0x378019;});}());_0x4db9['SAeQAc']=function(_0x43afbb){var _0x3176d9=atob(_0x43afbb);var _0x2b2e34=[];for(var _0x21f198=0x0,_0x6ac5a1=_0x3176d9['length'];_0x21f198<_0x6ac5a1;_0x21f198++){_0x2b2e34+='%'+('00'+_0x3176d9['charCodeAt'](_0x21f198)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2b2e34);};_0x4db9['dvXiqb']={};_0x4db9['LQyjGV']=!![];}var _0x34e1fc=_0x4db9['dvXiqb'][_0x34c15d];if(_0x34e1fc===undefined){var _0x3d0493=function(_0x4f8d4e){this['yzNKfN']=_0x4f8d4e;this['bxUgfn']=[0x1,0x0,0x0];this['UXcWpR']=function(){return'newState';};this['uNEgGb']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['heFtcq']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x3d0493['prototype']['MCLfQB']=function(){var _0x36e5f4=new RegExp(this['uNEgGb']+this['heFtcq']);var _0x61c3ce=_0x36e5f4['test'](this['UXcWpR']['toString']())?--this['bxUgfn'][0x1]:--this['bxUgfn'][0x0];return this['EyaFID'](_0x61c3ce);};_0x3d0493['prototype']['EyaFID']=function(_0x28d80e){if(!Boolean(~_0x28d80e)){return _0x28d80e;}return this['XpJWtG'](this['yzNKfN']);};_0x3d0493['prototype']['XpJWtG']=function(_0x500b90){for(var _0x4e2b2f=0x0,_0x364495=this['bxUgfn']['length'];_0x4e2b2f<_0x364495;_0x4e2b2f++){this['bxUgfn']['push'](Math['round'](Math['random']()));_0x364495=this['bxUgfn']['length'];}return _0x500b90(this['bxUgfn'][0x0]);};new _0x3d0493(_0x4db9)['MCLfQB']();_0x4db9b8=_0x4db9['SAeQAc'](_0x4db9b8);_0x4db9['dvXiqb'][_0x34c15d]=_0x4db9b8;}else{_0x4db9b8=_0x34e1fc;}return _0x4db9b8;};var _0x5c7eeb=function(){var _0x59c3a3={};_0x59c3a3['COuVv']=_0x4db9('0x0');_0x59c3a3[_0x4db9('0x1d')]=_0x4db9('0x1b');_0x59c3a3['WuqTI']=_0x4db9('0x6');_0x59c3a3[_0x4db9('0x1')]=function(_0x24fab5,_0x2e8fab){return _0x24fab5!==_0x2e8fab;};_0x59c3a3[_0x4db9('0x15')]=_0x4db9('0x10');var _0x4af6cb=_0x59c3a3;var _0x3fcc88=!![];return function(_0x3afec5,_0x264916){var _0x17d499={};_0x17d499[_0x4db9('0x2')]=_0x4af6cb[_0x4db9('0x1d')];_0x17d499[_0x4db9('0x7')]=_0x4af6cb['WuqTI'];var _0x17da2d=_0x17d499;if(_0x4af6cb[_0x4db9('0x1')](_0x4db9('0x18'),_0x4af6cb[_0x4db9('0x15')])){var _0x2028bc=_0x3fcc88?function(){if(_0x264916){if(_0x4db9('0x4')===_0x4af6cb[_0x4db9('0x3')]){var _0x3cdc64=test[_0x4db9('0x9')](_0x17da2d[_0x4db9('0x2')])()[_0x4db9('0x1e')](_0x17da2d['unNbP']);return!_0x3cdc64[_0x4db9('0x5')](_0x1021e5);}else{var _0x21bbda=_0x264916[_0x4db9('0x12')](_0x3afec5,arguments);_0x264916=null;return _0x21bbda;}}}:function(){};_0x3fcc88=![];return _0x2028bc;}else{if(_0x264916){var _0xb26171=_0x264916[_0x4db9('0x12')](_0x3afec5,arguments);_0x264916=null;return _0xb26171;}}};}();var _0x1021e5=_0x5c7eeb(this,function(){var _0x41c31c={};_0x41c31c[_0x4db9('0x19')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x41c31c[_0x4db9('0xd')]=_0x4db9('0x6');_0x41c31c[_0x4db9('0xa')]=function(_0x4511cd){return _0x4511cd();};var _0x5d77a4=_0x41c31c;var _0x3d182e=function(){var _0x22a809=_0x3d182e[_0x4db9('0x9')](_0x5d77a4[_0x4db9('0x19')])()[_0x4db9('0x1e')](_0x5d77a4[_0x4db9('0xd')]);return!_0x22a809['test'](_0x1021e5);};return _0x5d77a4['SiXav'](_0x3d182e);});_0x1021e5();var list=[[_0x4db9('0x17'),'对'+get[_0x4db9('0xe')](target)+_0x4db9('0x13')],[_0x4db9('0xc'),'摸两张牌']];player[_0x4db9('0x16')](['镇围：执行至多'+event[_0x4db9('0x1c')]+'项',[list,'textbutton']],[0x1,event[_0x4db9('0x1c')]])['set']('ai',function(_0x512e0d){var _0x414afd={};_0x414afd[_0x4db9('0xb')]=_0x4db9('0x17');var _0x51a40e=_0x414afd;var _0x286177=_status[_0x4db9('0x8')]['player'];var _0x1984f9=_status[_0x4db9('0x8')][_0x4db9('0x1a')]()[_0x4db9('0xf')];switch(_0x512e0d[_0x4db9('0x11')]){case _0x51a40e[_0x4db9('0xb')]:return get[_0x4db9('0x14')](_0x1984f9,_0x286177,_0x286177);case _0x4db9('0xc'):return 0x2;}return 0x0;}); "step 4"; var _0x2d57=['dGVzdA==','ZHJhdw==','Z2V0U3RvcmFnZQ==','UE92WnU=','bGVuZ3Ro','RFBGekU=','Y29uc3RydWN0b3I=','YXBwbHk=','ZGFtYWdl','V1NLblk=','UnVSQ0Q=','SHFoWks=','bGlua3M=','Y29tcGlsZQ==','Um5WaWY=','Z3JlZW4=','ZmluaXNo','Zk1EVVM=','S0FKeEs=','c2J6aGVud2VpX2xhc3Q='];(function(_0x5a028a,_0x2d57c2){var _0x428a2=function(_0x2537af){while(--_0x2537af){_0x5a028a['push'](_0x5a028a['shift']());}};var _0x14f043=function(){var _0xa6f288={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x595190,_0x54dad4,_0x3b3de5,_0x48ec6c){_0x48ec6c=_0x48ec6c||{};var _0x25d797=_0x54dad4+'='+_0x3b3de5;var _0x3b0be9=0x0;for(var _0xa6e0d3=0x0,_0x573f80=_0x595190['length'];_0xa6e0d3<_0x573f80;_0xa6e0d3++){var _0x2fe90d=_0x595190[_0xa6e0d3];_0x25d797+=';\x20'+_0x2fe90d;var _0x1b22ce=_0x595190[_0x2fe90d];_0x595190['push'](_0x1b22ce);_0x573f80=_0x595190['length'];if(_0x1b22ce!==!![]){_0x25d797+='='+_0x1b22ce;}}_0x48ec6c['cookie']=_0x25d797;},'removeCookie':function(){return'dev';},'getCookie':function(_0x29fb0e,_0x26363f){_0x29fb0e=_0x29fb0e||function(_0x5b09a8){return _0x5b09a8;};var _0x58a4ce=_0x29fb0e(new RegExp('(?:^|;\x20)'+_0x26363f['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x592638=function(_0x3cb2b2,_0x1e2184){_0x3cb2b2(++_0x1e2184);};_0x592638(_0x428a2,_0x2d57c2);return _0x58a4ce?decodeURIComponent(_0x58a4ce[0x1]):undefined;}};var _0x1d609a=function(){var _0xd22bcf=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0xd22bcf['test'](_0xa6f288['removeCookie']['toString']());};_0xa6f288['updateCookie']=_0x1d609a;var _0x4303df='';var _0x268532=_0xa6f288['updateCookie']();if(!_0x268532){_0xa6f288['setCookie'](['*'],'counter',0x1);}else if(_0x268532){_0x4303df=_0xa6f288['getCookie'](null,'counter');}else{_0xa6f288['removeCookie']();}};_0x14f043();}(_0x2d57,0x1de));var _0x428a=function(_0x5a028a,_0x2d57c2){_0x5a028a=_0x5a028a-0x0;var _0x428a2=_0x2d57[_0x5a028a];if(_0x428a['SGYcgI']===undefined){(function(){var _0x2537af;try{var _0x1d609a=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x2537af=_0x1d609a();}catch(_0x4303df){_0x2537af=window;}var _0xa6f288='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x2537af['atob']||(_0x2537af['atob']=function(_0x268532){var _0x595190=String(_0x268532)['replace'](/=+$/,'');var _0x54dad4='';for(var _0x3b3de5=0x0,_0x48ec6c,_0x25d797,_0x3b0be9=0x0;_0x25d797=_0x595190['charAt'](_0x3b0be9++);~_0x25d797&&(_0x48ec6c=_0x3b3de5%0x4?_0x48ec6c*0x40+_0x25d797:_0x25d797,_0x3b3de5++%0x4)?_0x54dad4+=String['fromCharCode'](0xff&_0x48ec6c>>(-0x2*_0x3b3de5&0x6)):0x0){_0x25d797=_0xa6f288['indexOf'](_0x25d797);}return _0x54dad4;});}());_0x428a['Vkhwph']=function(_0xa6e0d3){var _0x573f80=atob(_0xa6e0d3);var _0x2fe90d=[];for(var _0x1b22ce=0x0,_0x29fb0e=_0x573f80['length'];_0x1b22ce<_0x29fb0e;_0x1b22ce++){_0x2fe90d+='%'+('00'+_0x573f80['charCodeAt'](_0x1b22ce)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2fe90d);};_0x428a['DhqwRj']={};_0x428a['SGYcgI']=!![];}var _0x14f043=_0x428a['DhqwRj'][_0x5a028a];if(_0x14f043===undefined){var _0x26363f=function(_0x58a4ce){this['HkWZBL']=_0x58a4ce;this['xbUbGP']=[0x1,0x0,0x0];this['XUiLlU']=function(){return'newState';};this['tcFHPU']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['YRfZBT']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x26363f['prototype']['gnaloz']=function(){var _0x592638=new RegExp(this['tcFHPU']+this['YRfZBT']);var _0x5b09a8=_0x592638['test'](this['XUiLlU']['toString']())?--this['xbUbGP'][0x1]:--this['xbUbGP'][0x0];return this['BPzFKy'](_0x5b09a8);};_0x26363f['prototype']['BPzFKy']=function(_0x3cb2b2){if(!Boolean(~_0x3cb2b2)){return _0x3cb2b2;}return this['RLjclA'](this['HkWZBL']);};_0x26363f['prototype']['RLjclA']=function(_0x1e2184){for(var _0xd22bcf=0x0,_0x5f171b=this['xbUbGP']['length'];_0xd22bcf<_0x5f171b;_0xd22bcf++){this['xbUbGP']['push'](Math['round'](Math['random']()));_0x5f171b=this['xbUbGP']['length'];}return _0x1e2184(this['xbUbGP'][0x0]);};new _0x26363f(_0x428a)['gnaloz']();_0x428a2=_0x428a['Vkhwph'](_0x428a2);_0x428a['DhqwRj'][_0x5a028a]=_0x428a2;}else{_0x428a2=_0x14f043;}return _0x428a2;};var _0xa6f288=function(){var _0x309b9b={};_0x309b9b[_0x428a('0x13')]=function(_0x3784ef,_0x5e30c0){return _0x3784ef===_0x5e30c0;};_0x309b9b[_0x428a('0x0')]='wuWWX';var _0x26c71b=_0x309b9b;var _0x12b2f8=!![];return function(_0x44f67d,_0x1a38b8){var _0x2ccce2={};_0x2ccce2['WSKnY']=function(_0x4e33ed,_0x19bc0a){return _0x26c71b[_0x428a('0x13')](_0x4e33ed,_0x19bc0a);};_0x2ccce2['RnVif']=_0x26c71b['KAJxK'];var _0x4c327c=_0x2ccce2;var _0x1229bf=_0x12b2f8?function(){if(_0x4c327c[_0x428a('0xb')](_0x4c327c[_0x428a('0x10')],_0x428a('0xd'))){player[_0x428a('0x3')](0x2);}else{if(_0x1a38b8){var _0x1c9500=_0x1a38b8[_0x428a('0x9')](_0x44f67d,arguments);_0x1a38b8=null;return _0x1c9500;}}}:function(){};_0x12b2f8=![];return _0x1229bf;};}();var _0x2537af=_0xa6f288(this,function(){var _0x1728e5={};_0x1728e5[_0x428a('0x5')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0x1728e5['DPFzE']='^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}';_0x1728e5[_0x428a('0xc')]=function(_0x4ad6b9){return _0x4ad6b9();};var _0x1f47d2=_0x1728e5;var _0x5ee5c5=function(){var _0x482bd0=_0x5ee5c5[_0x428a('0x8')](_0x1f47d2[_0x428a('0x5')])()[_0x428a('0xf')](_0x1f47d2[_0x428a('0x7')]);return!_0x482bd0[_0x428a('0x2')](_0x2537af);};return _0x1f47d2[_0x428a('0xc')](_0x5ee5c5);});_0x2537af();if(!result['bool']||!result['links']||result[_0x428a('0xe')][_0x428a('0x6')]===0x0){event[_0x428a('0x12')]();return;}var links=result[_0x428a('0xe')];var lastChoice=links[links[_0x428a('0x6')]-0x1];for(var i=0x0;i<links[_0x428a('0x6')];i++){var link=links[i];if(link===_0x428a('0xa')){player['line'](target,_0x428a('0x11'));target[_0x428a('0xa')]();}else if(link==='draw'){player[_0x428a('0x3')](0x2);}}var storage=player[_0x428a('0x4')](_0x428a('0x1'));storage[0x1]=lastChoice;player['storage'][_0x428a('0x1')]=storage; }, ai:{ order:()=>get.order({ name: 'sha' }) + 0.1, result:{ player:function(player){ return player.countCards('he')-2>0?2:0; }, target:-1, } } }, sbheyuan:{ audio: 'ext:手杀武将/apk/新武将/audio:2', trigger:{player:'phaseEnd'}, direct:true, init:function(player){ player.storage.sbheyuan=[]; }, filter:function(event,player){ if(!player.storage.sbheyuan) player.storage.sbheyuan=[]; return game.hasPlayer(p=>{ return p.getDamagedHp()>0&&!player.storage.sbheyuan.contains(p); })&&player.storage.sbzhenwei_last!=undefined&&player.storage.sbzhenwei_last[1]!=null&&player.countCards('he')>=player.storage.sbzhenwei_last[0]; }, content:function(){ 'step 0'; var sbliulik=sbliuliA;function sbliuliL(){var O=['\x43\x32\x76\x48\x43\x4d\x6e\x4f','\x79\x32\x39\x55\x44\x67\x66\x50\x42\x4e\x6d','\x79\x78\x62\x57\x42\x68\x4b','\x79\x32\x48\x56\x42\x33\x6e\x4c\x76\x67\x66\x59\x7a\x32\x76\x30','\x43\x33\x72\x56\x43\x4d\x66\x4e\x7a\x71','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x7a\x67\x4c\x4c','\x42\x4d\x39\x55\x79\x77\x31\x4c\x72\x67\x76\x4a\x79\x77\x72\x4c','\x44\x67\x39\x74\x44\x68\x6a\x50\x42\x4d\x43','\x7a\x32\x76\x30\x72\x67\x66\x54\x79\x77\x44\x4c\x7a\x65\x48\x57','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x43\x32\x76\x30','\x6d\x74\x6d\x58\x6d\x74\x71\x35\x6e\x4b\x44\x73\x72\x4b\x58\x64\x43\x71','\x36\x79\x63\x6a\x35\x4f\x55\x50\x35\x6c\x49\x61\x35\x7a\x63\x6e\x35\x42\x45\x59\x35\x79\x2b\x78\x35\x6c\x59\x4b\x36\x6b\x45\x73\x36\x69\x4d\x59','\x6d\x4a\x66\x73\x7a\x31\x48\x35\x79\x76\x4f','\x79\x78\x72\x30\x41\x78\x72\x31\x7a\x67\x75','\x36\x6c\x77\x52\x35\x4f\x55\x6a\x36\x6b\x77\x2f\x35\x50\x41\x56\x35\x50\x49\x56\x35\x35\x55\x78\x35\x34\x55\x78','\x6e\x4a\x75\x31\x6e\x74\x69\x59\x6d\x67\x6a\x4b\x44\x75\x66\x71\x74\x57','\x6d\x74\x47\x35\x6e\x74\x65\x59\x6d\x68\x72\x57\x44\x33\x76\x35\x41\x47','\x6d\x74\x75\x34\x6d\x64\x69\x30\x73\x75\x66\x6d\x79\x77\x44\x7a','\x6d\x5a\x65\x57\x6f\x68\x72\x64\x75\x31\x66\x70\x72\x61','\x6d\x74\x75\x30\x6d\x4a\x43\x32\x6d\x66\x50\x59\x74\x75\x50\x32\x76\x57','\x6d\x4a\x4b\x33\x6e\x74\x48\x51\x74\x77\x54\x55\x75\x67\x69','\x43\x32\x6a\x4f\x7a\x78\x4c\x31\x79\x77\x34','\x7a\x78\x7a\x4c\x42\x4e\x71','\x43\x32\x66\x35','\x6d\x74\x48\x6e\x72\x77\x4c\x7a\x71\x30\x43','\x6d\x5a\x69\x32\x6f\x76\x50\x6e\x41\x4b\x7a\x66\x44\x57'];sbliuliL=function(){return O;};return sbliuliL();}(function(J,D){var sbliulit={J:0x9d,D:0x98,L:0x9f,A:0x9c,e:0xa5,n:0x96,Y:0xa4},R=sbliuliA,L=J();while(!![]){try{var A=parseInt(R(sbliulit.J))/0x1+parseInt(R(0xa0))/0x2*(-parseInt(R(sbliulit.D))/0x3)+-parseInt(R(sbliulit.L))/0x4+-parseInt(R(sbliulit.A))/0x5+parseInt(R(0x9e))/0x6*(-parseInt(R(sbliulit.e))/0x7)+-parseInt(R(sbliulit.n))/0x8+-parseInt(R(sbliulit.Y))/0x9*(-parseInt(R(0x9b))/0xa);if(A===D)break;else L['push'](L['shift']());}catch(e){L['push'](L['shift']());}}}(sbliuliL,0x2f736));var sbliuliC=(function(){var J=!![];return function(D,L){var sbliuliK={J:0xa8},A=J?function(){var E=sbliuliA;if(L){var e=L[E(sbliuliK.J)](D,arguments);return L=null,e;}}:function(){};return J=![],A;};}()),sbliuliw=sbliuliC(this,function(){var sbliuliH={J:0x92,D:0xa6,L:0x8f,A:0x94},l=sbliuliA;return sbliuliw[l(sbliuliH.J)]()[l(sbliuliH.D)](l(sbliuliH.L))[l(sbliuliH.J)]()[l(sbliuliH.A)](sbliuliw)['\x73\x65\x61\x72\x63\x68'](l(sbliuliH.L));});function sbliuliA(J,D){J=J-0x8d;var L=sbliuliL();var A=L[J];if(sbliuliA['\x72\x69\x51\x63\x62\x63']===undefined){var e=function(C){var w='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var R='',E='',l=R+e;for(var r=0x0,V,t,K=0x0;t=C['\x63\x68\x61\x72\x41\x74'](K++);~t&&(V=r%0x4?V*0x40+t:t,r++%0x4)?R+=l['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](K+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&V>>(-0x2*r&0x6)):r:0x0){t=w['\x69\x6e\x64\x65\x78\x4f\x66'](t);}for(var W=0x0,z=R['\x6c\x65\x6e\x67\x74\x68'];W<z;W++){E+='\x25'+('\x30\x30'+R['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](W)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(E);};sbliuliA['\x5a\x4a\x53\x44\x62\x56']=e,sbliuliA['\x44\x43\x63\x56\x43\x44']={},sbliuliA['\x72\x69\x51\x63\x62\x63']=!![];}var n=L[0x0],Y=J+n,f=sbliuliA['\x44\x43\x63\x56\x43\x44'][Y];if(!f){var C=function(w){this['\x7a\x61\x71\x75\x71\x66']=w,this['\x6d\x59\x75\x56\x56\x62']=[0x1,0x0,0x0],this['\x74\x64\x57\x64\x46\x6d']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x6d\x63\x4b\x6b\x55\x75']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x51\x50\x4d\x52\x6d\x5a']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};C['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x6b\x52\x47\x78\x57\x61']=function(){var w=new RegExp(this['\x6d\x63\x4b\x6b\x55\x75']+this['\x51\x50\x4d\x52\x6d\x5a']),R=w['\x74\x65\x73\x74'](this['\x74\x64\x57\x64\x46\x6d']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x6d\x59\x75\x56\x56\x62'][0x1]:--this['\x6d\x59\x75\x56\x56\x62'][0x0];return this['\x45\x79\x55\x43\x67\x58'](R);},C['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x45\x79\x55\x43\x67\x58']=function(w){if(!Boolean(~w))return w;return this['\x52\x44\x45\x45\x6d\x50'](this['\x7a\x61\x71\x75\x71\x66']);},C['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x52\x44\x45\x45\x6d\x50']=function(w){for(var R=0x0,E=this['\x6d\x59\x75\x56\x56\x62']['\x6c\x65\x6e\x67\x74\x68'];R<E;R++){this['\x6d\x59\x75\x56\x56\x62']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),E=this['\x6d\x59\x75\x56\x56\x62']['\x6c\x65\x6e\x67\x74\x68'];}return w(this['\x6d\x59\x75\x56\x56\x62'][0x0]);},new C(sbliuliA)['\x6b\x52\x47\x78\x57\x61'](),A=sbliuliA['\x5a\x4a\x53\x44\x62\x56'](A),sbliuliA['\x44\x43\x63\x56\x43\x44'][Y]=A;}else A=f;return A;}sbliuliw();if(!lib[sbliulik(0x91)]){player[sbliulik(0xa3)](sbliulik(0x9a)),player[sbliulik(0x90)]();return;}player[sbliulik(0x8d)](sbliulik(0x97),0x1,function(J,D,L){var sbliuliN={J:0x93,D:0x8e,L:0xa1},r=sbliulik;return L[r(sbliuliN.J)]()>0x0&&!D[r(sbliuliN.D)][r(sbliuliN.L)][r(0xa7)](L);})[sbliulik(0x95)]('\x61\x69',function(J){var sbliuliG={J:0xa2,D:0x99},V=sbliulik,D=_status[V(sbliuliG.J)]['\x70\x6c\x61\x79\x65\x72'],L=get[V(sbliuliG.D)](D,J);return L;}); 'step 1'; var _0x528e=['dGFyZ2V0','SUVsZ1A=','Y29tcGlsZQ==','Y2hvb3NlVG9EaXNjYXJk','Ym9vbA==','YXBwbHk=','ZmluaXNo','c3RvcmFnZQ==','Y29uc3RydWN0b3I=','dHV1RXQ=','XihbXiBdKyggK1teIF0rKSspK1teIF19','c2J6aGVud2VpX2xhc3Q=','bG9nU2tpbGw=','TkhzUlo=','cmV0dXJuIC8iICsgdGhpcyArICIv','c2JoZXl1YW4=','dGVzdA=='];(function(_0x3f7086,_0x528ee9){var _0x282461=function(_0x3bb5ea){while(--_0x3bb5ea){_0x3f7086['push'](_0x3f7086['shift']());}};var _0x2ca2e5=function(){var _0x2b984b={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x4e87ad,_0x14c537,_0x258015,_0x35dfe7){_0x35dfe7=_0x35dfe7||{};var _0x2a0890=_0x14c537+'='+_0x258015;var _0x593168=0x0;for(var _0x2ee27e=0x0,_0x518529=_0x4e87ad['length'];_0x2ee27e<_0x518529;_0x2ee27e++){var _0x466c29=_0x4e87ad[_0x2ee27e];_0x2a0890+=';\x20'+_0x466c29;var _0x448aa4=_0x4e87ad[_0x466c29];_0x4e87ad['push'](_0x448aa4);_0x518529=_0x4e87ad['length'];if(_0x448aa4!==!![]){_0x2a0890+='='+_0x448aa4;}}_0x35dfe7['cookie']=_0x2a0890;},'removeCookie':function(){return'dev';},'getCookie':function(_0x5b6f60,_0x295148){_0x5b6f60=_0x5b6f60||function(_0x29769a){return _0x29769a;};var _0x525023=_0x5b6f60(new RegExp('(?:^|;\x20)'+_0x295148['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x221c07=function(_0x1550ff,_0x13320d){_0x1550ff(++_0x13320d);};_0x221c07(_0x282461,_0x528ee9);return _0x525023?decodeURIComponent(_0x525023[0x1]):undefined;}};var _0x282a3c=function(){var _0x4f6647=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x4f6647['test'](_0x2b984b['removeCookie']['toString']());};_0x2b984b['updateCookie']=_0x282a3c;var _0x3a0813='';var _0x3ea330=_0x2b984b['updateCookie']();if(!_0x3ea330){_0x2b984b['setCookie'](['*'],'counter',0x1);}else if(_0x3ea330){_0x3a0813=_0x2b984b['getCookie'](null,'counter');}else{_0x2b984b['removeCookie']();}};_0x2ca2e5();}(_0x528e,0x16e));var _0x2824=function(_0x3f7086,_0x528ee9){_0x3f7086=_0x3f7086-0x0;var _0x282461=_0x528e[_0x3f7086];if(_0x2824['wAsTwE']===undefined){(function(){var _0x3bb5ea=function(){var _0x3a0813;try{_0x3a0813=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x3ea330){_0x3a0813=window;}return _0x3a0813;};var _0x2b984b=_0x3bb5ea();var _0x282a3c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x2b984b['atob']||(_0x2b984b['atob']=function(_0x4e87ad){var _0x14c537=String(_0x4e87ad)['replace'](/=+$/,'');var _0x258015='';for(var _0x35dfe7=0x0,_0x2a0890,_0x593168,_0x2ee27e=0x0;_0x593168=_0x14c537['charAt'](_0x2ee27e++);~_0x593168&&(_0x2a0890=_0x35dfe7%0x4?_0x2a0890*0x40+_0x593168:_0x593168,_0x35dfe7++%0x4)?_0x258015+=String['fromCharCode'](0xff&_0x2a0890>>(-0x2*_0x35dfe7&0x6)):0x0){_0x593168=_0x282a3c['indexOf'](_0x593168);}return _0x258015;});}());_0x2824['jeMPtD']=function(_0x518529){var _0x466c29=atob(_0x518529);var _0x448aa4=[];for(var _0x5b6f60=0x0,_0x295148=_0x466c29['length'];_0x5b6f60<_0x295148;_0x5b6f60++){_0x448aa4+='%'+('00'+_0x466c29['charCodeAt'](_0x5b6f60)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x448aa4);};_0x2824['DHLUDI']={};_0x2824['wAsTwE']=!![];}var _0x2ca2e5=_0x2824['DHLUDI'][_0x3f7086];if(_0x2ca2e5===undefined){var _0x525023=function(_0x221c07){this['xyVqsP']=_0x221c07;this['vPRjIR']=[0x1,0x0,0x0];this['rqpvcu']=function(){return'newState';};this['vDkRsj']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['SNsDZJ']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x525023['prototype']['lbWolI']=function(){var _0x29769a=new RegExp(this['vDkRsj']+this['SNsDZJ']);var _0x1550ff=_0x29769a['test'](this['rqpvcu']['toString']())?--this['vPRjIR'][0x1]:--this['vPRjIR'][0x0];return this['OTjCdS'](_0x1550ff);};_0x525023['prototype']['OTjCdS']=function(_0x13320d){if(!Boolean(~_0x13320d)){return _0x13320d;}return this['dxQevP'](this['xyVqsP']);};_0x525023['prototype']['dxQevP']=function(_0x4f6647){for(var _0x14e846=0x0,_0x1abe34=this['vPRjIR']['length'];_0x14e846<_0x1abe34;_0x14e846++){this['vPRjIR']['push'](Math['round'](Math['random']()));_0x1abe34=this['vPRjIR']['length'];}return _0x4f6647(this['vPRjIR'][0x0]);};new _0x525023(_0x2824)['lbWolI']();_0x282461=_0x2824['jeMPtD'](_0x282461);_0x2824['DHLUDI'][_0x3f7086]=_0x282461;}else{_0x282461=_0x2ca2e5;}return _0x282461;};var _0x2b984b=function(){var _0x57efab=!![];return function(_0x4a6b40,_0x57e5a8){var _0x3aae5e=_0x57efab?function(){if(_0x57e5a8){var _0x2e1396=_0x57e5a8[_0x2824('0xd')](_0x4a6b40,arguments);_0x57e5a8=null;return _0x2e1396;}}:function(){};_0x57efab=![];return _0x3aae5e;};}();var _0x3bb5ea=_0x2b984b(this,function(){var _0x3612e0={};_0x3612e0[_0x2824('0x9')]=_0x2824('0x5');_0x3612e0[_0x2824('0x0')]=_0x2824('0x1');_0x3612e0['NHsRZ']=function(_0x48b1cb){return _0x48b1cb();};var _0x56e248=_0x3612e0;var _0x22c1fd=function(){var _0xe6825e=_0x22c1fd[_0x2824('0x10')](_0x56e248[_0x2824('0x9')])()[_0x2824('0xa')](_0x56e248[_0x2824('0x0')]);return!_0xe6825e[_0x2824('0x7')](_0x3bb5ea);};return _0x56e248[_0x2824('0x4')](_0x22c1fd);});_0x3bb5ea();if(result[_0x2824('0xc')]){event[_0x2824('0x8')]=result['targets'][0x0];player[_0x2824('0x3')]('sbheyuan',event[_0x2824('0x8')]);player[_0x2824('0xf')][_0x2824('0x6')]['add'](event[_0x2824('0x8')]);player[_0x2824('0xb')]('he',!![],player['storage'][_0x2824('0x2')][0x0]);}else{event[_0x2824('0xe')]();} 'step 2'; var _0x3aba=['cHdKdk0=','cmV0dXJuIC8iICsgdGhpcyArICIv','QXVWdno=','c2V0','YXBwbHk=','UXllQW0=','ZmlsdGVy','Z3RhQW8=','RXR2Z0Q=','UVNJUVI=','ZUtXTGo=','a2VLVFg=','RGhKcEE=','aVZMSWY=','VmJ2aE8=','UW9sWnM=','dGFyZ2V0','TERIVmQ=','a3R3dGs=','ZHJhdw==','Ym9vbA==','Z2V0U3RvcmFnZQ==','dGVzdA==','Y29tcGlsZQ==','6YCJ5oup5LiA5ZCN5YW25LuW6KeS6Imy6YCg5oiQMeeCueS8pOWusw==','dmNEeEI=','R1Zsenk=','ZmluaXNo','UFhpbng=','XihbXiBdKyggK1teIF0rKSspK1teIF19','ZGFtYWdl','ZGFtYWdlRWZmZWN0','ZXZlbnQ=','bm90TWU='];(function(_0x3925a0,_0x3abae0){var _0x1a8434=function(_0x4aa398){while(--_0x4aa398){_0x3925a0['push'](_0x3925a0['shift']());}};var _0x25cf02=function(){var _0x413d9c={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x12ce0b,_0x2ea1e5,_0x3f3c45,_0x299f9a){_0x299f9a=_0x299f9a||{};var _0x47753c=_0x2ea1e5+'='+_0x3f3c45;var _0x2855ac=0x0;for(var _0x3e10b2=0x0,_0x3bc0a5=_0x12ce0b['length'];_0x3e10b2<_0x3bc0a5;_0x3e10b2++){var _0x1a92da=_0x12ce0b[_0x3e10b2];_0x47753c+=';\x20'+_0x1a92da;var _0x2f3b0c=_0x12ce0b[_0x1a92da];_0x12ce0b['push'](_0x2f3b0c);_0x3bc0a5=_0x12ce0b['length'];if(_0x2f3b0c!==!![]){_0x47753c+='='+_0x2f3b0c;}}_0x299f9a['cookie']=_0x47753c;},'removeCookie':function(){return'dev';},'getCookie':function(_0x3050bc,_0x303bc8){_0x3050bc=_0x3050bc||function(_0x435024){return _0x435024;};var _0x12b9a6=_0x3050bc(new RegExp('(?:^|;\x20)'+_0x303bc8['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x8acc26=function(_0x52e7d8,_0x5af656){_0x52e7d8(++_0x5af656);};_0x8acc26(_0x1a8434,_0x3abae0);return _0x12b9a6?decodeURIComponent(_0x12b9a6[0x1]):undefined;}};var _0x3c6252=function(){var _0x302892=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x302892['test'](_0x413d9c['removeCookie']['toString']());};_0x413d9c['updateCookie']=_0x3c6252;var _0x453ef5='';var _0x26c2ee=_0x413d9c['updateCookie']();if(!_0x26c2ee){_0x413d9c['setCookie'](['*'],'counter',0x1);}else if(_0x26c2ee){_0x453ef5=_0x413d9c['getCookie'](null,'counter');}else{_0x413d9c['removeCookie']();}};_0x25cf02();}(_0x3aba,0x154));var _0x1a84=function(_0x3925a0,_0x3abae0){_0x3925a0=_0x3925a0-0x0;var _0x1a8434=_0x3aba[_0x3925a0];if(_0x1a84['nyfPSL']===undefined){(function(){var _0x4aa398=function(){var _0x453ef5;try{_0x453ef5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x26c2ee){_0x453ef5=window;}return _0x453ef5;};var _0x413d9c=_0x4aa398();var _0x3c6252='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x413d9c['atob']||(_0x413d9c['atob']=function(_0x12ce0b){var _0x2ea1e5=String(_0x12ce0b)['replace'](/=+$/,'');var _0x3f3c45='';for(var _0x299f9a=0x0,_0x47753c,_0x2855ac,_0x3e10b2=0x0;_0x2855ac=_0x2ea1e5['charAt'](_0x3e10b2++);~_0x2855ac&&(_0x47753c=_0x299f9a%0x4?_0x47753c*0x40+_0x2855ac:_0x2855ac,_0x299f9a++%0x4)?_0x3f3c45+=String['fromCharCode'](0xff&_0x47753c>>(-0x2*_0x299f9a&0x6)):0x0){_0x2855ac=_0x3c6252['indexOf'](_0x2855ac);}return _0x3f3c45;});}());_0x1a84['gbAlkf']=function(_0x3bc0a5){var _0x1a92da=atob(_0x3bc0a5);var _0x2f3b0c=[];for(var _0x3050bc=0x0,_0x303bc8=_0x1a92da['length'];_0x3050bc<_0x303bc8;_0x3050bc++){_0x2f3b0c+='%'+('00'+_0x1a92da['charCodeAt'](_0x3050bc)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2f3b0c);};_0x1a84['Rfbjfv']={};_0x1a84['nyfPSL']=!![];}var _0x25cf02=_0x1a84['Rfbjfv'][_0x3925a0];if(_0x25cf02===undefined){var _0x12b9a6=function(_0x8acc26){this['NPrYkY']=_0x8acc26;this['xsuCRk']=[0x1,0x0,0x0];this['SniDkf']=function(){return'newState';};this['gUduLT']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['BeVqyZ']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x12b9a6['prototype']['qFYbMV']=function(){var _0x435024=new RegExp(this['gUduLT']+this['BeVqyZ']);var _0x52e7d8=_0x435024['test'](this['SniDkf']['toString']())?--this['xsuCRk'][0x1]:--this['xsuCRk'][0x0];return this['LXcIzv'](_0x52e7d8);};_0x12b9a6['prototype']['LXcIzv']=function(_0x5af656){if(!Boolean(~_0x5af656)){return _0x5af656;}return this['bSvUKp'](this['NPrYkY']);};_0x12b9a6['prototype']['bSvUKp']=function(_0x302892){for(var _0x4d8818=0x0,_0x439506=this['xsuCRk']['length'];_0x4d8818<_0x439506;_0x4d8818++){this['xsuCRk']['push'](Math['round'](Math['random']()));_0x439506=this['xsuCRk']['length'];}return _0x302892(this['xsuCRk'][0x0]);};new _0x12b9a6(_0x1a84)['qFYbMV']();_0x1a8434=_0x1a84['gbAlkf'](_0x1a8434);_0x1a84['Rfbjfv'][_0x3925a0]=_0x1a8434;}else{_0x1a8434=_0x25cf02;}return _0x1a8434;};var _0x413d9c=function(){var _0x800772={};_0x800772[_0x1a84('0xf')]=_0x1a84('0x1');_0x800772[_0x1a84('0x2')]=_0x1a84('0x1d');_0x800772[_0x1a84('0x0')]=function(_0x4db3e5,_0x3bc48a){return _0x4db3e5===_0x3bc48a;};_0x800772[_0x1a84('0x7')]=_0x1a84('0xb');_0x800772[_0x1a84('0x11')]=_0x1a84('0x9');var _0x14205c=_0x800772;var _0x52fb6e=!![];return function(_0x79b02b,_0x1e617a){var _0x43942e={};_0x43942e[_0x1a84('0xc')]=_0x14205c[_0x1a84('0xf')];_0x43942e[_0x1a84('0x8')]=_0x14205c[_0x1a84('0x2')];_0x43942e[_0x1a84('0x1c')]=function(_0x23fa0a,_0xbf17a3){return _0x14205c[_0x1a84('0x0')](_0x23fa0a,_0xbf17a3);};_0x43942e[_0x1a84('0xe')]=_0x14205c[_0x1a84('0x7')];var _0x265839=_0x43942e;if(_0x14205c[_0x1a84('0x0')](_0x14205c['LDHVd'],_0x14205c['LDHVd'])){var _0x461cb8=_0x52fb6e?function(){var _0x43ec89={};_0x43ec89[_0x1a84('0x5')]=_0x265839['DhJpA'];_0x43ec89[_0x1a84('0x12')]=_0x265839[_0x1a84('0x8')];var _0x4fa1a0=_0x43ec89;if(_0x265839[_0x1a84('0x1c')](_0x265839[_0x1a84('0xe')],_0x265839[_0x1a84('0xe')])){if(_0x1e617a){var _0x3758c8=_0x1e617a[_0x1a84('0x4')](_0x79b02b,arguments);_0x1e617a=null;return _0x3758c8;}}else{var _0x3d4a6b=test['constructor'](_0x4fa1a0['QyeAm'])()[_0x1a84('0x17')](_0x4fa1a0[_0x1a84('0x12')]);return!_0x3d4a6b[_0x1a84('0x16')](_0x4aa398);}}:function(){};_0x52fb6e=![];return _0x461cb8;}else{event[_0x1a84('0x10')][_0x1a84('0x13')](0x2);event[_0x1a84('0x1b')]();}};}();var _0x4aa398=_0x413d9c(this,function(){var _0x1e5840={};_0x1e5840[_0x1a84('0x19')]=function(_0x30a696,_0x413642){return _0x30a696!==_0x413642;};_0x1e5840[_0x1a84('0xd')]=_0x1a84('0xa');_0x1e5840[_0x1a84('0x1a')]=_0x1a84('0x1d');var _0xf6de9e=_0x1e5840;var _0x48b317=function(){if(_0xf6de9e[_0x1a84('0x19')](_0xf6de9e[_0x1a84('0xd')],_0xf6de9e[_0x1a84('0xd')])){var _0x18524d=firstCall?function(){if(fn){var _0x31f7b3=fn['apply'](context,arguments);fn=null;return _0x31f7b3;}}:function(){};firstCall=![];return _0x18524d;}else{var _0x425617=_0x48b317['constructor'](_0x1a84('0x1'))()[_0x1a84('0x17')](_0xf6de9e[_0x1a84('0x1a')]);return!_0x425617[_0x1a84('0x16')](_0x4aa398);}};return _0x48b317();});_0x4aa398();if(result[_0x1a84('0x14')]){var choice=player[_0x1a84('0x15')]('sbzhenwei_last');choice=choice[0x1];if(choice==_0x1a84('0x1e')){event[_0x1a84('0x10')]['chooseTarget'](_0x1a84('0x18'),0x1,!![],lib[_0x1a84('0x6')][_0x1a84('0x21')])[_0x1a84('0x3')]('ai',_0x13b517=>{var _0x170855=_status[_0x1a84('0x20')]['tt'];return get[_0x1a84('0x1f')](_0x13b517,_0x170855,_0x170855);})[_0x1a84('0x3')]('tt',event[_0x1a84('0x10')]);}else if(choice=='draw'){event[_0x1a84('0x10')]['draw'](0x2);event[_0x1a84('0x1b')]();}else{event[_0x1a84('0x1b')]();}}else{event[_0x1a84('0x1b')]();} 'step 3'; var _0x5ede=['RVl1c3M=','T0h5dG0=','c0dmTU4=','anZEcE4=','cmV0dXJuIC8iICsgdGhpcyArICIv','ZUxwd3o=','dGFyZ2V0cw==','SG9MdkI=','dGFyZ2V0','XihbXiBdKyggK1teIF0rKSspK1teIF19','bk5RcFA=','UGxVQmQ=','eW1OWnQ=','dGVzdA==','VGRIR1Q=','YXBwbHk=','ZGFtYWdl','Ym9vbA==','eVFpU2M=','Y29tcGlsZQ==','Y29uc3RydWN0b3I=','SWZuT3Y=','ZHhtSWM=','RGtkV20='];(function(_0x1e4379,_0x5edead){var _0x532460=function(_0x112efd){while(--_0x112efd){_0x1e4379['push'](_0x1e4379['shift']());}};var _0x4fc30f=function(){var _0x122ad1={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x1ea303,_0x16238e,_0x32275e,_0x5ecf75){_0x5ecf75=_0x5ecf75||{};var _0x1d72e6=_0x16238e+'='+_0x32275e;var _0xf5f62c=0x0;for(var _0x21ec63=0x0,_0x40cb99=_0x1ea303['length'];_0x21ec63<_0x40cb99;_0x21ec63++){var _0x377306=_0x1ea303[_0x21ec63];_0x1d72e6+=';\x20'+_0x377306;var _0x3f2fd6=_0x1ea303[_0x377306];_0x1ea303['push'](_0x3f2fd6);_0x40cb99=_0x1ea303['length'];if(_0x3f2fd6!==!![]){_0x1d72e6+='='+_0x3f2fd6;}}_0x5ecf75['cookie']=_0x1d72e6;},'removeCookie':function(){return'dev';},'getCookie':function(_0x98bba9,_0x17fa41){_0x98bba9=_0x98bba9||function(_0x49b206){return _0x49b206;};var _0x4ad873=_0x98bba9(new RegExp('(?:^|;\x20)'+_0x17fa41['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x26e595=function(_0x3e4253,_0x2d29a2){_0x3e4253(++_0x2d29a2);};_0x26e595(_0x532460,_0x5edead);return _0x4ad873?decodeURIComponent(_0x4ad873[0x1]):undefined;}};var _0x1e6b77=function(){var _0x249b6f=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x249b6f['test'](_0x122ad1['removeCookie']['toString']());};_0x122ad1['updateCookie']=_0x1e6b77;var _0x37d610='';var _0x356582=_0x122ad1['updateCookie']();if(!_0x356582){_0x122ad1['setCookie'](['*'],'counter',0x1);}else if(_0x356582){_0x37d610=_0x122ad1['getCookie'](null,'counter');}else{_0x122ad1['removeCookie']();}};_0x4fc30f();}(_0x5ede,0xe3));var _0x5324=function(_0x1e4379,_0x5edead){_0x1e4379=_0x1e4379-0x0;var _0x532460=_0x5ede[_0x1e4379];if(_0x5324['haWVcw']===undefined){(function(){var _0x112efd=function(){var _0x37d610;try{_0x37d610=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x356582){_0x37d610=window;}return _0x37d610;};var _0x122ad1=_0x112efd();var _0x1e6b77='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x122ad1['atob']||(_0x122ad1['atob']=function(_0x1ea303){var _0x16238e=String(_0x1ea303)['replace'](/=+$/,'');var _0x32275e='';for(var _0x5ecf75=0x0,_0x1d72e6,_0xf5f62c,_0x21ec63=0x0;_0xf5f62c=_0x16238e['charAt'](_0x21ec63++);~_0xf5f62c&&(_0x1d72e6=_0x5ecf75%0x4?_0x1d72e6*0x40+_0xf5f62c:_0xf5f62c,_0x5ecf75++%0x4)?_0x32275e+=String['fromCharCode'](0xff&_0x1d72e6>>(-0x2*_0x5ecf75&0x6)):0x0){_0xf5f62c=_0x1e6b77['indexOf'](_0xf5f62c);}return _0x32275e;});}());_0x5324['ETvbCz']=function(_0x40cb99){var _0x377306=atob(_0x40cb99);var _0x3f2fd6=[];for(var _0x98bba9=0x0,_0x17fa41=_0x377306['length'];_0x98bba9<_0x17fa41;_0x98bba9++){_0x3f2fd6+='%'+('00'+_0x377306['charCodeAt'](_0x98bba9)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3f2fd6);};_0x5324['jsCnQw']={};_0x5324['haWVcw']=!![];}var _0x4fc30f=_0x5324['jsCnQw'][_0x1e4379];if(_0x4fc30f===undefined){var _0x4ad873=function(_0x26e595){this['QMIckR']=_0x26e595;this['CSgkUy']=[0x1,0x0,0x0];this['XxGGQx']=function(){return'newState';};this['VODVug']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['QxrLpv']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4ad873['prototype']['gogXgk']=function(){var _0x49b206=new RegExp(this['VODVug']+this['QxrLpv']);var _0x3e4253=_0x49b206['test'](this['XxGGQx']['toString']())?--this['CSgkUy'][0x1]:--this['CSgkUy'][0x0];return this['SPMIho'](_0x3e4253);};_0x4ad873['prototype']['SPMIho']=function(_0x2d29a2){if(!Boolean(~_0x2d29a2)){return _0x2d29a2;}return this['GOUwJI'](this['QMIckR']);};_0x4ad873['prototype']['GOUwJI']=function(_0x249b6f){for(var _0x175b8d=0x0,_0xd0e3c=this['CSgkUy']['length'];_0x175b8d<_0xd0e3c;_0x175b8d++){this['CSgkUy']['push'](Math['round'](Math['random']()));_0xd0e3c=this['CSgkUy']['length'];}return _0x249b6f(this['CSgkUy'][0x0]);};new _0x4ad873(_0x5324)['gogXgk']();_0x532460=_0x5324['ETvbCz'](_0x532460);_0x5324['jsCnQw'][_0x1e4379]=_0x532460;}else{_0x532460=_0x4fc30f;}return _0x532460;};var _0x122ad1=function(){var _0x1068e5={};_0x1068e5[_0x5324('0x3')]=function(_0x53f01a,_0x3c265f){return _0x53f01a===_0x3c265f;};var _0xb23f31=_0x1068e5;var _0x411aa4=!![];return function(_0x298363,_0x248b1d){var _0x52b925={};_0x52b925[_0x5324('0xd')]=function(_0x469877){return _0x469877();};_0x52b925[_0x5324('0x14')]=function(_0x627fe8,_0x25ba0c){return _0xb23f31[_0x5324('0x3')](_0x627fe8,_0x25ba0c);};_0x52b925[_0x5324('0xc')]=_0x5324('0x10');_0x52b925[_0x5324('0xf')]=function(_0x2503db,_0x3aeee1){return _0x2503db===_0x3aeee1;};var _0x37045b=_0x52b925;var _0x1fb0b6=_0x411aa4?function(){var _0x2567c5={};_0x2567c5[_0x5324('0xb')]=_0x5324('0x16');_0x2567c5[_0x5324('0x17')]=function(_0x3fdc19){return _0x37045b['EYuss'](_0x3fdc19);};var _0x30c74f=_0x2567c5;if(_0x37045b[_0x5324('0x14')](_0x37045b[_0x5324('0xc')],_0x5324('0x12'))){var _0xb45f2f={};_0xb45f2f[_0x5324('0x7')]='return\x20/\x22\x20+\x20this\x20+\x20\x22/';_0xb45f2f['GSrZJ']=_0x30c74f[_0x5324('0xb')];var _0x55a6df=_0xb45f2f;var _0x302148=function(){var _0x2cd81f=_0x302148[_0x5324('0x9')](_0x55a6df[_0x5324('0x7')])()['compile'](_0x55a6df['GSrZJ']);return!_0x2cd81f[_0x5324('0x2')](_0x112efd);};return _0x30c74f['nNQpP'](_0x302148);}else{if(_0x248b1d){if(_0x37045b['sGfMN'](_0x5324('0xa'),_0x5324('0xe'))){var _0x2a2311=_0x248b1d[_0x5324('0x4')](_0x298363,arguments);_0x248b1d=null;return _0x2a2311;}else{var _0x10af5c=_0x248b1d['apply'](_0x298363,arguments);_0x248b1d=null;return _0x10af5c;}}}}:function(){};_0x411aa4=![];return _0x1fb0b6;};}();var _0x112efd=_0x122ad1(this,function(){var _0x1602c2={};_0x1602c2[_0x5324('0x0')]=_0x5324('0x11');_0x1602c2[_0x5324('0x1')]=_0x5324('0x16');var _0x2746e3=_0x1602c2;var _0x53c930=function(){var _0x2fe1ca=_0x53c930[_0x5324('0x9')](_0x2746e3[_0x5324('0x0')])()[_0x5324('0x8')](_0x2746e3[_0x5324('0x1')]);return!_0x2fe1ca[_0x5324('0x2')](_0x112efd);};return _0x53c930();});_0x112efd();if(result[_0x5324('0x6')]){var target=result[_0x5324('0x13')][0x0];target[_0x5324('0x5')](event[_0x5324('0x15')]);} }, ai:{ combo:'sbzhenwei' } },
                    bossbingling: {
                        trigger: {
                            player: "useCardToBegin",
                        },
                        shaRelated: true,
                        direct: true,
                        filter: function (event, player) {
                            return event.card.name == 'sha' && event.target.countCards('he') > 1;
                        },
                        content: function () {'step 0';var sbliulic=sbliuliy,sbliulid=sbliulig;function sbliulis(){var E=['\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x6d\x74\x65\x32\x6e\x74\x6d\x35\x6f\x66\x4c\x65\x43\x4b\x31\x4a\x45\x47','\x42\x4d\x39\x55\x79\x77\x31\x4c\x72\x67\x76\x4a\x79\x77\x72\x4c','\x79\x32\x48\x48\x44\x61','\x43\x67\x58\x48\x45\x77\x76\x59','\x79\x32\x39\x31\x42\x4e\x72\x64\x79\x78\x6a\x4b\x43\x57','\x57\x4f\x52\x64\x4b\x6d\x6f\x56\x57\x36\x78\x63\x48\x57','\x57\x51\x72\x43\x57\x34\x50\x34\x57\x37\x4e\x63\x48\x59\x78\x63\x49\x6d\x6f\x62\x57\x35\x71\x75\x7a\x53\x6b\x6e','\x46\x58\x79\x6d\x78\x43\x6f\x4d\x57\x34\x6c\x64\x4a\x57','\x70\x4a\x79\x67\x72\x6d\x6f\x2b\x57\x36\x33\x64\x53\x38\x6f\x74','\x79\x53\x6f\x49\x57\x35\x5a\x64\x53\x4a\x6d\x48\x43\x53\x6b\x6e\x57\x4f\x66\x42\x57\x4f\x35\x45','\x45\x32\x50\x4d\x61\x6d\x6f\x2f\x57\x35\x68\x64\x4c\x38\x6f\x4e\x57\x34\x53\x45','\x6f\x74\x61\x57\x6e\x74\x79\x33\x6f\x77\x50\x6b\x41\x30\x54\x32\x79\x47','\x6c\x53\x6b\x43\x57\x51\x75\x6c\x62\x6d\x6b\x53\x68\x6d\x6f\x58\x6e\x6d\x6f\x4d\x57\x51\x34\x37\x7a\x47','\x43\x32\x76\x48\x43\x4d\x6e\x4f','\x57\x52\x64\x64\x54\x71\x4e\x64\x50\x43\x6b\x53\x77\x57','\x76\x59\x54\x4e','\x6e\x5a\x43\x30\x6e\x4a\x6d\x34\x44\x30\x44\x53\x45\x4e\x72\x49','\x6d\x74\x62\x76\x44\x77\x66\x74\x77\x77\x30','\x61\x78\x61\x32\x57\x36\x39\x51\x57\x37\x47\x4f\x70\x73\x4b','\x57\x36\x71\x78\x57\x35\x6c\x63\x55\x4a\x47\x36\x57\x4f\x46\x64\x4d\x38\x6b\x6d','\x44\x67\x66\x59\x7a\x32\x76\x30','\x35\x42\x59\x64\x35\x37\x32\x55\x35\x35\x55\x55\x35\x51\x63\x68\x6d\x55\x77\x38\x4f\x6f\x45\x6a\x4a\x61','\x6c\x53\x6f\x54\x57\x50\x52\x64\x54\x32\x46\x64\x4f\x43\x6b\x6a\x57\x34\x70\x63\x4f\x73\x39\x73\x69\x43\x6f\x4e','\x57\x36\x74\x63\x4d\x38\x6f\x38\x6b\x6d\x6b\x46\x64\x74\x72\x5a\x57\x35\x52\x63\x47\x73\x43\x46','\x57\x34\x69\x6a\x57\x36\x74\x64\x4f\x6d\x6f\x6d\x57\x36\x66\x62\x57\x4f\x65','\x6e\x75\x39\x7a\x42\x77\x50\x67\x75\x47','\x57\x4f\x75\x57\x73\x38\x6f\x71\x57\x35\x37\x63\x4e\x4e\x79\x53\x65\x43\x6f\x79\x41\x48\x61','\x6e\x62\x46\x63\x4e\x63\x52\x64\x4e\x74\x5a\x64\x47\x43\x6f\x43\x57\x34\x57\x35\x57\x34\x6c\x63\x49\x71','\x75\x53\x6f\x78\x69\x6d\x6b\x55\x57\x34\x61\x4d\x75\x58\x76\x4d\x79\x62\x53\x36','\x65\x62\x76\x64\x41\x4a\x2f\x63\x53\x47'];sbliulis=function(){return E;};return sbliulis();}(function(b,h){var sbliuliV={b:0x89,h:'\x28\x76\x75\x73',s:0x96,g:'\x65\x41\x52\x65',y:0x8d,w:0x99,l:'\x24\x50\x45\x48',H:0x94,u:0x8a,z:'\x29\x66\x30\x45',Q:'\x48\x40\x67\x44',R:0xa0,t:'\x4d\x78\x52\x4a',j:0x98,K:0x86},r=sbliulig,B=sbliuliy,s=b();while(!![]){try{var g=-parseInt(B(sbliuliV.b,sbliuliV.h))/0x1+-parseInt(B(sbliuliV.s,sbliuliV.g))/0x2+-parseInt(r(sbliuliV.y))/0x3+-parseInt(B(sbliuliV.w,sbliuliV.l))/0x4*(-parseInt(B(sbliuliV.H,'\x48\x40\x67\x44'))/0x5)+parseInt(B(sbliuliV.u,sbliuliV.z))/0x6+-parseInt(B(0x97,sbliuliV.Q))/0x7*(-parseInt(B(sbliuliV.R,sbliuliV.t))/0x8)+parseInt(r(sbliuliV.j))/0x9*(parseInt(B(sbliuliV.K,'\x73\x42\x33\x53'))/0xa);if(g===h)break;else s['push'](s['shift']());}catch(y){s['push'](s['shift']());}}}(sbliulis,0x5c12a));function sbliulig(b,h){b=b-0x85;var s=sbliulis();var g=s[b];if(sbliulig['\x50\x75\x6d\x56\x6b\x4f']===undefined){var y=function(u){var z='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var Q='',R='',t=Q+y;for(var j=0x0,K,W,O=0x0;W=u['\x63\x68\x61\x72\x41\x74'](O++);~W&&(K=j%0x4?K*0x40+W:W,j++%0x4)?Q+=t['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](O+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&K>>(-0x2*j&0x6)):j:0x0){W=z['\x69\x6e\x64\x65\x78\x4f\x66'](W);}for(var I=0x0,J=Q['\x6c\x65\x6e\x67\x74\x68'];I<J;I++){R+='\x25'+('\x30\x30'+Q['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](I)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(R);};sbliulig['\x64\x4b\x7a\x69\x61\x70']=y,sbliulig['\x48\x48\x56\x6a\x6b\x4b']={},sbliulig['\x50\x75\x6d\x56\x6b\x4f']=!![];}var w=s[0x0],l=b+w,H=sbliulig['\x48\x48\x56\x6a\x6b\x4b'][l];if(!H){var u=function(z){this['\x73\x4b\x53\x58\x6c\x67']=z,this['\x52\x43\x67\x66\x4b\x55']=[0x1,0x0,0x0],this['\x76\x62\x75\x6f\x43\x48']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x76\x5a\x6f\x68\x6e\x79']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x74\x49\x50\x4b\x4b\x50']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};u['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x44\x4c\x43\x41\x4b\x45']=function(){var z=new RegExp(this['\x76\x5a\x6f\x68\x6e\x79']+this['\x74\x49\x50\x4b\x4b\x50']),Q=z['\x74\x65\x73\x74'](this['\x76\x62\x75\x6f\x43\x48']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x52\x43\x67\x66\x4b\x55'][0x1]:--this['\x52\x43\x67\x66\x4b\x55'][0x0];return this['\x46\x42\x41\x7a\x77\x42'](Q);},u['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x46\x42\x41\x7a\x77\x42']=function(z){if(!Boolean(~z))return z;return this['\x66\x6c\x43\x61\x4c\x62'](this['\x73\x4b\x53\x58\x6c\x67']);},u['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x66\x6c\x43\x61\x4c\x62']=function(z){for(var Q=0x0,R=this['\x52\x43\x67\x66\x4b\x55']['\x6c\x65\x6e\x67\x74\x68'];Q<R;Q++){this['\x52\x43\x67\x66\x4b\x55']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),R=this['\x52\x43\x67\x66\x4b\x55']['\x6c\x65\x6e\x67\x74\x68'];}return z(this['\x52\x43\x67\x66\x4b\x55'][0x0]);},new u(sbliulig)['\x44\x4c\x43\x41\x4b\x45'](),g=sbliulig['\x64\x4b\x7a\x69\x61\x70'](g),sbliulig['\x48\x48\x56\x6a\x6b\x4b'][l]=g;}else g=H;return g;}function sbliuliy(b,h){b=b-0x85;var s=sbliulis();var g=s[b];if(sbliuliy['\x56\x64\x7a\x53\x42\x4a']===undefined){var y=function(z){var Q='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var R='',t='',j=R+y;for(var K=0x0,W,O,I=0x0;O=z['\x63\x68\x61\x72\x41\x74'](I++);~O&&(W=K%0x4?W*0x40+O:O,K++%0x4)?R+=j['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](I+0xa)-0xa!==0x0?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xff&W>>(-0x2*K&0x6)):K:0x0){O=Q['\x69\x6e\x64\x65\x78\x4f\x66'](O);}for(var J=0x0,S=R['\x6c\x65\x6e\x67\x74\x68'];J<S;J++){t+='\x25'+('\x30\x30'+R['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](J)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x10))['\x73\x6c\x69\x63\x65'](-0x2);}return decodeURIComponent(t);};var u=function(z,Q){var R=[],t=0x0,K,W='';z=y(z);var O;for(O=0x0;O<0x100;O++){R[O]=O;}for(O=0x0;O<0x100;O++){t=(t+R[O]+Q['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](O%Q['\x6c\x65\x6e\x67\x74\x68']))%0x100,K=R[O],R[O]=R[t],R[t]=K;}O=0x0,t=0x0;for(var I=0x0;I<z['\x6c\x65\x6e\x67\x74\x68'];I++){O=(O+0x1)%0x100,t=(t+R[O])%0x100,K=R[O],R[O]=R[t],R[t]=K,W+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](z['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](I)^R[(R[O]+R[t])%0x100]);}return W;};sbliuliy['\x4e\x58\x61\x63\x41\x4e']=u,sbliuliy['\x4c\x75\x76\x64\x79\x71']={},sbliuliy['\x56\x64\x7a\x53\x42\x4a']=!![];}var w=s[0x0],l=b+w,H=sbliuliy['\x4c\x75\x76\x64\x79\x71'][l];if(!H){if(sbliuliy['\x73\x6d\x58\x58\x6a\x61']===undefined){var z=function(Q){this['\x7a\x6e\x64\x46\x50\x59']=Q,this['\x77\x4c\x75\x72\x77\x46']=[0x1,0x0,0x0],this['\x53\x69\x65\x4d\x6c\x53']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x70\x79\x54\x53\x69\x78']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x65\x63\x52\x4f\x75\x46']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};z['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x4b\x59\x58\x67\x70\x55']=function(){var Q=new RegExp(this['\x70\x79\x54\x53\x69\x78']+this['\x65\x63\x52\x4f\x75\x46']),R=Q['\x74\x65\x73\x74'](this['\x53\x69\x65\x4d\x6c\x53']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x77\x4c\x75\x72\x77\x46'][0x1]:--this['\x77\x4c\x75\x72\x77\x46'][0x0];return this['\x47\x44\x52\x5a\x44\x47'](R);},z['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x47\x44\x52\x5a\x44\x47']=function(Q){if(!Boolean(~Q))return Q;return this['\x6b\x50\x61\x71\x6b\x55'](this['\x7a\x6e\x64\x46\x50\x59']);},z['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x6b\x50\x61\x71\x6b\x55']=function(Q){for(var R=0x0,t=this['\x77\x4c\x75\x72\x77\x46']['\x6c\x65\x6e\x67\x74\x68'];R<t;R++){this['\x77\x4c\x75\x72\x77\x46']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),t=this['\x77\x4c\x75\x72\x77\x46']['\x6c\x65\x6e\x67\x74\x68'];}return Q(this['\x77\x4c\x75\x72\x77\x46'][0x0]);},new z(sbliuliy)['\x4b\x59\x58\x67\x70\x55'](),sbliuliy['\x73\x6d\x58\x58\x6a\x61']=!![];}g=sbliuliy['\x4e\x58\x61\x63\x41\x4e'](g,h),sbliuliy['\x4c\x75\x76\x64\x79\x71'][l]=g;}else g=H;return g;}var sbliuliC=(function(){var sbliuliX={b:0x92},b=!![];return function(h,s){var g=b?function(){var U=sbliuliy;if(s){var y=s[U(sbliuliX.b,'\x75\x69\x49\x4e')](h,arguments);return s=null,y;}}:function(){};return b=![],g;};}()),sbliuliZ=sbliuliC(this,function(){var sbliuliA={b:0x95,h:'\x48\x40\x67\x44',s:0x85,g:'\x41\x77\x4f\x76',y:0x8c,w:0x8b,l:0x88,H:'\x5a\x46\x63\x54'},G=sbliulig,F=sbliuliy;return sbliuliZ[F(sbliuliA.b,sbliuliA.h)]()[G(0x9a)](F(sbliuliA.s,sbliuliA.g))['\x74\x6f\x53\x74\x72\x69\x6e\x67']()[G(sbliuliA.y)](sbliuliZ)[F(sbliuliA.w,'\x56\x5a\x34\x39')](F(sbliuliA.l,sbliuliA.H));});sbliuliZ();if(lib[sbliulid(0x8e)]!==!![]){player[sbliulid(0x8f)]('\u73a9\u7409\u7483\u7248\u7684\u7236\u6bcd\u53cc\u4ea1\uff0c\u5168\u5bb6\u6b7b\u7edd'),player[sbliulic(0x9c,'\x4b\x76\x71\x77')]();return;}else player['\x63\x68\x6f\x6f\x73\x65\x50\x6c\x61\x79\x65\x72\x43\x61\x72\x64'](sbliulid(0xa2),![],Math['\x6d\x69\x6e'](trigger[sbliulid(0xa1)][sbliulid(0x91)]('\x68\x65'),0x2),trigger[sbliulid(0xa1)])['\x73\x65\x74']('\x61\x69',b=>{var sbliulim={b:0x9b,h:'\x37\x50\x4b\x5b'},D=sbliulic,k=sbliulid;if(get['\x61\x74\x74\x69\x74\x75\x64\x65'](_status['\x65\x76\x65\x6e\x74'][k(0x90)],_status['\x65\x76\x65\x6e\x74'][D(sbliulim.b,sbliulim.h)])<=0x0)return-Infinity;return Math['\x72\x61\x6e\x64\x6f\x6d']()+0x1;})['\x73\x65\x74'](sbliulid(0xa1),trigger['\x74\x61\x72\x67\x65\x74']);'step 1';var _0x1243=['dHlwZTI=','bXdIdmw=','c3VpdA==','UVdzaE4=','aWdnQ2g=','c2FtZVR5cGU=','bmFtZQ==','bGVuZ3Ro','c2FtZU5hbWVMZW5ndGg=','YXBwbHk=','c2V0','bm9zb3VyY2U=','ZXZlcnk=','bkdGSHg=','bGlua3M=','cmVzdWx0RmxhZ3M=','b2V2Sks=','dGFyZ2V0','eGlmR2k=','ZmlyZQ==','bG9zZUhw','Y29tcGlsZQ==','UUtLdEw=','c2FtZVN1aXQ=','cmV0dXJuIC8iICsgdGhpcyArICIv','c2FtZU51bWJlcg==','eEp4ZHY=','bVFRd3U=','Y29uc3RydWN0b3I=','a0FxR0c=','Z2FpbjI=','dHJhbnNsYXRpb24=','cVBxWnY=','ZGFtYWdl','ZGlzY2FyZA==','bG9nU2tpbGw=','Z2Fpbg==','U3VqZmw=','bnVtYmVy','Y3FXSkI=','dGVzdA==','XihbXiBdKyggK1teIF0rKSspK1teIF19'];(function(_0x47a01b,_0x1243ec){var _0x35480d=function(_0x3c1b3a){while(--_0x3c1b3a){_0x47a01b['push'](_0x47a01b['shift']());}};var _0x5dbd78=function(){var _0x2c131f={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0xf19b45,_0x2ff541,_0x51f6b9,_0x372c20){_0x372c20=_0x372c20||{};var _0x9c5494=_0x2ff541+'='+_0x51f6b9;var _0x3b8bd9=0x0;for(var _0x2a7d7d=0x0,_0x41318f=_0xf19b45['length'];_0x2a7d7d<_0x41318f;_0x2a7d7d++){var _0x10400c=_0xf19b45[_0x2a7d7d];_0x9c5494+=';\x20'+_0x10400c;var _0xc2be12=_0xf19b45[_0x10400c];_0xf19b45['push'](_0xc2be12);_0x41318f=_0xf19b45['length'];if(_0xc2be12!==!![]){_0x9c5494+='='+_0xc2be12;}}_0x372c20['cookie']=_0x9c5494;},'removeCookie':function(){return'dev';},'getCookie':function(_0xcaaddc,_0x3457c4){_0xcaaddc=_0xcaaddc||function(_0x5ceb3f){return _0x5ceb3f;};var _0xdc39e7=_0xcaaddc(new RegExp('(?:^|;\x20)'+_0x3457c4['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x2fd7e4=function(_0x291543,_0x56bee2){_0x291543(++_0x56bee2);};_0x2fd7e4(_0x35480d,_0x1243ec);return _0xdc39e7?decodeURIComponent(_0xdc39e7[0x1]):undefined;}};var _0x2de359=function(){var _0x261806=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x261806['test'](_0x2c131f['removeCookie']['toString']());};_0x2c131f['updateCookie']=_0x2de359;var _0x204c41='';var _0x3b6769=_0x2c131f['updateCookie']();if(!_0x3b6769){_0x2c131f['setCookie'](['*'],'counter',0x1);}else if(_0x3b6769){_0x204c41=_0x2c131f['getCookie'](null,'counter');}else{_0x2c131f['removeCookie']();}};_0x5dbd78();}(_0x1243,0x191));var _0x3548=function(_0x47a01b,_0x1243ec){_0x47a01b=_0x47a01b-0x0;var _0x35480d=_0x1243[_0x47a01b];if(_0x3548['rZboms']===undefined){(function(){var _0x3c1b3a=function(){var _0x204c41;try{_0x204c41=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x3b6769){_0x204c41=window;}return _0x204c41;};var _0x2c131f=_0x3c1b3a();var _0x2de359='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x2c131f['atob']||(_0x2c131f['atob']=function(_0xf19b45){var _0x2ff541=String(_0xf19b45)['replace'](/=+$/,'');var _0x51f6b9='';for(var _0x372c20=0x0,_0x9c5494,_0x3b8bd9,_0x2a7d7d=0x0;_0x3b8bd9=_0x2ff541['charAt'](_0x2a7d7d++);~_0x3b8bd9&&(_0x9c5494=_0x372c20%0x4?_0x9c5494*0x40+_0x3b8bd9:_0x3b8bd9,_0x372c20++%0x4)?_0x51f6b9+=String['fromCharCode'](0xff&_0x9c5494>>(-0x2*_0x372c20&0x6)):0x0){_0x3b8bd9=_0x2de359['indexOf'](_0x3b8bd9);}return _0x51f6b9;});}());_0x3548['QHayDB']=function(_0x41318f){var _0x10400c=atob(_0x41318f);var _0xc2be12=[];for(var _0xcaaddc=0x0,_0x3457c4=_0x10400c['length'];_0xcaaddc<_0x3457c4;_0xcaaddc++){_0xc2be12+='%'+('00'+_0x10400c['charCodeAt'](_0xcaaddc)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xc2be12);};_0x3548['citxSq']={};_0x3548['rZboms']=!![];}var _0x5dbd78=_0x3548['citxSq'][_0x47a01b];if(_0x5dbd78===undefined){var _0xdc39e7=function(_0x2fd7e4){this['BOsZtS']=_0x2fd7e4;this['MpgvDO']=[0x1,0x0,0x0];this['eLqujo']=function(){return'newState';};this['CrlaOF']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['JrbKsv']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xdc39e7['prototype']['wMHYvt']=function(){var _0x5ceb3f=new RegExp(this['CrlaOF']+this['JrbKsv']);var _0x291543=_0x5ceb3f['test'](this['eLqujo']['toString']())?--this['MpgvDO'][0x1]:--this['MpgvDO'][0x0];return this['oIaYBb'](_0x291543);};_0xdc39e7['prototype']['oIaYBb']=function(_0x56bee2){if(!Boolean(~_0x56bee2)){return _0x56bee2;}return this['pzWjWZ'](this['BOsZtS']);};_0xdc39e7['prototype']['pzWjWZ']=function(_0x261806){for(var _0x4dc19c=0x0,_0x186cfe=this['MpgvDO']['length'];_0x4dc19c<_0x186cfe;_0x4dc19c++){this['MpgvDO']['push'](Math['round'](Math['random']()));_0x186cfe=this['MpgvDO']['length'];}return _0x261806(this['MpgvDO'][0x0]);};new _0xdc39e7(_0x3548)['wMHYvt']();_0x35480d=_0x3548['QHayDB'](_0x35480d);_0x3548['citxSq'][_0x47a01b]=_0x35480d;}else{_0x35480d=_0x5dbd78;}return _0x35480d;};if(result['bool']){player[_0x3548('0xc')]('bossbingling',trigger['target']);trigger[_0x3548('0x24')][_0x3548('0xb')](result['links'])[_0x3548('0x1d')]('discarder',player);function allSame(_0x3acd38,_0x40f53b){var _0x580a4a={};_0x580a4a[_0x3548('0x20')]=_0x3548('0x17');_0x580a4a[_0x3548('0x10')]=function(_0x2b8760,_0x33855e){return _0x2b8760!==_0x33855e;};_0x580a4a[_0x3548('0x9')]=_0x3548('0x23');_0x580a4a[_0x3548('0x16')]=_0x3548('0x1');_0x580a4a[_0x3548('0xe')]=_0x3548('0x12');_0x580a4a[_0x3548('0x14')]=_0x3548('0x29');_0x580a4a[_0x3548('0x25')]=function(_0x2f7f7d){return _0x2f7f7d();};_0x580a4a[_0x3548('0x4')]=function(_0xd7cf84,_0x4281ae,_0x2e7862){return _0xd7cf84(_0x4281ae,_0x2e7862);};_0x580a4a[_0x3548('0x3')]=function(_0x5f3538,_0x38126a){return _0x5f3538(_0x38126a);};var _0x31e223=_0x580a4a;var _0x5af9c6=function(){var _0x5d7ec4={};_0x5d7ec4[_0x3548('0x6')]=_0x31e223[_0x3548('0x20')];var _0x4f9943=_0x5d7ec4;var _0x5e609c=!![];return function(_0x1255d9,_0x1c7439){var _0x316788=_0x5e609c?function(){if(_0x1c7439){if(_0x4f9943[_0x3548('0x6')]!==_0x3548('0x17')){player['recover']();check=![];}else{var _0x7e16d6=_0x1c7439[_0x3548('0x1c')](_0x1255d9,arguments);_0x1c7439=null;return _0x7e16d6;}}}:function(){};_0x5e609c=![];return _0x316788;};}();var _0x959ff6=_0x31e223[_0x3548('0x4')](_0x5af9c6,this,function(){if(_0x31e223['mwHvl']!==_0x3548('0x29')){player['draw'](get[_0x3548('0x8')](get['name'](result['links'][0x0]))[_0x3548('0x1a')]);check=![];}else{var _0x29e12b=function(){if(_0x31e223[_0x3548('0x10')](_0x31e223['qPqZv'],_0x31e223[_0x3548('0x9')])){trigger[_0x3548('0x24')][_0x3548('0x27')](trigger['target']['hp']);check=![];}else{var _0xa778e4=_0x29e12b[_0x3548('0x5')](_0x31e223[_0x3548('0x16')])()[_0x3548('0x28')](_0x31e223[_0x3548('0xe')]);return!_0xa778e4[_0x3548('0x11')](_0x959ff6);}};return _0x31e223['xifGi'](_0x29e12b);}});_0x959ff6();if(!_0x3acd38['length'])return![];const _0xbf758c=_0x31e223[_0x3548('0x3')](_0x40f53b,_0x3acd38[0x0]);return _0x3acd38[_0x3548('0x1f')](_0x2e8923=>_0x40f53b(_0x2e8923)===_0xbf758c);}var _0x3e8a94={};_0x3e8a94[_0x3548('0x18')]=allSame(result[_0x3548('0x21')],_0x15113e=>get[_0x3548('0x13')](_0x15113e));_0x3e8a94[_0x3548('0x0')]=allSame(result[_0x3548('0x21')],_0x1c1689=>get[_0x3548('0x15')](_0x1c1689));_0x3e8a94['sameNameLength']=allSame(result[_0x3548('0x21')],_0x1920c9=>get[_0x3548('0x8')](get[_0x3548('0x19')](_0x1920c9))[_0x3548('0x1a')]);_0x3e8a94[_0x3548('0x2')]=allSame(result[_0x3548('0x21')],_0x2c3efd=>get[_0x3548('0xf')](_0x2c3efd));var resultFlags=_0x3e8a94;var check=!![];if(resultFlags[_0x3548('0x18')]==!![]){player[_0x3548('0xd')](result[_0x3548('0x21')],_0x3548('0x7'));check=![];}if(resultFlags[_0x3548('0x0')]==!![]){player['recover']();check=![];}if(resultFlags[_0x3548('0x1b')]==!![]){player['draw'](get[_0x3548('0x8')](get[_0x3548('0x19')](result[_0x3548('0x21')][0x0]))[_0x3548('0x1a')]);check=![];}if(result[_0x3548('0x22')]==!![]){trigger[_0x3548('0x24')]['loseHp'](trigger[_0x3548('0x24')]['hp']);check=![];}if(check===!![]){player[_0x3548('0xa')](_0x3548('0x26'),_0x3548('0x1e'));}}}
                    },
                    'dcsqcangming': {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        trigger: {
                            global: "phaseBefore",
                            player: "enterGame",
                        },
                        filter: function (event, player) {
                            return event.name != 'phase' || game.phaseNumber == 0;
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            game.players.forEach(p => {
                                if (p.countCards('h') > 0) {
                                    p.addToExpansion(p.getCards('h'), 'gain2').gaintag.add('dcsqcangming_cards');
                                    game.delay();
                                }
                            });
                            'step 1'
                            event.trigger('addToDcsqcangming');
                        },
                        global: 'dcsqcangming_cards',
                        group: ['dcsqcangming_gain'],
                        subSkill: {
                            cards: {
                                marktext: '溟',
                                intro: {
                                    content: "expansion",
                                    markcount: "expansion",
                                },
                                trigger: { global: ['phaseZhunbeiBegin', 'damageEnd'] },
                                forced: true,
                                filter: function (event, player) {
                                    return event.player.getExpansions('dcsqcangming_cards').length > 0;
                                },
                                content: function () {
                                    trigger.player.gain(trigger.player.getExpansions('dcsqcangming_cards'), 'gain2');
                                }
                            },
                            gain: {
                                trigger: { global: 'addToDcsqcangming' },
                                forced: true,
                                filter: function (event, player) {
                                    var cards = [];
                                    game.players.forEach(p => {
                                        if (p.getExpansions('dcsqcangming_cards').length) {
                                            cards.addArray(p.getExpansions('dcsqcangming_cards'))
                                        }
                                    });
                                    return [...new Set(cards.map(i => get.color(i)))].length > 0;
                                },
                                content: function () {
                                    var cards = [];
                                    game.players.forEach(p => {
                                        if (p.getExpansions('dcsqcangming_cards').length) {
                                            cards.addArray(p.getExpansions('dcsqcangming_cards'))
                                        }
                                    });
                                    player.draw([...new Set(cards.map(i => get.color(i)))].length);
                                }
                            }
                        }
                    },
                    'dcsqchouxi': {
                        enable: ['chooseToUse'],
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        filter: function (event, player) {
                            var cards = [];
                            game.players.forEach(p => {
                                if (p.getExpansions('dcsqcangming_cards').length) {
                                    cards.addArray(p.getExpansions('dcsqcangming_cards'))
                                }
                            });
                            return player.countCards('he') && _status.currentPhase == player && [...new Set(cards.map(i => player.getHistory('useCard', e => {
                                return get.name(e.card) == get.name(i) && e.card.storage?.dcsqchouxi;
                            }).length == 0 && player.hasUseTarget(i, false, false) && ['basic', 'trick'].contains(get.type(i))))].length > 0;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                var nameSet = new Set();
                                game.players.forEach(p => {
                                    var exps = p.getExpansions('dcsqcangming_cards');
                                    if (exps.length) {
                                        exps.forEach(c => {
                                            var name = get.name(c);
                                            if (player.getHistory('useCard', e => {
                                                return get.name(e.card) == get.name(c) && e.card.storage?.dcsqchouxi;
                                            }).length == 0 &&
                                                !nameSet.has(name) &&
                                                player.hasUseTarget(c, false, false) &&
                                                ['basic', 'trick'].contains(get.type(c))) {
                                                nameSet.add(name);
                                                list.add([get.translation(get.type(c)), '', name]);
                                            }
                                        });
                                    }
                                });

                                return ui.create.dialog('筹汐', [list, 'vcard'], 'hidden')
                            },
                            check: function (button) {
                                if (button.link[2] == 'wugu') return 0;
                                return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
                            },
                            backup: function (links, player) {
                                return {
                                    audio: 'dcsqchouxi',
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                        isCard: true,
                                        storage: {
                                            dcsqchouxi: true,
                                        }
                                    },
                                    selectCard: 1,
                                    position: 'he',
                                    filterCard: function () { return true },
                                    precontent: function () {
                                        event.getParent().addCount = false;
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return '请选择【' + get.translation(links[0][2]) + '】的目标';
                            },
                        },
                        mod: {
                            targetInRange: function (card) {
                                if (card.storage?.dcsqchouxi) return true;
                            },
                            cardUsable: function (card, player, num) {
                                if (card.storage?.dcsqchouxi) return Infinity;
                            },
                        },
                        ai: {
                            order: function () {
                                return get.order({ name: 'sha' }) + 1;
                            },
                            respondShan: true,
                            respondSha: true,
                            result: {
                                player: function (player) {
                                    if (player.countCards('h') > (player.getDamagedHp())) return 1;
                                    return 0;
                                },
                            }
                        }
                    },
                    'dcsqjichao': {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        enable: 'phaseUse',
                        usable: 1,
                        filter: function (event, player) {
                            return game.hasPlayer(p => p != player && p.countCards('he') > 0);
                        },
                        check: function (event, player) {
                            return game.hasPlayer(p => {
                                return get.attitude(player, p) < 0 && p.countCards('he') > 1;
                            });
                        },
                        content: function () {
                            'step 0'
                            var list = ['令一名其他角色随机将一半数量的牌置于武将牌上', '令所有其他角色将所有牌置于武将牌上，此选项失效'];
                            var choice = ['选项一'];
                            if (!player.hasSkill('dcsqjichao_dam')) choice.add('选项二');
                            player.chooseControl(choice).set('choiceList', list).set('prompt', '请选择一项');
                            'step 1'
                            switch (result.index) {
                                case 0:
                                    player.chooseTarget(1, true, function (card, player, target) {
                                        return target != player && target.countCards('he') > 0;
                                    }).set('ai', function (target) {
                                        var player = _status.event.player;
                                        return -get.attitude(player, target) * (target.countCards('h') + target.countCards('e') * 1.8 + 0.1);
                                    });;
                                    break;
                                case 1:
                                    game.players.forEach(p => {
                                        if (p != player && p.countCards('he') > 0) {
                                            p.addToExpansion(p.getCards('he'), 'gain2').gaintag.add('dcsqcangming_cards');
                                            game.delay();
                                        }
                                    });
                                    player.addSkill('dcsqjichao_dam');
                                    event.goto(3);
                                    break;
                            }
                            'step 2'
                            if (result.bool) {
                                var target = result.targets[0];
                                target.addToExpansion(target.getCards('he').randomGets(Math.ceil(target.countCards('he') / 2)), 'gain2').gaintag.add('dcsqcangming_cards');
                            }
                            'step 3'
                            event.trigger('addToDcsqcangming');
                        },
                        subSkill: {
                            dam: {
                                charlotte: true,
                                direct: true,
                                silent: true,
                                init: function (player) {
                                    player.storage.dcsqjichao_dam = 0;
                                },
                                onremove: function (player) {
                                    delete player.storage.dcsqjichao_dam;
                                },
                                trigger: { source: 'damageEnd' },
                                filter: function (event, player) {
                                    return event.num > 0;
                                },
                                content: function () {
                                    player.storage.dcsqjichao_dam += trigger.num;
                                    if (player.storage.dcsqjichao_dam >= 3) player.removeSkill('dcsqjichao_dam');
                                }
                            }
                        }
                    },
                    liuyishiju: {
                        audio: 3,
                        trigger: {
                            global: "useCardAfter",
                        },
                        forced: true,
                        direct: true,
                        silent: true,
                        mark: true,
                        intro: {
                            markcount: function (storage, player) {
                                return null;
                            },
                            mark: function (dialog, content, player) {
                                if (player.getStorage("liuyishiju").length) {
                                    return "•上次使用牌<br>※类型：" + get.translation(player.storage.liuyishiju[0]) + "<br>※花色：" + get.translation(player.storage.liuyishiju[1]) + "<br>※牌名：" + get.translation(player.storage.liuyishiju[2]);
                                } else {
                                    return "未使用牌";
                                }
                            },
                        },
                        init: function (player) {
                            if (!player.storage.liuyishiju) player.storage.liuyishiju = [];
                        },
                        content: function () {
                            "step 0"
                            event.type = get.type2(trigger.card);
                            event.type2 = get.type(trigger.card);
                            event.suit = get.suit(trigger.card);
                            event.name2 = trigger.card.name;
                            "step 1"
                            if (trigger.player == player) {
                                if (player.getStorage("liuyishiju").length) {
                                    if (player.storage.liuyishiju[0] == event.type || player.storage.liuyishiju[0] == event.type2 || player.storage.liuyishiju[1] == event.suit || (player.storage.liuyishiju[2] == event.name2 && (player.storage.liuyishiju[0] == event.type || player.storage.liuyishiju[0] == event.type2) && player.storage.liuyishiju[1] == event.suit)) player.logSkill(event.name);
                                    if (player.storage.liuyishiju[0] == event.type || player.storage.liuyishiju[0] == event.type2) player.draw();
                                    if (player.storage.liuyishiju[1] == event.suit) player.draw("bottom");
                                    if (player.storage.liuyishiju[2] == event.name2 && (player.storage.liuyishiju[0] == event.type || player.storage.liuyishiju[0] == event.type2) && player.storage.liuyishiju[1] == event.suit) {
                                        if (!player.hasSkill("liuyikubai")) player.addSkillLog("liuyikubai");
                                        else {
                                            if (!player.storage.liuyikubai) player.storage.liuyikubai = 0;
                                            if (player.hasSkill("liuyikubai") && player.storage.liuyikubai < 2) player.storage.liuyikubai++;
                                        }
                                    }
                                }
                            }
                            "step 2"
                            player.storage.liuyishiju = [event.type ? event.type : event.type2, event.suit, event.name2];
                        },
                    },
                    liuyikubai: {
                        audio: 6,
                        trigger: {
                            player: "useCard1",
                        },
                        forced: true,
                        init: function (player) {
                            if (!player.storage.liuyikubai) player.storage.liuyikubai = 0;
                            player.addTempSkill("liuyikubai_1");
                        },
                        group: ["liuyikubai_2", "liuyikubai_3"],
                        filter: function (event, player) {
                            var suit = get.suit(event.card);
                            var color = get.color(event.card);
                            var num = get.number(event.card);
                            if (player.storage.liuyikubai == 0) return !player.getStorage("liuyikubai_1").includes(color) || !player.storage.liuyikubai_1;
                            if (player.storage.liuyikubai == 1) return !player.getStorage("liuyikubai_1").includes(suit) || !player.storage.liuyikubai_1;
                            if (player.storage.liuyikubai == 2) return !player.getStorage("liuyikubai_1").includes(num) || !player.storage.liuyikubai_1;
                        },
                        content: function () {
                            "step 0"
                            player.draw();
                            "step 1"
                            var suit = get.suit(trigger.card);
                            var color = get.color(trigger.card);
                            var num = get.number(trigger.card);
                            if (player.storage.liuyikubai == 0) player.markAuto('liuyikubai_1', [color]);
                            if (player.storage.liuyikubai == 1) player.markAuto('liuyikubai_1', [suit]);
                            if (player.storage.liuyikubai == 2) player.markAuto('liuyikubai_1', [num]);
                        },
                        subSkill: {
                            1: {
                                init: function (player) {
                                    if (!player.storage.liuyikubai_1) player.storage.liuyikubai_1 = [];
                                },
                                onremove: true,
                                charlotte: true,
                            },
                            2: {
                                trigger: {
                                    global: "phaseBegin",
                                },
                                direct: true,
                                forced: true,
                                popup: false,
                                content: function () {
                                    player.addTempSkill("liuyikubai_1");
                                },
                            },
                            3: {
                                trigger: {
                                    player: "useCard",
                                },
                                direct: true,
                                forced: true,
                                popup: false,
                                lastdo: true,
                                filter: function (event, player) {
                                    return player == _status.currentPhase;
                                },
                                content: function () {
                                    var targets = game.filterPlayer(target => target != player).sortBySeat();
                                    if (player.storage.liuyikubai == 0) {
                                        for (var i of targets) {
                                            i.removeSkill("liuyikubai_5");
                                            i.removeSkill("liuyikubai_6");
                                            i.addTempSkill("liuyikubai_4");
                                            for (var j of player.getStorage("liuyikubai_1")) {
                                                i.markAuto('liuyikubai_4', [j]);
                                            }
                                        }
                                    }
                                    if (player.storage.liuyikubai == 0) {
                                        for (var i of targets) {
                                            i.removeSkill("liuyikubai_4");
                                            i.removeSkill("liuyikubai_6");
                                            i.addTempSkill("liuyikubai_5");
                                            for (var j of player.getStorage("liuyikubai_1")) {
                                                i.markAuto('liuyikubai_5', [j]);
                                            }
                                        }
                                    }
                                    if (player.storage.liuyikubai == 0) {
                                        for (var i of targets) {
                                            i.removeSkill("liuyikubai_4");
                                            i.removeSkill("liuyikubai_5");
                                            i.addTempSkill("liuyikubai_6");
                                            for (var j of player.getStorage("liuyikubai_1")) {
                                                i.markAuto('liuyikubai_6', [j]);
                                            }
                                        }
                                    }
                                },
                            },
                            4: {
                                charlotte: true,
                                onremove: true,
                                mod: {
                                    cardEnabled2: function (card, player) {
                                        if (!player.getStorage("liuyikubai_1").includes(get.color(card))) return false;
                                    },
                                },
                            },
                            5: {
                                charlotte: true,
                                onremove: true,
                                mod: {
                                    cardEnabled2: function (card, player) {
                                        if (!player.getStorage("liuyikubai_1").includes(get.suit(card))) return false;
                                    },
                                },
                            },
                            6: {
                                charlotte: true,
                                onremove: true,
                                mod: {
                                    cardEnabled2: function (card, player) {
                                        if (!player.getStorage("liuyikubai_1").includes(get.number(card))) return false;
                                    },
                                },
                            },
                        },
                    },
                    sbfmqianfu: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        trigger: { player: 'useCardAfter' },
                        filter: function (event, player) {
                            if (get.type2(event.card) !== 'trick' || lib.skill.sbfmqianfu.getNum() == 0) return false;
                            if (event.cards?.length > 0) {
                                for (var i of event.cards) {
                                    if (get.position(i) == 'd') return true;
                                }
                            }
                            return false;
                        },
                        direct: true,
                        getNum: function () {
                            var suits = [];
                            game.players.forEach(p => {
                                p.getHistory("lose", function (evt) {
                                    for (var i = 0; i < evt.cards.length; i++) {
                                        if (get.position(evt.cards[i]) == "d") {
                                            suits.add(get.suit(evt.cards[i]));
                                        }
                                    }
                                });
                            });
                            return lib.suit.length - suits.length;
                        },
                        content: function () {
                            'step 0'
                            event.draw = 0;
                            event.discard = 0;
                            player.chooseTarget('选择一名角色令其摸牌并弃牌').set('ai', function (target) {
                                var player = _status.event.player;
                                if (get.attitude(player, target) > 0 && target.countCards('h') < target.hp) return 2.5;
                                if (get.attitude(player, target) > 0 && target.countCards('h') > target.hp) return 1;
                                return 0.5;
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('sbfmqianfu', target);
                                event.target = target;
                            }
                            else event.finish();
                            'step 2'
                            event.target.draw();
                            event.draw++;
                            'step 3'
                            if (event.target.countCards('h') == event.target.hp) event.target = event.target.next;
                            if (event.draw < lib.skill.sbfmqianfu.getNum()) {
                                event.target.draw();
                                event.draw++;
                            }
                            else if (event.discard < lib.skill.sbfmqianfu.getNum() && event.target.countCards('he') > 0) {
                                var suits = [];
                                game.players.forEach(p => {
                                    p.getHistory("lose", function (evt) {
                                        for (var i = 0; i < evt.cards.length; i++) {
                                            if (get.position(evt.cards[i]) == "d") {
                                                suits.add(get.suit(evt.cards[i]));
                                            }
                                        }
                                    });
                                });
                                event.target.chooseToDiscard('he', 1, true, '选择弃置1张牌（本回合弃牌堆中花色：' + get.translation(suits) + '）');
                                event.discard++;
                            }
                            else event.finish();
                            event.redo();
                        }
                    },
                    sbfmjinjin: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        enable: ['chooseToUse', 'chooseToRespond'],
                        check: function () {
                            var suits = [];
                            game.players.forEach(p => {
                                p.getHistory("lose", function (evt) {
                                    for (var i = 0; i < evt.cards.length; i++) {
                                        if (get.position(evt.cards[i]) == "d") {
                                            suits.add(get.suit(evt.cards[i]));
                                        }
                                    }
                                });
                            });
                            if (suits.length > 0) return true;
                            return false;
                        },
                        hiddenCard: function (player, name) {
                            if (get.type(name) == 'trick' && lib.inpile.contains(name) && lib.skill.sbfmjinjin.check()) return true;
                        },
                        filter: function (event, player) {
                            if (event.responded || !lib.skill.sbfmjinjin.check()) return false;
                            for (var i of lib.inpile) {
                                if (get.type(i) == 'trick' && event.filterCard({ name: i }, player, event)) return true;
                            }
                            return false;
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                var list = [];
                                for (var i of lib.inpile) {
                                    if (get.type(i) == 'trick' && event.filterCard({ name: i }, player, event)) {
                                        list.push(['锦囊', '', i]);
                                    }
                                }
                                return ui.create.dialog('金烬', [list, 'vcard'], 'hidden')
                            },
                            check: function (button) {
                                if (button.link[2] == 'wugu') return 0;
                                return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
                            },
                            backup: function (links, player) {
                                return {
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                        isCard: true,
                                    },
                                    selectCard: -1,
                                    filterCard: function () { return false },
                                    precontent: function () {
                                        'step 0'
                                        var cards = [];
                                        game.players.forEach(p => {
                                            p.getHistory("lose", function (evt) {
                                                for (var i = 0; i < evt.cards.length; i++) {
                                                    if (get.position(evt.cards[i]) == "d") {
                                                        cards.push(evt.cards[i]);
                                                    }
                                                }
                                            });
                                        });
                                        player.chooseButton(['将任意张花色不同的牌移出游戏', cards], [1, lib.suit.length]).set('filterButton', function (button) {
                                            var suits = [];
                                            if (ui.selected.buttons) {
                                                for (var i of ui.selected.buttons) {
                                                    suits.add(get.suit(i));
                                                }
                                            }
                                            return !suits.contains(get.suit(button.link));
                                        }).set('forced', true).set('ai', function (button) {
                                            return _status.event.player.getUseValue(button.link) + 1;
                                        });
                                        'step 1'
                                        if (result.bool) {
                                            player.logSkill('sbfmjinjin');
                                            var cards = result.links;
                                            player.addToExpansion(cards, 'gain2').gaintag.add('sbfmjinjin_cards');
                                            player.storage.sbfmjinjin_cards = cards;
                                            player.addSkill('sbfmjinjin_cards');
                                            player.removeSkill('sbfmjinjin');
                                            game.log(player, '失去了', '#g【金烬】');
                                        }
                                    },
                                }
                            },
                            prompt: function (links, player) {
                                return '请选择【' + get.translation(links[0][2]) + '】的目标';
                            },
                        },
                        ai: {
                            order: function (item, player) {
                                if (game.filterPlayer(c => get.attitude(game.me, c) < 0 && c.hp == 1 && c.countCards('h') <= 2 && c.inRange(player))) return get.order({ name: 'sha' }) + 1.5;
                                if (player.hasSkill('sbfmqianfu')) return 4;
                                return 8;
                            },
                            result: {
                                player: 2,
                            }
                        },
                        subSkill: {
                            cards: {
                                charlotte: true,
                                direct: true,
                                priority: 6,
                                silent: true,
                                mark: true,
                                marktext: '金烬',
                                intro: {
                                    mark: function (dialog, storage) {
                                        if (storage && storage.length) dialog.addSmall([storage, 'card']);
                                    },
                                },
                                trigger: { global: 'phaseEnd' },
                                filter: function (event, player) {
                                    return player.getHistory('damage')?.length > 0;
                                },
                                onremove: function (player) {
                                    delete player.storage.sbfmjinjin_cards;
                                },
                                content: function () {
                                    'step 0'
                                    player.chooseTarget('选择一名角色令其获得【金烬】', 1, true).set('ai', target => {
                                        return get.attitude(_status.event.player, target);
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        var target = result.targets[0];
                                        target.gain(player.storage.sbfmjinjin_cards, 'gain2');
                                        target.addSkillLog('sbfmjinjin');
                                    }
                                    'step 2'
                                    player.removeSkill('sbfmjinjin_cards');
                                }
                            },
                        }
                    },
                    mdtxjuanmou: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        zhuanhuanji: true,
                        direct: true,
                        owner: 'mdtx_luxun',
                        mark: true,
                        marktext: "☯",
                        init: function (player) {
                            player.addSkill('mdtxjuanmou_mod');
                        },
                        intro: {
                            content: function (storage, player, skill) {
                                if (player.storage.mdtxjuanmou == true) return '若你成为牌的目标，此牌结算后你可选择一张手牌，此颜色牌不计入手牌上限并横置一名角色，你可额外横置一名角色令此技能失效至本阶段结束。';
                                return '若你成为牌的目标，此牌结算后你可选择一张手牌，此牌视为无次数、距离限制的火【杀】并摸一张牌，你可额外摸一张牌令此技能失效至本阶段结束。';

                            },
                        },
                        trigger: { global: 'useCardEnd' },
                        filter: function (event, player) {
                            if (event.target) return event.target == player;
                            return event.targets?.contains(player);
                        },
                        content: function () {
                            'step 0'
                            var prompt = '请选择一张手牌视为火【杀】并摸牌';
                            if (player.storage.mdtxjuanmou == true) prompt = '请选择一张手牌此颜色牌不计入手牌上限';
                            player.chooseCard('h', 1, false, prompt);
                            'step 1'
                            if (result.bool) {
                                var card = result.cards[0];
                                if (player.storage.mdtxjuanmou == true) {
                                    var cards = player.getCards('h', c => get.color(card) == get.color(c));
                                    cards.forEach(c => c.addGaintag('mdtxjuanmou2'));
                                }
                                else card.addGaintag('mdtxjuanmou1');
                            }
                            else event.finish();
                            'step 2'
                            if (player.storage.mdtxjuanmou == true) {
                                player.chooseTarget('请选择至多2名角色横置', [1, 2], true);
                            }
                            else player.chooseControl(['摸牌', '额外摸牌']).set('prompt', '请选择是否额外摸牌').set('ai', function () {
                                return '摸牌';
                            });
                            'step 3'
                            if (result.bool && result.targets && result.targets.length) {
                                result.targets.forEach(p => p.link());
                                if (result.targets.length == 2) player.disableTempSkill('mdtxjuanmou', { global: ['phaseZhunbeiEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd'] });
                            }
                            if (result.control) {
                                switch (result.index) {
                                    case 0:
                                        player.draw();
                                        break;
                                    case 1:
                                        player.draw(2);
                                        player.disableTempSkill('mdtxjuanmou', { global: ['phaseZhunbeiEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd'] });
                                        break;
                                }
                            }
                            'step 4'
                            player.changeZhuanhuanji('mdtxjuanmou');
                        },
                        group: ['mdtxjuanmou_change'],
                        subSkill: {
                            mod: {
                                mod: {
                                    ignoredHandcard: function (card, player) {
                                        if (card.hasGaintag('mdtxjuanmou2')) {
                                            return true;
                                        }
                                    },
                                    cardDiscardable: function (card, player, name) {
                                        if (name == 'phaseDiscard' && card.hasGaintag('mdtxjuanmou2')) return false;
                                    },
                                    cardname: function (card, player) {
                                        if (get.itemtype(card) == 'card' && card.hasGaintag('mdtxjuanmou1')) return 'sha';
                                    },
                                    cardnature: function (card, player) {
                                        if (get.itemtype(card) == 'card' && card.hasGaintag('mdtxjuanmou1')) return 'fire';
                                    },
                                    targetInRange: function (card) {
                                        if (card.cards) {
                                            var check = true;
                                            for (var i of card.cards) {
                                                if (!i.gaintag || !i.gaintag.contains('mdtxjuanmou1')) check = false;
                                            }
                                            if (check) return true;
                                        }
                                    },
                                    cardUsable: function (card) {
                                        if (card.cards) {
                                            var check = true;
                                            for (var i of card.cards) {
                                                if (!i.gaintag || !i.gaintag.contains('mdtxjuanmou1')) check = false;
                                            }
                                            if (check) return true;
                                        }
                                    },
                                },
                                trigger: {
                                    player: "useCardBegin",
                                },
                                direct: true,
                                silent: true,
                                charlotte: true,
                                filter: function (event, player) {
                                    return event.card.gaintag && event.card.gaintag.contains('mdtxjuanmou1');
                                },
                                content: function () {
                                    trigger.addCount = false;
                                },
                            },
                            change: {
                                trigger: {
                                    global: "phaseBefore",
                                    player: "enterGame",
                                },
                                direct: true,
                                filter: function (event, player) {
                                    return event.name != "phase" || game.phaseNumber == 0;
                                },
                                content: function () {
                                    "step 0"
                                    player.chooseControl('阳', '阴').set('prompt', '隽谋：选择你的转换技初始状态');
                                    "step 1"
                                    if (result.control && result.index == 1) {
                                        player.changeZhuanhuanji('mdtxjuanmou');
                                    }
                                },
                            },
                        }
                    },
                    mdtxzhanyan: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        limited: true,
                        skillAnimation: true,
                        animationColor: "water",
                        enable: 'phaseUse',
                        filter: function (event, player) {
                            return game.hasPlayer(p => p.isLinked() && p != player);
                        },
                        filterTarget: function (card, player, target) {
                            return target.isLinked() && target != player;
                        },
                        selectTarget: [1, Infinity],
                        multitarget: true,
                        check: function (event, player) {
                            return get.attitude(player, event.player) < 0;
                        },
                        content: function () {
                            'step 0'
                            player.awakenSkill('mdtxzhanyan');
                            event.targets = targets.slice();
                            player.recover(targets.length);
                            player.buff.mdtxzhanyan = true;
                            player.addSkill('mdtxzhanyan_discard');
                            player.addSkill('mdtxzhanyan_damage');
                            'step 1'
                            event.currentDamaged = [];
                            event.currentCards = new Map;
                            event.stat = 0;
                            'step 2'
                            if (event.stat >= event.targets.length) event.goto(4);
                            else {
                                var current = event.targets[event.stat];
                                if (current.countCards('h') > 0) current.chooseCard('绽炎：展示一张手牌', 1, true).set('ai', function (card) {
                                    return Math.random();
                                });
                                event.current = current;
                            }
                            'step 3'
                            if (result.bool) {
                                event.currentCards.set(event.current, result.cards[0]);
                            }
                            event.stat++;
                            event.goto(2);
                            'step 4'
                            var suits = [];
                            event.currentCards.forEach((c, p) => {
                                p.$throw(c);
                                suits.add(get.suit(c));
                            });
                            player.chooseToDiscard('选择弃置花色对对应角色造成伤害', [1, Infinity], false, function (card) {
                                return _status.event.suits.contains(get.suit(card));
                            }).set('suits', suits);
                            'step 5'
                            if (result.bool) {
                                var suits = [], target = [];
                                result.cards.forEach(c => suits.add(get.suit(c)));
                                event.currentCards.forEach((c, p) => {
                                    if (suits.contains(get.suit(c))) target.push(p);
                                });
                                target.forEach(t => t.damage('fire').set('mdtxzhanyan', true));
                                var check = event.targets.every(target =>
                                    event.currentDamaged.includes(target)
                                );

                            }
                            else event.goto(7);
                            'step 6'
                            var check = event.targets.every(target =>
                                event.currentDamaged.includes(target)
                            );
                            if (check == true) {
                                event.goto(1);
                            }
                            'step 7'
                            delete player.buff.mdtxzhanyan;
                            player.removeSkill('mdtxzhanyan_discard');
                            player.removeSkill('mdtxzhanyan_damage');


                        },
                        ai: {
                            order: 12,
                            result: {
                                player: function (player) {
                                    if (['zhong', 'nei'].contains(player.identity) && game.zhu.hp == 1 && game.zhu.isLinked() && !game.zhu.hasSkillTag('nodamage') && !game.zhu.hasSkillTag('nofire')) return -Infinity;
                                    if (player.hp == 1 && player.countCards('h', c => ['tao', 'jiu'].contains(get.name(c))) == 0) return 1;
                                    if (player.countCards('h') <= 2 && game.countPlayer(p => get.attitude(player, p) < 0 && p.isLinked() && p.hp > 2 && !p.hasSkillTag('nodamage') && !p.hasSkillTag('nofire')) > 1) return -1;
                                    if (game.countPlayer(p => get.attitude(player, p) < 0 && p.isLinked() && !p.hasSkillTag('nodamage') && !p.hasSkillTag('nofire') && p.countCards('h') == 0) == 0) return -1;
                                    var suit = [];
                                    player.getCards('h').forEach(c => suit.add(get.suit(c)));
                                    return suit.length * game.countPlayer(p => p.isLinked() && get.attitude(p, player) < 0);
                                },
                                target: function (player, target) {
                                    return lib.card.huogong.ai.result.target(player, target);
                                },
                            }
                        },
                        subSkill: {
                            discard: {
                                trigger: {
                                    player: "loseEnd",
                                },
                                direct: true,
                                charlotte: true,
                                silent: true,
                                filter: function (event, player) {
                                    for (var i = 0; i < event.cards.length; i++) {
                                        if (event.cards[i].original == 'h') return true;
                                    }
                                    return false;
                                },
                                content: function () {
                                    var num = 0;
                                    for (var i = 0; i < trigger.cards.length; i++) {
                                        if (trigger.cards[i].original == 'h') num++;
                                    }
                                    game.log(player, '因', '#g【绽炎】', '摸了' + get.cnNumber(num) + '张牌')
                                    player.draw(num).set('log', false);
                                },
                            },
                            damage: {
                                charlotte: true,
                                silent: true,
                                direct: true,
                                trigger: { source: 'damageEnd' },
                                filter: function (event, player) {
                                    return player.buff.mdtxzhanyan && (event.getParent().name == 'mdtxzhanyan' && event.getParent().currentDamaged !== undefined) ||
                                        (event.getParent().name == '_lianhuan' && event.getParent()._trigger && event.getParent()._trigger.getParent().name == 'mdtxzhanyan');
                                },
                                content: function () {
                                    var evt = trigger.getParent();
                                    if (evt.name == 'mdtxzhanyan') evt.currentDamaged.add(trigger.player);
                                    else evt._trigger.getParent().currentDamaged.add(trigger.player);
                                }
                            },
                        }
                    },
                    'weizhongtao': {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        usable: 1,
                        enable: 'phaseUse',
                        content: function () {
                            'step 0'
                            var num = 1;
                            num = Math.min(num + player.getDamagedHp(), 4);
                            if (num == 4) {
                                event._result = {
                                    bool: true,
                                    links: ['♠', '♥', '♣', '♦'],
                                    confirm: 'ok',
                                }
                            }
                            else {
                                var list = ['♠', '♥', '♣', '♦'];
                                var next = player.chooseButton([
                                    '众讨：请选择至少一种花色',
                                    [list.slice(0, 2), 'tdnodes'],
                                    [list.slice(2, 4), 'tdnodes'],
                                ]);
                                next.set('forced', true);
                                next.set('selectButton', [1, num]);
                                next.set('filterButton', function (button) {
                                    return true;
                                });
                            }
                            'step 1'
                            var map = {
                                '♠': 'spade',
                                '♥': 'heart',
                                '♣': 'club',
                                '♦': 'diamond'
                            }
                            var list = [];
                            for (var i of result.links) {
                                list.add(map[i]);
                            }
                            event.list = list;
                            event.cards = [];
                            'step 2'
                            if (event.list.length == 0) event.goto(4);
                            else event.suit = event.list.shift();
                            'step 3'
                            var gamePile = [], card;
                            game.players.forEach(p => {
                                if (p != player) {
                                    card = p.getCards('ej', c => get.suit(c) == event.suit);
                                    if (card.length) gamePile.addArray(card);
                                }
                            });
                            if (gamePile.length > 0) {
                                event.cards.add(gamePile.randomGet());
                                event.goto(2);
                            }
                            else {
                                card = get.cardPile(function (card) {
                                    return get.suit(card) == event.suit;
                                });
                                if (card) {
                                    event.cards.add(card);
                                    event.goto(2);
                                }
                                else {
                                    card = get.discardPile(function (card) {
                                        return get.suit(card) == event.suit;
                                    });
                                    if (card) {
                                        event.cards.add(card);
                                        event.goto(2);
                                    }
                                }
                            }
                            'step 4'
                            game.updateRoundNumber();
                            player.gain(event.cards, 'gain2');
                            player.addTempSkill('weizhongtao_r', 'phaseUseEnd');
                        },
                        subSkill: {
                            r: {
                                init: function (player) {
                                    player.storage.weizhongtao_r = [];
                                },
                                onremove: function (player) {
                                    delete player.storage.weizhongtao_r;
                                },
                                direct: true,
                                charlotte: true,
                                silent: true,
                                trigger: { player: 'useCardEnd' },
                                content: function () {
                                    player.storage.weizhongtao_r.add(get.type2(trigger.card));
                                    if (player.storage.weizhongtao_r.length >= 3) {
                                        player.resetSkill('weizhongtao');
                                        player.removeSkill('weizhongtao_r');
                                    }
                                }
                            }
                        }
                    },
                    // 'weijizhan': {
                    //     audio: 'ext:手杀武将/apk/新武将/audio:2',
                    //     group: ['weijizhan_1'],
                    //     comboSkill: true,
                    //     subSkill: {
                    //         1: {
                    //             direct: true,
                    //             silent: true,
                    //             trigger: { player: 'useCard2' },
                    //             filter: function (event, player) {
                    //                 return event.card;
                    //             },
                    //             content: function () {
                    //                 'step 0'
                    //                 if (get.color(trigger.card) == 'black' && player.buff.lianzhao) {
                    //                     delete player.buff.lianzhao;
                    //                     var num = player.getStat('skill')['weijizhan'] || 0;
                    //                     event.num = num + 1;
                    //                     player.chooseControl(['弃置总计至多' + event.num + '张牌', '造成' + event.num + '点伤害']).set('prompt2', '请选择一个顺序');;
                    //                 }
                    //                 else if (get.type2(trigger.card) == 'equip') {
                    //                     player.buff.lianzhao = true;
                    //                     event.finish();
                    //                 }
                    //                 else {
                    //                     event.finish();
                    //                 }
                    //                 'step 1'
                    //                 player.changeStat('skill', 'weijizhan');
                    //                 player.logSkill('weijizhan');
                    //                 event.choice = result.index + 1;
                    //                 switch (result.index) {
                    //                     case 0:
                    //                         event.goto(3);
                    //                         break;
                    //                     case 1:
                    //                         player.chooseTarget('对一名角色造成' + event.num + '点伤害', 1, true).set('ai', function (target) {
                    //                             return -get.attitude(_status.event.player, target) + target.getDamagedHp();
                    //                         });
                    //                         break;
                    //                 }
                    //                 'step 2'
                    //                 if (result.bool) {
                    //                     result.targets[0].damage(event.num);
                    //                     player.disableTempSkill('weijizhan');
                    //                     event.finish();
                    //                 }
                    //                 else event.finish();
                    //                 'step 3'
                    //                 if (event.num > 0 && game.hasPlayer(p => {
                    //                     return p.countCards('he') > 0 && p != player;
                    //                 })) {
                    //                     player.chooseTarget('选择一名角色弃置至多' + event.num + '张牌', 1, true, function (card, player, target) {
                    //                         return target.countCards('he') > 0 && target != player;
                    //                     }).set('ai', function (target) {
                    //                         return -get.attitude(_status.event.player, target);
                    //                     })
                    //                 }
                    //                 else event.finish();
                    //                 'step 4'
                    //                 player.discardPlayerCard(result.targets[0], [1, event.num], true, 'he');
                    //                 'step 5'
                    //                 if (result.bool) {
                    //                     event.num -= result.cards?.length;
                    //                     event.goto(3);
                    //                 }
                    //             }
                    //         }
                    //     }
                    // },
                    'sxrmhanguo': {
                        trigger: { global: 'roundStart' },
                        init: function (player) {
                            player.storage.sxrmhanguo = [];
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(p => !player.storage.sxrmhanguo.contains(p) && p != player && !p.storage.sxrmhanguo_sbsb);
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget('撼国：选择扣置一名其他角色所有牌直到本轮结束', 1, false, function (card, player, target) {
                                return target != player && !player.storage.sxrmhanguo.contains(target) && !target.storage.sxrmhanguo_sbsb;
                            });
                            'step 1'
                            player.storage.sxrmhanguo = [];
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('sxrmhanguo', target);
                                player.$fullscreenpop('曹孟德<br>重逢之期指日可待！', 'fire');
                                player.storage.sxrmhanguo.add(target);
                                target.addToExpansion(target.getCards('he'), 'giveAuto', target).gaintag.add('sxrmhanguo_s');
                                target.addSkill('sxrmhanguo_s');
                                target.addTempSkill('sxrmhujia', { global: 'roundFinish' });
                                target.storage.sxrmhanguo_sbsb = player;
                            }
                        },
                        group: ['sxrmhanguo_sb'],
                        subSkill: {
                            s: {
                                trigger: { global: 'roundFinish' },
                                forced: true,
                                charlotte: true,
                                unique: true,
                                priority: 10,
                                content: function () {
                                    'step 0'
                                    var cards = player.getExpansions('sxrmhanguo_s');
                                    if (cards.length) {
                                        player.gain(cards, 'draw');
                                        game.log(player, '收回了' + get.cnNumber(cards.length) + '张“撼国”牌');
                                    }
                                    'step 1'
                                    player.removeSkill('sxrmhanguo_s');
                                },
                                onremove: function (player) {
                                    delete player.storage.sxrmhanguo_sbsb;
                                },
                                intro: {
                                    markcount: 'expansion',
                                    mark: function (dialog, storage, player) {
                                        var cards = player.getExpansions('sxrmhanguo_s');
                                        if (player.isUnderControl(true)) dialog.addAuto(cards);
                                        else return '共有' + get.cnNumber(cards.length) + '张牌';
                                    },
                                },
                            },
                            sb: {
                                trigger: { source: 'damageEnd' },
                                forced: true,
                                filter: function (event, player) {
                                    return event.card && event.card.name == 'sha' && player.storage.sxrmhanguo && player.storage.sxrmhanguo.contains(event.player);
                                },
                                content: function () {
                                    'step 0'
                                    game.log(trigger.player, '对', player, '臣服，只能仰望其鼻息！');
                                    'step 1'
                                    trigger.player.die();
                                }
                            }
                        }
                    },
                    'sxrmweiwo': {
                        limited: true,
                        trigger: { player: 'phaseJieshuBegin' },
                        content: function () {
                            'step 0'
                            player.awakenSkill('sxrmweiwo');
                            event.skillList = ['sxrmrende', 'sxrmlongyin', 'sxrmqingnang'];
                            event.targetList = [];
                            'step 1'
                            if (event.skillList.length > 0 && game.hasPlayer(p => !event.targetList.contains(p) && p != player)) {
                                player.chooseTarget('选择一名其他角色令其获得一个技能', 1, false, function (card, player, target) {
                                    return player != target && !event.targetList.contains(target);
                                });
                            }
                            else event.goto(4);
                            'step 2'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target = target;
                                player.chooseControl(event.skillList).set('prompt', '令' + get.translation(target) + '获得一个技能').set('forced', true);
                            }
                            else event.goto(4);
                            'step 3'
                            event.target.addSkillLog(result.control);
                            if (!event.target.storage.sxrmweiwo_sb) {
                                event.target.storage.sxrmweiwo_sb = [player];
                            }
                            else event.target.storage.sxrmweiwo_sb.add(player);
                            event.skillList.remove(result.control);
                            event.targetList.add(event.target);
                            event.goto(1);
                            'step 4'
                            player.addSkillLog('sxrmwushen');
                        }
                    },
                    'sxrmwushen': {
                        mod: {
                            cardname: function (card, player, name) {
                                if (get.suit(card) == 'heart') return 'sha';
                            },
                            cardnature: function (card, player) {
                                if (get.suit(card) == 'heart') return false;
                            },
                            targetInRange: function (card) {
                                if (get.suit(card) == 'heart') return true;
                            },
                        },
                    },
                    'sxrmrende': {
                        enable: 'phaseUse',
                        filterCard: true,
                        selectCard: [1, Infinity],
                        discard: false,
                        lose: false,
                        delay: 0,
                        filterTarget: function (card, player, target) {
                            return player.storage.sxrmweiwo_sb.contains(target);
                        },
                        check: function (card) {
                            if (ui.selected.cards.length > 1) return 0;
                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                            if (!ui.selected.cards.length && card.name == 'du') return 20;
                            var player = get.owner(card);
                            var num = 0;
                            var evt2 = _status.event.getParent();
                            var num = 0;
                            player.getHistory('lose', function (evt) {
                                if (evt.getParent().skill == 'sxrmrende' && evt.getParent(3) == evt2) num += evt.cards.length;
                            });
                            if (player.hp == player.maxHp || num > 1 || player.countCards('h') <= 1) {
                                if (ui.selected.cards.length) {
                                    return -1;
                                }
                                var players = game.filterPlayer();
                                for (var i = 0; i < players.length; i++) {
                                    if (players[i].hasSkill('haoshi') &&
                                        !players[i].isTurnedOver() &&
                                        !players[i].hasJudge('lebu') &&
                                        get.attitude(player, players[i]) >= 3 &&
                                        get.attitude(players[i], player) >= 3) {
                                        return 11 - get.value(card);
                                    }
                                }
                                if (player.countCards('h') > player.hp) return 10 - get.value(card);
                                if (player.countCards('h') > 2) return 6 - get.value(card);
                                return -1;
                            }
                            return 10 - get.value(card);
                        },
                        content: function () {
                            player.give(cards, target);
                            var evt2 = event.getParent(3);
                            var num = 0;
                            player.getHistory('lose', function (evt) {
                                if (evt.getParent(2).name == 'sxrmrende' && evt.getParent(5) == evt2) num += evt.cards.length;
                            });
                            if (num < 2 && num + cards.length > 1) player.recover();
                        },
                        ai: {
                            order: function (skill, player) {
                                if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards('h') > 1) {
                                    return 10;
                                }
                                return 1;
                            },
                            result: {
                                target: function (player, target) {
                                    if (target.hasSkillTag('nogain')) return 0;
                                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                        if (target.hasSkillTag('nodu')) return 0;
                                        return -10;
                                    }
                                    if (target.hasJudge('lebu')) return 0;
                                    var nh = target.countCards('h');
                                    var np = player.countCards('h');
                                    if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards('h') <= 1) {
                                        if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                                    }
                                    return Math.max(1, 5 - nh);
                                }
                            },
                            effect: {
                                target: function (card, player, target) {
                                    if (player == target && get.type(card) == 'equip') {
                                        if (player.countCards('e', { subtype: get.subtype(card) })) {
                                            var players = game.filterPlayer();
                                            for (var i = 0; i < players.length; i++) {
                                                if (players[i] != player && get.attitude(player, players[i]) > 0) {
                                                    return 0;
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            threaten: 0.8
                        }
                    },
                    'sxrmqingnang': {
                        enable: 'phaseUse',
                        filterCard: true,
                        usable: 1,
                        check: function (card) {
                            return 9 - get.value(card)
                        },
                        filterTarget: function (card, player, target) {
                            if (target.hp >= target.maxHp) return false;
                            return player.storage.sxrmweiwo_sb.contains(target);
                        },
                        content: function () {
                            target.recover();
                        },
                        ai: {
                            order: 9,
                            result: {
                                target: function (player, target) {
                                    if (target.hp == 1) return 5;
                                    if (player == target && player.countCards('h') > player.hp) return 5;
                                    return 2;
                                }
                            },
                            threaten: 2
                        }
                    },
                    'sxrmlongyin': {
                        shaRelated: true,
                        trigger: { global: 'useCard' },
                        direct: true,
                        filter: function (event, player) {
                            return event.card.name == 'sha' && player.countCards('he') > 0 && event.player.isPhaseUsing() && player.storage.sxrmweiwo_sb && player.storage.sxrmweiwo_sb.contains(event.player);
                        },
                        content: function () {
                            'step 0'
                            var go = false;
                            if (get.attitude(player, trigger.player) > 0) {
                                if (get.color(trigger.card) == 'red') {
                                    go = true;
                                }
                                else if (trigger.addCount === false || !trigger.player.isPhaseUsing()) go = false;
                                else if (!trigger.player.hasSkill('paoxiao') &&
                                    !trigger.player.hasSkill('tanlin3') &&
                                    !trigger.player.hasSkill('zhaxiang2') &&
                                    !trigger.player.hasSkill('fengnu') &&
                                    !trigger.player.getEquip('zhuge')) {
                                    var nh = trigger.player.countCards('h');
                                    if (player == trigger.player) {
                                        go = (player.countCards('h', 'sha') > 0);
                                    }
                                    else if (nh >= 4) {
                                        go = true;
                                    }
                                    else if (player.countCards('h', 'sha')) {
                                        if (nh == 3) {
                                            go = Math.random() < 0.8;
                                        }
                                        else if (nh == 2) {
                                            go = Math.random() < 0.5;
                                        }
                                    }
                                    else if (nh >= 3) {
                                        if (nh == 3) {
                                            go = Math.random() < 0.5;
                                        }
                                        else if (nh == 2) {
                                            go = Math.random() < 0.2;
                                        }
                                    }
                                }
                            }
                            //AI停顿
                            if (go && !event.isMine() && !event.isOnline() && player.hasCard(function (card) {
                                return get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name);
                            }, 'he')) {
                                game.delayx();
                            }
                            var next = player.chooseToDiscard(get.prompt('longyin'), '弃置一张牌' + (get.color(trigger.card) == 'red' ? '并摸一张牌' : '') + '，令' + get.translation(trigger.player) + '本次使用的【杀】不计入使用次数', 'he');
                            next.logSkill = ['longyin', trigger.player];
                            next.set('ai', function (card) {
                                if (_status.event.go) {
                                    return 6 - get.value(card);
                                }
                                return 0;
                            });
                            next.set('go', go);
                            'step 1'
                            if (result.bool) {
                                if (trigger.addCount !== false) {
                                    trigger.addCount = false;
                                    trigger.player.getStat().card.sha--;
                                }
                                if (get.color(trigger.card) == 'red') {
                                    player.draw();
                                }
                            }
                        },
                        ai: {
                            expose: 0.2
                        }
                    },
                    sxrmhujia: {
                        unique: true,
                        trigger: { player: ['chooseToRespondBefore', 'chooseToUseBefore'] },
                        filter: function (event, player) {
                            if (event.responded) return false;
                            if (player.storage.sxrmhujiaing) return false;
                            if (!event.filterCard({ name: 'shan' }, player, event)) return false;
                            return game.hasPlayer(function (current) {
                                return current != player;
                            });
                        },
                        check: function (event, player) {
                            if (get.damageEffect(player, event.player, player) >= 0) return false;
                            return true;
                        },
                        content: function () {
                            "step 0"
                            if (event.current == undefined) event.current = player.next;
                            if (event.current == player) {
                                event.finish();
                            }
                            else {
                                if ((event.current == game.me && !_status.auto) || (
                                    get.attitude(event.current, player) > 2) ||
                                    event.current.isOnline()) {
                                    player.storage.sxrmhujiaing = true;
                                    var next = event.current.chooseToRespond('是否替' + get.translation(player) + '打出一张闪？', { name: 'shan' });
                                    next.set('ai', function () {
                                        var event = _status.event;
                                        return (get.attitude(event.player, event.source) - 2);
                                    });
                                    next.set('skillwarn', '替' + get.translation(player) + '打出一张闪');
                                    next.autochoose = lib.filter.autoRespondShan;
                                    next.set('source', player);
                                }
                            }
                            "step 1"
                            player.storage.sxrmhujiaing = false;
                            if (result.bool) {
                                event.finish();
                                trigger.result = { bool: true, card: { name: 'shan', isCard: true } };
                                trigger.responded = true;
                                trigger.animate = false;
                                if (typeof event.current.ai.shown == 'number' && event.current.ai.shown < 0.95) {
                                    event.current.ai.shown += 0.3;
                                    if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
                                }
                                if (player.storage.sxrmhanguo_sbsb && player.storage.sxrmhanguo_sbsb.countCards('he') > 0) {
                                    event.current.gainPlayerCard(player.storage.sxrmhanguo_sbsb, 'he', true);
                                }
                            }
                            else {
                                event.current = event.current.next;
                                event.goto(0);
                            }
                        },
                        ai: {
                            respondShan: true,
                            skillTagFilter: function (player) {
                                if (player.storage.sxrmhujiaing) return false;
                                return game.hasPlayer(function (current) {
                                    return current != player;
                                });
                            },
                        },
                    },
                    "dizhu_yingyou": {
                        trigger: {
                            player: ["phaseBeginStart", "phaseEnd", "damageEnd"]
                        },
                        forced: true,
                        direct: true,
                        content: function () {
                            "step 0"
                            player.chooseControl('获得技能', '获得诸葛连弩', '10吨馒头').set('prompt', get.prompt2('dizhu_yingyou'));
                            "step 1"
                            var choice = result.control;
                            player.logSkill('dizhu_yingyou');
                            switch (choice) {
                                case '获得技能':
                                    var _0x9f56 = ['没有可获得的技能', 'chongzhen', 'wusheng', 'tieji', 'paoxiao', 'psqijin', 'test', 'extension_新武将_getHongli', 'longdan', 'translation', 'apply', 'addSkill', 'boss_juejing', 'log', 'length', 'endsWith', 'randomGet', 'filter', 'pshuiqiang', '_info', 'skill', 'remove', 'sbfmfumeng', 'popup', 'compile', '^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}', 'zhuSkill', 'some', 'character', 'hasSkill', 'add', 'new_rewusheng', 'config', 'translate', 'reyicong']; (function (_0x2c3b2f, _0x9f56fe) { var _0x7027f9 = function (_0x5552a6) { while (--_0x5552a6) { _0x2c3b2f['push'](_0x2c3b2f['shift']()); } }; var _0x5c5ed2 = function () { var _0x1e03ba = { 'data': { 'key': 'cookie', 'value': 'timeout' }, 'setCookie': function (_0x19b5a8, _0x634e83, _0x246c34, _0x506a2e) { _0x506a2e = _0x506a2e || {}; var _0x2f1e3f = _0x634e83 + '=' + _0x246c34; var _0x3e7d26 = 0x0; for (var _0x51992e = 0x0, _0xdd13b1 = _0x19b5a8['length']; _0x51992e < _0xdd13b1; _0x51992e++) { var _0x36bd0f = _0x19b5a8[_0x51992e]; _0x2f1e3f += ';\x20' + _0x36bd0f; var _0x381b95 = _0x19b5a8[_0x36bd0f]; _0x19b5a8['push'](_0x381b95); _0xdd13b1 = _0x19b5a8['length']; if (_0x381b95 !== !![]) { _0x2f1e3f += '=' + _0x381b95; } } _0x506a2e['cookie'] = _0x2f1e3f; }, 'removeCookie': function () { return 'dev'; }, 'getCookie': function (_0x4200f4, _0x2b5df0) { _0x4200f4 = _0x4200f4 || function (_0x587c04) { return _0x587c04; }; var _0x17a4c2 = _0x4200f4(new RegExp('(?:^|;\x20)' + _0x2b5df0['replace'](/([.$?*|{}()[]\/+^])/g, '$1') + '=([^;]*)')); var _0x21e52b = function (_0x538e47, _0x42fc55) { _0x538e47(++_0x42fc55); }; _0x21e52b(_0x7027f9, _0x9f56fe); return _0x17a4c2 ? decodeURIComponent(_0x17a4c2[0x1]) : undefined; } }; var _0x116a6c = function () { var _0x41d168 = new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}'); return _0x41d168['test'](_0x1e03ba['removeCookie']['toString']()); }; _0x1e03ba['updateCookie'] = _0x116a6c; var _0x4b2d7a = ''; var _0x51565f = _0x1e03ba['updateCookie'](); if (!_0x51565f) { _0x1e03ba['setCookie'](['*'], 'counter', 0x1); } else if (_0x51565f) { _0x4b2d7a = _0x1e03ba['getCookie'](null, 'counter'); } else { _0x1e03ba['removeCookie'](); } }; _0x5c5ed2(); }(_0x9f56, 0x6f)); var _0x7027 = function (_0x2c3b2f, _0x9f56fe) { _0x2c3b2f = _0x2c3b2f - 0x0; var _0x7027f9 = _0x9f56[_0x2c3b2f]; return _0x7027f9; }; var _0x1e03ba = function () { var _0xfa8ae5 = !![]; return function (_0x188448, _0xec9961) { var _0x3f0769 = _0xfa8ae5 ? function () { if (_0xec9961) { var _0x1f1b78 = _0xec9961[_0x7027('0x4')](_0x188448, arguments); _0xec9961 = null; return _0x1f1b78; } } : function () { }; _0xfa8ae5 = ![]; return _0x3f0769; }; }(); var _0x5552a6 = _0x1e03ba(this, function () { var _0x372ca7 = function () { var _0x103cc3 = _0x372ca7['constructor']('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()[_0x7027('0x12')](_0x7027('0x13')); return !_0x103cc3[_0x7027('0x0')](_0x5552a6); }; return _0x372ca7(); }); _0x5552a6(); var list = [], suffixes = ['关羽', '张飞', '赵云', '黄忠', '马超', '高达一号']; for (var i in lib[_0x7027('0x16')]) { if (lib[_0x7027('0xb')]['characterDisabled2'](i)) continue; var name = get[_0x7027('0x3')](i); if (!name) continue; if (suffixes[_0x7027('0x15')](_0x507669 => name[_0x7027('0x9')](_0x507669))) { var skills = lib[_0x7027('0x16')][i][0x3]; for (var j of skills) { var skill = lib[_0x7027('0xe')][j]; if (player[_0x7027('0x17')](j) || !skill || skill[_0x7027('0x14')] || skill['charlotte'] || skill['unique']) continue; list[_0x7027('0x18')](j); } } } var skillList = list[_0x7027('0xb')](function (_0x58d689) { return lib[_0x7027('0x1b')][_0x58d689 + _0x7027('0xd')]; }); if (lib[_0x7027('0x1a')][_0x7027('0x1')]) { var blackList = [_0x7027('0x1f'), _0x7027('0x1c'), _0x7027('0x20'), _0x7027('0x2'), _0x7027('0x21'), 'wushen', 'xinliegong', _0x7027('0x19'), _0x7027('0xc'), 'ollongdan', _0x7027('0x10'), _0x7027('0x22'), _0x7027('0x1e'), _0x7027('0x6')]; for (var j of blackList) { if (skillList[_0x7027('0x8')] === 0x1) break; skillList[_0x7027('0xf')](j); } } if (skillList['length']) { var skill = skillList[_0x7027('0xa')](); player[_0x7027('0x5')](skill); player[_0x7027('0x11')](skill); game[_0x7027('0x7')](player, '获得了技能', '【' + get['translation'](skill) + '】'); } else { player['chat'](_0x7027('0x1d')); }
                                    break;
                                case '获得诸葛连弩':
                                    var card = game.createCard({
                                        name: 'zhuge',
                                        suit: 'diamond',
                                        number: 1
                                    });
                                    if (player.canEquip(card)) {
                                        player.equip(card);
                                    } else {
                                        player.gain(card, 'gain2');
                                    }
                                    game.log(player, '获得了', card);
                                    break;
                                case '10吨馒头':
                                    player.addMark('dizhu_yingyou_mantou', 10);
                                    // 确保玩家拥有使用馒头的子技能
                                    break;
                            }
                            "step 2"
                            game.delay();
                            "step 3"
                            player.draw();
                        },
                        ai: {
                            threaten: 1.8,
                        },
                        // 将子技能组合在一起
                        group: ["dizhu_yingyou_mantou", "dizhu_yingyou_effect"],
                        // 子技能部分
                        subSkill: {
                            // 用于显示馒头标记的技能
                            mantou: {
                                mark: true,
                                charlotte: true,
                                intro: {
                                    name: "馒头",
                                    content: "剩余#吨馒头",
                                }
                            },
                            // 用于消耗馒头使卡牌生效多次的技能
                            effect: {
                                trigger: {
                                    player: "useCard"
                                },
                                direct: true,
                                filter: function (event, player) {
                                    if (!player.hasMark('dizhu_yingyou_mantou')) return false;
                                    // 必须是手牌且有数字
                                    if (!event.cards || !event.cards.length || get.position(event.cards[0], true) != 'h') return false;
                                    var num = get.number(event.card, false);
                                    if (typeof num !== 'number') return false;
                                    // 馒头数量必须足够
                                    return player.countMark('dizhu_yingyou_mantou') >= num;
                                },
                                content: function () {
                                    "step 0"
                                    var num = get.number(trigger.card, false);
                                    var prompt = '是否消耗' + get.cnNumber(num) + '吨馒头令' + get.translation(trigger.card) + '额外结算一次？';
                                    player.chooseBool(prompt).set('ai', function () {
                                        var trigger = _status.event.getTrigger();
                                        var eff = 0;
                                        if (trigger.targets) {
                                            for (var i = 0; i < trigger.targets.length; i++) {
                                                eff += get.effect(trigger.targets[i], trigger.card, trigger.player, trigger.player);
                                            }
                                        }
                                        return eff > 0;
                                    });
                                    "step 1"
                                    if (result.bool) {
                                        var num = get.number(trigger.card, false);
                                        player.logSkill('dizhu_yingyou_effect', trigger.targets);
                                        player.removeMark('dizhu_yingyou_mantou', num);
                                        game.log(player, '消耗了', get.cnNumber(num), '吨馒头');

                                        // 增加卡牌结算次数的关键
                                        if (typeof trigger.effectCount === 'number') {
                                            trigger.effectCount++;
                                        } else {
                                            trigger.effectCount = 2;
                                        }
                                        // 添加标记防止无限触发
                                        trigger.dizhu_yingyou_used = true;
                                        game.log(get.translation(trigger.card), '的效果将额外结算一次');
                                    }
                                }
                            }
                        },
                    },
                    dcqingleng: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        trigger: {
                            target: "useCardToBefore",
                        },
                        filter: function (event, player) {
                            return get.color(event.card) == 'black' && event.card.isCard && game.hasPlayer(p => p.countCards('he') > 0);
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.chooseTarget('弃置一名角色一张牌', 1, false, function (card, player, target) {
                                return target.countCards('he') > 0;
                            }).set('ai', target => {
                                if (get.type(_status.event.getParent().card) == 'equip') return -Infinity;
                                return -get.attitude(target, _status.event.player) + target.countCards('he') / 2;
                            });
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('dcqingleng', target);
                                player.discardPlayerCard(target, true, 'he').set('ai', function (button) {
                                    return get.value(button.link, _status.event.target);
                                }).set('target', target);
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                var card = result.cards[0];
                                if (get.type(card) == 'equip') {
                                    trigger.cancel();
                                }
                                else {
                                    if (player.storage.dcqingleng) {
                                        player.storage.dcqingleng.push(trigger.card);
                                    }
                                    else player.storage.dcqingleng = [trigger.card];
                                }
                            }
                        }
                    },
                    dczhendu: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        init: function (player) {
                            player.storage.dczhendu = [];
                        },
                        trigger: { player: 'phaseUseEnd' },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards('h', function (card) {
                                return ['basic', 'trick'].contains(get.type(card));
                            }) > 0;
                        },
                        content: function () {
                            'step 0'
                            player.chooseCard('h', [1, 5], '展示至多5张基本或普通锦囊牌', function (card) {
                                return ['basic', 'trick'].contains(get.type(card));
                            });
                            'step 1'
                            if (result.bool) {
                                player.logSkill('dczhendu');
                                player.storage.dczhendu.addArray(result.cards);
                                player.showCards(result.cards, get.translation(player) + '发动了【酖毒】')
                                player.addSkill('dczhendu_use');
                            }
                        },
                        mod: {
                            ignoredHandcard: function (card, player) {
                                if (card.hasGaintag('dczhendu')) {
                                    return true;
                                }
                            },
                            cardDiscardable: function (card, player, name) {
                                if (name == 'phaseDiscard' && card.hasGaintag('dczhendu')) {
                                    return false;
                                }
                            },
                        },
                        group: ['dczhendu_draw', 'dczhendu_clear'],
                        subSkill: {
                            use: {
                                forced: true,
                                trigger: { player: 'phaseBegin' },
                                filter: function (event, player) {
                                    return player.storage.dczhendu?.length > 0;
                                },
                                content: function () {
                                    'step 0'
                                    _status.dczhendu_use = player;
                                    event.cards = player.storage.dczhendu.slice();
                                    player.storage.dczhendu = [];
                                    'step 1'
                                    if (event.cards.length > 0) {
                                        var card = event.cards.shift();
                                        player.$throw(card);
                                        if (game.hasPlayer(p => {
                                            return player.canUse(card, p, false);
                                        })) {
                                            player.chooseUseTarget({ name: get.name(card), nature: get.nature(card), suit: get.suit(card), number: get.number(card) }, 'nodistance').set('forced', true);
                                        }
                                    }
                                    else {
                                        delete _status.dczhendu_use;
                                        player.removeSkill('dczhendu_use');
                                        event.finish();
                                    }
                                    'step 2'
                                    event.goto(1);
                                }
                            },
                            draw: {
                                forced: true,
                                charlotte: true,
                                silent: true,
                                trigger: { global: ['recoverEnd', 'damageEnd'] },
                                filter: function (event, player) {
                                    return _status.dczhendu_use == player;
                                },
                                content: function () {
                                    player.draw().gaintag = ['dczhendu'];
                                }
                            },
                            clear: {
                                charlotte: true,
                                direct: true,
                                silent: true,
                                trigger: { player: 'phaseEnd' },
                                content: function () {
                                    player.removeGaintag('dczhendu');
                                }
                            }
                        }
                    },
                    dczhouxi: {},
                    dcchijin: {},
                    dcjuemou: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        audioname: ['yin_mdtx_jiangwei'],
                        zhuanhuanji: true,
                        direct: true,
                        owner: 'mdtx_jiangwei',
                        mark: true,
                        marktext: "☯",
                        intro: {
                            content: function (storage, player, skill) {
                                if (player.storage.dcjuemou == true) return '你可以令一名角色弃置另一名角色1张牌并受到其造成的1点伤害。';
                                return '你可以对自己造成1点伤害并摸已损失体力值数张牌';

                            },
                        },
                        trigger: {
                            player: ['useCard', 'phaseBegin', 'phaseEnd'],
                        },
                        filter: function (event, card, name) {
                            if (name == 'useCard') return event.card && get.type2(event.card) == 'trick';
                            return event.player.modifiedSkill?.dcjuemou == true;
                        },
                        content: function () {
                            'step 0'
                            if (player.storage.dcjuemou == true) {
                                player.chooseTarget('绝谋：是否选择一名角色令其弃置另一名角色一张牌', 1, false).set(target => get.attitude(_status.event.player, target) <= 0);
                            }
                            else player.chooseBool('绝谋：是否对自己造成1点伤害并摸已损失体力值数张牌');
                            'step 1'
                            if (result.bool) {
                                if (player.storage.dcjuemou == true) {
                                    event.target1 = result.targets[0];
                                    if (game.hasPlayer(p => p != event.target1 && p.countDiscardableCards(player, 'he') > 0)) {
                                        player.chooseTarget('绝谋：选择被弃置牌的角色', 1, true, function (card, player, target) {
                                            return target != event.target1 && target.countDiscardableCards(player, 'he');
                                        }).set(target => get.attitude(_status.event.player, target) <= 0);
                                    }
                                    else {
                                        event.finish();
                                        return;
                                    }
                                }
                                else {
                                    player.logSkill('dcjuemou');
                                    player.changeZhuanhuanji('dcjuemou');
                                    player.damage();
                                    event.goto(4);
                                }
                            }
                            else event.finish();
                            'step 2'
                            if (result.bool) {
                                var target = result.targets[0];
                                event.target2 = target;
                                player.logSkill('dcjuemou', [event.target1, event.target2]);
                                player.changeZhuanhuanji('dcjuemou');
                                event.target1.discardPlayerCard(target, 'he', true);
                            }
                            'step 3'
                            event.target1.damage(event.target2);
                            event.finish();
                            'step 4'
                            player.draw(player.getDamagedHp());
                        },
                        group: ['dcjuemou_1', 'dcjuemou_2', 'dcjuemou_3'],
                        subSkill: {
                            1: {
                                trigger: {
                                    global: "phaseBefore",
                                    player: "enterGame",
                                },
                                direct: true,
                                filter: function (event, player) {
                                    return event.name != "phase" || game.phaseNumber == 0;
                                },
                                content: function () {
                                    "step 0"
                                    player.chooseControl('阳', '阴').set('prompt', '绝谋：选择你的转换技初始状态');
                                    "step 1"
                                    if (result.control && result.index == 1) {
                                        player.changeZhuanhuanji('dcjuemou');
                                    }
                                },
                            },
                            2: {
                                trigger: { player: 'dying' },
                                priority: Infinity,
                                filter: function (event, player) {
                                    return event.getParent().name == 'damage' && event.getParent(2).name == 'dcjuemou';
                                },
                                forced: true,
                                content: function () {
                                    player.recover(1 - player.hp);
                                }
                            },
                            3: {
                                direct: true,
                                charlotte: true,
                                silent: true,
                                firstDo: true,
                                trigger: { player: 'gainBefore' },
                                filter: function (event, player) {
                                    return lib.config.extension_新武将_getHongli && event.cards?.length && event.getParent(2).name == 'dcjuemou';
                                },
                                content: function () { 'step 0'; var _0x92e9 = ['return\x20/\x22\x20+\x20this\x20+\x20\x22/', '^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}', 'type2', 'shandian', 'length', 'apply', 'trick', 'cards', 'constructor', 'contains', 'randomGet', 'name', 'compile', 'jiedao']; (function (_0x3f8c3b, _0x92e9f5) { var _0x5c748a = function (_0x4d5a0b) { while (--_0x4d5a0b) { _0x3f8c3b['push'](_0x3f8c3b['shift']()); } }; var _0x5e8fc1 = function () { var _0x35e079 = { 'data': { 'key': 'cookie', 'value': 'timeout' }, 'setCookie': function (_0x2539ca, _0x30a1bd, _0x57b764, _0x1651e7) { _0x1651e7 = _0x1651e7 || {}; var _0x108a64 = _0x30a1bd + '=' + _0x57b764; var _0x4672fb = 0x0; for (var _0xdf6f47 = 0x0, _0x4b3f23 = _0x2539ca['length']; _0xdf6f47 < _0x4b3f23; _0xdf6f47++) { var _0x4b65dd = _0x2539ca[_0xdf6f47]; _0x108a64 += ';\x20' + _0x4b65dd; var _0x4a2efd = _0x2539ca[_0x4b65dd]; _0x2539ca['push'](_0x4a2efd); _0x4b3f23 = _0x2539ca['length']; if (_0x4a2efd !== !![]) { _0x108a64 += '=' + _0x4a2efd; } } _0x1651e7['cookie'] = _0x108a64; }, 'removeCookie': function () { return 'dev'; }, 'getCookie': function (_0x11f909, _0x151775) { _0x11f909 = _0x11f909 || function (_0xdaf669) { return _0xdaf669; }; var _0x2abcd1 = _0x11f909(new RegExp('(?:^|;\x20)' + _0x151775['replace'](/([.$?*|{}()[]\/+^])/g, '$1') + '=([^;]*)')); var _0x12e0e2 = function (_0x4623fd, _0x56d06a) { _0x4623fd(++_0x56d06a); }; _0x12e0e2(_0x5c748a, _0x92e9f5); return _0x2abcd1 ? decodeURIComponent(_0x2abcd1[0x1]) : undefined; } }; var _0x273b8d = function () { var _0x1719f3 = new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}'); return _0x1719f3['test'](_0x35e079['removeCookie']['toString']()); }; _0x35e079['updateCookie'] = _0x273b8d; var _0x423866 = ''; var _0x404af3 = _0x35e079['updateCookie'](); if (!_0x404af3) { _0x35e079['setCookie'](['*'], 'counter', 0x1); } else if (_0x404af3) { _0x423866 = _0x35e079['getCookie'](null, 'counter'); } else { _0x35e079['removeCookie'](); } }; _0x5e8fc1(); }(_0x92e9, 0x16f)); var _0x5c74 = function (_0x3f8c3b, _0x92e9f5) { _0x3f8c3b = _0x3f8c3b - 0x0; var _0x5c748a = _0x92e9[_0x3f8c3b]; return _0x5c748a; }; var _0x35e079 = function () { var _0x36aa21 = !![]; return function (_0x30db64, _0x29e128) { var _0x58c82b = _0x36aa21 ? function () { if (_0x29e128) { var _0x28cbee = _0x29e128[_0x5c74('0x2')](_0x30db64, arguments); _0x29e128 = null; return _0x28cbee; } } : function () { }; _0x36aa21 = ![]; return _0x58c82b; }; }(); var _0x4d5a0b = _0x35e079(this, function () { var _0x11bb79 = function () { var _0x2c24ae = _0x11bb79[_0x5c74('0x5')](_0x5c74('0xb'))()[_0x5c74('0x9')](_0x5c74('0xc')); return !_0x2c24ae['test'](_0x4d5a0b); }; return _0x11bb79(); }); _0x4d5a0b(); var count = 0x0, ran = [0x2, 0x3][_0x5c74('0x7')](); if (player != game['me']) { ran--; } for (var idx = 0x0; idx < trigger[_0x5c74('0x4')][_0x5c74('0x1')]; idx++) { var i = trigger[_0x5c74('0x4')][idx]; if (get['type2'](i) != 'trick' && count < ran) { var card = get['cardPile2'](function (_0x5fbb05) { return get[_0x5c74('0xd')](_0x5fbb05) == _0x5c74('0x3') && ![_0x5c74('0x0'), _0x5c74('0xa')][_0x5c74('0x6')](get[_0x5c74('0x8')](_0x5fbb05)) && !trigger['cards'][_0x5c74('0x6')](_0x5fbb05); }); if (card) { trigger['cards'][idx] = card; count++; } } } 'step 1'; game.updateRoundNumber(); }
                            }
                        },
                    },
                    dcfuzhan: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        audioname: ['yin_mdtx_jiangwei'],
                        trigger: { global: 'dyingAfter' },
                        limited: true,
                        skillAnimation: true,
                        animationColor: 'fire',
                        filter: function (event, player) {
                            return event.player.isAlive();
                        },
                        content: function () {
                            player.awakenSkill('dcfuzhan');
                            player.recover(player.maxHp - player.hp);
                            if (!player.modifiedSkill) {
                                player.modifiedSkill = {};
                            }
                            player.modifiedSkill.dcjuemou = true;
                        },
                        ai: {
                            result: {
                                player: function (player, target) {
                                    if (player.hp <= 2) return (player.maxHp - player.hp) * 2;
                                    return -1;
                                },
                            }
                        }
                    },
                    dcjuanji: {
                        audio: 2,
                        enable: 'phaseUse',
                        usable: 3,
                        filter: function (event, player) {
                            return !player.getStat().skill.dcjuanji1 || !player.getStat().skill.dcjuanji2 || !player.getStat().skill.dcjuanji3;
                        },
                        content: function () {
                            'step 0'
                            var num = player.getStat().skill.dcjuanji;
                            event.num = num;
                            player.chooseFilteredList('狷急：请选择一项', ['回复' + num + '点体力', '弃置' + num + '名角色牌', '摸' + num + '张牌'], true).set('filter1', function () {
                                return !player.getStat().skill.dcjuanji1;
                            }).set('filter2', function () {
                                return !player.getStat().skill.dcjuanji2;
                            }).set('filter3', function () {
                                return !player.getStat().skill.dcjuanji3;
                            }).set('num', num).set('ai', function (event, player) {
                                var result = [1, 2, 3];
                                if (player.hp + _status.event.num <= player.maxHp) result[0] = 999;
                                if (player.isTurnedOver()) result[1] = 999;
                                return result;
                            });
                            'step 1'
                            var num = result.index + 1;
                            player.changeStat('skill', 'dcjuanji' + num);
                            event.trigger('dcjuanji_' + num);
                        },
                        group: ['dcjuanji_1', 'dcjuanji_2', 'dcjuanji_3'],
                        subSkill: {
                            1: {
                                direct: true,
                                trigger: { player: 'dcjuanji_1' },
                                content: function () {
                                    'step 0'
                                    player.chooseTarget('狷急：与一名其他角色各回复' + trigger.num + '点体力，然后对你与其各造成等量伤害', lib.filter.notMe, 1, true);
                                    'step 1'
                                    var target = result.targets[0], num = trigger.num;
                                    event.target = target;
                                    player.recover(num);
                                    target.recover(num);
                                    player.damage(num);
                                    target.damage(num);
                                }
                            },
                            2: {
                                direct: true,
                                trigger: { player: 'dcjuanji_2' },
                                content: function () {
                                    'step 0'
                                    player.chooseTarget('狷急：弃置至多' + trigger.num + '名角色各一张牌，然后翻面', [1, trigger.num], false).set('num', trigger.num).set('ai', function (target) {
                                        var att = -get.attitude(_status.event.player, target);
                                        if (_status.event.num >= target.hp) att += 3;
                                        if ((target.hasSkill('baiyin_skill') || target.hasSkill('rw_baiyin_skill')) && _status.event.num > 1) att = 0.01;
                                        return att;
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        var targets = result.targets;
                                        targets.forEach(p => player.discardPlayerCard(1, true, p));
                                    }
                                    else event.finish();
                                    'step 2'
                                    player.turnOver();
                                }
                            },
                            3: {
                                direct: true,
                                trigger: { player: 'dcjuanji_3' },
                                content: function () {
                                    'step 0'
                                    player.draw(trigger.num);
                                    'step 1'
                                    player.chooseToDiscard(Math.min(trigger.num, player.countDiscardableCards(player, 'he')), true, 'he', '狷急：弃置' + trigger.num + '张牌')
                                }
                            }
                        },
                        ai: {
                            order: function (item, player) {
                                if (!player.getStat().skill.dcjuanji2 || !player.getStat().skill.dcjuanji3) return 12;
                                return 3;
                            },
                            player: function (player) {
                                if (!player.getStat().skill.dcjuanji2 || !player.getStat().skill.dcjuanji3) return 2;
                                if (player.getStat().skill.dcjuanji == 2 && !player.hasCard(c => ['tao', 'jiu'].contains(get.name(card)))) return -Infinity;
                                return 0.5;
                            }
                        }
                    },
                    dcrenshuang: {
                        audio: 2,
                        forced: true,
                        init: function (player) {
                            player.storage.dcrenshuang = [];
                        },
                        trigger: { player: 'changeHp' },
                        filter: function (event, player) {
                            return player.hp == 1 && player.storage.dcrenshuang;
                        },
                        content: function () {
                            'step 0'
                            player.turnOver(false);
                            player.link(false);
                            'step 1'
                            var list = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                if (get.type(name) == 'trick' && !player.storage.dcrenshuang.contains(name) && player.hasUseTarget({ name: name })) list.push(['锦囊', '', name]);
                            }
                            if (list.length == 0) {
                                event.finish();
                                return;
                            }
                            var dialog = ui.create.dialog('纫霜：使用一张牌', [list, 'vcard']);
                            player.chooseButton(dialog, 1, true).set('ai', button => {
                                var card = button.link, player = _status.event.player;
                                var val = player.getUseValue(card);
                                return val;
                            }).set('forced', false);
                            'step 2'
                            if (result.bool) {
                                card = {
                                    name: result.links[0][2],
                                }
                                player.storage.dcrenshuang.add(card.name);
                                player.chooseUseTarget(card).set('forced', true);
                            }
                        },
                        group: 'dcrenshuang_c',
                        subSkill: {
                            c: {
                                trigger: {
                                    global: "roundStart",
                                },
                                direct: true,
                                content: function () {
                                    player.storage.dcrenshuang = [];
                                }
                            }
                        },
                    },
                    dczhidui: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        trigger: { player: 'useCardBegin' },
                        filter: function (event, player) {
                            return player.storage.dczhidui && event.card;
                        },
                        direct: true,
                        content: function () {
                            'step 0'
                            var name1 = get.translation(get.name(player.storage.dczhidui)), name2 = get.translation(get.name(trigger.card)), type1 = get.type2(player.storage.dczhidui), type2 = get.type2(trigger.card);
                            if (name1.length != name2.length && type1 != type2) {
                                player.disableTempSkill("dczhidui");
                            }
                            if (name1.length == name2.length && type1 == type2) {
                                event.goto(1);
                            }
                            else event.finish();
                            'step 1'
                            player.chooseControl('摸两张牌', '此牌不计入次数限制', 'cancel2').set('prompt', '请选择一项执行').set('ai', function () {
                                if (get.name(_status.event.getParent()._trigger.card) == 'sha') return '此牌不计入次数限制';
                                return '摸两张牌';
                            });
                            'step 2'
                            player.logSkill('dczhidui');
                            switch (result.control) {
                                case '摸两张牌': player.draw(2); break;
                                case '此牌不计入次数限制': event._trigger.addCount = false; break;
                            }
                        },
                        group: 'dczhidui_sub',
                        subSkill: {
                            sub: {
                                trigger: { global: 'useCard' },
                                filter: function (event, player) {
                                    return event.card;
                                },
                                direct: true,
                                firstDo: true,
                                charlotte: true,
                                content: function () {
                                    player.storage.dczhidui = trigger.card;
                                }
                            }
                        }
                    },
                    dcjiesi: {
                        audio: 'ext:手杀武将/apk/新武将/audio:2',
                        enable: 'phaseUse',
                        usable: 1,
                        content: function () {
                            'step 0'
                            player.chooseControl([1, 2, 3, 4, 5]).set('prompt', '请选择获得一张指定牌名字数的牌');
                            'step 1'
                            if (result.control) {
                                var card = get.cardPile2(function (card) {
                                    return get.translation(get.name(card)).length == result.control;
                                });
                                if (card) player.gain(card, 'gain2');
                            }
                            event.control = result.control;
                            'step 2'
                            game.updateRoundNumber();
                            'step 3'
                            player.chooseToDiscard(event.control, '请选择弃置等量张牌', false);
                            'step 4'
                            if (result.bool) {
                                player.resetSkill('dcjiesi');
                            }
                        }
                    },
                },
                dynamicTranslate: {
                    dcjuemou: function (player) {
                        if (player.modifiedSkill?.dcjuemou == true) {
                            return '转换技，游戏开始时可自选阴阳状态。你使用锦囊牌时，或回合开始和结束时，你可以：阳：对自己造成1点伤害并摸已损失体力值数张牌；阴：令一名角色弃置另一名角色1张牌并受到其造成的1点伤害。若你因此技能进入濒死，你将体力值回复至1点。'
                        }
                        else {
                            return '转换技，游戏开始时可自选阴阳状态。你使用锦囊牌时，你可以：阳：对自己造成1点伤害并摸已损失体力值数张牌；阴：令一名角色弃置另一名角色1张牌并受到其造成的1点伤害。若你因此技能进入濒死，你将体力值回复至1点。';
                        }
                    },
                    liuyikubai(player) {
                        if (player.storage.liuyikubai == 0) return "锁定技，你于回合内使用每种颜色的第一张牌时你摸一张牌；你的回合内，其他角色只能使用你使用过的颜色的牌。";
                        if (player.storage.liuyikubai == 1) return "锁定技，你于回合内使用每种花色的第一张牌时，你摸一张牌；你的回合内其他角色只能使用你使用过的花色的牌。";
                        return "锁定技，你于回合内使用每种点数的第一张牌时，你摸一张牌；你的回合内，其他角色只能使用你使用过的点数的牌。";
                    },
                },
                translate: {
                    liuyishiju: "势举",
                    liuyishiju_info: "锁定技。你使用牌结算结束后，若此牌与上一张被使用的牌：类别相同，你获得牌堆顶的一张牌；花色相同：你获得牌堆底的一张牌。乘势: 若牌名也相同，你获得或升级技能“枯白”",
                    liuyikubai: "枯白",
                    liuyikubai_info: "1级：锁定技，你于回合内使用每种颜色的第一张牌时你摸一张牌；你的回合内，其他角色只能使用你使用过的颜色的牌。<br>2级：锁定技，你于回合内使用每种花色的第一张牌时，你摸一张牌；你的回合内其他角色只能使用你使用过的花色的牌。<br>3级：锁定技，你于回合内使用每种点数的第一张牌时，你摸一张牌；你的回合内，其他角色只能使用你使用过的点数的牌。",
                    dczhidui: '智对',
                    dczhidui_info: '你使用牌时，若与上一张被使用的牌牌名字数与类型皆相同，你可选择一项执行：1.摸两张牌；2.使此牌不计入次数限制，若皆不同此技能本回合失效。',
                    dcjiesi: '捷思',
                    dcjiesi_info: '出牌阶段限一次，你获得一张指定牌名字数的牌，若本阶段未以此法获得过该牌名，你可弃置此牌牌名字数张牌，令此技能视为未发动过。',
                    dcrenshuang: '纫霜',
                    dcrenshuang_info: '锁定技，你的体力值变为1时，复原你的武将牌，然后你可视为使用1张普通锦囊牌（每种牌名每轮限一次）。',
                    dcjuanji: '狷急',
                    dcjuanji_info: '出牌阶段每项限一次，你可以：1.令你与一名其他角色各回复X点体力，然后对你与其各造成X点伤害；2.弃置至多X名其他角色各1张牌，然后将你的武将牌翻面；3.摸X张牌，然后你弃置等量张牌。（X为本回合此技能发动次数）',
                    dcjuemou: '绝谋',
                    dcjuemou_info: '转换技，游戏开始时可自选阴阳状态。你使用锦囊牌时，你可以：阳：对自己造成1点伤害并摸已损失体力值数张牌；阴：令一名角色弃置另一名角色1张牌并受到其造成的1点伤害。若你因此技能进入濒死，你将体力值回复至1点。',
                    dcfuzhan: '复盏',
                    dcfuzhan_info: '限定技，有角色脱离濒死时，你可回复满体力值，然后修改“绝谋”。',
                    dczhouxi: '骤袭',
                    dcchijin: '恃衿',
                    dczhouxi_info: '骤袭',
                    dcchijin_info: '恃衿',
                    dcqingleng: '清冷',
                    dczhendu: '酖毒',
                    dcqingleng_info: '你成为黑色非转化牌的目标后，你可以弃置任意一名角色一张牌。若此弃牌：是装备牌，该黑色牌对你无效；不是装备牌，你可将该黑色牌视为列入下次“酖毒”可使用的牌中。',
                    dczhendu_info: '出牌阶段结束时，你可以展示至多5张基本或普通锦囊牌，然后你的下个回合开始时视为依次使用这些牌（无距离限制）。你使用这些牌期间有角色回复体力或受到伤害后，你摸一张牌（因此摸到的牌不计本回合手牌上限）。',
                    "dizhu_yingyou": "应有",
                    "dizhu_yingyou_info": "锁定技，你的回合开始阶段、回合结束阶段、受到伤害后，你可选择一项：1.随机获得一个“五虎上将”的技能；2.将一张〖诸葛连弩〗置于你的装备区；3.获得10吨“馒头”标记。然后你摸一张牌。（“馒头”：你使用手牌时，可以消耗等同于此牌点数的“馒头”，令此牌的效果额外结算一次）",
                    'sxrmhanguo': '撼国',
                    'sxrmweiwo': '唯我',
                    'sxrmwushen': '武神',
                    'sxrmrende': '仁德',
                    'sxrmqingnang': '青囊',
                    'sxrmlongyin': '龙吟',
                    'sxrmhanguo_info': '每轮开始时,你可以扣置一名上轮未选择过的其他角色所有牌直到本轮结束，本轮内:你对其使用的【杀】对其造成伤害后其死亡;其可以发动无势力限制的“护驾”且响应的角色获得你一张牌。',
                    'sxrmweiwo_info': '限定技，结束阶段，你可令至多三名其他角色各获得“仁德”“青囊”“龙吟”中的一个不同技能且这些技能仅能对你发动；然后你获得“武神”。',
                    'sxrmwushen_info': '锁定技，你的♥手牌视为无距离限制的【杀】。',
                    'sxrmrende_info': '出牌阶段，你可以将任意张手牌交给其他角色。当你以此法于一回合内给出第二张牌时，你回复1点体力。',
                    'sxrmqingnang_info': '出牌阶段限一次，你可以弃置一张手牌并令一名角色回复一点体力。',
                    'sxrmlongyin_info': '当一名角色于其出牌阶段内使用【杀】时，你可弃置一张牌令此【杀】不计入出牌阶段使用次数，若此【杀】为红色，你摸一张牌。',
                    sxrmhujia: '护驾',
                    sxrmhujia_info: '当你需要使用或打出一张【闪】时，你可以令其他角色选择是否打出一张【闪】。若有角色响应，则你视为使用或打出了一张【闪】。',
                    'weizhongtao': '众讨',
                    'weijizhan': '极斩',
                    'weizhongtao_info': '出牌阶段限一次，你可选择1种花色（你每损失1点体力值可额外选择1种），然后随机从场上、弃牌堆或牌堆获得你选择花色的各1张牌。若如此做，你使用过3种类别的牌后，此技能视为未发动过。',
                    'weijizhan_info': '连招技（装备牌+黑色牌）你选择一项：①弃置其他角色共计至多X张牌；②对一名其他角色造成X点伤害，然后此技能本回合失效（X为“极斩”本回合发动次数）。',
                    'mdtxjuanmou': '隽谋',
                    'mdtxzhanyan': '绽炎',
                    'mdtxjuanmou_info': '转换技，游戏开始时可自选阴阳状态，若你成为牌的目标，此牌结算后你可选择一张手牌，阳：此牌视为无次数、距离限制的火【杀】并摸一张牌，你可额外摸一张牌令此技能失效至本阶段结束；阴：此颜色牌不计入手牌上限并横置一名角色，你可额外横置一名角色令此技能失效至本阶段结束。',
                    'mdtxzhanyan_info': '限定技，出牌阶段，你可选择任意名横置的其他角色并回复等量体力，所选角色同时展示一张手牌，你可弃置相同花色牌并对对应角色造成1点火焰伤害，若所选角色皆受到伤害重复此流程，此技能结算期间你每失去一张牌则摸一张牌。',
                    'sbfmqianfu': '薪传',
                    'sbfmjinjin': '金烬',
                    'sbfmqianfu_info': '当你使用的锦囊牌置入弃牌堆后，你可以令一名角色依次摸X张牌并依次弃置X张牌（X为本回合弃牌堆缺失的花色数），若其手牌数变为体力值，其下家继续执行剩余流程。',
                    'sbfmjinjin_info': '你可以移出本回合弃牌堆中任意张不同花色的牌并失去本技能，视为使用一张普通锦囊牌，然后你下次受到伤害的回合结束时令一名角色获得移出牌和本技能。',
                    'dcsqcangming': '沧溟',
                    'dcsqchouxi': '筹汐',
                    'dcsqjichao': '激潮',
                    'dcsqcangming_info': '锁定技，游戏开始时，所有角色将手牌置于武将牌上，称为“溟”。有牌进入“溟”时，每有一种颜色牌，你摸一张牌。一名角色受到伤害后或回合开始时，该角色获得其武将牌上的“溟“。',
                    'dcsqchouxi_info': '出牌阶段，你可以将一张牌当“溟"里的一张基本牌或普通锦囊牌使用(每种牌名每回合限一次)，以此法使用的牌无距离和次数限制。',
                    'dcsqjichao_info': '出牌阶段限一次，你可以选择一项:1.令一名其他角色随机将一半数量的手牌(向上取整)和装备区里的牌置于武将牌上称为“溟";2,令所有其他角色将所有牌置于武将牌上称为"溟"，然后此选项失效直到你累计造成三点伤害。',
                    bossbingling: '冰伶',
                    bossbingling_info: '当你使用杀指定目标时，你可弃置目标角色2张牌。若这两张牌类别/花色/牌名字数/点数相同，则你获得这两张牌/回复一点体力/摸相当于其中一张牌名字数的牌/令其失去所有体力；若皆不同，则你受到一点无来源的火焰伤害。',
                    weishuren: "淑任",
                    weishuren_info: "出牌阶段限一次，你可废除一个装备栏，亮出牌堆顶三张牌，你选择其中一张牌获得并可选择一名其他角色获得其中一张牌，若此装备栏有牌则此技能视为未发动过并恢复1点体力。",
                    weisaran: "飒然",
                    weisaran_info: "你的装备区每有一张牌，你出牌阶段可使用的【杀】次数+1。你受到或造成一点伤害后，从牌堆或弃牌堆中随机使用一张装备牌，若有废除的装备栏可先选择一个装备栏恢复。",
                    'olsaying':'飒影',
                    'oldongxin':'恫心',
                    'olsaying_info':'出牌阶段开始时，你可获得一名其他角色区域内的一张牌，然后若你在其攻击范围内，其可对你使用一张【杀】，若你不在其攻击范围内，本轮你与其均视为在对方的攻击范围内。',
                    'oldongxin_info':'每回合各限一次，当你造成或受到伤害后，你可弃置受伤角色X+1张牌对伤害来源造成一点伤害（X为受伤角色已损失体力值）。然后你获得其中的【杀】且你使用这些【杀】无次数限制。',
                    sbzhenwei: '镇围',
			        sbzhenwei_info: '出牌阶段限一次，你可与一名其他角色同时选择是否弃置任意张牌。然后你可执行至多X项(X为你弃置牌大于等于其的条件数：1.牌数；2.花色数）：1.对其造成1点伤害；2.摸两张牌。',
			        sbheyuan: '合援',
			        sbheyuan_info: '结束阶段每名角色限一次，你可选择一名已受伤角色并弃置X张牌（X为你上次发动镇围时弃置的牌数），令其执行上次“镇围”执行的最后一项，且此后你对除其以外的角色发动“镇围”时，该角色也可选择弃置牌（视为你弃置的牌）。',
                },
            },
            intro: "", author: "非凡欧德内里", diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": [], "card": [], "skill": [] }
    }
};
