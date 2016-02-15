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
    sequence: ['Escape', '/']
  },
  {
    command: 'command-palette:deactivate',
    selector: '*',
    sequence: ['Escape', 'Escape']
  },
  {
    command: 'file-operations:new-text-file',
    selector: '*',
    sequence: ['Escape', 'F']
  },
  {
    command: 'file-operations:new-notebook',
    selector: '*',
    sequence: ['Escape', 'B']
  },
  {
    command: 'file-operations:save',
    selector: '.jp-Document',
    sequence: ['Escape', 'S']
  },
  {
    command: 'file-operations:close',
    selector: '.jp-Document',
    sequence: ['Escape', 'W']
  },
  {
    command: 'file-operations:close-all',
    selector: '.jp-Document',
    sequence: ['Escape', 'Q']
  },
  {
    command: 'terminal:new',
    selector: '*',
    sequence: ['Escape', 'T']
  }
];
