import { lib, game, get, _status, ui } from "noname";
/**
 * 为元素添加右击或长按弹出的提示信息
 * @param {string} title 标题
 * @param {string} content 提示的具体内容
 * @returns {HTMLElement}
 */
HTMLElement.prototype.setNodeIntro = function (title, content) {
	this.classList.add("nodeintro");
	// @ts-expect-error ThereBe
	this.nodeTitle = title;
	// @ts-expect-error ThereBe
	this.nodeContent = content;
	if (!lib.config.touchscreen) {
		if (lib.config.hover_all) {
			lib.setHover(this, ui.click.hoverplayer);
		}
		if (lib.config.right_info) {
			this.oncontextmenu = ui.click.rightplayer;
		}
	}
	return this;
};

/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['addTempClass'] }
 */
HTMLDivElement.prototype.addTempClass = function (name, time = 1000) {
	// @ts-expect-error ignore
	let that = get.is.mobileMe(this) && name === "target" ? ui.mebg : this;
	that.classList.add(name);
	setTimeout(() => {
		that.classList.remove(name);
	}, time);
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['hide'] }
 */
HTMLDivElement.prototype.hide = function () {
	this.classList.add("hidden");
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['unfocus'] }
 */
HTMLDivElement.prototype.unfocus = function () {
	if (lib.config.transparent_dialog) {
		this.classList.add("transparent");
	}
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['refocus'] }
 */
HTMLDivElement.prototype.refocus = function () {
	this.classList.remove("transparent");
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['show'] }
 */
HTMLDivElement.prototype.show = function () {
	this.classList.remove("hidden");
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['delete'] }
 */
HTMLDivElement.prototype.delete = function (time = 500, callback) {
	if (this.timeout) {
		clearTimeout(this.timeout);
		delete this.timeout;
	}
	if (!this._listeningEnd || this._transitionEnded) {
		if (typeof time != "number") {
			time = 500;
		}
		this.classList.add("removing");
		// @ts-expect-error ignore
		this.timeout = setTimeout(() => {
			this.remove();
			this.classList.remove("removing");
			if (typeof callback == "function") {
				callback();
			}
		}, time);
	} else {
		this._onEndDelete = true;
	}
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['goto'] }
 */
HTMLDivElement.prototype.goto = function (position, time) {
	if (this.timeout) {
		clearTimeout(this.timeout);
		delete this.timeout;
	}
	if (typeof time != "number") {
		time = 500;
	}
	this.classList.add("removing");
	if (!this._selfDestroyed) {
		position.appendChild(this);
	}
	// @ts-expect-error ignore
	this.timeout = setTimeout(() => {
		this.classList.remove("removing");
	}, time);
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['fix'] }
 */
