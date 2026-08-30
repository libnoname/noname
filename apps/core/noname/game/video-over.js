export function unpackVideoOverContent(content) {
	if (typeof content === "string") {
		return {
			html: content,
			handcardPoptips: null,
		};
	}

	return content;
}
