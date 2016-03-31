// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  Widget
} from 'phosphor-widget';

import {
  IKernelMessage, IComm
} from 'jupyter-js-services';

/**
 * The notebook services provider registry.
 */
export
const notebookServicesProvider = {
  id: 'jupyterlab.services.notebookservices',
  provides: NotebookServicesRegistry,
  resolve: () => new NotebookServicesRegistry()
}

/**
 * A provider for notebook services.
 */
export
interface NotebookServices {
  commTargets: {[target: string]: (comm: IComm, msg: IKernelMessage) => Promise<any> }
  rendermime: RenderMime<Widget>;
}

/**
 * A factory for notebook service providers.
 */
export
type NotebookServiceFactory = () => NotebookServices;

/**
 * A registry of notebook service factories.
 */
export
class NotebookServicesRegistry {
  /**
   * Register a factory that will provide a NotebookServices object.
   */
  registerProvider(serviceFactory: NotebookServiceFactory): void {
    this._services.push(serviceFactory);
  }

  /**
   * The registry of notebook service factories.
   */
  get registry(): NotebookServiceFactory[] {
    return this._services;
  }

  private _services: NotebookServiceFactory[] = [];
}


