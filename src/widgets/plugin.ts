// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Application
} from 'phosphide/lib/core/application';

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  NotebookSignals, NotebookContext
} from 'jupyter-js-notebook';

import {
  INotebookSession, IKernel
} from 'jupyter-js-services';

import {
  WidgetManager, WidgetRenderer
} from 'jupyter-js-ui/lib/widgets';


/**
 * Activate the widget manager factory by registering with the notebook services registry.
 */
function activateWidgetManagerFactory(app: Application, nbsignals: NotebookSignals) {
  nbsignals.newNotebookSignal.connect(makeWidgetManager);
}


export
function makeWidgetManager(nbsignals: NotebookSignals, nbcontext: NotebookContext) {
  // Create new widget manager
  new NotebookWidgetManager(nbcontext)
  
  // listener for the session should clear widget manager state and set up a listener for a new kernel
  
  // the new kernel handler should clear the widget manager state and set up the comm channels.
}

export
class NotebookWidgetManager {
  constructor(nbcontext: NotebookContext) {

    let mimetype = 'application/vnd.jupyter.widget';
    this._widgetManager = new WidgetManager();
    nbcontext.widget.notebook.rendermime.renderers[mimetype] = new WidgetRenderer(this._widgetManager);
    nbcontext.widget.notebook.rendermime.order.unshift(mimetype);

    let model = nbcontext.widget.model;
    // set up a listener for the session
    model.stateChanged.connect((sender, args) => {
      if (args.name === 'session') {
        this.newSession(args.newValue);
      }
    })
    if (model.session) {
      this.newSession(model.session);
    }
  }
  
  newSession(session: INotebookSession) {
    session.kernelChanged.connect((sender, kernel) => {
      this.newKernel(kernel);
    })
    if (session.kernel) {
      this.newKernel(session.kernel);
    }
  }
  
  newKernel(kernel: IKernel) {
    kernel.registerCommTarget(this._widgetManager.comm_target_name, 
      (comm, msg) => {this._widgetManager.handle_comm_open(comm, msg)});
      
    //this._widgetManager.setKernel(kernel);
  }

  private _widgetManager: WidgetManager;
}

/**
 * The widget manager extension.
 */
export
const widgetManagerExtension = {
  id: 'jupyter.extensions.widgetmanager',
  requires: [NotebookSignals],
  activate: activateWidgetManagerFactory
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


/*

A react-ish way to do it: 

*all* state is stored at the application level. This includes all document model state, including which renderers are used for each model. You register an output renderer by adding that to the state.

Rendering is just taking the output renderers stored with a notebook and using them to render the notebook. Simple! When a kernel disconnects, we send a new message that updates the state. When a comm message comes in, send a message to update state.

Otherwise, we have to listen for when there are changes, and hook back up handlers, etc. I have to deal with the temporal state as well as the application state.

In order to get a comm handler hooked up across kernel restarts, etc...I guess we have to do that anyway, it doesn't matter if we have a reactish thing or an mvc thing. We'd still have to listen to kernel restarts and reconnect handlers.

connect to the existing session and kernel, if possible.

so: listen to a notebook session start


*/