import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function content(config, pack) {
	if (lib.config.extension_英雄杀_forbidconfigs !== lib.extensionPack["英雄杀"].version) {
		const configs = {
			forbidstone: ["yxs_yujix", "yxs_luzhishen"],
		};
		for (const key in configs) {
			if (Array.isArray(lib.config[key])) {
				lib.config[key].addArray(configs[key]);
				game.saveConfig(key, lib.config[key]);
			}
		}
		game.saveExtensionConfig("英雄杀", "forbidconfigs", lib.extensionPack["英雄杀"].version);
	}

	if (lib.rank) {
		const rank = {
			a: ["yxs_caocao", "yxs_diaochan", "yxs_guiguzi", "yxs_luobinhan", "yxs_luzhishen", "yxs_wuzetian", "yxs_yangyuhuan"],
			am: ["yxs_direnjie", "yxs_huamulan", "yxs_libai", "yxs_luban", "yxs_nandinggeer", "yxs_napolun", "yxs_sunwu", "yxs_wangzhaojun", "yxs_xiangyu", "yxs_yangguang", "yxs_yingzheng", "yxs_zhangsanfeng"],
			bp: ["yxs_aijiyanhou", "yxs_bole", "yxs_fuermosi", "yxs_jinke", "yxs_kaisa", "yxs_lanlinwang", "yxs_luocheng", "yxs_meixi", "yxs_mozi", "yxs_xiaoqiao", "yxs_yuefei", "yxs_zhaoyong", "yxs_zhuyuanzhang"],
			b: ["yxs_baosi", "yxs_chengjisihan", "yxs_chengyaojin", "yxs_lishimin", "yxs_lvzhi", "yxs_mingchenghuanghou", "yxs_tangbohu", "yxs_weizhongxian", "yxs_yujix"],
			bm: ["yxs_goujian"],
		};
		for (let i in rank) {
			lib.rank[i].addArray(rank[i]);
		}
		if (lib.rank.rarity) {
			const rarity = {
				legend: ["yxs_wuzetian"],
				epic: ["yxs_libai", "yxs_luban", "yxs_yangyuhuan", "yxs_guiguzi", "yxs_aijiyanhou"],
				rare: ["yxs_kaisa", "yxs_napolun", "yxs_jinke", "yxs_yuefei", "yxs_huamulan", "yxs_diaochan", "yxs_caocao", "yxs_bole", "yxs_mozi"],
			};
			for (let i in rarity) {
				lib.rank.rarity[i].addArray(rarity[i]);
			}
		}
	}
}
