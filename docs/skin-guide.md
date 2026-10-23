# skin 章节

本章节将简略介绍无名杀使用的更换原画/更换皮肤的方式

# 一、changeSkin

无名杀为十周年谋定天下、手杀曹髦、势太史慈等多原画武将使用的更换原画的方式
以势魏延`pot_weiyan`为例

## 1.武将须在lib.characterSubstitute中存在定义
具体格式为：
```javascript
lib.characterSubstitute["pot_weiyan"] = [
	["pot_weiyan_achieve", []],
	["pot_weiyan_fail", []],
]
```

该写法为武将`pot_weiyan`添加了两个可更换的原画，分别为：
-	〖忠傲〗使命成功后更换的火龙果形态`pot_weiyan_achieve`
-	〖忠傲〗使命失败时更换的雨中吕布形态`pot_weiyan_fail`

每个原画在lib.characterSubstitute中对应的值均为长度为2的数组，第一项为该原画对应的id，第二项用于存放原画信息，其在功能上等同于数组形式character的第五格`lib.character[4]`，一般用于存放对应原画路径和该原画的阵亡语音


## 2.原画路径和阵亡语音
信息格为空的情况下，原画和阵亡语音均走默认路径
例：
```javascript
["pot_weiyan_achieve", []],
```
该写法下，对应原画路径为`image/character/pot_weiyan_achieve.jpg`，对应阵亡语音路径为`audio/die/pot_weiyan_achieve.mp3`

### 2.1原画路径
需要自定义原画路径时，只需在信息格中填入符合格式的路径即可，格式与自定义武将的路径相同
例如：

1.为武将势魏延`pot_weiyan`添加一张原画`pot_weiyan_achieve`，使用武将孙策`sunce`的原画
```javascript
["pot_weiyan_achieve", ["character:sunce"]],
```

2.为武将势魏延`pot_weiyan`添加一张原画`pot_weiyan_achieve`，使用指定扩展`无名扩展`中的图片`weiyan.jpg`作为原画
```javascript
["pot_weiyan_achieve", ["ext:无名扩展/weiyan.jpg"]],
```
最终路径为`extension/无名扩展/weiyan.jpg`

### 2.2阵亡语音
同样，需要自定义阵亡语音时，只需按自定义武将的阵亡语音格式填入信息格中
例如：

1.为武将势魏延`pot_weiyan`添加一张原画`pot_weiyan_achieve`，使用原皮`pot_weiyan`的阵亡语音
```javascript
["pot_weiyan_achieve", ["die:pot_weiyan"]],
```

2.为武将势魏延`pot_weiyan`添加一张原画`pot_weiyan_achieve`，其阵亡语音为放在`无名扩展`中`die`文件夹下的同名语音`pot_weiyan_achieve.mp3`
```javascript
["pot_weiyan_achieve", ["die:ext:无名扩展/die:true"]],
```
最终路径为`extension/无名扩展/die/pot_weiyan_achieve.mp3`

3.为武将势魏延`pot_weiyan`添加一张原画`pot_weiyan_achieve`，使用指定扩展`无名扩展`中的语音`weiyan.mp3`作为阵亡语音
```javascript
["pot_weiyan_achieve", ["die:ext:无名扩展/weiyan.mp3"]],
```
最终路径为`extension/无名扩展/weiyan.mp3`
### 阵亡语音还有其他可选择的格式，也可为一张原画添加多个阵亡语音，详细了解请查看 audio-guide.md 文件 ###

### 2.3扩展使用例
为扩展`无名扩展`中的武将`noname_sunce`添加一张原画`noname_sunce_shadow`，原画在`无名扩展/image`下，阵亡语音在`无名扩展/die`下
```javascript
lib.characterSubstitute["noname_sunce"] = [
	["noname_sunce_shadow", ["ext:无名扩展/image/noname_sunce_shadow.jpg", "die:ext:无名扩展/die:true"]],
]
```


## 3.具体应用
为武将添加好原画后，就可以在游戏内进行切换。切换方式为函数`player.changeSkin`
`changeSkin`接收`map`和`character`两个函数

### 3.1 map
map用于定位要进行原画切换的武将牌，接受两种类型的参数：
假设player为主将势魏延`pot_weiyan`和副将手杀曹髦`mb_caocao`双将

1.object类型：该参数下会细分多种情况进行处理：
-	①[map.skill]：将`map.skill`的值作为skill处理，更换武将牌上持有技能`map.skill`的武将牌，如
		```javascript
		player.changeSkin("potzhongao", "pot_weiyan_achieve")
		```
--		仅会更换持有技能〖忠傲〗`potzhongao`的武将牌`pot_weiyan`的原画为`pot_weiyan_achieve`，不会影响到另一张武将牌`mb_caocao`

-	②[map.characterName]：更换对应id为`map.characterName`的武将牌，如
		```javascript
		player.changeSkin({ characterName: "pot_weiyan" }, "pot_weiyan_achieve")
		```
