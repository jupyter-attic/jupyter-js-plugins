// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Application
} from 'phosphide/lib/core/application';

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  NotebookServicesRegistry, NotebookServices, commOpenHandler, commTargetMap
} from '../notebook/service';

import {
  WidgetManager, WidgetRenderer
} from 'jupyter-js-ui/lib/widgets';

/**
 * The widget manager extension.
 */
export
const widgetManagerExtension = {
  id: 'jupyter.extensions.widgetmanager',
  requires: [NotebookServicesRegistry],
  activate: activateWidgetManagerFactory
}

/**
 * Activate the widget manager factory by registering with the notebook services registry.
 */
function activateWidgetManagerFactory(app: Application, nbservices: NotebookServicesRegistry) {
  nbservices.registerProvider(widgetServiceFactory);
}

/**
 * Create a widget notebook service.
 */
export
function widgetServiceFactory(): NotebookServices {
  let widgetManager = new WidgetManager();
  
  let rendermime = new RenderMime(
    {'application/vnd.jupyter.widget': new WidgetRenderer(widgetManager)}, 
    ['application/vnd.jupyter.widget']);
  
  let commHandler: commOpenHandler = (comm, msg) => widgetManager.handle_comm_open(comm, msg);
  
  let comms: commTargetMap = {}
  comms[widgetManager.comm_target_name] = commHandler;
  
  return {
    commTargets: comms,
    rendermime: rendermime
  };
}
/*
    // Validate the version requested by the backend.
    var validate = (function validate() {
        this.validateVersion().then(function(valid) {
            if (!valid) {
                console.warn('Widget frontend version does not match the backend.');
            }
        }).catch(function(err) {
            console.error('Could not cross validate the widget frontend and backend versions.', err);
        });
    }).bind(this);
    validate();
    
    WidgetManager.prototype._create_comm = function(comm_target_name, model_id, metadata) {
    return this._get_connected_kernel().then(function(kernel) {
        if (metadata) {
            return kernel.comm_manager.new_comm(comm_target_name, metadata, model_id);
        } else {
            return new Promise(function(resolve) {
                requirejs(["services/kernels/comm"], function(comm) {
                    var new_comm = new comm.Comm(comm_target_name, model_id);
                    kernel.comm_manager.register_comm(new_comm);
                    resolve(new_comm);
                });
            });
        }
    });
};
WidgetManager.prototype._get_comm_info = function() {
    var that = this;
    return this._get_connected_kernel().then(function(kernel) {
        return new Promise(function(resolve, reject) {
            kernel.comm_info('jupyter.widget', function(msg) {
                resolve(msg['content']['comms']);
            });
        });
    });
};*/
