# Async 章节

无名杀在v1.10.6的时候由 @nonameShijian 引入了一种全新的技能效果代码写法，这种写法与原有写法最大的区别在于，这种写法的content函数是一个带有 `async`标识符的函数，而不是原来存在 `step`字样的普通函数。

比如原来的写法是：

```javascript
let skill = {
    content: function () {
        "step 0"
        player.draw(2);
        "step 1"
        player.chooseToDiscard(2, true);
    }
}
```

而新的写法是：

```javascript
let skill = {
    content: async function (event, trigger, player) {
        await player.draw(2);
        await player.chooseToDiscard(2, true);
    }
}
```

我们称这种新的写法叫做 `Async Content`；为了区分，我们将原来那种写法称作 `Step Content`

相比于原来的 `Step Content`，`Async Content`在设计上更加贴近原有的Javascript语法，并且能很方便的实现之前 `Step Content`无法做到或很难做到的事情，故无名杀未来更新武将的技能代码中将主要使用这种形式，这也将成为无名杀未来的开发方向

本章节将简单的介绍：

- 了解 `async`函数
- `Async Content`的形式与使用
- `Async Content`相比原有形式的优势

> 此章节面向于JavaScript基础稍微薄弱的，对于async函数相关用法不熟悉的开发者，所以本章节在编写时偏向于技能写法，而不是专业的JavaScript异步编程讲解，如果想要了解更加详细的JavaScript异步编程，请参考[JavaScript异步编程指南](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous)

## 一、了解 `async`函数

一般来说，async函数只需要在函数的声明前加上 `async`标识符即可，如：

```javascript
// 命名函数
async function named() { ... }

// 匿名函数
let anonymous = async function () { ... }
```

被标记为async的函数拥有以下特性：

- 必然返回一个Promise对象
- 可以在async函数中使用 `await`来等待一个Promise对象

此时我们就又引入了两个概念：`Promise`和 `await`

### `Promise`

Promise是JavaScript中的一种异步编程解决方案，它允许你以一种更优雅的方式处理异步操作

在最初的Javascript异步编程中，我们通常使用回调函数来处理异步操作，但是这种方式存在一些问题，比如回调地狱和难以阅读

我们会在后文需要用到 `Promise`的地方再介绍这个概念，这里仅作提出