HTMLDivElement.prototype.fix = function () {
	clearTimeout(this.timeout);
	delete this.timeout;
	delete this.destiny;
	this.classList.remove("removing");
	return this;
};
Reflect.defineProperty(HTMLDivElement.prototype, "setBackground", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this HTMLDivElement
	 * @type { typeof HTMLDivElement['prototype']['setBackground'] }
	 */
	value(name, type, ext, subfolder) {
		if (!name) {
			return this;
		}
		let src;
		if (ext === "noskin") {
			ext = ".jpg";
		}
		ext = ext || ".jpg";
		subfolder = subfolder || "default";
		if (type) {
			let dbimage = null,
				extimage = null,
				modeimage = null,
				nameinfo,
				gzbool = false;
			const mode = get.mode();
			if (type === "character") {
				nameinfo = get.character(name);
				if (lib.characterPack[`mode_${mode}`] && lib.characterPack[`mode_${mode}`][name]) {
					if (mode === "guozhan") {
						if (name.startsWith("gz_shibing")) {
							name = name.slice(3, 11);
						} else {
							if (lib.config.mode_config.guozhan.guozhanSkin && nameinfo && nameinfo.hasSkinInGuozhan) {
								gzbool = true;
							}
							name = name.slice(3);
						}
					} else {
						modeimage = mode;
					}
				} else if (name.includes("::")) {
					// @ts-expect-error ignore
					name = name.split("::");
					modeimage = name[0];
					name = name[1];
				}
			}
			let imgPrefixUrl;
			if (!modeimage && nameinfo) {
				if (nameinfo.img) {
					imgPrefixUrl = nameinfo.img;
				} else if (nameinfo.trashBin) {
					for (const value of nameinfo.trashBin) {
						if (value.startsWith("img:")) {
							imgPrefixUrl = value.slice(4);
							break;
						} else if (value.startsWith("ext:")) {
							extimage = value;
							break;
						} else if (value.startsWith("db:")) {
							dbimage = value;
							break;
						} else if (value.startsWith("mode:")) {
							modeimage = value.slice(5);
							break;
						} else if (value.startsWith("character:")) {
							name = value.slice(10);
							break;
						}
					}
				}
			}
			if (type === "character" && lib.config.skin[name] && arguments[2] !== "noskin") {
				src = lib.config.skin[name][1];
			} else if (imgPrefixUrl) {
				src = imgPrefixUrl;
			} else if (extimage) {
				src = extimage.replace(/^ext:/, "extension/");
			} else if (dbimage) {
				this.setBackgroundDB(dbimage.slice(3)).then(lib.filter.none);
				return this;
			} else if (modeimage) {
				src = `image/mode/${modeimage}/character/${name}${ext}`;
			} else if (type === "character") {
				src = `image/character/${gzbool ? "gz_" : ""}${name}${ext}`;
			} else {
				src = `image/${type}/${subfolder}/${name}${ext}`;
			}
		} else {
			src = `image/${name}${ext}`;
		}
		this.style.backgroundPositionX = "center";
		this.style.backgroundSize = "cover";
		//@ts-ignore
		//不应在外部使用
		this._backgroundImage = src;
		if (type === "character") {
			const nameinfo = get.character(name);
			const sex = nameinfo && ["male", "female", "double"].includes(nameinfo[0]) ? nameinfo[0] : "male";
			this.setBackgroundImage(`${lib.characterDefaultPicturePath}${sex}${ext}`);
			const observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				
				//@ts-ignore
				const backgroundImage = this._backgroundImage;
				const img = new Image();
				img.src = backgroundImage;
				img.onload = () => {
					//@ts-ignore
					if (backgroundImage !== this._backgroundImage) return;
					this.setBackgroundImage(backgroundImage);
				}

				observer.disconnect();
			});

			observer.observe(this);
		} else {
			this.setBackgroundImage(src);
		}
		return this;
	},
});
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['setBackgroundDB'] }
 */
HTMLDivElement.prototype.setBackgroundDB = async function (img) {
	let src = await game.getDB("image", img);
	this.style.backgroundImage = `url('${src}')`;
	this.style.backgroundSize = "cover";
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['setBackgroundImage'] }
 */
HTMLDivElement.prototype.setBackgroundImage = function (img) {
	this.style.backgroundImage = URL.canParse(img) ? `url("${img}")` : `url("${lib.assetURL}${img}")`;
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['listen'] }
 */
HTMLDivElement.prototype.listen = function (func) {
	if (lib.config.touchscreen) {
		this.addEventListener("touchend", function (e) {
			if (!_status.dragged) {
				func.call(this, e);
			}
		});
		/**
		 * @this HTMLDivElement
		 * @param { MouseEvent } e
		 */
		const fallback = function (e) {
			if (!_status.touchconfirmed) {
				func.call(this, e);
			} else {
				this.removeEventListener("click", fallback);
			}
		};
		this.addEventListener("click", fallback);
	} else {
		this.addEventListener("click", func);
	}
	return this;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['listenTransition'] }
 */
