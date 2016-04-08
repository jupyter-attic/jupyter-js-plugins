// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  RenderMime, 
} from 'jupyter-js-ui/lib/rendermime';

import {
  Application
} from 'phosphide/lib/core/application';

import {
  Widget
} from 'phosphor-widget';

import {
  ConsoleTextRenderer,
  TextRenderer,
  ImageRenderer,
  HTMLRenderer,
  SVGRenderer,
  JavascriptRenderer,
  LatexRenderer,
} from 'jupyter-js-ui/lib/renderers';

/**
 * The default file handler extension.
 */
export
const renderersExtension = {
  id: 'jupyter.extensions.renderers',
  requires: [RenderMime],
  activate: (app: Application, rendermime: RenderMime<Widget>) => {
    const transformers = [
      new JavascriptRenderer(),
      new HTMLRenderer(),
      new ImageRenderer(),
      new SVGRenderer(),
      new LatexRenderer(),
      new ConsoleTextRenderer(),
      new TextRenderer()
    ];

    for (let t of transformers) {
      for (let m of t.mimetypes) {
        rendermime.order.push(m);
        rendermime.renderers[m] = t;
      }
    }
  },
};
