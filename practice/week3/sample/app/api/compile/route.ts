import ts from 'typescript';
import { exercises } from '../../presentation';

function parse(code: string, counter: boolean) {
  return ts.createSourceFile(
    'exercise.tsx',
    counter ? 'function Counter() {\n' + code + '\n}' : 'const example = (\n' + code + '\n);',
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX,
  );
}

function normalize(file: ts.SourceFile) {
  const printer = ts.createPrinter({ removeComments: true });
  const printed = parsePrinted(printer.printFile(file));
  function tokens(node: ts.Node): string[] {
    if (ts.isStringLiteral(node)) return [JSON.stringify(node.text)];
    if (node.kind === ts.SyntaxKind.JsxText) {
      const value = node.getText(printed).trim();
      return value ? [JSON.stringify(value)] : [];
    }
    const children = node.getChildren(printed);
    return children.length ? children.flatMap(tokens) : [node.getText(printed)];
  }
  return JSON.stringify(tokens(printed));
}

function parsePrinted(code: string) {
  return ts.createSourceFile('exercise.tsx', code, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
}

function nodeTexts(file: ts.SourceFile, kind: ts.SyntaxKind) {
  const texts: string[] = [];
  function visit(node: ts.Node) {
    if (node.kind === kind) texts.push(node.getText(file));
    ts.forEachChild(node, visit);
  }
  visit(file);
  return texts;
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null);
  const exercise = exercises.find(({ id }) => id === input?.id);
  if (!exercise || typeof input?.code !== 'string' || input.code.length > 6000) {
    return Response.json({ error: '과제를 선택하고 6,000자 이내로 코드를 입력하세요.' }, { status: 400 });
  }

  const counter = exercise.id === 'initial-state';
  const file = parse(input.code, counter);
  const compiled = ts.transpileModule(file.text, {
    fileName: file.fileName,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext },
    reportDiagnostics: true,
  });
  const error = compiled.diagnostics?.find(({ category }) => category === ts.DiagnosticCategory.Error);
  if (error) {
    return Response.json({ error: ts.flattenDiagnosticMessageText(error.messageText, '\n') }, { status: 400 });
  }

  const source = normalize(file);
  const matches = (code: string) => source === normalize(parse(code, counter));
  const base = matches(exercise.starter);
  let added = matches(exercise.answer);
  const query = new URLSearchParams({ mission: exercise.id, exercise: '1' });

  if (exercise.id === 'streaming' && !base) {
    const message = nodeTexts(file, ts.SyntaxKind.JsxText)
      .map((value) => value.trim()).find(Boolean);
    if (message && message.length <= 100 && matches(exercise.answer.replace('스터디원 불러오는 중…', () => message))) {
      added = true;
      query.set('message', message);
    }
  }

  if (counter && !base) {
    const increment = nodeTexts(file, ts.SyntaxKind.NumericLiteral)[0];
    if (increment && /^[1-9][0-9]?$/.test(increment)) {
      const updated = exercise.answer.replace('value + 1', 'value + ' + increment);
      if (matches(updated) || matches(updated.replace('(value) => value +', 'count +'))) {
        added = true;
        query.set('increment', increment);
      }
    }
  }

  if (!base && !added) {
    return Response.json({
      error: 'TSX 문법에 문제는 없습니다. 이 미리보기에서 지원하는 예제 형태는 아래 해설에서 확인할 수 있습니다.',
    }, { status: 422 });
  }

  query.set('block', added ? '1' : '0');
  return Response.json({ preview: '/preview?' + query });
}
