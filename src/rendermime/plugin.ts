// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

/**
 * The default rendermime instance.
 */
export
const rendermimeProvider = {
  id: 'jupyter.services.rendermime',
  provides: RenderMime,
  resolve: () => {
    return new RenderMime();
  }
}
