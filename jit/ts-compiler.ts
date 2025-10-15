import ts from "typescript";
import importMap from "./import-map";

/**
 * 将 import 路径根据 importmap 替换
 */
function applyImportMap(source: string, fileName = "module.ts") {
	const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX);

	const transformer = <T extends ts.Node>(context: ts.TransformationContext) => {
		const visit: ts.Visitor = node => {
			// 静态 import
			if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
				const spec = node.moduleSpecifier.text;
				const mapped = importMap[spec];
				if (mapped) {
					return ts.factory.updateImportDeclaration(
						node,
						node.modifiers,
						node.importClause,
						ts.factory.createStringLiteral(mapped),
						node.assertClause
					);
				}
			}

			// 动态 import('...')
			if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length === 1) {
				const arg = node.arguments[0];
				if (ts.isStringLiteral(arg)) {
					const mapped = importMap[arg.text];
					if (mapped) {
						return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [ts.factory.createStringLiteral(mapped)]);
					}
				}
			}

			return ts.visitEachChild(node, visit, context);
		};
		return (node: T) => ts.visitNode(node, visit) as T;
	};

	const result = ts.transform(sourceFile, [transformer]);
	const printer = ts.createPrinter();
	const output = printer.printFile(result.transformed[0] as ts.SourceFile);
	result.dispose();
	return output;
}

/**
 * 编译（支持 TS 与 JS）
 */
export async function compile(source: string, fileName = "module.ts") {
	const transformedSource = applyImportMap(source, fileName);

	const result = ts.transpileModule(transformedSource, {
		compilerOptions: {
			module: ts.ModuleKind.ES2015,
			target: ts.ScriptTarget.ES2020,
			allowJs: true,
			esModuleInterop: true,
			resolveJsonModule: true,
			inlineSourceMap: true,
		},
		fileName,
	});

	return result.outputText;
}
