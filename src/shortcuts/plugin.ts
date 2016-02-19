// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  Application
} from 'phosphide/lib/core/application';


/**
 * The list of default application shortcuts.
 */
const SHORTCUTS = [
  {
    command: 'command-palette:toggle',
    selector: '*',
    sequence: ['Accel Shift P']
  },
  {
    command: 'command-palette:hide',
    selector: '[data-left-area="command-palette"]',
    sequence: ['Escape']
  },
  {
    command: 'file-browser:activate',
    selector: '*',
    sequence: ['Accel Shift F']
  },
  {
    command: 'file-browser:hide',
    selector: '[data-left-area="file-browser"]',
    sequence: ['Escape']
  },
  {
    command: 'file-operations:new-text-file',
    selector: '*',
    sequence: ['Ctrl O']
  },
  {
    command: 'file-operations:new-notebook',
    selector: '*',
    sequence: ['Ctrl Shift B']
  },
  {
    command: 'file-operations:save',
    selector: '.jp-Document',
    sequence: ['Accel S']
  },
  {
    command: 'file-operations:close',
    selector: '.jp-Document',
    sequence: ['Ctrl W']
  },
  {
    command: 'file-operations:close-all',
    selector: '.jp-Document',
    sequence: ['Ctrl Shift W']
  },
  {
    command: 'notebook:run-selected-cell',
    selector: '.jp-Notebook-cell',
    sequence: ['Shift Enter']
  },
  {
    command: 'help-doc:toggle',
    selector: '*',
    sequence: ['Alt Shift H']
  },
  {
    command: 'help-doc:hide',
    selector: '[data-right-area="help-doc"]',
    sequence: ['Escape']
  }
];


/**
 * The default shortcuts extension.
 */
export
const shortcutsExtension = {
  id: 'jupyter.extensions.shortcuts',
  activate: (app: Application): Promise<void> => {
    app.shortcuts.add(SHORTCUTS);
    return Promise.resolve(void 0);
  }
};
