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
    sequence: ['Ctrl Shift Q']
  },
  {
    command: 'notebook:execute-selected-cell',
    selector: '.jp-CodeCell',
    sequence: ['Shift Enter']
  },
  {
    command: 'notebook:render-selected-cell',
    selector: '.jp-MarkdownCell',
    sequence: ['Shift Enter']
  }

];
