import { intro as normalIntro } from "./normal.js";
import { intro as zhenIntro } from "./zhen.js";
import { intro as shiIntro } from "./shi.js";
import { intro as bianIntro } from "./bian.js";

export default {
	...normalIntro,
	...zhenIntro,
	...shiIntro,
	...bianIntro,
};
