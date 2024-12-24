import axios from 'axios';
import { observable, action, makeObservable, computed, reaction, autorun } from "mobx";
import { hydrateStore, makePersistable } from "mobx-persist-store";


class GlobalStore {
    popupProduct = null;

    constructor() {
        makeObservable(this, {
            popupProduct: observable,
        });

        makePersistable(this, {
            name: 'GlobalStore',
            storage: typeof window !== "undefined" ? window.localStorage : undefined,
            properties: [ 'popupProduct' ]
        });
    }

    async hydrate(data: any) {
        await hydrateStore(data);
    }
}

const globalStore = new GlobalStore();
export default globalStore;