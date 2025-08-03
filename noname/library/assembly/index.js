import * as buildin from "./buildin.js";

/**
 * > 这玩意因为狂神还得是数组
 * 
 * 这个就是一个存放函数的数组，实例化是时接受一个字符串，姑且叫做这个数组的名字的吧。然后
 * ，会自动的从buildin中找与这个名字相同的，把对应的函数，放入这个数组中。
 * 
 * 这个东西有个缺陷，就是还没有对应的方法去调用所有保存的这些函数。
 * game.callHook(name)，只是调用的初始的，放在buildin.js 的文件里的函数。
 * 也就是下面的defaultHookcompatition中的函数。
 * 
 * @example
 * const assembly = new NonameAssembly('myAssembly');//这里会检查buildin.js里的写的函数，当然也可以通过下面的方式添加。

// 添加命名函数
function myFunction() {
	console.log('Hello, world!');
}

assembly.add('myFunction', myFunction);

// 添加匿名函数
assembly.add(() => console.log('Anonymous function'));

// 检查是否已添加
console.log(assembly.has('myFunction')); // 输出: true
console.log(assembly.has('nonExistentFunction')); // 输出: false

// 获取函数
const myFunctionInstance = assembly.get('myFunction');
if (myFunctionInstance) {
	myFunctionInstance(); // 输出: Hello, world!
}

// 更新函数
function updatedMyFunction() {
	console.log('Updated hello, world!');
}

assembly.update('myFunction', updatedMyFunction);
const updatedFunctionInstance = assembly.get('myFunction');
if (updatedFunctionInstance) {
	updatedFunctionInstance(); // 输出: Updated hello, world!
}

// 使用 push 方法
assembly.push('anotherFunction', () => console.log('Another function'));
console.log(assembly.length); // 输出: 3
 * 
 * 
 *
 * @template {NonameAssemblyType} AssemblyType
 * @template {keyof AssemblyType} Name
 * @extends {Array<AssemblyType[Name][keyof AssemblyType[Name]]>}
 */
export class NonameAssembly extends Array {
	/**
	 * @type {Name}
	 */
	#name;

	/**
	 * @type {Map<keyof AssemblyType[Name], number>}
	 */
	#record;

	/**
	 *
	 * @param {Name} name
	 */
	constructor(name) {
		super();
		this.#name = name;
		this.#record = new Map();

		if (name in buildin) {
			// @ts-expect-error ignore
			for (const [key, item] of Object.entries(buildin[name])) {
				// @ts-expect-error ignore
				this.add(key, item);
			}
		}
	}

	static get [Symbol.species]() {
		return Array;
	}

	get name() {
		return this.#name;
	}

	/**
	 *
	 * @param {keyof AssemblyType[Name]} name
	 * @param {AssemblyType[Name][keyof AssemblyType[Name]]} content
	 * @override
	 */
	// @ts-expect-error ignore
	add(name, content) {
		if (!content) {
			// @ts-expect-error ignore
			content = name;
			// @ts-expect-error ignore
			name = content.name;
		}
		if (typeof content !== "function") {
			throw new Error("you can't add a non-function to assembly.");
		}
		// if (typeof name !== "string" || name.length === 0) throw new Error("you can't add a anonymous function to assembly.")

		if (typeof name !== "string" || name.length === 0) {
			if (!this.includes(content)) {
				Array.prototype.push.call(this, content);
			}
		} else if (!this.has(name)) {
			this.#record.set(name, this.length);
			Array.prototype.push.call(this, content);
		}

		return this;
	}

	/**
	 *
	 * @param {keyof AssemblyType[Name]} name
	 * @param {AssemblyType[Name][keyof AssemblyType[Name]]} content
	 * @override
	 */
	// @ts-expect-error ignore
	push(name, content) {
		return this.add(name, content).length;
	}

	/**
	 *
	 * @param {keyof AssemblyType[Name]} name
	 */
	has(name) {
		return this.#record.has(name);
	}

	/**
	 *
	 * @param {keyof AssemblyType[Name]} name
	 * @returns {AssemblyType[Name][keyof AssemblyType[Name]] | undefined}
	 */
	get(name) {
		if (!this.has(name)) {
			return void 0;
		}
		// @ts-expect-error ignore
		return this[this.#record.get(name)];
	}

	/**
	 *
	 * @param {keyof AssemblyType[Name]} name
	 * @param {AssemblyType[Name][keyof AssemblyType[Name]]} content
	 */
	update(name, content) {
		if (!this.has(name)) {
			return false;
		}

		try {
			// @ts-expect-error ignore
			this[this.#record.get(name)] = content;
		} catch (e) {
			console.error(e);
			return false;
		}

		return true;
	}
}

/**
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 *
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 *
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const defaultHookcompatition = {
	checkBegin: new NonameAssembly("checkBegin"),
	checkCard: new NonameAssembly("checkCard"),
	checkTarget: new NonameAssembly("checkTarget"),
	checkButton: new NonameAssembly("checkButton"),
	checkEnd: new NonameAssembly("checkEnd"),

	uncheckBegin: new NonameAssembly("uncheckBegin"),
	uncheckCard: new NonameAssembly("uncheckCard"),
	uncheckTarget: new NonameAssembly("uncheckTarget"),
	uncheckButton: new NonameAssembly("uncheckButton"),
	uncheckEnd: new NonameAssembly("uncheckEnd"),

	checkOverflow: new NonameAssembly("checkOverflow"),
	checkTipBottom: new NonameAssembly("checkTipBottom"),

	checkDamage1: new NonameAssembly("checkDamage1"),
	checkDamage2: new NonameAssembly("checkDamage2"),
	checkDamage3: new NonameAssembly("checkDamage3"),
	checkDamage4: new NonameAssembly("checkDamage4"),

	checkDie: new NonameAssembly("checkDie"),

	checkUpdate: new NonameAssembly("checkUpdate"),

	checkSkillAnimate: new NonameAssembly("checkSkillAnimate"),

	addSkillCheck: new NonameAssembly("addSkillCheck"),
	removeSkillCheck: new NonameAssembly("removeSkillCheck"),
	refreshSkin: new NonameAssembly("refreshSkin"),
};

export const defaultAssemblys = {
	...defaultHookcompatition,
};
