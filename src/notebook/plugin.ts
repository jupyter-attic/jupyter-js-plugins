// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  AbstractFileHandler
} from 'jupyter-js-docmanager';

import {
  NotebookWidget, NotebookModel, NBData, populateNotebookModel, buildOutputModel, Output, INotebookModel
} from 'jupyter-js-notebook';

import {
  isCodeCellModel, isMarkdownCellModel
} from 'jupyter-js-notebook/lib/cells';

import {
  IContentsModel, IContentsManager,
  NotebookSessionManager, INotebookSessionManager,
  INotebookSession, IKernelMessage
} from 'jupyter-js-services';

import {
  ICommandRegistry, ICommandPalette
} from 'phosphide';

import {
  Container
} from 'phosphor-di';

import {
  Panel
} from 'phosphor-panel';

import {
  Property
} from 'phosphor-properties';

import {
  Widget
} from 'phosphor-widget';

import {
  IServicesProvider, IDocumentManager
} from '../index';

import {
  WidgetManager
} from './widgetmanager';


let executeCellCommandId = 'notebook:execute-selected-cell';
let renderCellCommandId = 'notebook:render-selected-cell';
let selectNextCellCommandId = 'notebook:select-next-cell';
let selectPreviousCellCommandId = 'notebook:select-previous-cell';

let notebookContainerClass = 'jp-NotebookContainer';

/**
 * Register the plugin contributions.
 *
 * @param container - The di container for type registration.
 *
 * #### Notes
 * This is called automatically when the plugin is loaded.
 */
export
function resolve(container: Container): Promise<AbstractFileHandler> {
  return container.resolve({
    requires: [IServicesProvider, IDocumentManager, ICommandRegistry, ICommandPalette],
    create: (services: IServicesProvider, manager: IDocumentManager,
             registry: ICommandRegistry,
             palette: ICommandPalette) => {
      let handler = new NotebookFileHandler(
        services.contentsManager,
        services.notebookSessionManager
      );
      manager.register(handler);
      registry.add([{
        id: executeCellCommandId,
        handler: () => handler.executeSelectedCell()
      }, {
        id: renderCellCommandId,
        handler: () => handler.renderSelectedCell()
      }, {
        id: selectNextCellCommandId,
        handler: () => handler.selectNextCell()
      }, {
        id: selectPreviousCellCommandId,
        handler: () => handler.selectPreviousCell()
      }]);
      palette.add([{
        id: executeCellCommandId,
        category: 'Notebook Operations',
        args: void 0,
        text: 'Execute current cell',
        caption: 'Execute the current cell'
      }, {
        id: renderCellCommandId,
        category: 'Notebook Operations',
        args: void 0,
        text: 'Render current markdown cell',
        caption: 'Render the current markdown cell'
      }, {
        id: selectNextCellCommandId,
        category: 'Notebook Operations',
        args: void 0,
        text: 'Select next cell',
        caption: 'Select next cell'
      }, {
        id: selectPreviousCellCommandId,
        category: 'Notebook Operations',
        args: void 0,
        text: 'Select previous cell',
        caption: 'Select previous cell'
      }]);
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
  if (isCodeCellModel(cell)) {
    let exRequest = {
      code: cell.input.textEditor.text,
      silent: false,
      store_history: true,
      stop_on_error: true,
      allow_stdin: true
    };
    let output = cell.output;
    console.log(`executing`, exRequest)
    let ex = session.kernel.execute(exRequest);
    output.clear(false);
    ex.onIOPub = (msg => {
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

function renderSelectedCell(model: NotebookModel)  {
  let cell = model.cells.get(model.selectedCellIndex);
  if (isMarkdownCellModel(cell)) {
    cell.rendered = true;
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

  executeSelectedCell(): void {
    for (let w of this.widgets) {
      if (w.hasClass('jp-mod-focus')) {
        executeSelectedCell(modelProperty.get(w), sessionProperty.get(w));
        return;
      }
    }
  }

  renderSelectedCell(): void {
    for (let w of this.widgets) {
      if (w.hasClass('jp-mod-focus')) {
        renderSelectedCell(modelProperty.get(w));
        return;
      }
    }
  }

  selectNextCell(): void {
    for (let w of this.widgets) {
      if (w.hasClass('jp-mod-focus')) {
        modelProperty.get(w).selectNextCell();
        return;
      }
    }
  }

  selectPreviousCell(): void {
    for (let w of this.widgets) {
      if (w.hasClass('jp-mod-focus')) {
        modelProperty.get(w).selectPreviousCell();
        return;
      }
    }
  }

  /**
   * Get file contents given a contents model.
   */
  protected getContents(model: IContentsModel): Promise<IContentsModel> {
    return this.manager.get(model.path, { type: 'notebook' });
  }

  /**
   * Create the widget from an `IContentsModel`.
   */
  protected createWidget(contents: IContentsModel): Widget {
    let model = new NotebookModel();
    let panel = new Panel();

    let widgetarea = new Widget();
    let manager = new WidgetManager(widgetarea.node);
    let widget = new NotebookWidget(model);

    panel.addChild(widgetarea);
    panel.addChild(widget);
    panel.title.text = contents.name;
    panel.addClass(notebookContainerClass);
    modelProperty.set(panel, model);

    this.session.startNew({notebookPath: contents.path}).then(s => {
      sessionProperty.set(panel, s);

      s.kernel.registerCommTarget('jupyter.widget', (comm, msg) => {
        console.log('comm message', msg);

        let modelPromise = manager.handle_comm_open(comm, msg);

        comm.onMsg = (msg) => {
          manager.handle_comm_open(comm, msg)
          // create the widget model and (if needed) the view
          console.log('comm widget message', msg);
        }
        comm.onClose = (msg) => {
          console.log('comm widget close', msg);
        }
      })
    })

    return panel;
  }

  /**
   * Populate the notebook widget with the contents of the notebook.
   */
  protected setState(widget: Widget, model: IContentsModel): Promise<void> {
    let nbData: NBData = makedata(model);
    let nbWidget: NotebookWidget = ((widget as Panel).childAt(1)) as NotebookWidget;
    populateNotebookModel(nbWidget.model, nbData);
    return Promise.resolve();
  }

  protected getState(widget: Widget): Promise<IContentsModel> {
    return Promise.resolve(void 0);
  }

  session: INotebookSessionManager;
}


function makedata(a: IContentsModel): NBData {
  return {
    content: a.content,
    name: a.name,
    path: a.path
  }
}


const sessionProperty = new Property<Widget, INotebookSession>({
  name: 'notebookSession',
  value: null
});


const modelProperty = new Property<Widget, INotebookModel>({
  name: 'notebookModel',
  value: null
});
