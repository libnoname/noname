const modules = import.meta.glob(["./*.js", "!./index.js"], { eager: true });

const skills = Object.assign({}, ...Object.values(modules).map((module: any) => module.default));

export default skills;
