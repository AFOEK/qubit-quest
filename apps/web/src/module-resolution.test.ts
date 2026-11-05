import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const workingDirectory = ts.sys.getCurrentDirectory().replaceAll('\\', '/');
const sourceRoot = [`${workingDirectory}/src`, `${workingDirectory}/apps/web/src`].find(
  (directory) => ts.sys.fileExists(`${directory}/main.tsx`),
)!;
const files = ts.sys.readDirectory(sourceRoot, ['.ts', '.tsx']);
const fold = (name: string) => ts.sys.resolvePath(name).replaceAll('\\', '/').toLowerCase();
const realFiles = new Map(files.map((file) => [fold(file), file]));

describe('portable browser module resolution', () => {
  it('has no ambiguous extensionless source names on case-insensitive filesystems', () => {
    const names = new Map<string, string[]>();
    for (const file of files) {
      const name = fold(file).replace(/\.tsx?$/, '');
      names.set(name, [
        ...(names.get(name) ?? []),
        file.replaceAll('\\', '/').slice(sourceRoot.length + 1),
      ]);
    }
    expect([...names.values()].filter((group) => group.length > 1)).toEqual([]);
  });

  it('resolves the reward UI import to a module exporting its components even without case sensitivity', () => {
    const main = `${sourceRoot}/main.tsx`;
    const entry = ts.createSourceFile(
      main,
      ts.sys.readFile(main)!,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const declaration = entry.statements.find((statement): statement is ts.ImportDeclaration => {
      if (!ts.isImportDeclaration(statement)) return false;
      const bindings = statement.importClause?.namedBindings;
      return Boolean(
        bindings &&
        ts.isNamedImports(bindings) &&
        bindings.elements.some((element) => element.name.text === 'RewardToast'),
      );
    })!;
    expect(declaration).toBeDefined();
    const host: ts.ModuleResolutionHost = {
      useCaseSensitiveFileNames: false,
      fileExists: (file) => realFiles.has(fold(file)) || ts.sys.fileExists(file),
      readFile: (file) => ts.sys.readFile(realFiles.get(fold(file)) ?? file),
      directoryExists: ts.sys.directoryExists,
      realpath: (file) => realFiles.get(fold(file)) ?? file,
    };
    const resolved = ts.resolveModuleName(
      (declaration.moduleSpecifier as ts.StringLiteral).text,
      main,
      {
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
      },
      host,
    ).resolvedModule;
    expect(resolved).toBeDefined();
    const target = ts.createSourceFile(
      resolved!.resolvedFileName,
      host.readFile(resolved!.resolvedFileName)!,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const exports = target.statements
      .filter(ts.isFunctionDeclaration)
      .filter((statement) =>
        statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
      )
      .map((statement) => statement.name?.text);
    expect(exports).toEqual(
      expect.arrayContaining(['AchievementsPage', 'LearningSpark', 'RewardToast']),
    );
  });
});
