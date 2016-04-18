// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  NotebookSignals
} from 'jupyter-js-notebook';


/**
 * The notebook services provider registry.
 */
export
const notebookSignals = {
  id: 'jupyterlab.services.notebooksignals',
  provides: NotebookSignals,
  resolve: () => {
    return new NotebookSignals();
  }
}
