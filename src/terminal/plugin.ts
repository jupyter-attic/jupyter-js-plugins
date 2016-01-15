// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  TerminalWidget, ITerminalOptions
} from 'jupyter-js-terminal';

import {
  DelegateCommand
} from 'phosphor-command';

import {
  Container, Token
} from 'phosphor-di';

import {
  IAppShell, ICommandPalette, ICommandRegistry, IShortcutManager
} from 'phosphide';

import './plugin.css';


export
function resolve(container: Container): Promise<void> {
  return container.resolve(TerminalPlugin).then(() => {});
}


class TerminalPlugin {

  /**
   * The dependencies required by the editor factory.
   */
  static requires: Token<any>[] = [IAppShell, ICommandPalette, ICommandRegistry, IShortcutManager];

  /**
   * Create a new terminal plugin instance.
   */
  static create(shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry, shortcuts: IShortcutManager): TerminalPlugin {
    return new TerminalPlugin(shell, palette, registry, shortcuts);
  }

  /**
   * Construct a terminal plugin.
   */
  constructor(shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry, shortcuts: IShortcutManager) {
    let termCommandItem = {
      // Move this to the terminal.
      id: 'jupyter-plugins:new-terminal',
      command: new DelegateCommand(() => {
        let term = new TerminalWidget();
        term.color = 'black';
        term.background = 'white';
        term.title.closable = true;
        shell.addToMainArea(term);
      })
    };

    shortcuts.add([
      {
        sequence: ['Ctrl T'],
        selector: '*',
        command: termCommandItem.command,
        commandArgs: termCommandItem.id
      }
    ]);

    registry.add([termCommandItem]);
    let paletteItem = {
      id: 'jupyter-plugins:new-terminal',
      title: 'Terminal',
      caption: ''
    };
    let section = {
      text: 'New...',
      items: [paletteItem]
    }
    palette.add([section]);
  }

}
