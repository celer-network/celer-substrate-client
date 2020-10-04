import { ApiPromise, WsProvider } from '@polkadot/api';
import * as celerDefinitions from 'celer-substrate-types/src/interfaces/definitions';

export async function connect (): Promise<ApiPromise> {
    // extract all types from definitions - fast and dirty approach, flatted on 'types'
    const types = Object.values(celerDefinitions).reduce((res, { types }): object => ({ ...res, ...types }), {});
    const wsProvider = new WsProvider('ws://localhost:9944');
    const api = await ApiPromise.create({
        provider: wsProvider,
        types: {
            ...types,
            "Address": "AccountId",
            "LookupSource": "AccountId",
            "Signature": "MultiSignature",
            // chain-specific overrides
            Keys: 'SessionKeys4'
        },
        rpc: celerRpc,
    });


    return api;
}

const celerRpc = {
    celerPayModule: {
        getCelerLedgerId: {
            description: "Return Celer Ledger Operation module id",
            params: [],
            type: "AccountId",
        },
        getSettleFinalizedTime: {
            description: "Return channel confirm settle open time",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<BlockNumber>",
        },
        getChannelStatus: {
            description: "Return channel status",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "u8",
        },
        getCooperativeWithdrawSeqNum: {
            description: "Return cooperative withdraw seq_num",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<u128>",
        },
        getTotalBalance: {
            description: "Return one channel\'s total balance amount",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Balance",
        },
        getBalanceMap: {
            description: "Return one channel\'s balance map",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<Balance>, Vec<Balance>)",
        },
        getDisputeTimeOut: {
            description: "Return channel's dispute timeout",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<BlockNumber>",
        },
        getStateSeqNumMap: {
            description: "Return state seq_num map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(Vec<AccountId>, Vec<u128>)>",
        },
        getTransferOutMap: {
            description: "Return transfer_out map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(Vec<AccountId>, Vec<Balance>)>",
        },
        getNextPayIdListHashMap: {
            description: "Return next_pay_id_list_hash map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(Vec<AccountId>, Vec<Hash>)>",
        },
        getLastPayResolveDeadlineMap: {
            description: "Return last_pay_resolve_deadline map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(Vec<AccountId>, Vec<BlockNumber>)>",
        },
        getPendingPayOutMap: {
            description: "Return pending_pay_out map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(Vec<AccountId>, Vec<Balance>)>",
        },
        getWithdrawIntent: {
            description: "Return the withdraw intent info of the channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(AccountId, Balance, BlockNumber, Hash)>",
        },
        getChannelStatusNum: {
            description: "Return the channel number of given status",
            params: [
                {
                    name: "channelStatus",
                    type: "u8",
                }
            ],
            type: "Option<u8>",
        },
        getBalanceLimits: {
            description: "Return balance limits",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<Balance>",
        },
        getBalanceLimitsEnabled: {
            description: "Whether balance limits is enable",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<bool>",
        },
        getPeersMigrationInfo: {
            description: "Return migration info of the peers in the channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "Option<(Vec<AccountId>, Vec<Balance>, Vec<Balance>, Vec<u128>, Vec<Balance>, Vec<Balance>)>",
        },
        getCelerWalletId: {
            description: "Return AccountId of Celer Wallet module",
            params: [],
            type: "AccountId",
        },
        getWalletOwners: {
            description: "Return wallet owner conrresponding tp wallet_id",
            params: [
                {
                    name: "walletId",
                    type: "Hash",
                }
            ],
            type: "Option<Vec<AccountId>>",
        },
        getWalletBalance: {
            description: "Return amount of funds which is deposited into specified wallet",
            params: [
                {
                    name: "walletId",
                    type: "Hash",
                }
            ],
            type: "Option<Balance>",
        },
        getPoolId: {
            description: "Return AccountId of Pool",
            params: [],
            type: "AccountId",
        },
        getPoolBalance: {
            description: "Return amount of funds which is pooled of specified address",
            params: [
                {
                    name: "owner",
                    type: "AccountId",
                }
            ],
            type: "Option<Balance>",
        },
        getAllowance: {
            description: "Return amount of funds which owner allowed to a spender",
            params: [
                {
                    name: "owner",
                    type: "AccountId",
                },
                {
                    name: "spender",
                    type: "AccountId",
                }
            ],
            type: "Option<Balance>",
        },
        getPayResolverId: {
            description: "Return AccountId of PayResolver module",
            params: [],
            type: "AccountId",
        },
        calculatePayId: {
            description: "Calculate pay id",
            params: [
                {
                    name: "payHash",
                    type: "Hash",
                }
            ],
            type: "Hash",
        }
    }
}