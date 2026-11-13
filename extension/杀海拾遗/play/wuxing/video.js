export default function video() {
	for (const i in this.translate) {
		lib.translate[i] = this.translate[i];
	}
	for (const i in this.card) {
		lib.card[i] = this.card[i];
	}
	for (const i in this.skill) {
		lib.skill[i] = this.skill[i];
	}
}