HTMLDivElement.prototype.listenTransition = function (func, time) {
	let done = false;
	const callback = () => {
		if (!done) {
			done = true;
			func.call(this);
		}
		clearTimeout(timer);
		this.removeEventListener("webkitTransitionEnd", callback);
	};
	const timer = setTimeout(callback, time || 1000);
	this.addEventListener("webkitTransitionEnd", callback);
	// @ts-expect-error ignore
	return timer;
};
/**
 * @this HTMLDivElement
 * @type { typeof HTMLDivElement['prototype']['setPosition'] }
 *- 用Array.from(arguments)来创建一个新的数组，这比使用循环更加简洁。
  - 使用解构赋值来直接从position数组中提取出四个参数，使代码更清晰。
  - 将条件运算符的结果直接嵌入到模板字符串中，取代了之前使用字符串拼接的方式喵。
  //最后，宝贝看一下我的理解有问题吗？🥺
 */
HTMLDivElement.prototype.setPosition = function (...args) {
	let position;
	if (args.length === 4) {
		position = args;
	} else {
		// noinspection JSUnresolvedReference
		if (args.length === 1 && Array.isArray(args[0]) && args[0].length === 4) {
			position = args[0];
		} else {
			return this;
		}
	}

	const [topPercent, topOffset, leftPercent, leftOffset] = position;

	this.style.top = `calc(${topPercent}% ${topOffset > 0 ? "+ " : "- "}${Math.abs(topOffset)}px)`;
	this.style.left = `calc(${leftPercent}% ${leftOffset > 0 ? "+ " : "- "}${Math.abs(leftOffset)}px)`;

	return this;
};
/**
 * @this HTMLElement
 * @type { typeof HTMLElement['prototype']['css'] }
 */
HTMLElement.prototype.css = function (style) {
	for (const i in style) {
		if (i === "innerHTML" && typeof style["innerHTML"] == "string") {
			this.innerHTML = style["innerHTML"];
		} else {
			this.style[i] = style[i];
		}
	}
	return this;
};
/**
 * @this HTMLTableElement
 * @param {number} row
 * @param {number} col
 * @returns {HTMLElement | void}
 */
HTMLTableElement.prototype.get = function (row, col) {
	if (row < this.childNodes.length) {
		// @ts-expect-error ignore
		return /** @type {HTMLElement | void} */ this.childNodes[row].childNodes[col];
	}
};

Object.defineProperty(Array.prototype, "filterInD", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['filterInD'] }
	 */
	value(pos = "o") {
		if (typeof pos != "string") {
			pos = "o";
		}
		return this.filter(card => pos.includes(get.position(card, true)));
	},
});
Object.defineProperty(Array.prototype, "someInD", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['someInD'] }
	 */
	value(pos = "o") {
		if (typeof pos != "string") {
			pos = "o";
		}
		return this.some(card => pos.includes(get.position(card, true)));
	},
});
Object.defineProperty(Array.prototype, "everyInD", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['everyInD'] }
	 */
	value(pos = "o") {
		if (typeof pos != "string") {
			pos = "o";
		}
		return this.every(card => pos.includes(get.position(card, true)));
	},
});
/**
 *@legacy Use {@link Array#includes} instead.
 */
Object.defineProperty(Array.prototype, "contains", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this T[]
	 * @template T
	 * @param { T[] } args
	 * @returns { boolean }
	 */
	value(...args) {
		console.warn(this, "Array的contains方法已废弃，请使用includes方法");
		// @ts-expect-error ignore
		return this.includes(...args);
	},
});
Object.defineProperty(Array.prototype, "containsSome", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['containsSome'] }
	 */
	value() {
		return Array.from(arguments).some(i => this.includes(i));
	},
});
Object.defineProperty(Array.prototype, "containsAll", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['containsAll'] }
	 */
	value() {
		return Array.from(arguments).every(i => this.includes(i));
	},
});

