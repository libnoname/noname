declare interface NonameAssemblyType {
	checkBegin: Record<string, Function>;

	checkCard: {
		/**
		 *
		 * @param card - 检查的卡牌
		 * @param event - 当前检查的事件
		 */
		updateTempname(card: Card, event: GameEvent): void;
	};

	checkTarget: {
		/**
		 *
		 * @param target - 检查的玩家
		 * @param event - 当前检查的事件
		 */
		updateInstance(target: Player, event: GameEvent): void;
		/**
		 * 添加目标角色的提示
		 *  @param target - 检查的玩家
		 * @param event - 当前检查的事件
		 */
		addTargetPrompt(target: Player, event: GameEvent): void;
	};

	checkButton: Record<string, Function>;

	checkEnd: {
		/**
		 *
		 * @param event - 当前检查的事件
		 * @param config - 一些配置
		 */
		autoConfirm(
			event: GameEvent,
			config: { ok: boolean; auto: boolean; autoConfirm: boolean }
		): void;
		/**
		 * 为主动技添加全选按钮喵
		 *
		 * @param event - 当前检查的事件
		 * @param _
		 */
		createChooseAll(
			event: GameEvent,
			_: unknown
		): void;
	};

	uncheckBegin: {
		/**
		 * 清理不需要的全选按钮喵
		 * 
		 * @param event 
		 * @param _
		 * @returns 
		 */
		destroyChooseAll(
			event: GameEvent,
			_: unknown
		): void;
	};

	uncheckCard: {
		/**
		 *
		 * @param card - 取消检查的卡牌
		 * @param event - 当前检查的事件
		 */
		removeTempname(card: Card, event: GameEvent): void;
	};

	uncheckTarget: {
		/**
		 *
		 * @param target - 取消检查的玩家
		 * @param event - 当前检查的事件
		 */
		removeInstance(target: Player, event: GameEvent): void;
		/**
		 * 删除目标角色的提示
		 * @param target - 取消检查的玩家
		 * @param event - 当前检查的事件
		 */
		removeTargetPrompt(target: Player, event: GameEvent): void;
	};

	uncheckButton: Record<string, Function>;

	uncheckEnd: Record<string, Function>;

	checkOverflow: {
		updateDialog(itemOption: Row_Item_Option, itemContainer: HTMLDivElement, addedItems: HTMLDivElement[] | undefined, game: Game): void;
	};
	checkTipBottom: {
		undateTipBottom(player: Player): void;
	};

	checkDamage1: {
		kuanggu(event: GameEvent, player: Player): void;
		jyliezhou(event: GameEvent, player: Player): void;
	};

	checkDamage2: Record<string, Function>;

	checkDamage3: {
		jiushi(event: GameEvent, player: Player): void;
	};

	checkDamage4: Record<string, Function>;

	checkDie: Record<string, Function>;

	checkUpdate: Record<string, Function>;

	checkSkillAnimate: Record<string, Function>;

	addSkillCheck: Record<string, Function>;

	removeSkillCheck: {
		checkCharge(skill: string, player: Player): void;
	};

	refreshSkin: Record<string, Function>;
}
