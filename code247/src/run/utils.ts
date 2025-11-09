import {ExtensionContext,StatusBarAlignment,window,workspace } from 'vscode';
import {basename,join } from 'path';
import {existsSync} from 'fs';

// ステータスバーにアイテムを追加する関数
export function addStatusBarItem(context: ExtensionContext, command: string, text: string, priority: number) {
  let statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, priority);
  statusBarItem.command = command;
  statusBarItem.text = text;
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

// ファイルの拡張子に基づいて実行コマンドを返す
export function getRunCommandByExtension(extension: string, filePath: string): string | null {
  switch (extension) {
    case '.js':
      return `node ${filePath}`;  // JavaScript
    case '.ts':
      return `ts-node ${filePath}`;  // TypeScript
    case '.py':
      return `python ${filePath}`;    // Python
    case '.go':
      return `go run ${filePath}`;   // Go
    case '.java':
      return `javac ${filePath} && java ${basename(filePath, '.java')}`;  // Java
    case '.rb':
      return `ruby ${filePath}`;     // Ruby
    case '.php':
      return `php ${filePath}`;   // PHP
    case '.cs':
      return `dotnet run ${filePath}`; // C#
    case '.cpp':
    case '.c':
      return `gcc ${filePath} -o ${basename(filePath, extension)} && ./${basename(filePath, extension)}`; // C/C++
    default:
      return null;
  }
}

// ファイルの拡張子に基づいてテストコマンドを返す
export function getTestCommandByExtension(extension: string): string | null {
  switch (extension) {
    case '.js':
    case '.ts':
      return 'npm test';  // JavaScript/TypeScript
    case '.py':
      return 'pytest';    // Python
    case '.go':
      return 'go test';   // Go
    case '.java':
      return 'mvn test';  // Java
    case '.rb':
      return 'rspec';     // Ruby
    case '.php':
      return 'phpunit';   // PHP
    case '.cs':
      return 'dotnet test'; // C#
    case '.cpp':
    case '.c':
      return 'make test'; // C/C++
    default:
      return null;
  }
}

// プロジェクトファイルを検出してテストフレームワークを決定
export function detectProjectTestFramework(filePath: string): string | null {
  const workspaceFolders = workspace.workspaceFolders;
  if (!workspaceFolders) {
    return null;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;

  if (existsSync(join(workspacePath, 'package.json'))) {
    return 'npm test'; // Node.js
  }

  if (existsSync(join(workspacePath, 'pytest.ini'))) {
    return 'pytest';   // Python
  }

  if (existsSync(join(workspacePath, 'go.mod'))) {
    return 'go test';  // Go
  }

  if (existsSync(join(workspacePath, 'pom.xml'))) {
    return 'mvn test'; // Java
  }

  if (existsSync(join(workspacePath, 'Gemfile'))) {
    return 'rspec';    // Ruby
  }

  if (existsSync(join(workspacePath, 'composer.json'))) {
    return 'phpunit';  // PHP
  }

  if (existsSync(join(workspacePath, 'Makefile'))) {
    return 'make test'; // C/C++
  }

  if (existsSync(join(workspacePath, 'project.json'))) {
    return 'dotnet test'; // C#
  }

  return null;
}

// ターミナルでコマンドを実行
export function runTerminalCommand(command: string) {
  const terminal = window.createTerminal('Run Program');
  terminal.show();
  terminal.sendText(command);
}