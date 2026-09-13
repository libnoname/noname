# 黛玉风华资源说明

图片由内置 imagegen 工具生成，原始生成文件保留在 Codex generated_images；本项目引用扩展 theme 与本体 image/hlhj/theme 的副本。没有使用 CLI/API 备用路径。原始 hlhj_daiyu.svg 为既有题笺立绘。归梦背景现使用独立月夜庭院，不再使用竹影背景调色。

## theme/jiangzhu-dream-garden.png

内置 imagegen 生成，保存到扩展 theme/jiangzhu-dream-garden.png，并同步到本体 image/hlhj/theme/jiangzhu-dream-garden.png。最终生成提示词：

> Use case: stylized-concept. Asset type: finished landscape background for a Chinese Dream of the Red Chamber card game. Create an independent 绛珠归梦 dream garden background, wide 16:9 composition. A moonlit ancient Chinese waterside garden, arched white jade bridge crossing misty still water, an elegant distant pavilion to the left, soft drooping willow and pale pink flowering branches framing the outer edges, a scattering of crimson petals resting on the water. Full moon high right with soft silver light, midnight plum and muted blue green shadows, delicate pearl and dusty rose highlights. Refined detailed Chinese fantasy gongbi painterly realism, wistful tranquil atmosphere. Center stays visually quiet, dark and open for cards and character interface; landscape fills frame. No people, no figures, no text, no logo, no watermark, no border, no interface. This must be its own scene and composition, not a recolor of a bamboo garden. Generate one finished image.

## 当前歌单

使用用户提供的音频文件：竹窗听雨/竹窗听雨1.mp3、竹窗听雨/竹窗听雨2.mp3、绛珠归梦/绛珠归梦1.mp3、绛珠归梦/绛珠归梦2.mp3、绛珠归梦/绛珠归梦3.m4a。播放器与扩展资源清单共用 theme/catalog.js；增删音频后使用 scripts/sync-hlhj-theme.mjs 更新。以下旧WAV仅保留历史来源说明，不再用于播放。

## theme/daiyu-dream.png

内置 imagegen，身份与画风参考图：theme/daiyu-bamboo.png。最终生成提示词：

> Create the missing alternate character portrait for Lin Daiyu, Crimson Pearl Fairy, theme 绛珠归梦. Reference image is her existing 潇湘竹影 portrait: preserve this same adult Chinese woman's facial identity, delicate willow eyebrows, wistful almond eyes, long black hair, small white jade flower hairpin, and exquisite gongbi painterly rendering. Make a genuinely distinct composition: she turns gently toward the viewer, holds a translucent teardrop-shaped jade pendant by a crimson silk thread above an open palm, compassionate sorrow and quiet resolve. Flowing dignified ivory and muted lotus-pink hanfu with silver-lilac silk accents, loose ribbon and a few floating fallen petals. A luminous moonlit dream garden with silver mist and faint arched jade bridge behind her. Portrait 2:3, half body, face clearly framed in upper third and legible as small game avatar. Dusty rose, midnight plum, silver purple, warm pearl highlights. Refined realistic anatomy, soft luminous skin, rich painted silk detail, Chinese fantasy card-game illustration. No poetry book, no text, no logo, no watermark, no border, no UI, no modern objects. Standalone completed character art; original reference is only a visual identity/style reference.

## theme/daiyu-bamboo.png

最终生成提示词：

> Finished game character portrait illustration for Lin Daiyu, Crimson Pearl Fairy in Dream of the Red Chamber, theme 潇湘竹影. Portrait 2:3 aspect ratio. A graceful adult Chinese woman with fine willow eyebrows, almond eyes conveying quiet sorrow, long black hair half gathered with a small white jade hairpin, ivory and pale celadon layered hanfu with muted blush silk ribbon. Half body three-quarter view, face centered in upper third, holding a closed poetry book and one pink petal near her heart. Delicate bamboo and mist in softly receding background. Exquisite Chinese fantasy card-game painted art, refined gongbi linework with soft painterly shading, realistic anatomy, luminous restrained colors, detailed expressive face legible at small avatar size, no text, no logo, no border, no watermark, no modern objects, dignified nonsexual clothing. Original standalone raster art, not a card mockup.

## theme/xiaoxiang-garden.png

最终生成提示词：

> Finished widescreen 16:9 environment background for a Chinese fantasy card game, Dream of the Red Chamber theme 潇湘竹影. Quiet Xiaoxiang garden after rain at early morning, elegant bamboo groves framing the left and right, a small traditional Chinese moon gate and pavilion on the far right, pale jade pond and a few fallen pink petals, subtle ancient scholar stone. Broad central sixty percent is soft atmospheric mist and calm water, low contrast to keep gameplay legible. Refined gongbi landscape combined with cinematic painterly light, celadon, warm ivory, restrained blush. No people, no writing, no UI, no text, no border or watermark. Complete scenic composition, not an interface mockup.

## theme/zhuying.wav 与 theme/guimeng.wav

原创旋律与音色由 scripts/generate-hlhj-music.mjs 定义并渲染，分别为《竹窗听雨》与《一枕归梦》，48 秒 / 60 秒，22050 Hz、16 位、立体声 WAV。使用加法合成、包络、微量噪声和循环延迟，不包含外部音频素材，也不是古琴或笛子的真人录音。本轮执行该脚本仅为生成音乐素材，未执行测试、构建或打包。
