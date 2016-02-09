// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  TerminalWidget, ITerminalOptions
} from 'jupyter-js-terminal';

import {
  IAppShell, ICommandPalette, ICommandRegistry
} from 'phosphide';

import {
  Container, Token
} from 'phosphor-di';

import {
  TabPanel
} from 'phosphor-tabs';


export
function resolve(container: Container): Promise<void> {
  return container.resolve({
    requires: [IAppShell, ICommandPalette, ICommandRegistry],
    create: (shell: IAppShell, palette: ICommandPalette, registry: ICommandRegistry) => {

      let newTerminalId = 'terminal:new';

      registry.add([
        {
          id: newTerminalId,
          handler: () => {
            let term = new TerminalWidget();
            term.color = 'black';
            term.background = 'white';
            term.title.closable = true;
            shell.addToMainArea(term);
            let stack = term.parent;
            if (!stack) {
              return;
            }
            let tabs = stack.parent;
            if (tabs instanceof TabPanel) {
              tabs.currentWidget = term;
            }
          }
        }
      ]);
      palette.add([
        {
          id: newTerminalId,
          args: void 0,
          category: 'Terminal',
          text: 'New Terminal',
          caption: 'Start a new terminal session'
        }
      ]);
    }
  });
}
