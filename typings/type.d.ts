//这里主要是声明各种游戏内常用的对象的结构
type listeners = {
    [key in keyof HTMLElementEventMap]?: EventListener;
};

type styleObj = {
    [key in keyof CSSStyleDeclaration]?: string;
}

/** 
 * @deprecated
 * key为字符串的Record
 */
type SMap<V> = Record<string, V>;

/** 单体与集合类型 */
type SAAType<T> = T | T[];


type Row_Item = SAAType<Card | Player | string>;
type Row_Item_Option<T = Row_Item> = {
    /**添加的东西，可以是string,card,player或它们的数组 */
    item: T;
    /**行中有多个框，每个框的样式 */
    itemContainerCss?: CSSStyleDeclaration;
    /**每个框中有多个项目，每个项目的样式，比如每个卡的样式 */
    itemCss?: CSSStyleDeclaration;
    /**自定义的方法，可以自定义加完后的一些逻辑 */
    custom?: (itemContainer: HTMLDivElement) => void;
    /**每个框所分配行的总宽度的比例 */
    ratio?: number;
    /**控制每个框中的项目是否可以支持点击 */
    ItemNoclick?: boolean;
    /**点击每个项目的回调函数
     * @param item 当前点击的item
     * @param itemContainer 当前item所在的容器
     * @param AllItemConatainers 所有的容器框
     * @param e 鼠标事件
     */
    clickItem?: (item: HTMLDivElement, itemContainer: HTMLDivElement, AllItemConatainers: HTMLDivElement[], e: MouseEvent) => void;
    /**
     * 点击框的回调事件
     * @param itemContainer 当前点击的框
     * @param item 框中最开始加入的原始的项目
     * @param AllItemConatainers 所有的容器框
     * @param e 鼠标事件
     */
    clickItemContainer?: (itemContainer: HTMLDivElement, item: T, AllItemConatainers: HTMLDivElement[], e: MouseEvent) => void;
    overflow?: 'fold' | 'scroll' | 'hidden';
};
declare type RowItem = Row_Item | Row_Item_Option<Row_Item>;

/** 技能content */
declare type ContentFuncByAll = (event: GameEvent, trigger: GameEvent, player: Player) => Promise<any>;
declare type ContentFuncsByAll = ((event: GameEvent, trigger: GameEvent, player: Player, result: Partial<Result>) => Promise<any>)[];

declare type OldContentFuncByAll = () => void

declare type Game = typeof import('noname').game;
declare type Library = typeof import('noname').lib;
declare type Status = typeof import('noname')._status;
declare type UI = typeof import('noname').ui;
declare type Get = typeof import('noname').get;
declare type AI = typeof import('noname').ai;

declare type Button = import('@/library/index.js').Button;
declare type Card = import('@/library/index.js').Card;
declare type VCard = import('@/library/index.js').VCard;
declare type Dialog = import('@/library/index.js').Dialog;
declare type GameEvent = import('@/library/index.js').GameEvent;
declare type Player = import('@/library/index.js').Player;
declare type Control = import('@/library/index.js').Control;

declare type Video = import('@/game/index.js').Video;
declare type Videos = import('@/game/index.js').Videos;
declare type GameHistory = import('@/game/index.js').GameHistory;

declare type Sex = 'male' | 'female' | 'dobule' | 'none';
declare type Character = [Sex, string, number | string, string[], string[]] | [Sex, string, number | string, string[]] | import('@/library/element/character.js').Character;
declare type Select = [number, number];

declare interface progress extends HTMLDivElement {
    /** 获取标题 */
    getTitle: () => string;
    /** 更改标题 */
    setTitle: (title: string) => void;
    /** 获取显示的文件名 */
    getFileName: () => string;
    /** 更改显示的文件名 */
    setFileName: (title: string) => void;
    /** 获取进度*/
    getProgressValue: () => number;
    /** 更改进度*/
    setProgressValue: (value: number) => void;
    /** 获取下载文件总数 */
    getProgressMax: () => number;
    /** 修改下载文件总数 */
    setProgressMax: (max: number) => void;
    /** 通过数组自动解析文件名 */
    autoSetFileNameFromArray: (fileNameList: string[]) => void;
}

