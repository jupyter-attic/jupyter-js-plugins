// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

declare module Widgets {
    export class ManagerBase<T> {
        display_view(msg: any, view: any, options: any): T;
        handle_comm_open(comm: shims.services.Comm, msg: any): Promise<any>;
        display_model(msg: any, view: any, options: any): Promise<T>;
        get_model(id: string): any;
    }
    
    export module shims {
        export module services {
            export class Comm {
                constructor(comm: any);
            }            
        }
    }
}

declare module "jupyter-js-widgets" {
    export = Widgets;
}
