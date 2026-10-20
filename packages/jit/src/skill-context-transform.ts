import ts from "typescript";

/** Compile at module load/build time, preserving lexical closures and async tags. */
export function transformSkillContext(source: string, fileName: string) {
	// Sandbox intrinsics are loaded again in a blank iframe without the game
	// import map. They must remain realm-local and must not import the engine.
	if (/\/noname\/util\/sandbox\//.test(fileName.replaceAll("\\", "/"))) return source;
	if (!/\basync\b/.test(source) || source.includes(".__nonameSkillAwait")) return source;
	// Lower only async functions. A lower global target would also inject
	// __rest/__assign into old Step bodies, which are recompiled without module
	// closures. Keep all other syntax native and let the normal build target it.
	const transforms = ts as unknown as { transformES2019: ts.TransformerFactory<ts.SourceFile>; transformES2017: ts.TransformerFactory<ts.SourceFile> };
	const asyncTransform = transforms.transformES2017,
		catchTransform = transforms.transformES2019;
	if (typeof asyncTransform !== "function" || typeof catchTransform !== "function") throw new Error(`Unsupported TypeScript async transformer: ${ts.version}`);
	const parsed = ts.createSourceFile(fileName, source, ts.ScriptTarget.ESNext, true);
	let unsupported = false;
	const inspect = (node: ts.Node) => {
		if ((ts.isForOfStatement(node) && node.awaitModifier) || (ts.isFunctionLike(node) && (node as ts.FunctionLikeDeclaration).asteriskToken && ts.canHaveModifiers(node) && node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword))) unsupported = true;
		ts.forEachChild(node, inspect);
	};
	inspect(parsed);
	// ES2017 alone cannot lower async iterators. Preserve native protocol and
	// constructor intrinsics; this whole module keeps the documented native-async
	// context boundary rather than silently emitting a broken synchronous generator.
	if (unsupported) return source;
	let alias = "__nonameSkillAwaiter";
	while (new RegExp(`\\b${alias}\\b`).test(source)) alias += "_";
	let used = false;
	const result = ts.transpileModule(source, {
		fileName,
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget.ESNext,
			allowJs: true,
			jsx: ts.JsxEmit.Preserve,
		},
		transformers: {
			after: [
				catchTransform,
				asyncTransform,
				context => root => {
					const transformed = ts.visitNode(root, function visit(node): ts.VisitResult<ts.Node> {
						node = ts.visitEachChild(node, visit, context);
						const original = ts.getOriginalNode(node);
						if (ts.isFunctionLike(node) && !(original as ts.FunctionLikeDeclaration).asteriskToken && ts.canHaveModifiers(original) && original.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword)) {
							// ContentCompiler relies on native AsyncFunction identity. The outer
							// wrapper contains no await; all user code runs inside the generator.
							const modifiers = [...(ts.canHaveModifiers(node) ? node.modifiers || [] : []), ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)];
							const f = ts.factory;
							if (ts.isFunctionDeclaration(node)) node = f.updateFunctionDeclaration(node, modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body);
							else if (ts.isFunctionExpression(node)) node = f.updateFunctionExpression(node, modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body);
							else if (ts.isArrowFunction(node)) node = f.updateArrowFunction(node, modifiers, node.typeParameters, node.parameters, node.type, node.equalsGreaterThanToken, node.body);
							else if (ts.isMethodDeclaration(node)) node = f.updateMethodDeclaration(node, modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
						}
						if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "__awaiter" && ts.getEmitFlags(node.expression) & ts.EmitFlags.HelperName) {
							used = true;
							return ts.factory.updateCallExpression(node, ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(alias), "__nonameSkillAwait"), node.typeArguments, node.arguments);
						}
						return node;
					}) as ts.SourceFile;
					if (used) {
						for (const helper of ts.getEmitHelpers(transformed) || []) {
							if (helper.name === "typescript:awaiter") ts.removeEmitHelper(transformed, helper);
						}
					}
					return transformed;
				},
			],
		},
	});
	return used ? `import { skillContextAwaiter as ${alias} } from "noname";\n${result.outputText}` : source;
}
