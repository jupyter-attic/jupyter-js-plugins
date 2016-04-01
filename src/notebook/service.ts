// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  Widget
} from 'phosphor-widget';

import {
  IComm, IKernelIOPubCommOpenMessage
} from 'jupyter-js-services';

export
type commOpenHandler = (comm: IComm, msg: IKernelIOPubCommOpenMessage) => void;

export
interface commTargetMap {
  [target: string]: commOpenHandler
}

/**
 * A provider for notebook services.
 */
export
interface NotebookServices {
  commTargets: commTargetMap
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

/**
 * The notebook services provider registry.
 */
export
const notebookServicesProvider = {
  id: 'jupyterlab.services.notebookservices',
  provides: NotebookServicesRegistry,
  resolve: () => {
    return new NotebookServicesRegistry();
  }
}
