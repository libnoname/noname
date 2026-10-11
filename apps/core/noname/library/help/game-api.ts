import html from "dedent";

export default html`
	<div style="margin:10px">变量名</div>
	<ul style="margin-top:0">
		<li>场上角色<br>game.players</li>
		<li>阵亡角色<br>game.dead</li>
		<li>玩家<br>game.me</li>
		<li>玩家的上/下家<br>game.me.previous/next</li>
		<li>玩家的上/下家（含阵亡）<br>game.me.previousSeat/<br>nextSeat</li>
		<li>牌堆<br>ui.cardPile</li>
		<li>弃牌堆<br>ui.discardPile</li>
	</ul>
	<div style="margin:10px">角色属性</div>
	<ul style="margin-top:0">
		<li>体力值<br>player.hp</li>
		<li>体力上限<br>player.maxHp</li>
		<li>身份<br>player.identity</li>
		<li>手牌<br>player.getCards("h")</li>
		<li>装备牌<br>player.getCards("e")</li>
		<li>判定牌<br>player.getCards("j")</li>
		<li>是否存活/横置/翻面<br>player.isAlive()/<br>isLinked()/<br>isTurnedOver()</li>
	</ul>
	<div style="margin:10px">角色操作</div>
	<ul style="margin-top:0">
		<li>受到伤害<br>player.damage(source,<br>num)</li>
		<li>回复体力<br>player.recover(num)</li>
		<li>摸牌<br>player.draw(num)</li>
		<li>获得牌<br>player.gain(cards)</li>
		<li>弃牌<br>player.discard(cards)</li>
		<li>使用卡牌<br>player.useCard(card,<br>targets)</li>
		<li>死亡<br>player.die()</li>
		<li>复活<br>player.revive(hp)</li>
	</ul>
	<div style="margin:10px">游戏操作</div>
	<ul style="margin-top:0">
		<li>在命令框中输出结果<br>game.print(str)</li>
		<li>清除命令框中的内容<br>cls</li>
		<li>上一条/下一条输入的内容<br>up/down</li>
		<li>游戏结束<br>game.over(bool)</li>
		<li>角色资料<br>lib.character</li>
		<li>卡牌资料<br>lib.card</li>
	</ul>
`;