/**
 * 导入武将包的配置
 */
declare interface importCharacterConfig {
    /** 武将包名 */
    name: string;
    /** 
     * 设置该武将包是否可以联机 
     */
    connect?: boolean;
    /** 
     * 设置联机武将禁用列表 
     * */
    connectBanned?: string[];
    /** 
     * 设置武将基本配置信息
     */
    character: Record<string, Character>;
    /** 
     * 设置武将介绍 
     * */
    characterIntro?: Record<string, string>;
    /** 
     * 设置武将标题（用于写称号或注释）
     * */
    characterTitle?: Record<string, string>;
    /** 
     * 设置技能 
     * */
    skill?: Record<string, Skill>;
    /** 
     * 设置珠联璧合武将 
     * */
    perfectPair?: Record<string, string[]>;
    /** 
     * 设置指定武将的过滤方法（传入一个mode，用于过滤玩法模式） 
     * */
    characterFilter?: Record<string, (mod: string) => boolean>;
    /** 
     * 设置在武将包界面分包
     */
    characterSort?: Record<string, Record<string, string[]>>;
    /** 
     * 设置该武将包独有的卡牌（或者是特殊卡牌） 
     * 
     * */
    card?: Record<string, any>;
    /** 
     * 设置自定义卡牌类型的排序用的优先级
     * */
    cardType?: Record<string, number>;
    /**
     * 设置动态翻译（本地化）【v1.9.105】
     * 
     * 指定lib.dynamicTranslate.xxx为一个函数 即可让技能xxx显示的描述随玩家状态而变化 并实现技能修改等
     * 
     * Player:指技能拥有者
     */
    dynamicTranslate?: Record<string, (player: Player) => string>;
    /** 
     * 选择武将时，武将左下角可进行替换的武将配置【v1.9.106.3】 
     * 
     * */
    characterReplace?: Record<string, string[]>;

    translate?: Record<string, string>;
    /**
     * 对应lib.element
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;
    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;

    [key: string]: any;
}
/**
 * 导入卡牌包的配置
 */
declare interface importCardConfig {
    /** 卡牌包名 */
    name: string;
    /** 
     * 设置该卡包是否可以联机 
     * */
    connect?: boolean;
    /** 
     * 设置卡牌
     * */
    card: Record<string, Card>;
    /** 
     * 设置卡牌技能 
     * */
    skill: Record<string, Skill>;
    /** 
     * 设置从牌堆添加指定卡牌
     * */
    list: CardBaseUIData[];
    /** 卡牌翻译 */
    translate: Record<string, string> | string;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;

    [key: string]: any;
}

/**
 * 导入玩法模式的配置
 */
declare interface importModeConfig {
    /** 模式名 */
    name: string;
    /** 技能（主要是放些该模式下特有的技能） */
    skill?: Record<string, Skill>;
    /** 
     * 武将包
     */
    characterPack?: Record<string, Record<string, Character>>;
    /**
     * 武将分类排序
     */
    characterSort?: Record<string, Record<string, string[]>>;
    /** 卡牌（主要是放些该模式下特有的卡牌） */
    card?: Record<string, Card>;
    /** 
     * 卡包
     */
    cardPack?: Record<string, Record<string, string[]>>;
    /**
     * mode的init方法（若有，init是最早启动的方法）
     */
    init?(): void;
    /**
     * mode的start启动方法
     */
    start: ContentFuncByAll;
    /**
     * mode的start启动之前的处理方法
     */
    startBefore?(): void;
    /**
     * 重新初始化
     * 
     * 在lib.client.reinit中，
     * 
     * game.loadModeAsync，读取mode时启用这个初始化。
     * 
     * 具体作用：有待考究
     */
    onreinit?(): void;
    /**
     * 对应lib.element
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;

    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;

    [key: string]: any;
}

/**
 * 导入武将的配置
 */
declare interface importPlayerConfig {
    /** 武将包名 */
    name: string;
    /** 禁用此扩展的模式 */
    forbid: string[];
    /** 可使用模式 */
    mode: string[];
    //自定义是实现核心初始化方法
    init?(): void;
    arenaReady?(): void;
    /**
      * 对应lib.element
      * 
      * 若里面是项目内的同名字段，将覆盖原方法
      */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;

    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;

