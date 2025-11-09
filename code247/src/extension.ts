import { commands, ExtensionContext, window, debug, DebugConfiguration } from "vscode";
import { Code247Panel } from "./panel/core";
import { addStatusBarItem, getRunCommandByExtension, getTestCommandByExtension, detectProjectTestFramework, runTerminalCommand } from './run/utils';
import {extname} from 'path';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("code247.start", () => {
      Code247Panel.createOrShow(context.extensionUri);
    }),
  );

  // 実行コマンド
  let runCommand = commands.registerCommand('code247.runCommand', () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage('ファイルが開かれていません');
      return;
    }

    const filePath = editor.document.uri.fsPath;
    const fileExtension = extname(filePath);

    let runCommand: string | null = getRunCommandByExtension(fileExtension, filePath);

    if (runCommand) {
      runTerminalCommand(runCommand);
    } else {
      window.showErrorMessage('サポートされていない言語です');
    }
  });

  // デバッグコマンド
  let debugCommand = commands.registerCommand('code247.debugCommand', () => {
    window.showInformationMessage('デバッグを開始します！');
    const debugConfig: DebugConfiguration = {
      type: 'node',
      request: 'launch',
      name: 'Launch Program',
      program: '${file}'
    };

    debug.startDebugging(undefined, debugConfig).then(success => {
      if (success) {
        window.showInformationMessage('デバッグが正常に開始されました');
      } else {
        window.showErrorMessage('デバッグの開始に失敗しました');
      }
    });
  });

  // テストコマンド
  let runTestCommand = commands.registerCommand('code247.runTestCommand', () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage('ファイルが開かれていません');
      return;
    }

    const filePath = editor.document.uri.fsPath;
    const fileExtension = extname(filePath);

    let testCommand: string | null = getTestCommandByExtension(fileExtension);

    if (!testCommand) {
      testCommand = detectProjectTestFramework(filePath);
    }

    if (testCommand) {
      runTerminalCommand(testCommand);
    } else {
      window.showErrorMessage('サポートされていない言語です');
    }
  });

  addStatusBarItem(context, 'code247.runCommand', '$(play) 実行', 100);
  addStatusBarItem(context, 'code247.debugCommand', '$(bug) デバッグ', 101);
  addStatusBarItem(context, 'code247.runTestCommand', '$(beaker) テスト', 102);

  context.subscriptions.push(runCommand);
  context.subscriptions.push(debugCommand);
  context.subscriptions.push(runTestCommand);
}