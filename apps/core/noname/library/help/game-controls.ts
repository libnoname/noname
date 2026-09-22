import html from "dedent";

export default html`
	<ul>
		<li>长按/鼠标悬停/右键单击显示信息。</li>
		<li>触屏模式中，双指点击切换暂停；下划显示菜单，上划切换托管。</li>
		<li>
			键盘快捷键<br>
			<table>
				<tr><td>A</td><td>切换托管</td></tr>
				<tr><td>W</td><td>切换不询问无懈</td></tr>
				<tr><td>空格</td><td>暂停</td></tr>
			</table>
		</li>
		<li>
			编辑牌堆<br>
			在卡牌包中修改牌堆后，将自动创建一个临时牌堆，在所有模式中共用，当保存当前牌堆后，临时牌堆被清除。每个模式可设置不同的已保存牌堆，设置的牌堆优先级大于临时牌堆。
		</li>
	</ul>
`;