    [key: string]: any;
}

/**
 * 导入扩展的配置
 */
declare interface importExtensionConfig {
    /** 扩展名 */
    name: string;
    /** 用于解析用的key，不直接参与游戏逻辑，参与自己定义的解析流程，统一该包的前缀 */
    key?: string;
    /** 
     * 是否可编辑该扩展（需要打开显示制作扩展）
     * 
     * （都满足条件，则可以开启“编辑此扩展”功能）
     */
    editable?: boolean;
    /** 
     * 该扩展菜单的配置 
     * 
     * 名字："extension_" + key
     * 
     * 内容： value
     * 
     * (也是游戏编辑器中的选项代码部分)
     */
    config?: Record<string, SelectConfigData>;
    /**
     * 联机配置（目前扩展已经不能联机）
     * 
     * 特殊接口：update
     */
    connect?: Record<string, SelectConfigData>;
    /**
     * 扩展的包信息。
     * 
     * 包括卡牌，技能，人物的代码以及中文翻译
     */
    package: PackageData;
    /**
     * 函数执行时机为游戏数据加载之后、界面加载之前
     * 
     * （游戏编辑器中的主代码部分）
     * 
     * 注：即选择了玩法模式之后加载的内容部分；
     * @param config 扩展选项/配置
     * @param pack 扩展定义的武将、卡牌和技能等
     */
    content?(config: Record<string, any>, pack: PackageData): void;
    /**
     * 函数执行时机为游戏数据加载之前，且不受禁用扩展的限制，除添加模式外请慎用
     * 
     * （也是游戏编辑器中的启动代码部分）
     * 
     * 注：game.import添加扩展时就加载，即当前游戏加载菜单界面时就已经加载；
     * 
     * 注2：当前扩展联机时，需要直接再此扩展；为了方便扩展，大部分扩展直接在这里扩展；
     * @param data 保存在lib.config中”extension_扩展名“为前缀的配置
     */
    precontent?(data?: Record<string, any>): void;
    /** 删除该扩展后调用 */
    onremove?(): void;
    /** 
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;
    /** 相关文件名 */
    files?: {
        character?: string[],
        card?: string[],
        skill?: string[]
    };
    /**
     * 【特殊】用于game.addMode添加时，
     * 用于显示模式icon，所有的图片路径的imgsrc，指定外层扩展文件名；
     */
    extension?: string;
    /**
     * 对应lib.element,
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     */
    game?: Record<string, any>;
    /**
     * 对应get
     */
    get?: Record<string, any>;
    /** 
     * 可以继续加入更多对象：
     * 这些对象会对应附加在lib中，或替换对应lib位置的对象：
     * 例如：translate，help，skill... ... 或者其他自定义的...
     */
    [key: string]: any;
}

/**
 * 导入玩法的配置
 */
declare interface importPlayConfig {
    /** 扩展名 */
    name: string;
    arenaReady?: Function;
    /**
     * 设置播放录像
     */
    video?: Function;
    /** 
     * 设置技能 
     * */
    skill?: Record<string, Skill>;
    /** 
     * 设置该武将包独有的卡牌（或者是特殊卡牌） 
     * 
     * */
    card?: Record<string, any>;
    translate?: Record<string, string>;
    /**
     * 对应lib.element
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;
    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;
    [key: string]: any;
}

/** 
 * 菜单的选项的配置 
 * 
 * config的功能菜单的node._link.config，就是该config
 * 内部代码略复杂，太多UI相关逻辑，看不懂（等日后精进，再继续再战）
 */
declare interface SelectConfigData {
    /** 功能名 */
    name: string;
    /** 
     * 【核心】初始化时默认的选项/配置/模式（对应下面item的key）
     */
    init?: boolean | string;
    /** 
     * 【核心】二级菜单配置(当前config内容的菜单)
     */
    item?: Record<string, string> | (() => Record<string, string>);
    /** 
     * 功能说明
     * 
     * 若没有，也不是其他特殊的选项，则显示“设置 + name”
     */
    intro?: string | (() => string);

