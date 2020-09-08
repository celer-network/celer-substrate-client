import { ApiRx } from '@polkadot/api';

import * as celerDefinitions from 'celer-substrate-types/src/interfaces/definitions';

export async function connect (): Promise<ApiRx> {
    // extract all types from definitions - fast and dirty approach, flatted on 'types'
    const types = Object.values(celerDefinitions).reduce((res, { types }): object => ({ ...res, ...types }), {});

    const api = await ApiRx.create({
        types: {
            ...types,
            "Address": "AccountId",
            "LookupSource": "AccountId",
            "Signature": "MultiSignature",
            // chain-specific overrides
            Keys: 'SessionKeys4'
        }
    }).toPromise();
   
    return api;
}