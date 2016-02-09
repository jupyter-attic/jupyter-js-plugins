import {
  IAppShell, ICommandPalette, ICommandRegistry, IShortcutManager
} from 'phosphide';

import {
  CodeMirrorWidget
} from 'phosphor-codemirror';

import {
  Container, Token
} from 'phosphor-di';

import {
  Widget
} from 'phosphor-widget';

import {
  IFileBrowserWidget
} from '../index';


/**
 * Register the plugin contributions.
 *
 * @param container - The di container for type registration.
 *
 * #### Notes
 * This is called automatically when the plugin is loaded.
 */
export
function resolve(container: Container): Promise<void> {
  return container.resolve({
    requires: [IAppShell, ICommandPalette, IFileBrowserWidget, IShortcutManager],
    create: (shell: IAppShell, palette: ICommandPalette, browser: IFileBrowserWidget, shortcuts: IShortcutManager) => {
      palette.widget.title.text = 'Commands';
      shell.addToLeftArea(palette.widget, { rank: 40 });
      shell.attach(document.body);
      window.addEventListener('resize', () => { shell.update(); });
      browser.title.text = 'Files';
      shell.addToLeftArea(browser, { rank: 40 });

      shortcuts.add([
        {
          sequence: ['Ctrl O'],
          selector: '*',
          command: 'file-operations:new-text-file'
        },
        {
          sequence: ['Ctrl Shift N'],
          selector: '*',
          command: 'file-operations:new-notebook'
        },
        {
          sequence: ['Accel S'],
          selector: 'jp-Document',
          command: 'file-operations:save'
        },
        {
          sequence: ['Accel R'],
          selector: 'jp-Document',
          command: 'file-operations:revert'
        },
        {
          sequence: ['Ctrl Q'],
          selector: 'jp-Document',
          command: 'file-operations:close'
        },
        {
          sequence: ['Ctrl Shift Q'],
          selector: 'jp-Document',
          command: 'file-operations:close-all'
        },
        {
          sequence: ['Shift Enter'],
          selector: '.jp-CodeCell',
          command: 'notebook:execute-selected-cell'
        },
        {
          sequence: ['Shift Enter'],
          selector: '.jp-MarkdownCell',
          command: 'notebook:render-selected-cell'
        },
        {
          sequence: ['ArrowDown'],
          selector: '.jp-Cell',
          command: 'notebook:select-next-cell',
        },
        {
          sequence: ['ArrowUp'],
          selector: '.jp-Cell',
          command: 'notebook:select-previous-cell',
        },
        {
          sequence: ['Ctrl T'],
          selector: '*',
          command: 'terminal:new',
        }
      ]);
    }
  });
}
