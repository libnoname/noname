export function isBannedText(text: string, bannedKeywords: string[]): boolean {
	return bannedKeywords.some(keyword => text.includes(keyword));
}
