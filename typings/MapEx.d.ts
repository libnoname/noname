declare interface Map<K, V> {
	/**
	* @deprecated 为了兼容array改为map而创建的方法，请使用has
	*/
	contains(item: K): boolean;

	/**
	* @deprecated 为了兼容array改为map而创建的方法，请使用has
	*/
	inculdes(item: K): boolean;
	/**
	* @deprecated 为了兼容array改为map而创建的方法，请使用set
	*/
	add(item: K): this;
	/**
	* @deprecated 为了兼容array改为map而创建的方法，请使用set
	*/
	push(item: K): this;
	/**
	* @deprecated 为了兼容array改为map而创建的方法
	*/
	addArray(arr: Array<K>): this;
	/**
	* @deprecated 为了兼容array改为map而创建的方法，请使用delete
	*/
	remove(item: K): this;
}