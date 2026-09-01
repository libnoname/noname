/**
 * 联机断线重连的纯决策逻辑。
 *
 * 从 `lib.element.ws.onclose` 中抽离，仅根据传入状态返回应执行的动作，
 * 不含任何副作用（setTimeout / game.connect / game.reload / DOM 操作），
 * 因此可被单元测试覆盖。副作用由调用方（onclose）根据返回的 action 执行。
 *
 * @typedef {Object} ReconnectState
 * @property {boolean} wasOnline    断开前是否处于联机态（game.online || game.onlineroom）
 * @property {boolean} wasGameOver  是否为正常游戏结束（无需重连）
 * @property {boolean} noReconnect  是否用户主动退出 / 被踢（走 reload，不重连）
 * @property {boolean} reconnecting 是否正处于重试链中（用于纯大厅等 wasOnline 已为 false 的续连）
 * @property {boolean} hasIp        是否存在可重连地址（_status.ip）
 * @property {number}  attempts     已尝试重连次数（_status.reconnectAttempts）
 * @property {number}  [maxAttempts=5] 最大重试次数
 *
 * @typedef {{action: "none"}
 *   | {action: "reload"}
 *   | {action: "retry", delay: number, nextAttempts: number}} ReconnectDecision
 *
 * @param {ReconnectState} state
 * @returns {ReconnectDecision}
 */
export function decideReconnect(state) {
	const { wasOnline, wasGameOver, noReconnect, reconnecting, hasIp } = state;
	const attempts = state.attempts ?? 0;
	const maxAttempts = state.maxAttempts ?? 5;

	// 是否需要重连：本次为联机中的异常断开，或正处于重试链中（续连）。
	// 用独立的 reconnecting 标志驱动续连，避免依赖 onlineroom/online —— 纯大厅
	// 场景下二者在重试期间均为 false，否则重试链会中断、重连遮罩卡住。
	const shouldReconnect = (wasOnline && !wasGameOver) || reconnecting;
	if (!shouldReconnect) {
		return { action: "none" };
	}

	// 用户主动退出 / 被踢、无可重连地址、或重试已耗尽 —— 回退到刷新
	if (noReconnect || !hasIp || attempts >= maxAttempts) {
		return { action: "reload" };
	}

	// 指数退避：1s → 2s → 4s → 8s → 15s（封顶 15s）
	const delay = Math.min(1000 * Math.pow(2, attempts), 15000);
	return { action: "retry", delay, nextAttempts: attempts + 1 };
}

/**
 * 清除重连链的进行中状态。
 *
 * 必须在「协议层确认联机态已恢复」时调用，而不是 WebSocket open 时——传输层
 * 连通不代表已重新联机。恢复入口有两个：大厅连接走 `roomlist`，直连房主
 * （game.createServer 自起的 8080 服务端，不经大厅）走 `reinit`，二者都要调用，
 * 否则直连模式下重连成功后计数不清零、重连遮罩也不会收起。
 *
 * @param {{reconnectAttempts?: number, reconnecting?: boolean}} status 通常为 `_status`
 */
export function clearReconnectState(status) {
	status.reconnectAttempts = 0;
	status.reconnecting = false;
}