--		仅会更换武将牌`pot_weiyan`的原画为`pot_weiyan_achieve`，不会影响到另一张武将牌`mb_caocao`

-	③[map.characterSkinName]：更换对应`player.skin[name]`为`map.characterSkinName`的武将牌，如
		```javascript
		player.changeSkin({ characterSkinName: "pot_weiyan_achieve" }, "pot_weiyan_fail")
		```
--		仅会将当前原画为`pot_weiyan_achieve`的武将牌`pot_weiyan`更换为原画`pot_weiyan_fail`，不会影响到另一张武将牌`mb_caocao`

-	④[map.source]：传入值为`name`/`name1`/`name2`，更换所在位置为`player[map.source]`的武将牌，如
		```javascript
		player.changeSkin({ source: "name1" }, "pot_weiyan_achieve")
		```
--		仅会将玩家在`player.name1`处的主将`pot_weiyan`更换为原画`pot_weiyan_achieve`，不会影响到副将`mb_caocao`

2.字符串[string]：该参数下map会被当作skill处理，后续判断等同`map.skill`的情况

### 3.2 character
character即为要更换的目标原画，如上文中：
```javascript
player.changeSkin({ characterName: "pot_weiyan" }, "pot_weiyan_achieve")
```
就是将武将原画变更为[character]对应的`pot_weiyan_achieve`

### 3.3 使用例
可以查看手杀曹髦、势魏延、势太史慈、新杀谋周瑜等拥有多原画的武将来进行参考，这里给出几个简化后的使用例

①势魏延发动〖忠傲〗使命成功后更换武将原画`pot_weiyan_achieve`
```javascript
player.changeSkin("potzhongao", "pot_weiyan_achieve");
```

②新杀谋周瑜根据转换技〖英谋〗的状态更换武将原画，阳：`dc_sb_zhouyu`；阴：`dc_sb_zhouyu_shadow`;
```javascript
const type = player.storage["dcsbyingmou"];
player.changeSkin({ characterName: "dc_sb_zhouyu" }, "dc_sb_zhouyu" + (type ? "_shadow" : ""));
```

③手杀笮融根据发动〖净土〗选择的选项更换武将原画，黑：`mb_zerong_black`；红：`mb_zerong_red`；背水：`mb_zerong_all`
```javascript
const choice = result.control;
player.changeSkin({ characterName: "mb_zerong" }, `mb_zerong_${choice}`);
```

④OL谋袁绍发动〖合讨〗更换为原画`ol_sb_yuanshao`，发动〖神离〗更换为原画`ol_sb_yuanshao_shadow`;
```javascript
player.changeSkin("olsbhetao", "ol_sb_yuanshao");
player.changeSkin("olsbshenli", "ol_sb_yuanshao_shadow");
```


# 二、本体换肤

### 兼容性较低，处于半废弃状态，慎用 ###

打开[选项-选项-外观]处的[开启换肤]功能启用此效果
启用后，无名杀会读取位于`与原画所在文件夹同级的skin文件夹下以该武将id命名的文件夹A下的图片`作为该武将的可用皮肤
若该武将使用了changeSkin创建了多张原画，一张皮肤对应的其他原画则读取`文件夹A下以该皮肤文件名命名的文件夹`中的同名原画

## 1.默认路径
①本体武将`NAME`的图片路径为`image/character/NAME.jpg`，对应的皮肤路径即为`image/skin/NAME/`，位于该路径下的图片均可作为皮肤
-	比如皮肤[谋定天下]的路径即为`image/skin/NAME/谋定天下.jpg`
-	若该武将拥有多原画`NAME_achieve`和`NAME_fail`，则皮肤[谋定天下]对应的其他原画路径为：
-	`image/skin/NAME/谋定天下/NAME_achieve.jpg`和`image/skin/NAME/谋定天下/NAME_fail.jpg`

②扩展武将的图片路径若为`extension/无名扩展/pictures/NAME.jpg`，对应的皮肤路径即为`extension/无名扩展/skin/NAME/`，位于该路径下的图片均可作为皮肤

## 2.自定义路径
允许为武将设置skinPath属性，用于自定义该武将对应的皮肤路径

①Character类：
```javascript
lib.character["sunce"] = {
	sex: "male",
	group: "wu",
	hp: 4,
	skills: ["jiang", "hunzi", "zhiba"],
	isZhugong: true,
	skinPath: "image/skin/shen_sunce/",
}
```
②数组形式
```javascript
lib.character["sunce"] = ["male", "wu", 4, ["jiang", "hunzi", "zhiba"], ["zhu", "skinPath:image/skin/shen_sunce/"]];
```
这两种写法的效果一致，为让武将标孙策[sunce]使用文件夹`image/skin/shen_sunce/`中的图片作为皮肤，实现标孙策使用神孙策的皮肤

扩展武将同理：
```javascript
lib.character["noname_sunce"].skinPath = "ext:无名扩展/skin/";
```




