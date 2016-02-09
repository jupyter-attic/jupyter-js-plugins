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
 * The class name added to document widgets.
 */
const DOCUMENT_CLASS = 'jp-Document';

/**
 * The class name added to focused widgets.
 */
const FOCUS_CLASS = 'jp-mod-focus';


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
          selector: `.${DOCUMENT_CLASS}.${FOCUS_CLASS}`,
          command: 'file-operations:save'
        },
        {
          sequence: ['Accel R'],
          selector: `.${DOCUMENT_CLASS}.${FOCUS_CLASS}`,
          command: 'file-operations:revert'
        },
        {
          sequence: ['Ctrl Q'],
          selector: `.${DOCUMENT_CLASS}.${FOCUS_CLASS}`,
          command: 'file-operations:close'
        },
        {
          sequence: ['Ctrl Shift Q'],
          selector: `.${DOCUMENT_CLASS}`,
          command: 'file-operations:close-all'
        },
        {
          sequence: ['Shift Enter'],
          selector: '.jp-nbCell.jp-selected-cell',
          command: 'notebook:execute-selected-cell'
        },
        {
          sequence: ['Shift Enter'],
          selector: '.jp-MarkdownCell.jp-selected-cell',
          command: 'notebook:render-selected-cell'
        },
        {
          sequence: ['ArrowDown'],
          selector: `.${DOCUMENT_CLASS}.${FOCUS_CLASS} .jp-Cell`,
          command: 'notebook:select-next-cell',
        },
        {
          sequence: ['ArrowUp'],
          selector: `.${DOCUMENT_CLASS}.${FOCUS_CLASS} .jp-Cell`,
          command: 'notebook:select-previous-cell',
        }
      ]);

    }
  });
}
