# Audio 章节

本章节将简单的介绍：

- Audio音频的格式
- Audio音频的用法

## 一、Audio音频的格式

*下列音频将以`wusheng`和`paoxiao`为例，其中:
- `wusheng`为`wusheng: {audio: [示例写法]}`,
- `paoxiao`为`paoxiao: {audio: 2}`,
- 默认路径为`skill/`。

### 基础用法:

- **`false`:** 不播放语音。
- **`true`:** 播放默认路径下与技能名或角色名一致的音频。
  *eg.* `true`
  -> `["skill/wusheng.mp3"]`。
- **数字:** 播放默认路径下以数字做后缀的音频文件。
  *eg.* `2`
  -> `["skill/wusheng1.mp3", "skill/wusheng2.mp3"]`。
- **字符串(引用):** 播放对应引用技能或角色的音频。
  *eg.* `"paoxiao"`
  -> `["skill/paoxiao1.mp3", "skill/paoxiao2.mp3"]`。

### 指定路径播放:

- **路径:** 直接按指定的音频路径播放。
  *eg.* `"ext:无名扩展/audio/wusheng_custom.mp3"`
  -> `["ext:无名扩展/audio/wusheng_custom.mp3"]`
- **路径 + true:** 播放指定路径下与技能名或角色名一致的音频。
  *eg.* `"ext:无名扩展/audio:true:mp3"`
  -> `["ext:无名扩展/audio/wusheng.mp3"]`
- **路径 + 数字:** 播放指定路径下以数字后缀命名的音频。
  *eg.* `"ext:无名扩展/audio:2"`
  -> `["ext:无名扩展/audio/wusheng1.mp3", "ext:无名扩展/audio/wusheng2.mp3"]`

*在 `路径 + true` 和 `路径 + 数字` 格式中，路径与 `true` 或数字之间使用的是 "`:`" 不是 "`/`"，`true` 或数字与文件类型之间也是用 "`:`" 不是 "`.`"。若后缀为 "`:mp3`"，可以省略。

### 高级组合播放:

- **`[引用/地址, 数量]` (仅限技能):** 播放引用的技能或指定地址的音频，并限制播放前 n 个。
  *eg.* `["paoxiao", 1]`
  -> `["skill/paoxiao1.mp3"]`
- **`[任意组合]`:** 在一个数组中可组合使用以上任意格式，最终将播放所有分析后结果的组合。
  *eg.* `["paoxiao", "ext:无名扩展/audio:true"]`
  -> `["skill/paoxiao1.mp3", "skill/paoxiao2.mp3", "ext:无名扩展/audio/wusheng.mp3"]`

#### 台词配对:

- 在 `lib.translate` 中，以 "`#`" 开头的键值对存放技能台词，其键的格式为 "`#[音频地址]:[后缀]`"(技能没有后缀)。
- 音频地址不应包含文件后缀(例如 ".mp3")；若音频存于默认路径(如 `skill/`, `die/`等)，路径也应省略。






## 二、Audio音频的用法

### Skill 技能:

#### 用法:
为技能的audio属性赋值。
*eg.* `wusheng: {audio: 2}`

#### 默认值:
技能音频的默认路径为`skill/`
技能音频的默认值为`[true, 2]`
-> `[skill/[技能名].mp3, skill/[技能名]1.mp3, skill/[技能名]2.mp3]`

#### 自定义音频名称:
- **`audioname`:** 一个包含角色名后缀的数组。
*eg.* `wusheng: {audio: 2, audioname: ["zhangfei"]}`
-> `["skill/wusheng_zhangfei1.mp3", "skill/wusheng_zhangfei2.mp3"]`(张飞使用 `wusheng` 时)
- **`audioname2`:** 一个键值对映射，可为不同的角色指定新的 `audio`。
*eg.* `wusheng: {audio: 2, audioname2: { zhangfei: "ext:无名扩展/audio:true" }}`
-> `["ext:无名扩展/audio/wusheng.mp3"]`(张飞使用 `wusheng` 时)

#### 台词配对:
- 在 `lib.translate` 中，"`#[音频地址]`"格式的键值对存放技能台词。
*eg.* `wusheng: {audio: 2}` 
-> "`#wusheng1`", "`#wusheng2`"
*eg.* `wusheng: {audio: "ext:无名扩展/audio:2"}`
-> "`#ext:无名扩展/audio/wusheng1`", "`#ext:无名扩展/audio/wusheng2`" 
*eg.* `wusheng: {audio: "ext:无名扩展/audio/wusheng_custom.mp3"}`
-> "`#ext:无名扩展/audio/wusheng_custom`" 
*eg.* `wusheng: {audio: 2, audioname: ["zhangfei"]}`
-> "`#wusheng1`", "`#wusheng2`", "`#wusheng_zhangfei1`", "`#wusheng_zhangfei2`", 
*eg.* `wusheng: {audio: 2, audioname2: { zhangfei: "ext:无名扩展/audio:true" }}`
-> "`#wusheng1`", "`#wusheng2`", "`#ext:无名扩展/audio/wusheng`"


### Die 阵亡:

#### 用法:
- 为Character实例的dieAudios属性赋值。
*eg.* `lib.character.guanyu.dieAudios = [true, "ext:无名扩展/audio/die:true"]`
- 在Character的数组形式中填写任意个"die:xxx"。
*eg.* `guanyu: ["male", "shu", 4, ["wusheng"], ["die:true", "die:ext:无名扩展/audio/die:true"]]`

#### 默认值:
技能音频的默认路径为`die/`
阵亡音频的默认值为`true`
-> `["die/[角色名].mp3"]`

#### 台词配对:
- 在 `lib.translate` 中，"`#[音频地址]:die`"格式的键值对存放技能台词。
*eg.* `lib.character.guanyu.dieAudios = 2` 
-> "`#guanyu1:die`", "`#guanyu2:die`"
*eg.* `lib.character.guanyu.dieAudios = "die:ext:无名扩展/audio/die:true"`
=> "`#ext:无名扩展/audio/die/guanyu:die`"
*eg.* `lib.character.guanyu.dieAudios = "ext:无名扩展/audio/guanyu_custom.mp3"`
-> "`#ext:无名扩展/audio/guanyu_custom:die`" 