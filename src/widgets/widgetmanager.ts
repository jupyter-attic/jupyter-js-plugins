// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

//import * as Backbone from 'backbone';

import {
    ManagerBase, shims
} from 'jupyter-js-widgets';

import {
  Panel
} from 'phosphor-panel';

import {
  Application
} from 'phosphide/lib/core/application';

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  BackboneViewWrapper
} from '../backboneviewwrapper/plugin';

import {
  NotebookServicesRegistry, NotebookServices
} from '../notebook/service';

import {
  Widget
} from 'phosphor-widget';

import {
  IRenderer
} from 'jupyter-js-ui/lib/rendermime';

import {
  IKernelMessage, IComm
} from 'jupyter-js-services';

import 'jquery-ui/themes/smoothness/jquery-ui.min.css';

import 'jupyter-js-widgets/css/widgets.min.css';


/**
 * The widget manager extension.
 */
export
const widgetManagerExtension = {
  id: 'jupyter.extensions.widgetmanager',
  requires: [RenderMime, NotebookServicesRegistry],
  activate: activateWidgetManager
};

function activateWidgetManager(app: Application, rendermime: RenderMime<Widget>, nbservices: NotebookServicesRegistry) {
  nbservices.registerProvider(widgetServiceFactory);
}


export
function widgetServiceFactory(): NotebookServices {
  let widgetManager = new WidgetManager();
  
  let rendermime = new RenderMime(
    {'application/vnd.jupyter.widget': new WidgetRenderer(widgetManager)}, 
    ['application/vnd.jupyter.widget']);
  
  let commHandler = widgetManager.handle_comm_open.bind(widgetManager);
  
  let comms = {
    'ipython.widget': commHandler, 
    'jupyter.widget': commHandler
  }
  
  return {
    commTargets: comms,
    rendermime: rendermime
  }
}

export
class WidgetManager extends ManagerBase<Widget> {
  /**
   * Return a phosphor widget representing the view
   */
  display_view(msg: any, view: Backbone.View<any>, options: any): Widget {
    return new BackboneViewWrapper(view);
  }

  /**
   * Handle when a comm is opened.
   */
  handle_comm_open(comm: IComm, msg: IKernelMessage) {
    // Convert jupyter-js-services comm to old comm
    // so that widget models use it compatibly
    let oldComm = new shims.services.Comm(comm);
    return super.handle_comm_open(oldComm, msg);
  }
}

/**
 * A renderer for widgets.
 */
export
class WidgetRenderer implements IRenderer<Widget> {
  constructor(widgetManager: WidgetManager) {
    this._manager = widgetManager;
  }

  /**
   * Render a widget mimetype.
   */
  render(mimetype: string, data: string): Widget {
    // data is a model id
    let w = new Panel();
    this._manager.get_model(data).then((model: any) => {
      return this._manager.display_model(void 0, model, void 0);
    }).then((view: Widget) => {
        w.addChild(view);
    });
    return w;
  }
  
  private _manager: WidgetManager;
  mimetypes = ['application/vnd.jupyter.widget'];
}
