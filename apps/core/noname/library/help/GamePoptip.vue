<template>
	<dl class="game-poptip">
		<div v-for="item in items" :key="item.id" class="game-poptip-entry">
			<dt>{{ item.name }}</dt>
			<!-- 解释为游戏内 HTML 文案，不是用户输入 -->
			<dd v-html="item.info"></dd>
		</div>
	</dl>
</template>

<script setup lang="ts">
import { lib } from "noname";

defineOptions({ persist: false });

const items = lib.poptip.getIdList("rule").map(id => ({
	id,
	name: lib.poptip.getName(id),
	info: lib.poptip.getInfo(id),
}));
</script>

<style scoped>
.game-poptip {
	margin: 4px 8px 16px 2px;
	padding: 0;
}

.game-poptip-entry + .game-poptip-entry {
	margin-top: 14px;
	padding-top: 12px;
	border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.game-poptip-entry dt {
	margin: 0;
	font-size: 18px;
	line-height: 1.3;
	font-weight: bold;
	color: #e8d5a3;
}

.game-poptip-entry dd {
	margin: 4px 0 0;
	padding: 0;
	font-size: 15px;
	line-height: 1.55;
	color: rgba(255, 255, 255, 0.88);
}

.game-poptip-entry dd :deep(ul) {
	margin: 6px 0 0;
	padding-left: 1.4em;
}

.game-poptip-entry dd :deep(li) {
	display: list-item;
	list-style: disc;
	margin: 4px 0 4px 1.35em !important;
	padding: 0;
	line-height: 1.5;
}
</style>
