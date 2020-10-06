"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
const celerDefinitions = __importStar(require("celer-substrate-types/src/interfaces/definitions"));
async function connect() {
    // extract all types from definitions - fast and dirty approach, flatted on 'types'
    const types = Object.values(celerDefinitions).reduce((res, { types }) => (Object.assign(Object.assign({}, res), types)), {});
    const wsProvider = new api_1.WsProvider('ws://localhost:9944');
    const api = await api_1.ApiPromise.create({
        provider: wsProvider,
        types: Object.assign(Object.assign({}, types), { "Address": "AccountId", "LookupSource": "AccountId", "Signature": "MultiSignature", 
            // chain-specific overrides
            Keys: 'SessionKeys4' }),
        rpc: celerRpc,
    });
    return api;
}
exports.connect = connect;
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
            type: "BlockNumber",
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
            type: "SeqNumWrapper",
        },
        getTotalBalance: {
            description: "Return one channel\'s total balance amount",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "BalanceWrapper",
        },
        getBalanceMap: {
            description: "Return one channel\'s balance map",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<BalanceWrapper>, Vec<BalanceWrapper>)",
        },
        getDisputeTimeOut: {
            description: "Return channel's dispute timeout",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "BlockNumber",
        },
        getStateSeqNumMap: {
            description: "Return state seq_num map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<SeqNumWrapper>)",
        },
        getTransferOutMap: {
            description: "Return transfer_out map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<BalanceWrapper>)",
        },
        getNextPayIdListHashMap: {
            description: "Return next_pay_id_list_hash map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<Hash>)",
        },
        getLastPayResolveDeadlineMap: {
            description: "Return last_pay_resolve_deadline map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<BlockNumber>)",
        },
        getPendingPayOutMap: {
            description: "Return pending_pay_out map of a duplex channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<BalanceWrapper>)",
        },
        getWithdrawIntent: {
            description: "Return the withdraw intent info of the channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(AccountId, BalanceWrapper, BlockNumber, Hash)",
        },
        getChannelStatusNum: {
            description: "Return the channel number of given status",
            params: [
                {
                    name: "channelStatus",
                    type: "u8",
                }
            ],
            type: "u8",
        },
        getBalanceLimits: {
            description: "Return balance limits",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "BalanceWrapper",
        },
        getBalanceLimitsEnabled: {
            description: "Whether balance limits is enable",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "bool",
        },
        getPeersMigrationInfo: {
            description: "Return migration info of the peers in the channel",
            params: [
                {
                    name: "channelId",
                    type: "Hash",
                }
            ],
            type: "(Vec<AccountId>, Vec<BalanceWrapper>, Vec<BalanceWrapper>, Vec<SeqNumWrapper>, Vec<BalanceWrapper>, Vec<BalanceWrapper>)",
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
            type: "Vec<AccountId>",
        },
        getWalletBalance: {
            description: "Return amount of funds which is deposited into specified wallet",
            params: [
                {
                    name: "walletId",
                    type: "Hash",
                }
            ],
            type: "BalanceWrapper",
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
            type: "BalanceWrapper",
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
            type: "BalanceWrapper",
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
};
