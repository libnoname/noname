// noname内扩展的一些array方法：
declare interface Array<T> {
    // /**
    //  * @deprecated 已废弃，请使用includes
    //  */
    // contains(item: T): boolean;
    containsSome(...item: T[]): boolean;
    containsAll(...item: T[]): boolean;
    /**
     * 将任意元素添加进数组中，若元素已经存在则不添加
     * @param args 
     * @returns 
     */
    add(...item: T[]): this;
    /**
     * 将一个数组的所有元素添加进数组中(循环执行this.add)，此时参数arr中若有一个数组元素可能会出现bug
     * @param arr 
     */
    addArray(...arr: T[][]): this;
    /**
     * 将任意元素移出数组(该元素不能是数组)
     * @param item 
     * @returns 
     */
    remove(...item: T[]): this;
    /**
     * 将一个数组的所有元素移出数组(循环执行this.remove)，此时参数arr中若有一个数组元素可能会出现bug
     * @param arr 
     */
    removeArray(...arr: T[][]): this;
    /**
     * 随机获得该数组的一个元素
     * @param excludes 需要排除的元素；
     */
    randomGet(...excludes: T[]): T;
    /**
     * 随机获取多个数组的元素，返回获取到的元素组成的数组
     * @param num 获取的数量（默认为0）
     */
    randomGets(num?: number): T[];
    /**
     * 随机移除数组的一个元素，返回被移除的元素 （若数组无元素返回undefined）
     */
    randomRemove(): T | undefined;
    /**
     * 随机移除数组的多个元素，返回被移除元素组成的数组
     * @param num 移除元素的个数
     * @returns 
     */
    randomRemove(num: number): T[];
    /**
     * 将数组随机排序，改变原数组
     */
    randomSort(): this;
    /**
     * 以目标玩家为起点，将数组按座位排序，改变原数组
     * 
     * *只适用于玩家数组（使用lib.sort.seat方法）
     * 
     * @param target 目标玩家（默认为一号位）
     */
    sortBySeat(target?: Player): this;
    /**
     * 将一个Array中所有位于处理区的卡牌过滤出来（只适用于卡牌数组）
     * 
     * 例：设一list为[c1,c2,c3,c4]，其中c1和c3是位于处理区的卡牌
     * 那么list.filterInD()得到的结果即为[c1,c3]
     * 
     * 在1.9.97.8.1或更高的版本中: 
     * 可通过直接在括号中填写一个区域 来判断处于特定区域的卡牌 
     * 例：list.filterInD('h') 即判断数组中所有位于手牌区的卡牌
     * @param position 指定的区域，默认是 'o'
     */
    filterInD(position?: "e" | "j" | "x" | "s" | "h" | "c" | "d" | "o"): this;
    someInD(position?: "e" | "j" | "x" | "s" | "h" | "c" | "d" | "o"): boolean;
    everyInD(position?: "e" | "j" | "x" | "s" | "h" | "c" | "d" | "o"): boolean;

    //关于处理区：
    /*
    不知道处理区是什么的同学们 请自行查阅凌天翼规则集相关内容太长了我懒得贴
    处理区在无名杀的代码为ui.ordering
    为方便兼容旧扩展 使用get.position(card)方法读取处理区的卡牌 默认得到的仍然是弃牌堆（'d'）
    使用get.position(card,true) 才会得到处理区（'o'）的结果

    处理区：（不清楚无名杀对其的实验是否满足这些要求）
    一个最常被用到，但是尚未命名的区域。
    当你使用一张牌等待结算或处于结算中，
    当你和另一名角色拼点的两张牌失去时，
    当你和另一名角色交换的牌失去时，
    当你的牌被张辽或张郃搞的失去时……
    总之，当一张牌不在任何角色的手牌、装备区或判定区里，
    也不在牌堆或弃牌堆里，也没有被移出游戏，那么它就是在这个尚未命名的区域里。
    为了便于行文，在本规则与FAQ集中暂且称之为‘处理区’。
    */

    /**
     * 获取 item 在数组中出现的次数
     */
    numOf(item: T): number;
    /**
     * 将数组去重，改变原数组
     */
    unique(): this;
    /**
     * 返回去重后的数组，不改变原数组
     */
    toUniqued(): T[];
    maxBy(sortBy?: Function, filter?: typeof Array['prototype']['filter']): T;
    minBy(sortBy?: Function, filter?: typeof Array['prototype']['filter']): T;
}