由于无名杀编写技能并不会出现回调地狱的情况，所以这里我们不会对Promise进行过多的介绍，如果你对Promise感兴趣，可以参考[Promise对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### `await`

`await`是JavaScript中的一个关键字，它允许你在async函数中等待一个Promise对象的状态发生变化

`await`与 `async`共同组成了新的异步形态，使 `Javascript`的异步能像同步代码般编写

事实上，`await`不仅会等待一个 `Promise`事件，它还能等待别的符合要求的东西，这类东西我们称作可 `await`的东西；我们将在后文再次介绍这个概念

如果你对 `await`感兴趣，可以参考[async 和 await](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Promises#async_%E5%92%8C_await)，本章节仅针对无名杀技能中使用的 `await`进行介绍

## 二、`Async Content`的形式与使用

### 1. `Async Content`怎么用

我们先来看看一个 `Step Content`的技能:

```javascript
let skill = {
	trigger: {
		player: "phaseBegin",
	},
	content: function () {
		"step 0"
		player.draw(2);
	},
};
```

这个技能对应的描述是: `当你回合开始时，你摸两张牌`

然后我们再来看一个 `Async Content`的技能：

```javascript
let skill = {
	trigger: {
		player: "phaseBegin",
	},
	content: async function (event, trigger, player) {
		await player.draw(2);
	},
};
```

这两处代码有下面几处变化：

1. 添加了 `async`在函数前面
2. 添加了三个参数: `event`,`trigger`,`player`
3. 函数里面的 `"step 0"`被删除了
4. `player.draw`之前添加了 `await`

接下来我们来具体聊聊这些改变究竟带来了什么

### 2. `Async Content`相对于 `Step Content`的有啥变化

`Async Content`可以让 `content`这类step写法的函数贴近普通的函数

例如，函数 `filter`要求你写出 `(event, player, name)`参数，然后你才可以用 `event`/`player`/`name`三个变量

而 `Async Content`也是如此，你需要写出 `(event, trigger, player)`三个由无名杀提供的参数才能使用 `event`/`trigger`/`player`三个变量

这样的好处是统一规范了函数写法，减少了新开发者的疑惑，你所使用的 `event`/`trigger`/`player`都是你看得到的

到这里你可能会反应过来，平常在 `step`写法中经常直接使用 `card`/`target`/`num`等变量，现在参数里面没有这些变量，要怎么样引用这些变量呢？

如果你稍微了解过Javascript的语法，你应该明白 `Step Content`的 `step x`本应该没任何作用，而无名杀中则通过动态编译使 `step x`转换成了普通的Javascript代码，而这一过程中同时将 `card`/`target`/`num`等变量注入在函数参数内，使得我们能直接调用

而 `card`/`target`/`num`等变量，均为 `event`的属性；换言之，我们用 `event.card`/`event.target`/`event.num`就可以代替原本的 `card`/`target`/`num`这些变量了

你或许已经注意到了，`Async Content`省去了编译过程。在原有的 `Step Content`中，如果函数出现报错，会发现提示的报错位置是一个 `VM xx`，这个标识就是Javascript引擎存储动态编译代码的地方，但这种情况下我们的调试问题将受到影响。而 `Async Content`不会经过动态编译，故报错/调试代码将会变得更加简单

值得注意的是，`event.step`变量在async函数中不再有意义，因为没有了 `step`标注，本体也无法确定async函数执行到了哪一步，自然 `event.step`的值也就没有了意义

### 3. 那么 `Async Content`如何写出分步的效果呢？

上文已经提到过，`Step Content`会经过动态编译

我们看看这个例子：

```javascript
let skill = {
	trigger: {
		player: "phaseBegin",
	},
	content() {
		"step 0"
		player.addTempSkill("jiang");
		player.draw(2);
		"step 1"
		if (player.countCards("h") > 5) {
			player.chooseToDiscard(2, true);
		}
		player.addMark("jiang");
	},
};
```

> 技能描述: 出牌阶段限一次，你可以于本回合获得【激昂】并摸两张牌，然后若手牌数量超过五张，你弃置两张牌；若如此做，你获得一枚【激昂】

> 激昂没有标记，但为了好理解，我们假设存在这种标记。

很明显，我们这里至少需要分为两步，因为我们要在摸牌之后计算手牌数量，也就是说，我们需要等待“摸牌”这个动作

而分步的作用正是等待这一步所有结算完成，再执行下一步

如果不分步就执行 `countCards`，会导致我们读取的是摸牌前的手牌数量（因为此时摸牌还没开始），从而导致效果与描述不一致

在经过动态编译后(v1.10.15前)，content函数会变成这样：

```javascript
let skill = {
    trigger: {
        player: "phaseBegin"
    },
    // 添加的参数在此省略
    content: function (...) {
        if (event.step >= 2) return event.finish();

        switch (event.step) {
            case 0:
                player.addTempSkill("jiang");
                player.draw(2);
            break;case 1:
                if (player.countCards("h") > 5) {
                    player.chooseToDiscard(2, true);
                }
                player.addMark("jiang");
        }
    }
}
```

很抱歉我在此处使用了很丑陋的代码，但这确实是编译后理应拥有的结果。

我们发现，编译后的 `content`函数，在 `event.step == 0`时，会只执行到 `player.draw(2);`，然后结束函数的执行；无名杀引擎会自动让 `event.step++`，然后等待摸牌结束后，再次执行这个函数。此时我们的 `event.step == 1`，就会开始检查手牌是否大于5，然后根据情况决定是否执行弃牌。

此时如果我们要在弃牌后才开始获得标记，就需要在选择弃牌和获得标记间添加新的 `step`，这样就会变成下面的情况：

```javascript
function (...) {
    if (event.step >= 3) return event.finish();

    switch (event.step) {
        case 0:
            player.addTempSkill("jiang");
            player.draw(2);
        break;case 1:
            if (player.countCards("h") > 5) {
                player.chooseToDiscard(2, true);
            }
        break;case 2:
            player.addMark("jiang");
    }
}
```

这样我们就会在 `player.chooseToDiscard`后才开始获得标记

综上所述，我们已经明白了 `Step Content`的基本原理。而不难发现，`Step Content`所作的一切，大部分情况下，是为了**等事件运行完**。

虽然我们并未详细讲过什么是“异步”，但你大概能反应过来，上面所说的“等事件运行完”，就是异步。

既然如此，那么async函数自然就能达成这一目的，因为async函数就是现阶段下，符合逻辑的异步的最佳实践。

那么我们来看看async写法:

```javascript
let skill = {
	trigger: {
		player: "phaseBegin",
	},
	content: async function (event, trigger, player) {
		player.addTempSkill("jiang");
		await player.draw(2);
		if (player.countCards("h") > 5) {
			await player.chooseToDiscard(2, true);
		}
		player.addMark("jiang");
	},
};
```

我们可以看到分步没有了，取而代之的是每次操作前面附加了一个 `await`；这个 `await`表示的是，会等待后面的代码运行完毕，再执行后续的代码

而此时，你可能会有疑惑：如果我现在需要获得所摸的牌，我该怎么办？

原先分步情况下你可以在下一步中用 `result`变量来获取上一步事件的结果，而现在，当我们 `await`之后，我们可以这样做：

```javascript
let drawEvent = await player.draw(2);
```

你或许也发现了，无论是无名杀的分步，还是Javascript原来的回调异步，都会存在“结果”。就好比你做一件事，就算最后没有因为这件事得到任何东西，此时的情况也是一种“结果”

而 `await`也同理，在等待事件结束后，便会得到这个“结果”。而对于 `player.draw(2)`这种常见的，需要分步得到 `result`的，我们称之为“事件“的东西，`await`后返回的，是事件本身；而事件的结果，则是该事件的 `result`属性

我们把“`await`后会等待后续事物执行完毕，并返回新的东西”的东西，简单的称作能 `await`的东西；在后文中我们会再次讨论这块的内容

换句话说，摸牌函数返回的 `drawEvent`事件，是一个可 `await`的东西；而 `await`一个事件，就是等待一个事件运行结束，并获取这个事件本身

故我们接下来就能这样获取我们所摸的牌：

```javascript
let cards = drawEvent.result;
```

如果你不需要事件，只需要对应的结果，无名杀提供了对应的方法，你可以使用 `forResult`函数：

```javascript
let cards = await player.draw(2).forResult();
```

当然，Javascript也有对应的语法帮助我们，那就是[解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)：

```javascript
let { result: cards } = await player.draw(2);
```

两种方法都能得到结果，只要不混用就行；如果你对Javascript的新语法不熟悉，只需要简单的使用 `forResult`就行

实际上 `await`没有那么死板，你完全可以把 `await`放在任何你想要的地方，只有能 `await`的情况才会等待，反之会原封不动的将值返回过来

就比如，你可以：

```javascript
await player.addTempSkill("jiang");
```

`player.addTempSkill`并不需要等待，但你等待也不会出啥问题，此时 `await`后的返回值仍然是 `player.addTempSkill`原有的返回值；`await`只会处理需要等待的东西

### 4. 一些原有操作的代替品

如果你了解无名杀的技能代码，你一定会知道下面三个函数:

- `event.goto`: 跳转到指定步
- `event.redo`: 重新执行当前步
- `event.finish`: 结束当前事件

如果要使用 `Async Content`，那么这些函数自然需要替换，因为已经不再需要 `step`这个概念了；至于 `event.finish`，因为 `Async Content`的机制很复杂，故将 `event.finish`的操作交给无名杀会是个更好的选择

#### 代替 `event.finish`

我们先从 `event.finish`开始，它的作用是结束当前事件，那么如何替代它呢？

`Async Content`的核心就是使用async函数，而且我们只会执行一遍async函数；也就是说，如果我们要结束一个事件，只需要结束这个函数的执行就行。那如果要退出一个函数，你会使用什么呢？

我们知道，`return`语句会中断函数的执行，并将后面的值作为函数的返回值。那么，对于 `Async Content`，我们只需要在需要结束的时候提前 `return`，就能达到效果。

也就是说你可以把

```javascript
if (!result.bool) event.finish();
```

直接写成

```javascript
if (!result.bool) return;
```

同时，如果你在分步中使用 `event.finish()`结束事件，代码并不会立刻停止执行，当前步后面的代码依旧会继续执行，直到当前步结束为止。如果你要阻止后续代码的执行，你还需要额外进行处理才能不继续执行后续代码

而 `return`会立刻停止函数执行，不需要你再额外进行处理

当然你可能会问，`Async Content`需不需要确切的返回值？不需要，甚至不应该要，因为实现的复杂性，如果你返回了一个可 `await`的东西，那么无名杀也会等后面的东西执行完毕才认为这个函数执行完毕，而这可能会导致这个函数循环等待而永远无法执行完毕；故在任何情况下，`Async Content`的 `return`后面都不应该跟任何东西

如果你因为一些操作必须得有，请使用 `void`语句，这个语句会无视后面的值，一律返回 `undefined`，比如：

```javascript
return void await player.draw(2);
```

我们不但等待了 `player.draw`，而且返回的内容也是 `undefined`

#### 代替 `event.goto`与 `event.redo`

如果你曾看过远古计算机代码，你或许会发现，`Step Content`的 `evnet.goto`和 `event.redo`，很有当年的循环风格。但事实证明，这种风格在代码复杂起来时，会变得难以维护，故我们必然会寻找方法替代——故我们发明了循环语句

比如下面这段代码使用了 `event.redo`:

```javascript
let target = event.targets.shift();
target.draw(1);
if (event.targets.length) event.redo();
```

你可以改成

```javascript
while (event.targets.length) {
	let target = event.targets.shift();
	await target.draw(1);
}
```

这样写出来的代码也更加清晰，你可以一眼看出来这是一个循环，对吧？

当然，因为我们已经用上了循环，不再需要通过 `event.targets.length`来区分有没有遍历完，所以我们甚至能直接这样写：

```javascript
for (let target of event.targets) {
    await target.draw(1);
}
```

而 `event.goto`也是同理，你可以用 `if`、`while`、`for`、`break`、`continue`等语句来代替它，从而达到更好的可读性

这块的内容由于因具体情况会变得异常复杂，故本章节将本块内容当成附加内容，将在后文补充一些个人的方法和习惯；本体的标准包代码已全面换成 `Async Content`的形式，可前往学习。

### 5. async使用的一些细节补充

看到这里，你对于 `Async Content`的大致特点已经掌握，那接下来我们就来对一些实战中可能遇到的问题进行补充吧

#### 1. 什么情况下必须要使用 `await`？

我们都知道，在Javascript中，`await`一个不需要 `await`的东西不会有任何问题，故你可以在任何操作下都尝试 `await`。但这会让代码的无用 `await`变得很多，所以我们需要判断什么时候该用 `await`

非常幸运，在无名杀中，你可以查看操作是否有以下情况:

1. 会触发时机。触发时机意味着可能进行插入结算，你需要等待所有插入结算的完成，故而使用 `await`(包括使用 `event.trigger`来主动触发时机也需要 `await`)
2. 等待玩家确认。如果有个操作需要玩家点击确认，或者会弹出窗口给玩家查看时，你需要等待玩家确认完毕，所以也使用 `await`
3. `asyncDraw`等带 `async`字符的函数，这些操作一般都会返回一个可 `await`的东西，故我们需要 `await`来保证函数执行完毕

顺带一提，有些异步的情况不能用 `await`来等待，或者说使用 `await`并不会起到效果。这类情况基本上都是无名杀的古老异步代码，因为在那个时代并不存在 `Promise`，且没人尝试在后来适配这些异步代码，所以你只能通过原先给定的特殊方式来等待，比如说回调函数

#### 2. delay与delayx

在 `Async Content`里面，当使用 `game.delay`/`game.delayx`时，我们也可以进行 `await`:

```javascript
await game.delay();
await game.delayx();
```

#### 3. Promise的使用

除了 `game.resume`外，我们还可以使用 `Promise`来实现类似的功能。

**Promise的概念**

在之前介绍async函数的时候，我们就稍微提到过这个概念；我们当时说 `Promise`是无名杀的一种异步解决方案；这里我们不得不简单说明下 `Promise`的历史，来理解 `Promise`的诞生

当时人们为了解决回调地狱，就开始着手设计新的异步形态，同时要比较方便的兼容原有异步；此时就有人尝试提出了这样的概念：

```javascript
// 回调写法
someAsyncFunction(callback);
// 回调地狱
someAsyncFunction(a => {
    someAsyncFunctionToo(b, c => {
        someAsyncFunctionAgain(c, d => {
            ...
        })
    })
})

// 新的写法
someAsyncFunction().then(callback);
// 链式调用
someAsyncFunction().then(a => {
    return someAsyncFunctionToo(b);
}).then(c => {
    return someAsyncFunctionAgain(c);
}).then(d => {
    ...
})
// 或者因为刚好就是后面需要调用函数的第一个参数，故还能再次简化
someAsyncFunction()
    .then(someAsyncFunctionToo)
    .then(someAsyncFunctionAgain)
    .then(...)
```

而要实现链式调用，就需要一个对象来承载：这就是 `Promise`的诞生，它将原本的回调地狱变成了链式调用，让代码变得清晰易懂

`Promise`类似于一个通知，比如你点了一份外卖，如果你要知道外卖有没有完成，你肯定是查看外卖app是否显示已送达 而不是跑到楼下去看看外卖员有没有到对吧？

`Promise`此时充当了一个外卖app的作用，当你对它使用 `await`时，你的代码会暂停执行，等待 `Promise`提供者确认任务完成之后，`Promise`就会结束你代码的等待，并继续向下执行

> 我们前文说过，可 `await`的东西不一定是 `Promise`，实际上满足[Promise A+](https://promisesaplus.com/)标准的都是可 `await`的东西，感兴趣的可以了解一下

**Promise的语法**

我们来看看 `Promise`的创建:

```javascript
let promise = new Promise((resolve, reject) => { ... });
```

和其他对象一样，`Promise`也是通过构造函数构建的，而构造函数则接收一个回调函数——毕竟要取代原来的回调函数，你也必须提供一个回调函数

而回调函数则接收两个参数，这两个参数分别对应 `resolve`与 `reject`，这两个参数都是 `Promise`提供的回调函数，其中 `resolve`则表示，一切顺利后，使用这个回调函数，而 `reject`则表示出问题后使用这个回调函数

这两个回调函数都可以接收一个参数，这个参数将会被 `Promise`储存下来，而你可以通过 `await`这个 `Promise`来获取这个值（当然如果 `reject`了就改为报错）

在最新的Javascript中，提供了一个函数 `Promise.withResolvers`，这个函数会将 `Promise`本身和其 `resolve`和 `reject`包含在一个对象中返回；当你代码中的 `resolve`和 `reject`需要和 `Promise`对象同一作用域时，就能使用这个函数，如下面所示：

```javascript
let { promise, resolve, reject } = Promise.withResolvers();
```

在后文中，为了防止演示代码的层级过多，我们将统一使用 `Promise.withResolvers`来创建 `Promise`，尽管大部分例子下直接用构造函数创建 `Promise`会更简洁

**代码演示**

接下来我们来看看如何用 `Promise`演示外卖送达的流程

```javascript
// 外卖平台部分
// 我们要提供dian_can()函数来接受外卖任务
let { promise, resolve } = Promise.withResolvers() // 创建一个新的Promise，由于我们现在能保证外面必然送到，故不需要reject

function dianCan() {
    return promise // 返回我们创建的promise
}

// 外卖员部分
// 当外卖员送达时需要通知用户取餐
... // 送餐流程省略
resolve() // 执行promise创建时提供的通知函数，告诉正在等待这个promise的代码任务已经完成

// 用餐人部分
// 我们执行dian_can()函数来发起一个外卖任务
let waimaiPromise = dianCan() // 调用并获取promise
await waimaiPromise // 等待外卖送达
```

从上面可以看出，如果要使用 `Promise`，我们需要三个部分：

1. 创建 `Promise`
2. 等待 `Promise`
3. 通知 `Promise`

**使用示例**

那么我们来实现一个简单的效果，用 `await`暂停代码5秒:

我们的思路应该是这样的，首先我们肯定要创建一个 `Promise`，这样才可以使用 `await`

然后我们要在5秒后执行 `resolve`函数，让 `await`结束等待

```javascript
var { promise, resolve } = Promise.withResolvers(); // 创建promise
setTimeout(resolve, 5000); // 将resolve传递给setTimeout，setTimeout是一个系统函数，会在指定时间后执行你传入的函数，这里填写的时间是5000毫秒即5秒
await promise; // 等待直到resolve在5秒后被调用
```

你有没有发现，我们已经实现了类似 `game.delay`的功能了；而事实上无名杀本体的 `game.delay`也就是使用这种方式实现的功能

当你掌握了 `Promise`的使用时，你就可以进入下面的一节了

#### 4. pause与resume

`game.pause`与 `game.resume`是一对游戏内暂停函数，与玩家暂停不同，它们用于 `等待游戏动画`/`等待玩家确定`这类耗时的操作时使用

在分步中，如果你要等待玩家按下确定再执行下一步，你需要先执行 `game.pause`，这将启动游戏内暂停，直到你执行 `game.resume`之前，下一步都不会执行

而到了async函数里面，我们可以使用更加优雅的办法(`Promise`)来替代 `game.pause`与 `game.resume`:

假设 `button`是一个按钮，我们要等待按钮按下再继续执行，这种代码应该这样写:

```javascript
// 创建一个Promise来等待
let { promise, resolve } = Promise.withResolvers();

// 监听按钮点击，当按钮点击时执行大括号里面的代码
button.listen(() => {
	resolve(); // 结束await的等待
	game.log("玩家点击了按钮");
});

// 暂停代码的执行并等待点击
await promise;
```

当然，你也可以继续使用 `game.pause`，这并不会造成错误或者其他影响

#### 5. async的其他优势

**支持闭包访问**

什么是闭包？

闭包是指一种变量的访问，当一个函数访问外层代码声明的变量就叫做闭包访问，而那个变量成为闭包变量

```javascript
let v1 = 1;

function funA() {
	let v2 = 2;
	function funB() {
		return v1 + v2; // 访问了两个闭包变量
	}
}
```

在上面的代码中，对于 `funB`函数来说，无论 `v1`还是 `v2`变量都不是它声明的，但是它可以通过闭包访问来获取这些变量

在 `Step Content`中，因为代码被动态编译了，导致无法使用闭包；这种情况下，你如果要访问你其他地方定义的变量，必须将这个变量暴露为公共变量，不利于扩展对自身数据的封闭管理

而在 `Async Content`中，你可以直接在里面访问到你外层定义的变量，这是 `Step Content`不具备的优势

**更好的调试**

`Async Content`支持电脑上的开发者工具进行断点调试

在电脑上可以按 `Ctrl+Shift+I`打开开发工具，然后在 `源代码`/`Sources`里面找到你觉得有问题的代码，在编辑器左边的行数点击一下，会出现一个蓝色的箭头，代表此行已经被打上断点

断点被打上后，当代码执行到此行时，开发工具会暂停代码的执行，此时你可以在开发工具里面观察各个变量的值，或者执行额外的代码

另外使用 `Async Content`的技能出现错误时，不会出现报错信息不正确的问题 `Async Content`同样也是因为没有二次编译，不会丢失错误信息，增加你的错误排查效率

## 三、`Async Content`相比原有形式的优势

`Async Content`相比 `Step Content`的优势上文已经说明，但无名杀实际还存在其他的content形式，故我们再看看其他的content形式与 `Async Content`的对比

### `Generator Content`

`Generator Content`通过“生成器”来等待事件结束。比如之前演示的技能，就可以这样写：

```javascript
{
    content: function * (event, { player }) {
        let cards = yield player.draw(2);

        if (player.countCards("h") > 5) {
            yield player.chooseToDiscard(2, true);
        }

        player.addMark("jiang");
    }
}
```

在 `Generator Content`中，`Step Content`中的 `content`属性被换成了一个数组，数组中每个函数都是一个 `step`，返回需要等待的事件，其中第一个参数则是当前事件，第二个参数是所有 `Step Content`给出的参数，没用上的第三个参数则是需要等待事件的结果——这种参数形式被标记为“旧参数格式”，目前已被 `Async Content`的参数形式取代

你会发现，这很像 `Async Content`。实际上，当时 `Generator Content`或许会代替现在 `Async Content`的地位，因为两者的优缺点一致，`Generator Content`也能轻松实现异步功能；但时至今日，我们庆幸最终采用了 `Async Content`，并将事件改成了可 `await`的东西——这使得等待归一，从而使代码能实现更多功能，而 `Generator Content`的 `yield`却无法简单的实现

只不过这一点过于复杂，本章节不会阐述，但额外章节会考虑讲述这一方面的内容

### `Array Content`

在v1.10.15中，由于旧的`Array Content`并没有人用，故新的`Array Content`取代了原有的`Array Content`，成为了目前无名杀解决跳步残留的方法之一

比如之前的技能，就可以这么写：

```javascript
{
    content: [
        async (event, trigger, player) => {
            player.addTempSkill("jiang");
            await player.draw(2);
        },
        async (event, trigger, player) => {
            if (player.countCards("h") > 5){
                //return的事件会自动await，并将结果存入event._result
                return player.chooseToDiscard(2, true);
            }
        },
        async (event, trigger, player) => {
            player.addMark("jiang");
        }
    ]
}
```

由于 `Array Content`的强大兼容性，在v1.10.15后 `Async Content` 和 `Step Content` 会在运行时被封装为 `Array Content`，从而更好地进行生命周期管理

---

好了，到此你就已经彻底的把 `Async Content`的关键知识浏览了一遍，如果要更好的巩固它，可以试着把你之前的技能改成 `Async Content`试试

未来可以遇见的是，`Asnyc Content`必将慢慢成为主流，而无名杀的代码环境也会逐渐使用async函数——这是Javascript的选择，也将是无名杀的选择

感谢你的阅读，希望你能通过本章节来创作出更好的扩展
