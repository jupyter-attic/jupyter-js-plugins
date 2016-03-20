// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  TerminalWidget, ITerminalOptions
} from 'jupyter-js-ui/lib/terminal';

import {
  Application
} from 'phosphide/lib/core/application';

import {
  IMessageFilter, IMessageHandler, Message, installMessageFilter,
  removeMessageFilter
} from 'phosphor-messaging';

import {
  TabPanel
} from 'phosphor-tabs';


/**
 * The default terminal extension. 
 */
export
const terminalExtension = {
  id: 'jupyter.extensions.terminal',
  activate: activateTerminal
};


function activateTerminal(app: Application): Promise<void> {

  if (terminalManager === null) {
    terminalManager = new TerminalManager();
  }

  let newTerminalId = 'terminal:new';
  let closeTerminalsId = 'terminal:close-all';

  app.commands.add([{
    id: newTerminalId,
    handler: () => {
      let term = terminalManager.createTerminal();
      app.shell.addToMainArea(term);
      let stack = term.parent;
      if (!stack) {
        return;
      }
      let tabs = stack.parent;
      if (tabs instanceof TabPanel) {
        tabs.currentWidget = term;
      }
    }
  }]);
  app.commands.add([{
    id: closeTerminalsId,
    handler: () => {
      terminalManager.closeAll();
      return true;
    }
  }])
  app.palette.add([
    {
      command: newTerminalId,
      category: 'Terminal',
      text: 'New Terminal',
      caption: 'Start a new terminal session'
    }
  ]);

  return Promise.resolve(void 0);
}


/**
 * A class which manages open terminals.
 */
class TerminalManager {
  /**
   * Create a new terminal widget.
   */
  createTerminal(): TerminalWidget {
    let term = new TerminalWidget();
    term.color = 'black';
    term.background = 'white';
    term.title.closable = true;
    installMessageFilter(term, this);
    this._terminals.set(term.id, term);
    return term;
  }

  closeAll(): void {
    this._terminals.forEach(term => { term.close(); });
  }

  /**
   * Filter messages on the widget.
   */
  filterMessage(handler: IMessageHandler, msg: Message): boolean {
    if (msg.type == 'close-request') {
      this._terminals.delete((handler as TerminalWidget).id);
    }
    return false;
  }

  private _terminals = new Map<string, TerminalWidget>();
}


/**
 * A private singleton terminal manager
 */
let terminalManager: TerminalManager = null;