    /**
     * 显示bar(添加了“withbar”,有一定的居中效果，即当前menu的头部或者尾部)
     * 
     * @param node 创建出来的visualBar节点
     * @param item item选项
     * @param create 即内部自定义的createNode方法，一般不直接使用该方法，目前来看，可以内部重新定义覆盖该方法，自己达成创建item列表的方式
     * @param switcher 当前config的item的node节点
     */
    visualBar?: (node: HTMLDivElement, item: Record<string, string>, create: (arg: string) =>  void, switcher?: HTMLDivElement) => void
    /**
     * 显示菜单
     * 显示一个以3列为一行的显示列表（内部实现）
     * @param node 当前配置项的节点
     * @param item 当前node的node._link
     * @param name item选项
     * @param config 当前的config
     */
    visualMenu?: (node: HTMLDivElement, link: any, name: string, config: SelectConfigData) => void;
    /**
     * 文本菜单
     * 当前不存在visualMenu的话，则创建item列表节点，若有该属性则执行
     * @param node 
     * @param link 
     */
    textMenu?(node: HTMLDivElement, link: string, config: SelectConfigData): void;

    /** 
     * 清理游戏，核心选项，应该默认是false(undefined)<--该功能不知是否存在
     * 
     * 若没有nopointer配置（false/undefined）,则设置“pointerspan”
     * 
     * 通“click”,即当前整个node都可以点击<--这个应该才是真实的功能
     */
    clear?: boolean;
    /** 指定该项没有功能，仅展示，项目内多用于描述上 */
    nopointer?: boolean;
    /** 
     * 点击触发事件
     * 
     * 若有返回值false，则当前点击事件的toggle切换无效
     */
    onclick?(item: any): void | boolean;
    onclick?(link: any, node: HTMLDivElement): void | boolean;

    /** 当前没有onclick方法时，除了默认game.saveConfig保存数据配置key的数据，可以使用该方法进行数据处理啊 */
    onsave?(reslut: any): void;

    /**
     * 输入框
     * 
     * 其输入框的默认值是当前的init属性
     */
    input?: boolean;
    /** 取值true，若没有设置可以进行input输入 */
    fixed?: boolean;
    /** 设置input节点的onblur事件的回调（焦点离开输出框） */
    onblur?(): void;

    /**
     * 用于扩展菜单lib.extensionMenu中(目前未见使用)
     */
    onswitch?(bool: boolean): void;

    /** 核心，更新方法 */
    update?(config: Record<string, any>, map: Record<string, HTMLDivElement>): any;

    /**
     * 在玩法模式选择中： 
     *  是否需要“重启”游戏，若为true，则“启”按钮会高亮（添加“glowing”）
     * 在选项中：
     *  每次改变该选项，都会重置当前的ui选项（增加，减少一些功能项） 
     */
    restart?: boolean | (() => boolean);
    /** 应该与unfrequent功能时一致的，相反判断，直接显示出来的功能项 */
    frequent?: boolean,
    /** 加入更多中（随着下拉出现），用得较多 */
    unfrequent?: boolean;
    /** 不明，用得很少 */
    content?(bool: boolean): void;

    /** 内部属性，记录当前配置的key */
    _name?: string;
}

/** 
 * 扩展的包信息
 * 游戏自带编辑器的代码编辑区域的扩展结构：
 * （主要是通过系统内部自带编译器编辑的代码，导入逻辑其实基本一致）
 */
declare interface PackageData {
    /** 扩展制作作者名 */
    author?: string,
    /** 扩展描述 */
    intro?: string,
    /** 讨论地址 */
    diskURL?: string,
    /** 网盘地址 */
    forumURL?: string,
    /** 扩展版本 */
    version?: string,

    /** 武将导入信息 */
    character?: {
        character: Record<string, Character>;
        translate: Record<string, string>;
    };
    /** 卡牌导入信息 */
    card?: {
        card: Record<string, Card>;
        translate: Record<string, string>;
        list: CardBaseUIData[];
    };
    /** 技能导入信息 */
    skill?: {
        skill: Record<string, Skill>;
        translate: Record<string, string>;
    };

    /** 相关文件名（扩展所使用的一些图片） */
    files?: {
        character: string[];
        card: string[];
        skill: string[];
    }