Object.defineProperty(Array.prototype, "add", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['add'] }
	 */
	value() {
		for (const arg of arguments) {
			if (this.includes(arg)) {
				continue;
			}
			this.push(arg);
		}
		return this;
	},
});
Object.defineProperty(Array.prototype, "addArray", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['addArray'] }
	 */
	value() {
		for (const arr of arguments) {
			for (const item of arr) {
				this.add(item);
			}
		}
		return this;
	},
});
Object.defineProperty(Array.prototype, "remove", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['remove'] }
	 */
	value(...args) {
		for (const item of args) {
			let pos;

			if (typeof item == "number" && isNaN(item)) {
				pos = this.findIndex(v => isNaN(v));
			} else {
				pos = this.indexOf(item);
			}

			if (pos === -1) {
				continue;
			}
			this.splice(pos, 1);
		}

		return this;
	},
});
Object.defineProperty(Array.prototype, "removeArray", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['removeArray'] }
	 */
	value() {
		for (const i of Array.from(arguments)) {
			this.remove(...i);
		}
		return this;
	},
});
Object.defineProperty(Array.prototype, "unique", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['unique'] }
	 */
	value() {
		let uniqueArray = [...new Set(this)];
		this.length = uniqueArray.length;
		for (let i = 0; i < uniqueArray.length; i++) {
			this[i] = uniqueArray[i];
		}
		return this;
	},
});
Object.defineProperty(Array.prototype, "toUniqued", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['toUniqued'] }
	 */
	value() {
		return [...new Set(this)];
	},
});
Object.defineProperty(Array.prototype, "randomGet", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['randomGet'] }
	 */
	value(...excludes) {
		let arr = this;

		if (excludes.length > 0) {
			arr = this.slice(0);
			arr.removeArray(Array.from(arguments));
		}

		return arr[Math.floor(Math.random() * arr.length)];
	},
});
Object.defineProperty(Array.prototype, "randomGets", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['randomGets'] }
	 */
	value(num = 0) {
		if (num > this.length) {
			num = this.length;
		}
		let arr = this.slice(0);
		let list = [];
		for (let i = 0; i < num; i++) {
			list.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
		}
		return list;
	},
});
Object.defineProperty(Array.prototype, "randomRemove", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @param { number } [num]
	 * @type { typeof Array['prototype']['randomRemove'] }
	 */
	value(num) {
		if (typeof num == "number") {
			let list = [];
			for (let i = 0; i < num; i++) {
				if (!this.length) {
					break;
				}
				list.push(this.randomRemove());
			}
			return list;
		}
		return this.splice(Math.floor(Math.random() * this.length), 1)[0];
	},
});
Object.defineProperty(Array.prototype, "randomSort", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['randomSort'] }
	 */
	value() {
		for (let i = this.length; i > 1; --i) {
			const index = /* randInt(0, i); */ Math.floor(Math.random() * i);
			const temp = this[i - 1];
			this[i - 1] = this[index];
			this[index] = temp;
		}

		return this;
	},
});
Object.defineProperty(Array.prototype, "sortBySeat", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['sortBySeat'] }
	 */
	value(target) {
		lib.tempSortSeat = target;
		this.sort(lib.sort.seat);
		delete lib.tempSortSeat;
		return this;
	},
});
/**
 *@description 从数组中寻找某个特征最大的，且通过筛选的第一个元素
 */
Object.defineProperty(Array.prototype, "maxBy", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['maxBy'] }
	 */
	value(sortBy, filter) {
		let list = this.filter(filter || (() => true));
		if (sortBy && typeof sortBy == "function") {
			list.sort((a, b) => sortBy(a) - sortBy(b));
		} else {
			list.sort();
		}
		return list[list.length - 1];
	},
});
Object.defineProperty(Array.prototype, "minBy", {
	configurable: true,
	enumerable: false,
	writable: true,
	/**
	 * @this any[]
	 * @type { typeof Array['prototype']['minBy'] }
	 */
	value(sortBy, filter) {
		let list = this.filter(filter || (() => true));
		if (sortBy && typeof sortBy == "function") {
			list.sort((a, b) => sortBy(a) - sortBy(b));
		} else {
			list.sort();
		}
		return list[0];
	},
});
