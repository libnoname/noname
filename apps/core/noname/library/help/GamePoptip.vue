<template>
	<ul class="game-poptip-list">
		<li v-for="item in items" :key="item.id">
			<strong>{{ item.name }}</strong>：<br>
			<!-- 解释为游戏内 HTML 文案，不是用户输入 -->
			<span v-html="item.info"></span>
		</li>
	</ul>
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
