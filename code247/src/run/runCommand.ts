import { commands, window, debug } from "vscode";
import {extname} from 'path';
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
const debugConfig: vscode.DebugConfiguration = {
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