    /** 主代码中，pack.code包括以下属性： */
    code?: {
        /** 扩展的config配置信息 */
        config?: Record<string, SelectConfigData>;
        /** 扩展主代码 */
        content?: (config: Record<string, any>, pack: PackageData) => void;
        /** 扩展帮助信息 */
        help?: Record<string, string>;
        /** 扩展启动代码 */
        precontent?: (data?: Record<string, any>) => void;
    }
}




interface When {
    /**一次性技能的内容，一个then中写一个step中的内容 */
    then(fun: ContentFuncByAll): When
    /**
     * ```plain
     * 闭包用法的then，不再提供parsex变量，改为使用闭包访问
     * 传参为 event, trigger, player
     *
     * 闭包即你可以直接在when里面访问when外面的变量
     * 如下：
     * ```
     * ```javascript
     * var att = get.attitude(player, target);
     *
     * player.when("phaseEnd")
     *     .step(() => {
     *         if (att > 0) // 闭包访问了外面定义的变量 att
     *             player.say("你好喵!");
     *     });
     * ```
     */
    step(fun: ContentFuncByAll): When
    /**添加临时技能的必要筛选条件，只有当添加的筛选条件都通过时，才能触发 */
    filter(fun: Required<Skill>['filter']): When
    /**
     * 向临时技能中添加技能可以拥有的一切属性
     *  */
    assign(obj: Skill): When
    /**触发时，弹出的显示提示字样 */
    popup(str: string): When
    /**
     * 用于在then中用到的变量
     * ```
     * player.when('useCard').vars({
     * targets:result.targets
     * }).then(()=>{
     * //这里面可以使用vars中传递的参数
     * targets.gain()
     * })
     * ```
    */
    vars(obj: Record<string, any>): When
    translation(str: string): When
    /**
     * 获得技能
     * 如果instantlyAdd为false，则需要以此法获得技能
     **/
    finish(): When
}

type _AllCardName = "caoyao" | "dinvxuanshuang" | "du" | "fengyinzhidan" | "hufu" | "jiu" | "sha" | "shan" | "shenmiguo" |
    "shoulijian" | "tao" | "tianxianjiu" | "xuejibingbao" | "yunvyuanshen" | "ziyangdan" | "caochuan" | "caochuanjiejian" |
    "zhulu_card" | "chenghuodajie" | "chenhuodajie" | "chiyuxi" | "chuansongmen" | "chuqibuyi" | "diaobingqianjiang" |
    "diaohulishan" | "dongzhuxianji" | "dunpaigedang" | "fudichouxin" | "geanguanhuo" | "guaguliaodu" | "guisheqi" | "guohe" |
    "heilonglinpian" | "huogong" | "huoshaolianying" | "jiedao" | "jiejia" | "jihuocard" | "jinchan" | "jingleishan" |
    "jinlianzhu" | "juedou" | "kaihua" | "linghunzhihuo" | "liufengsan" | "liuxinghuoyu" | "nanman" | "qijia" | "shandianjian" |
    "shatang" | "shencaojie" | "shenenshu" | "shengdong" | "shezhanqunru" | "shihuifen" | "shijieshu" | "shuiyanqijun" |
    "shuiyanqijunx" | "shujinsan" | "shunshou" | "suijiyingbian" | "tanshezhiren" | "taoyuan" | "tiesuo" | "toulianghuanzhu" |
    "tuixinzhifu" | "wangmeizhike" | "wanjian" | "wugu" | "wuxie" | "wuzhong" | "xianluhui" | "xietianzi" | "xingjiegoutong" |
    "yangpijuan" | "yiyi" | "youdishenru" | "yuanjiao" | "yuansuhuimie" | "zengbin" | "zhaomingdan" | "zhiliaobo" | "zhufangshenshi" |
    "zhujinqiyuan" | "bingliang" | "caomu" | "fulei" | "guiyoujie" | "hongshui" | "huoshan" | "lebu" | "shandian" | "chilongya" |
    "cixiong" | "duanjian" | "fangtian" | "fengxueren" | "guanshi" | "guding" | "guiyanfadao" | "hanbing" | "kuwu" | "pangufu" |
    "qibaodao" | "qilin" | "qinggang" | "qinglong" | "qixingbaodao" | "sanjian" | "wufengjian" | "wutiesuolian" | "wuxinghelingshan" |
    "xuanyuanjian" | "yajiaoqiang" | "yinyueqiang" | "yitianjian" | "zhangba" | "zheji" | "zhuge" | "zhungangshuo" | "zhuque" |
    "bagua" | "baihupifeng" | "baiyin" | "guangshatianyi" | "heiguangkai" | "huxinjing" | "lanyinjia" | "mianju" | "mutoumianju" |
    "nvzhuang" | "qinglianxindeng" | "renwang" | "serafuku" | "suolianjia" | "tengjia" | "yexingyi" | "yinfengjia" | "yinfengyi" |
    "dilu" | "hualiu" | "jueying" | "xiayuncailing" | "zhanxiang" | "zhuahuang" | "chitu" | "daihuofenglun" | "dawan" | "jingfanma" |
    "numa" | "yonglv" | "zixin" | "donghuangzhong" | "fuxiqin" | "gjyuheng" | "guilingzhitao" | "haotianta" | "jinhe" | "jiuwei" |
    "kongdongyin" | "kunlunjingc" | "langeguaiyi" | "lianyaohu" | "monkey" | "muniu" | "nvwashi" | "qiankundai" | "qinglonglingzhu" |
    "sadengjinhuan" | "shennongding" | "shentoumianju" | "shuchui" | "sifeizhenmian" | "taigongyinfu" | "tianjitu" | "tongque" | "xinge" |
    "xingjunyan" | "xixueguizhihuan" | "xuelunyang" | "yufulu" | "yuruyi" | "baishouzhihu" | "bingpotong" | "cangchizhibi" | "chunbing" |
    "feibiao" | "gouhunluo" | "gudonggeng" | "huanglinzhicong" | "jiguanfeng" | "jiguanshu" | "jiguantong" | "jiguanyaoshu" | "jiguanyuan" |
    "lingjiandai" | "liutouge" | "liyutang" | "longxugou" | "luyugeng" | "mapodoufu" | "mianlijinzhen" | "mizhilianou" | "molicha" |
    "mujiaren" | "qiankunbiao" | "qinglongzhigui" | "qingtuan" | "shenhuofeiya" | "tanhuadong" | "xiajiao" | "xuanwuzhihuang" | "yougeng" |
    "yuanbaorou" | "yuchandui" | "yuchangen" | "yuchankan" | "yuchankun" | "yuchanli" | "yuchanqian" | "yuchanxun" | "yuchanzhen" |
    "zhiluxiaohu" | "zhuquezhizhang"

type AllCardName = _AllCardName | (string & {})

//--------------------


//所有的由event.trigger()发出的时机信号汇总
type Signal_Trigger = `addShownCardsAfter` | `addToExpansionBefore` | `boss_baonuwash` | `changeHp` | `changeSkillsAfter` | `changeSkillsBefore` | `changeSkillsBegin` | `changeSkillsEnd` | `compare` | `compareCardShowBefore` | `compareFixing` | `damage` | `damageBegin1` | `damageBegin2` | `damageBegin3` | `damageBegin4` | `damageSource` | `damageZero` | `debateShowOpinion` | `die` | `discard` | `dying` | `enterGame` | `eventNeutralized` | `executeDelayCardEffect` | `fellow` | `gameStart` | `gift` | `giftAccept` | `giftAccepted` | `giftDenied` | `giftDeny` | `hideShownCardsAfter` | `jiananUpdate` | `judge` | `judgeFixing` | `juedou` | `loseToDiscardpile` | `phaseAfter` | `phaseBefore` | `phaseBeforeEnd` | `phaseBeforeStart` | `phaseBegin` | `phaseBeginStart` | `phaseChange` | `phaseDiscard` | `phaseDrawBegin1` | `phaseDrawBegin2` | `phaseEnd` | `phaseJudge` | `phaseOver` | `phaseUseAfter` | `phaseUseBefore` | `phaseUseBegin` | `phaseUseEnd` | `recast` | `recastingGain` | `recastingGained` | `recastingLose` | `recastingLost` | `removeCharacterBefore` | `removeSubPlayer` | `respond` | `rewriteDiscardResult` | `rewriteGainResult` | `roundStart` | `shaDamage` | `shaHit` | `shaMiss` | `shaUnhirt` | `showCharacterAfter` | `showCharacterEnd` | `skillAfter` | `subPlayerDie` | `triggerAfter` | `triggerHidden` | `triggerInvisible` | `useCard` | `useCard0` | `useCard1` | `useCard2` | `useSkill` | `washCard` | `wuguRemained` | `yingbian` | `zhuUpdate`;
//所有的带额外时机的事件汇总
type EventWithTrigger = `${_AllCardName}` | `${_AllCardName}Cancel` | `${_AllCardName}ContentAfter` | `${_AllCardName}ContentBefore` | `[skillname]` | `[skillname]ContentAfter` | `[skillname]ContentBefore` | `[skillname]_cost` | `_save` | `addFellowAuto` | `addJudge` | `addToExpansion` | `boss_jingjia` | `callSubPlayer` | `caochuan_gain` | `cardsDiscard` | `cardsGotoOrdering` | `cardsGotoPile` | `cardsGotoSpecial` | `carryOutJunling` | `changeCharacter` | `changeGroup` | `changeHp` | `changeHujia` | `changeVice` | `chessMech` | `chessMechRemove` | `chooseBool` | `chooseButton` | `chooseButtonOL` | `chooseCard` | `chooseCardOL` | `chooseCardTarget` | `chooseCharacter` | `chooseCharacterOL` | `chooseControl` | `chooseCooperationFor` | `chooseJunlingControl` | `chooseJunlingFor` | `choosePlayerCard` | `chooseSkill` | `chooseTarget` | `chooseToCompare` | `chooseToDebate` | `chooseToDisable` | `chooseToDiscard` | `chooseToDuiben` | `chooseToEnable` | `chooseToGive` | `chooseToGuanxing` | `chooseToMove` | `chooseToMoveChess` | `chooseToMove_new` | `chooseToPSS` | `chooseToPlayBeatmap` | `chooseToRespond` | `chooseToUse` | `chooseUseTarget` | `compareMultiple` | `damage` | `die` | `disableEquip` | `disableJudge` | `discard` | `discardPlayerCard` | `discoverCard` | `doubleDraw` | `draw` | `dying` | `enableEquip` | `enableJudge` | `equip` | `equip_${_AllCardName}` | `executeDelayCardEffect` | `exitSubPlayer` | `expandEquip` | `finish_game` | `gain` | `gainMaxHp` | `gainPlayerCard` | `game` | `gameDraw` | `gift` | `guozhanDraw` | `gzzhenxi_use` | `hideCharacter` | `judge` | `link` | `loadMap` | `loadPackage` | `lose` | `loseAsync` | `loseHp` | `loseMaxHp` | `loseToDiscardpile` | `lose_${_AllCardName}` | `lose_[VEquip.name]` | `mayChangeVice` | `moveCard` | `nvzhuang_lose` | `phaseDiscard` | `phaseDraw` | `phaseJieshu` | `phaseJudge` | `phaseLoop` | `phaseZhunbei` | `phaseAny` | `pre_[event.wuxieresult2]` | `pre_[skillname]` | `qinglong_guozhan` | `recast` | `recover` | `removeCharacter` | `replaceChessPlayer` | `replaceEquip` | `replaceHandcards` | `replacePlayer` | `respond` | `showCards` | `showHandcards` | `stratagemCamouflage` | `stratagemInsight` | `swapEquip` | `toggleSubPlayer` | `turnOver` | `useCard` | `useSkill` | `versusDraw` | `viewCards` | `viewCharacter` | `yingbianEffect` | `yingbianZhuzhan` | `zhuque_clear` | `undefined`;
//所有的不带额外时机的事件汇总,即game.createEvent(xxx,false)
type EventWithoutTrigger = `[eventname]Inserted` | `addShownCards` | `arrangeTrigger` | `changeSkills` | `chooseDrawRecover` | `debateCallback` | `delay` | `delayx` | `dieAfter` | `enterGame` | `gainMultiple` | `game` | `hideShownCards` | `judgeCallback` | `leaderView` | `loadMode` | `logSkill` | `logSkillBegin` | `orderingDiscard` | `phase` | `phaseUse` | `qianlidanji_replace` | `replacePlayer` | `replacePlayerSingle` | `replacePlayerTwo` | `shidianyanluo_huanren` | `showCharacter` | `showYexings` | `swapHandcards` | `trigger` | `useCardToExcluded` | `useCardToPlayer` | `useCardToPlayered` | `useCardToTarget` | `useCardToTargeted` | `video` | `waitForPlayer` | `wuxianhuoli_reward` | `year_limit_pop`;
//所有的事件汇总
type AllEvent = EventWithTrigger | EventWithoutTrigger;
//----------------------

//所有的由event派生的额外的时机信号
type Signal_Event = `${EventWithTrigger}Before` | `${EventWithTrigger}Begin` |
    `${EventWithTrigger}End` | `${EventWithTrigger}After` | `${EventWithTrigger}Skipped`

//【最终的所有的总的时机信号】 = 【由事件派生的】 + 【event.trigger()手动触发的】
type Signal = Signal_Event | Signal_Trigger | (string & {})


type EnableSignal1 = 'chooseToUse' | 'chooseToRespond' | 'chooseCard'
//技能的enable
type EnableSignal = 'phaseUse' | EnableSignal1 | EnableSignal1[]


interface CheckMod {
    <T extends string & keyof Mod>(...args: [...Parameters<Required<Mod>[T]>, name: T, skills: string[]]): ReturnType<Required<Mod>[T]>
}

interface History_UseSkill {
    /** 技能事件 */
    event: GameEvent,
    /** 技能名 */
    skill: string;
    /** 来源技能 */
    sourceSkill: string;
    /** 技能目标 */
    targets: Player[] | false;
    /** 技能类型 */
    type: "global" | "player";
}
interface ActionHistory {
    /** 使用卡牌 */
    useCard: GameEvent[],
    /** 响应 */
    respond: GameEvent[],
    /** 跳过 */
    skipped: GameEvent[],
    /** 失去卡牌 */
    lose: GameEvent[],
    /** 获得卡牌 */
    gain: GameEvent[],
    /** 伤害来源 */
    sourceDamage: GameEvent[],
    /** 造成伤害 */
    damage: GameEvent[],
    /** 自定义的东西 */
    custom: any[],
    /**使用的技能 */
    useSkill: History_UseSkill[]
    /**是否是[我this]的回合 */
    isMe?: boolean
    /**是否一轮的开端 */
    isRound?: boolean
}
type Stat = {
    /** 出牌(不同名字的牌单独计数) */
    card: Record<AllCardName, number>;
    /** 使用技能（不同名字的技能单独计数） */
    skill: Record<string, number>;
    /** 伤害 */
    damage?: number;
    /** 受到伤害 */
    damaged?: number;
    /** 摸牌 */
    gain?: number;
    /** 杀敌 */
    kill?: number;
    /** 使用技能次数（不区分统一计数） */
    allSkills?: number;

}

declare interface menuData {
    /** 菜单左方的数据列表 */
    leftPaneData: { name: string; attrs: Record<string, any> }[][];
    /** 缓存的vue实例 */
    rightPaneApps: Map<
      HTMLElement,
      { element: HTMLElement; app: import("vue").App<HTMLElement> }
    >;
    /** 响应式的config */
    configDatas: Map<string, {
      [key: string]: SelectConfigData;
      update: (config: any, map: any) => any;
    }>;
    /** 初始化菜单左方的数据列表
     * @param connectMenu 是否是联机菜单
     */
    initLeftPaneData(connectMenu: boolean): { name: string; attrs: Record<string, any> }[][];
    /** 获取默认选中的元素 */
    getDefaultActive(
      connectMenu: boolean,
      nodes: HTMLElement[]
    ): HTMLElement | void;
    /** 初始化配置 */
    initConfigs(
      connectMenu: boolean,
      node: HTMLElement,
      startButton: HTMLElement
    ): void;
    /** 右方html模板 */
    rightPaneTemplate: import("vue").Component;
  }
