import ts from "typescript";

/** Compile at module load/build time, preserving lexical closures and async tags. */
export function transformEventContext(source: string, fileName: string) {
	if (!/\basync\b/.test(source) || source.includes("__nonameEventAwaiter")) return source;
	let used = false;
	const result = ts.transpileModule(source, {
		fileName,
		compilerOptions: {
			module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2016,
			allowJs: true, jsx: ts.JsxEmit.Preserve,
		},
		transformers: {
			after: [context => root => ts.visitNode(root, function visit(node): ts.VisitResult<ts.Node> {
				node = ts.visitEachChild(node, visit, context);
				const original = ts.getOriginalNode(node);
				if (ts.isFunctionLike(node) && !original.asteriskToken && ts.canHaveModifiers(original) && original.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword)) {
					// ContentCompiler relies on native AsyncFunction identity. The outer
					// wrapper contains no await; all user code runs inside the generator.
					node = ts.factory.replaceModifiers(node as ts.HasModifiers, [...(ts.canHaveModifiers(node) ? node.modifiers || [] : []), ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]);
				}
				if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "__awaiter") {
					used = true;
					return ts.factory.updateCallExpression(node, ts.factory.createIdentifier("__nonameEventAwaiter"), node.typeArguments, node.arguments);
				}
				return node;
			}) as ts.SourceFile],
		},
	});
	return used ? `import { eventContextAwaiter as __nonameEventAwaiter } from "noname";\n${result.outputText}` : source;
}
