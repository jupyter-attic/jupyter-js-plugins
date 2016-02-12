// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  IShortcutItem
} from 'phosphide';

export
const SHORTCUTS: IShortcutItem[] = [
  {
    command: 'command-palette:activate',
    selector: '*',
    sequence: ['Alt Space']
  },
  {
    command: 'command-palette:deactivate',
    selector: '*',
    sequence: ['Escape']
  },
  {
    command: 'file-operations:new-text-file',
    selector: '*',
    sequence: ['Ctrl Shift F']
  },
  {
    command: 'file-operations:new-notebook',
    selector: '*',
    sequence: ['Ctrl Shift B']
  },
  {
    command: 'file-operations:save',
    selector: '.jp-Document',
    sequence: ['Ctrl Shift S']
  },
  {
    command: 'file-operations:close',
    selector: '.jp-Document',
    sequence: ['Ctrl Shift W']
  },
  {
    command: 'file-operations:close-all',
    selector: '.jp-Document',
    sequence: ['Ctrl Shift Q']
  },
  {
    command: 'terminal:new',
    selector: '*',
    sequence: ['Ctrl Shift T']
  }
];
