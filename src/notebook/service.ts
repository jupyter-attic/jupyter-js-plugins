// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.



// A service in which you can register a callback

/**
 * When I create a new notebook in the plugin,
 * 
 * - Get a factory for notebook-specific services
 * 
 *   - call the function to create a rendermime and insert that into the
 *     start of the chain
 *   - when session starts, call the function to get the map of comm targets
 */

/**
 * Make the notebook use a local rendermime instance in preference to the global rendermime.
 */

/**
 * 
 * the callback is called when a notebook is created. It will be given an object that lets you:
 * - register a comm listener
 * - register an output listener
  
 * 
 *  */

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  Widget
} from 'phosphor-widget';


export
interface NotebookServices {
  commTargets: {[target: string]: any} // a comm target function
  rendermime: RenderMime<Widget>;
}

export
type NotebookServiceFactory = () => NotebookServices;

/**
 * An object that will call a callback when a notebook is created
 */

export
class NotebookServicesRegistry {
  /**
   * Register a callback that will provide a NotebookServices object.
   */
  registerProvider(serviceFactory: NotebookServiceFactory): void {
    this._services.push(serviceFactory);
  }

  get registry(): NotebookServiceFactory[] {
    return this._services;
  }  
  private _services: NotebookServiceFactory[] = [];
}


/**
 * The default rendermime instance.
 */
export
const notebookServicesProvider = {
  id: 'jupyterlab.services.notebookservices',
  provides: NotebookServicesRegistry,
  resolve: () => {
    return new NotebookServicesRegistry();
  }
}
