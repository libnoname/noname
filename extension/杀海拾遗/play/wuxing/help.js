import html from "../../../../game/dedent.js";

const help = {
	五行生克: {
		/**
		 * “五行生克”模式的帮助信息。
		 * @type { string }
		 */
		template: html`
			<div style="margin: 20px; font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6;">
				<h3 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; margin-bottom: 15px;">五行生克 规则说明</h3>

				<div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #4CAF50;">
					<h4 style="margin-top: 0; margin-bottom: 10px; color: #4CAF50;">基本规则:</h4>
					<ul style="list-style: disc; padding-left: 20px; margin: 0;">
						<li>每名角色在游戏开始时随机获得一个五行属性 (金、木、水、火、土)。</li>
						<li>牌堆中约 <strong>1/3</strong> 的卡牌会随机获得一个五行属性。</li>
					</ul>
				</div>

				<div style="margin-bottom: 15px; padding: 10px; background-color: #eef7ff; border-radius: 5px; border-left: 4px solid #2196F3;">
					<h4 style="margin-top: 0; margin-bottom: 10px; color: #2196F3;">属性交互:</h4>
					<ul style="list-style: none; padding-left: 0; margin: 0;">
						<li>
							<strong style="color: #f44336;">【相克】</strong>
							当一名角色成为<strong style="color: #f44336;">克制自身属性</strong>的卡牌目标时：必须<strong>弃置</strong>一张手牌。
						</li>
						<li>
							<strong style="color: #8BC34A;">【相生】</strong>
							当一名角色成为<strong style="color: #8BC34A;">生成自身属性</strong>的卡牌目标时：必须<strong>摸取</strong>一张牌。
						</li>
					</ul>
				</div>

				<div style="margin-bottom: 15px; padding: 10px; background-color: #fff8e1; border-radius: 5px; border-left: 4px solid #FFC107;">
					<h4 style="margin-top: 0; margin-bottom: 10px; color: #FFC107;">生克循环:</h4>
					<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
						<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
							<strong style="color: #FFC107; border-bottom: 1px solid #FFC107;">金 (Metal)</strong><br />
							<span style="color: #f44336;">克</span> 木 (Wood)<br />
							<span style="color: #8BC34A;">生</span> 水 (Water)
						</div>
						<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
							<strong style="color: #4CAF50; border-bottom: 1px solid #4CAF50;">木 (Wood)</strong><br />
							<span style="color: #f44336;">克</span> 土 (Earth)<br />
							<span style="color: #8BC34A;">生</span> 火 (Fire)
						</div>
						<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
							<strong style="color: #2196F3; border-bottom: 1px solid #2196F3;">水 (Water)</strong><br />
							<span style="color: #f44336;">克</span> 火 (Fire)<br />
							<span style="color: #8BC34A;">生</span> 木 (Wood)
						</div>
						<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
							<strong style="color: #f44336; border-bottom: 1px solid #f44336;">火 (Fire)</strong><br />
							<span style="color: #f44336;">克</span> 金 (Metal)<br />
							<span style="color: #8BC34A;">生</span> 土 (Earth)
						</div>
						<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
							<strong style="color: #795548; border-bottom: 1px solid #795548;">土 (Earth)</strong><br />
							<span style="color: #f44336;">克</span> 水 (Water)<br />
							<span style="color: #8BC34A;">生</span> 金 (Metal)
						</div>
					</div>
					<small style="display: block; text-align: center; margin-top: 10px; color: #777;"> (温馨提醒：上古时代的老扩展了，希望你能喜欢) </small>
				</div>
			</div>
		`,
		/**
		 * 暂时没有，但不排除以后会有喵。
		 * @returns { object } 返回一个空对象。
		 */
		setup() {
			return {};
		},
	},
};

export default help;
