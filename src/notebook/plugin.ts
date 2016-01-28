// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  NotebookWidget, NotebookModel, NBData, populateNotebookModel, buildOutputModel, Output
} from 'jupyter-js-notebook';

import {
  Container
} from 'phosphor-di';

import {
  IContentsModel, IContentsManager,
  NotebookSessionManager, INotebookSessionManager,
  INotebookSession, IKernelMessage
} from 'jupyter-js-services';

import {
  Panel
} from 'phosphor-panel';

import {
  IServicesProvider, IFileOpener, IFileHandler
} from '../index';

import {
  AbstractFileHandler
} from 'jupyter-js-filebrowser';

import {
  Widget
} from 'phosphor-widget';


import {
  CodeCellModel, ICellModel, isCodeCell, BaseCellModel
} from 'jupyter-js-cells';

import './plugin.css';

/**
 * Register the plugin contributions.
 *
 * @param container - The di container for type registration.
 *
 * #### Notes
 * This is called automatically when the plugin is loaded.
 */
export
function resolve(container: Container): Promise<IFileHandler> {
  return container.resolve({
    requires: [IServicesProvider, IFileOpener],
    create: (services: IServicesProvider, opener: IFileOpener) => {
      let handler = new NotebookFileHandler(services.contentsManager, services.notebookSessionManager);
      opener.register(handler);
      return handler;
    }
  });
}

export
class SessionStoreMapping {
  constructor(services: IServicesProvider) {
    this.services = services;
  }
  public services: IServicesProvider;
}

function messageToModel(msg: IKernelMessage) {
  let m: Output = msg.content;
  let type = msg.header.msg_type;
  if (type === 'execute_result') {
    m.output_type = 'display_data';
  } else {
    m.output_type = type;
  }
  return buildOutputModel(m);
}

function executeSelectedCell(model: NotebookModel, session: INotebookSession)  {
  let cell = model.cells.get(model.selectedCellIndex);
  if (isCodeCell(cell)) {
    let exRequest = {
      code: cell.input.textEditor.text
    };
    let output = cell.output;
    console.log(`executing`, exRequest)
    let ex = session.kernel.execute(exRequest);
    output.clear(false);
    ex.onIOPub = (msg => {
      // TODO: not getting an execute_result message
      let model = messageToModel(msg);
      console.log('iopub', msg);
      if (model !== void 0) {
        output.add(model)
      }
    });
    ex.onReply = (msg => {console.log('a', msg)});
    ex.onDone = (msg => {console.log('b', msg)});
  }
}

/**
 * An implementation of a file handler.
 */
export
class NotebookFileHandler extends AbstractFileHandler {

  constructor(contents: IContentsManager, session: INotebookSessionManager) {
    super(contents);
    this.session = session;
  }

  /**
   * Get the list of file extensions supported by the handler.
   */
  get fileExtensions(): string[] {
    return ['.ipynb']
  }

  /**
   * Get file contents given a path.
   */
  protected getContents(path: string): Promise<IContentsModel> {
    return this.manager.get(path, { type: 'notebook' });
  }

  /**
   * Create the widget from an `IContentsModel`.
   */
  protected createWidget(path: string): Widget {
    let model = new NotebookModel();
    let panel = new Panel()
    let button = new Widget();
    let b = document.createElement('button');
    b.appendChild(document.createTextNode('Execute Current Cell'))
    this.session.startNew({notebookPath: path}).then(s => {
      b.addEventListener('click', ev=> {
        executeSelectedCell(model, s);
      })
    })
    button.node.appendChild(b);
    panel.addChild(button);
    panel.addChild(new NotebookWidget(model));
    panel.title.text = path.split('/').pop();
    panel.addClass('jp-NotebookContainer')
    return panel;
  }

  protected setState(widget: NotebookWidget, model: IContentsModel): Promise<void> {
    let nbdata: NBData = makedata(model);
    populateNotebookModel(widget.model, nbdata);
    return Promise.resolve();
  }

  protected getState(widget: NotebookWidget): Promise<IContentsModel> {
    return Promise.resolve(void 0);
  }

  /**
   * Populate the notebook widget with the contents of the notebook.
   */
  protected populateWidget(widget: Widget, model: IContentsModel): Promise<void> {
    let nbData: NBData = makedata(model);
    let nbWidget: NotebookWidget = ((widget as Panel).childAt(1)) as NotebookWidget;
    populateNotebookModel(nbWidget.model, nbData);
    return Promise.resolve();
  }

}

function makedata(a: IContentsModel): NBData {
  return {
    content: a.content,
    name: a.name,
    path: a.path
  }
}
