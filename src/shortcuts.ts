// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  IShortcutItem
} from 'phosphide';

export
const SHORTCUTS: IShortcutItem[] = [
  {
    command: 'command-palette:toggle',
    selector: '*',
    sequence: ['Accel Shift P']
  },
  {
    command: 'file-operations:new-text-file',
    selector: '*',
    sequence: ['Accel Alt F']
  },
  {
    command: 'file-operations:new-notebook',
    selector: '*',
    sequence: []
  },
  {
    command: 'file-operations:save',
    selector: '.jp-Document',
    sequence: []
  },
  {
    command: 'file-operations:close',
    selector: '.jp-Document',
    sequence: []
  },
  {
    command: 'file-operations:close-all',
    selector: '.jp-Document',
    sequence: []
  },
  {
    command: 'terminal:new',
    selector: '*',
    sequence: ['Accel Shift C']
  }
];
