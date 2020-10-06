import { Keyring } from '@polkadot/keyring';
import { ApiPromise } from '@polkadot/api';
import { 
    getCooperativeWithdrawRequest, 
    getOpenChannelRequest, 
    waitBlockNumber,
    caluculateChannelId,
    selectChannelPeerKeyring,
    selectChannelPeer
} from './utils';
import { cryptoWaitReady, blake2AsU8a } from '@polkadot/util-crypto';
import { 
    SignedSimplexStateArray, 
    PayIdList, 
    VouchedCondPayResultOf,
    ResolvePaymentConditionsRequestOf,
    CooperativeSettleRequestOf 
} from 'celer-substrate-types';
import { u8aToHex } from "@polkadot/util";
import { bool } from '@polkadot/types';

export async function setBalanceLimits(
    api: ApiPromise,
    _caller: string,
    channelId: string,
    limits: number,
) {
    let caller = await selectChannelPeerKeyring(_caller);
    
    api.tx.celerPayModule
        .setBalanceLimits(channelId, api.registry.createType("Balance", limits))
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Set Balance Limits:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.SetBalanceLimits [channelId(Hash), limits(Balance)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function disableBalanceLimits(
    api: ApiPromise,
    _caller: string,
    channelId: string,
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .disableBalanceLimits(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Disable Balance Limits:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.DisableBalanceLimits [channelId(Hash)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function enableBalanceLimits(
    api: ApiPromise,
    _caller: string,
    channelId: string,
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .enableBalanceLimits(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Enable Balance Limits:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.EnableBalanceLimits [channelId(Hash)]\n')

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
}

export async function openChannel(
    api: ApiPromise,
    _caller: string,
    zeroTotalDeposit = true,
    msgValue = 0,
    balanceLimitsEnabled = true,
    balanceLimits = 1000000,
    channelPeerBalance0 = 1000,
    channelPeerBalance1 = 2000,
    openDeadline = 999999, 
    disputeTimeout = 10,
    msgValueReceiver = 0,
): Promise<string> {
    let caller = await selectChannelPeerKeyring(_caller);
  
    let openChannelRequestOf = await getOpenChannelRequest(
        api,
        balanceLimitsEnabled,
        balanceLimits,
        channelPeerBalance0,
        channelPeerBalance1,
        openDeadline,
        disputeTimeout,
        zeroTotalDeposit,
        msgValueReceiver
    );

    let channelId = await caluculateChannelId(api, openChannelRequestOf);
    console.log(`channel id is ${channelId}`);
    console.log(`channelPeers[0] is bob, channelPeers[1] is alice \n`);
    await waitBlockNumber(2);

    api.tx.celerPayModule
        .openChannel(openChannelRequestOf, api.registry.createType("Balance", msgValue))
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Open channel:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', `celerPayModule.EnableBalanceLimits [channelId(Hash)]`);
                console.log('\t', `celerPayModule.SetBalanceLimits [channelId(Hash), balanceLimits(Balance)]`);
                console.log('\t', `system.NewAccount [newAccount(AccountId)]`);
                console.log('\t', `balances.Endowed [createdAccount(AccountId), freeBalance(Balance)]`)
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`)
                console.log('\t', `celerPayModule.OpenChannel [channelId(Hash), channelPeers(Vec<AccountId>), deposits(Vec<Balance>)]`)
                console.log('\t', 'celerPayModule.CreateWallet [walletId(Hash), channelPeers(Vec<AccountId>)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    
    return channelId;
}

export async function deposit(
    api: ApiPromise,
    _caller: string,
    channelId: string,
    _receiver: string,
    msgValue: number,
    transferFromAmount: number,
) {
    let caller = await selectChannelPeerKeyring(_caller);
    let receiver = await selectChannelPeer(api, _receiver);

    api.tx.celerPayModule
        .deposit(channelId, receiver, api.registry.createType("Balance", msgValue), api.registry.createType("Balance", transferFromAmount))
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Deposit:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`)
                console.log('\t', 'celerPaymodule.DepositToChannel [channelId(Hash), channelPeers(Vec<AccountId>), deposits(Vec<Balance>), withdrawals(Vec<Balance>)\n')

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function depositInBatch(
    api: ApiPromise,
    _caller: string,
    _channelIds: string[],
    _receivers: string[],
    _msgValues: number[],
    _transferFromAmounts: number[],
) {
    let caller = await selectChannelPeerKeyring(_caller);

    let receivers = [];
    for (let i = 0; i < _receivers.length; i++) {
        receivers[i] = await selectChannelPeer(api, _receivers[i]);
    }

    let msgValues = [];
    let transferFromAmounts = [];
    for (let i = 0; i < _msgValues.length; i++) {
        msgValues[i] = api.registry.createType("BalanceOf", _msgValues[i]);
        transferFromAmounts[i] = api.registry.createType("BalanceOf", _transferFromAmounts[i]);
    }
    
    let channelIds = [];
    for (let i = 0; i < _channelIds.length; i++) {
        channelIds[i] = api.registry.createType("Hash", _channelIds[i]);
    }
    
    api.tx.celerPayModule
        .depositInBatch(channelIds, receivers, msgValues, transferFromAmounts)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Deposit In Batch:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
                console.log('\t', 'celerPaymodule.DepositToChannel [channelId(Hash), channelPeers(Vec<AccountId>), deposits(Vec<Balance>), withdrawals(Vec<Balance>)]\n')

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function snapshotStates(
   api: ApiPromise,
   _caller: string,
   signedSimplexStateArray: SignedSimplexStateArray
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .snapshotStates(signedSimplexStateArray)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Snapshot states:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.SnapshotStates [channelId(Hash), seqNums(Vec<u128>)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function intendWithdraw(
    api: ApiPromise,
    _caller: string,
    channelId: string,
    amount: number,
    isZeroHash = true,
    recipientChannelId?: string,
) { 
    let caller = await selectChannelPeerKeyring(_caller);
    
    if (isZeroHash === true) {
        let zeroU8a = blake2AsU8a(api.registry.createType("u8", 0).toU8a());
        let zeroHash = u8aToHex(zeroU8a);
        api.tx.celerPayModule
            .intendWithdraw(channelId, amount, zeroHash)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Intend Withdraw:', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.IntendWithdraw [channelId(Hash), receiver(AccountId), amount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
            });
    } else {
        api.tx.celerPayModule
            .intendWithdraw(channelId, amount, recipientChannelId)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Intend Withdraw:', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.IntendWithdraw [channelId(Hash), receiver(AccountId), amount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
            });
    }
}

export async function confirmWithdraw(
    api: ApiPromise,
    _caller: string,
    channelId: string
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .confirmWithdraw(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Confirm Withdraw:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.confirmWithdraw [channelId(Hash), withdrawnAmount(Balance), receiver(AccountId), receipientChannelId(Hash), deposits(Vec<Balance>), withdrawals(Vec<Balance>)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function vetoWithdraw(
    api: ApiPromise,
    _caller: string,
    channelId: string
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .vetoWithdraw(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Veto Withdraw:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.VetoWithdraw [channelId(Hash)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function cooperativeWithdraw(
    api: ApiPromise,
    _caller: string,
    channelId: string,
    seqNum: number,
    amount: number,
    _receiverAccount: string,
    withdrawDeadline = 9999999,
    isZeroHash = true,
    recipientChannelId?: string,
) {
    let caller = await selectChannelPeerKeyring(_caller);

    let cooperativeWithdrawRequest;
    if (isZeroHash === true) {
        cooperativeWithdrawRequest = await getCooperativeWithdrawRequest(
            api,
            channelId,
            seqNum,
            amount,
            _receiverAccount,
            withdrawDeadline,
            isZeroHash
        );
    } else {
        cooperativeWithdrawRequest = await getCooperativeWithdrawRequest(
            api,
            channelId,
            seqNum,
            amount,
            _receiverAccount,
            withdrawDeadline,
            isZeroHash,
            recipientChannelId
        );
    }

    api.tx.celerPayModule
        .cooperativeWithdraw(cooperativeWithdrawRequest)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Cooperative Withdraw:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.CooperativeWithdraw [channelId(Hash), withdrawnAmount(Balance), receiver(AccountId), recipientChannelId(Hash), deposits(Vec<Balnace>), withdrawals(Vec<Balance>), seqNum(u128)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function intendSettle(
    api: ApiPromise,
    _caller: string,
    signedSimplexStateArray: SignedSimplexStateArray,
) {
    let caller = await selectChannelPeerKeyring(_caller);
    
    api.tx.celerPayModule
        .intendSettle(signedSimplexStateArray)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Intend Settle:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.ClearOnePay [channelId(Hash), payId(Hash), peerFrom(AccountId), amount(Balance)]');
                console.log('\t', 'celerPayModule.IntendSettle [channelId(Hash), seqNums(Vec<Hash>)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function clearPays(
    api: ApiPromise,
    _caller: string,
    channelId: string,
    _peerFrom: string,
    payIdList: PayIdList
) {
    let caller = await selectChannelPeerKeyring(_caller);    
    let peerFrom = await selectChannelPeer(api, _peerFrom);

    api.tx.celerPayModule
        .clearPays(channelId, peerFrom, payIdList)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Clear Pays:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.ClearOnePay [channelId(Hash), payId(Hash), peerFrom(AccountId), amount(Balance)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}


export async function confirmSettle(
    api: ApiPromise,
    _caller: string,
    channelId: string
) {
    let caller = await selectChannelPeerKeyring(_caller);
    
    api.tx.celerPayModule
        .confirmSettle(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Confirm Settle:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
                console.log('\t', 'celerPayModule.WithdrawFromWallet [receiver(AccountId), amount(Balance)]');
                console.log('\t', 'celerPayModule.ConfirmSettle [channelId(Hash), settleBalance(Vec<Balance>)]');
                console.log('\t', 'celerPayModule.ConfirmSettleFail [channelId(Hash)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function cooperativeSettle(
    api: ApiPromise,
    _caller: string,
    settleRequest: CooperativeSettleRequestOf
) {
    let caller = await selectChannelPeerKeyring(_caller);
    
    api.tx.celerPayModule
        .cooperativeSettle(settleRequest)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Cooperative Settle:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
                console.log('\t', 'celerPayModule.WithdrawFromWallet [walletId(Hash), receiver(AccountId), amount(Balance)]')
                console.log('\t', 'celerPayModule.CooperativeSettle [channelId(Hash), settleBalances(Vec<Balance>)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function depositPool(
    api: ApiPromise,
    _caller: string,
    _receiver: string,
    amount: number,
) {
    let caller = await selectChannelPeerKeyring(_caller);
    let receiver = await selectChannelPeer(api, _receiver);
    
    api.tx.celerPayModule
        .depositPool(receiver, amount)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Deposit to Pool:', status.type);
            if (status.isInBlock) {
                console.log('Events: ');
                console.log('\t', `system.NewAccount [newAccount(AccountId)]`);
                console.log('\t', `balances.Endowed [createdAccount(AccountId), freeBalance(Balance)]`)
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`)
                console.log('\t', 'celerPayModule.DepositToPool [receiver(AccountId), amount(Balance)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function withdrawFromPool(
    api: ApiPromise,
    _caller: string,
    value: number,
) {
    let caller = await selectChannelPeerKeyring(_caller);
    
    api.tx.celerPayModule
        .withdrawFromPool(api.registry.createType("Balance", value))
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Withdraw from Pool:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.WithdrawFromPool [receiver(AccountId), amount(Balance)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function approve(
    api: ApiPromise,
    _caller: string,
    _spender: string,
    value: number,
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const bob = keyring.addFromUri('//Bob');

    let caller = await selectChannelPeerKeyring(_caller);

    if (_spender === 'bob') {
        let spender = api.registry.createType("AccountId", bob.address);
        api.tx.celerPayModule
            .approve(spender, value)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Approve :', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), amount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
            });
    } else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        api.tx.celerPayModule
            .approve(spender, value)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Approve:', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), amount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
        });
    }
}

export async function transferFrom(
    api: ApiPromise,
    _caller: string,
    _from: string,
    _to: string,
    value: number,
) {
    await cryptoWaitReady();
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice'); 
    const charlie = keyring.addFromUri('//Charlie');

    let caller = await selectChannelPeerKeyring(_caller);
    let from = await selectChannelPeer(api, _from);

    let to;
    if (_to === 'alice' || _to === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        to = api.registry.createType("AccountId", alice.address);   
    } else if (_to === 'charlie' || _to === '5EYCAe5fKkaKKxUTp36E2KW1q785EuQDLNuCRm7k7opzCMfq') {
        to = api.registry.createType("AccountId", charlie.address);
    }

    api.tx.celerPayModule
        .transferFrom(from, to, value)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Transfer from :', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), amount(Balance)]');
                console.log('\t', `system.NewAccount [newAccount(AccountId)]`);
                console.log('\t', `balances.Endowed [createdAccount(AccountId), freeBalance(Balance)]`)
                console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`)
                console.log('\t', 'celerPayModule.Transfer [from(AccountId), receiver(AccountId), amount(Balance)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function increaseAllowance(
    api: ApiPromise,
    _caller: string,
    _spender: string,
    addedValue: number,
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const bob = keyring.addFromUri('//Bob');

    let caller = await selectChannelPeerKeyring(_caller);

    if (_spender === 'bob') {
        let spender = api.registry.createType("AccountId", bob.address);
        api.tx.celerPayModule
            .increaseAllowance(spender, addedValue)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Increase allowance :', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), increasedAmount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
            });
    } else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        api.tx.celerPayModule
            .increaseAllowance(spender, addedValue)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Increase allowance:', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), increasedAmount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
        });
    }
}

export async function decreaseAllowance(
    api: ApiPromise,
    _caller: string,
    _spender: string,
    subtractedValue: number,
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const bob = keyring.addFromUri('//Bob');

    let caller = await selectChannelPeerKeyring(_caller);

    if (_spender === 'bob') {
        let spender = api.registry.createType("AccountId", bob.address);
        api.tx.celerPayModule
            .decreaseAllowance(spender, subtractedValue)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Decrease allowance :', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), decreasedAmount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
            });
    } else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        api.tx.celerPayModule
            .decreaseAllowance(spender, subtractedValue)
            .signAndSend(caller, ({ events = [], status }) => {
                console.log('Decrease allowance:', status.type);
                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events: ');
                    console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), decreasedAmount(Balance)]\n');

                    events.forEach(({ event: { data, method, section}}) => {
                        const [error] = data;
                        if (error.isModule) {
                            const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                            console.log(`${section}: error message is ${name}, ${documentation}` );
                        } else {
                            console.log('\t', `${section}.${method}`, data.toString());
                        }
                    });
                } 
        });
    }
}

export async function resolvePaymentByConditions(
    api: ApiPromise,
    _caller: string,
    resolvePayRequest: ResolvePaymentConditionsRequestOf,
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .resolvePaymentByConditions(resolvePayRequest)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Resolve payment by conditions:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.PayInfoUpdate [payId(Hash), amount(Balance), resolveDeadline(BlockNumber)');
                console.log('\t', 'celerPayModule.ResolvePayment [payId(Hash), amount(Balance), resolveDeadline(BlockNumber)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            } 
        });
}

export async function resolvePaymentByVouchedResult(
    api: ApiPromise,
    _caller: string,
    voucehdPayResult: VouchedCondPayResultOf,
) {
    let caller = await selectChannelPeerKeyring(_caller);

    api.tx.celerPayModule
        .resolvePaymentByVouchedResult(voucehdPayResult)
        .signAndSend(caller, ({ events = [], status }) => {
            console.log('Resolve payment by vouched result:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.ResolvePayment [payId(Hash), amount(Balance), resolveDeadline(BlockNumber)]\n');

                events.forEach(({ event: { data, method, section}}) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}` );
                    } else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
}

export async function getCelerLedgerId(api: ApiPromise): Promise<string> {
    const celerLedgerId = await api.rpc.celerPayModule.getCelerLedgerId();
    return celerLedgerId.toHuman();
}

export async function getSettleFinalizedTime(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const settleFinalizedTime = await api.rpc.celerPayModule.getSettleFinalizedTime(channelId);
    return settleFinalizedTime.toNumber();
}

export async function getChannelStatus(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const channelStatus = await api.rpc.celerPayModule.getChannelStatus(channelId);
    return channelStatus.toNumber();
}

export async function getCooperativeWithdrawSeqNum(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const seqNum = await api.rpc.celerPayModule.getCooperativeWithdrawSeqNum(channelId);
    return seqNum.number.toNumber();
}

export async function getTotalBalance(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const totalBalance = await api.rpc.celerPayModule.getTotalBalance(channelId);
    return totalBalance.amount.toNumber();
}

export async function getBalanceMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[], number[]]> {
    const [channelPeers, deposits, withdrawals] = await api.rpc.celerPayModule.getBalanceMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [deposits[0].amount.toNumber(), deposits[1].amount.toNumber()],
        [withdrawals[0].amount.toNumber(), deposits[1].amount.toNumber()]
    ];
}

export async function getDisputeTimeOut(
    api: ApiPromise,
    channelId: string
): Promise<number> {
    const disputeTimeOut = await api.rpc.celerPayModule.getDisputTimeOut(channelId);
    return disputeTimeOut.toNumber();
}

export async function getStateSeqNumMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, seqNums] = await api.rpc.celerPayModule.getStateSeqNumMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [seqNums[0].number.toNumber(), seqNums[1].number.toNumber()]
    ];
}

export async function getTransferOutMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, transferOuts] = await api.rpc.celerPayModule.getTransferOutMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [transferOuts[0].amount.toNumber(), transferOuts[1].amount.toNumber()]
    ];
}

export async function getNextPayIdListHashMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], string[]]> {
    const [channelPeers, nextPayIdListsHashs] = await api.rpc.celerPayModule.getNextPayIdListHashMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [nextPayIdListsHashs[0].toHex(), nextPayIdListsHashs[1].toHex()]
    ];
}

export async function getLastPayResolveDeadlineMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, lastPayResolveDeadlines] = await api.rpc.celerPayModule.getLastPayResolveDeadlineMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [lastPayResolveDeadlines[0].toNumber(), lastPayResolveDeadlines[1].toNumber()]
    ];
}

export async function getPendingPayOutMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, pendingPayOuts] = await api.rpc.celerPayModule.getPendingPayOutMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [pendingPayOuts[0].amount.toNumber(), pendingPayOuts[1].amount.toNumber()]
    ];
}

export async function getWithdrawIntent(
    api: ApiPromise,
    channelId: string
): Promise<[string, number, number, string]> {
    const [receiver, withdrawIntentAmount, withdrawIntentRequestTime, recipientChannelId]
        = await api.rpc.celerPayModule.getWithdrawIntent(channelId);

    return [
        receiver.toHuman(),
        withdrawIntentAmount.amount.toNumber(),
        withdrawIntentRequestTime.toNumber(),
        recipientChannelId.toHex()
    ];
}

export async function getChannelStatusNum(
    api: ApiPromise,
    channelStatus: number
): Promise<number> {
    const statusNums = await api.rpc.celerPayModule.getChannelStatusNum(channelStatus);
    return statusNums.toHuman();
}

export async function getBalanceLimits(
    api: ApiPromise,
    channelId: string
): Promise<number> {
    const balanceLimits = await api.rpc.celerPayModule.getBalanceLimits(channelId);
    return balanceLimits.amount.toNumber();
}

export async function getBalanceLimitsEnabled(
    api: ApiPromise,
    channelId: string
): Promise<bool> {
    const balanceLimitsEnabled = await api.rpc.celerPayModule.getBalanceLimitsEnabled(channelId);
    return balanceLimitsEnabled.toHuman();
}

export async function getPeersMigrationInfo(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[], number[], number[], number[], number[]]> {
    const [channelPeers, deposits, withdrawals, seqNums, transferOuts, pendingPayOuts]
        = await api.rpc.celerPayModule.getPeersMigrationInfo(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [deposits[0].amount.toNumber(), deposits[1].amount.toNumber()],
        [withdrawals[0].amount.toNumber(), withdrawals[1].amount.toNumber()],
        [seqNums[0].number.toNumber(), seqNums[1].number.toNumber()],
        [transferOuts[0].amount.toNumber(), transferOuts[1].amount.toNumber()],
        [pendingPayOuts[0].amount.toNumber(), pendingPayOuts[1].amount.toNumber()]
    ];
}

export async function getCelerWalletId(
    api: ApiPromise
): Promise<string> {
    const celerWalletId = await api.rpc.celerPayModule.getCelerWalletId();
    return celerWalletId.toHex();
}

export async function getWalletOwners(
    api: ApiPromise,
    walletId: string
): Promise<string[]> {
    const walletOwners = await api.rpc.celerPayModule.getWalletOwners(walletId);
    return [walletOwners[0].toHuman(), walletOwners[1].toHuman()];
}

export async function getPoolId(
    api: ApiPromise,
): Promise<string> {
    const poolId = await api.rpc.celerPayModule.getPoolId();
    return poolId.toHuman();
}

export async function getAllowance(
    api: ApiPromise,
    owner: string,
    spender: string
): Promise<number> {
    const allowance = await api.rpc.celerPayModule.getAllowance(owner, spender);
    return allowance.amount.toNumber();
}

export async function getPayResolverId(
    api: ApiPromise
): Promise<string> {
    const payResolverId = await api.rpc.celerPayModule.getPayResolverId();
    return payResolverId.toHuman();
}

export async function calculatePayId(
    api: ApiPromise,
    payHash: string
): Promise<string> {
    const payId = await api.rpc.celerPayModule.calculatePayId(payHash);
    return payId.toHex();
}

export async function emitCelerLedgerId(
    api: ApiPromise
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit AccountId of Ledger Operation module");
    console.log('\t', 'celerPayModule.CelerLedgerId [celerLedgerId(AccountId)]');
    api.tx.celerPayModule
        .emitCelerLedgerId()
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitChannelInfo(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit channel basic info");
    console.log('\t', 'celerPayModule.ChannelInfo [balanceLimitsEnabled(bool), BalanceLimits(Balance), ChannelStatus(u8)]');
    api.tx.celerPayModule
        .emitChannelInfo(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitSettleFinalizedTime(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit channel settle open time");
    console.log('\t', 'celerPayModule.SettleFinalizedTime [settleFinalizedTime(BlockNumber)]');
    api.tx.celerPayModule
        .emitSettleFinalizedTime(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        })

    await waitBlockNumber(2);
}

export async function emitCooperativeWithdrawSeqNum(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit cooperative withdraw seq num");
    console.log('\t', 'celerPayModule.CooperativeWithdrawSeqNum [cooperativeWithdrawSeqNum(u128)]');
    api.tx.celerPayModule
        .emitCooperativeWithdrawSeqNum(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitTotalBalance(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit one channel's total balance amount");
    console.log('\t', 'celerPayModule.TotalBalance [totalBalance(Balance)]');
    api.tx.celerPayModule
        .emitTotalBalance(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitBalanceMap(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit one channel's balance info");
    console.log('\t', 'celerPayModule.BalanceMap [channelPeers(Vec<AccountId>), deposits(Vec<Balance>), withdrawals(Vec<Balance>)');
    api.tx.celerPayModule
        .emitBalanceMap(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitDisputeTimeOut(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit dipute time out");
    console.log('\t', 'celerPayModule.DisputeTimeout [disputeTimeout (Blocknumber)]');
    api.tx.celerPayModule
        .emitDisputeTimeOut(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitStateSeqNumMap(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit state seq_num map of a duplex channel");
    console.log('\t', 'celerPayModule.StateSeqNumMap [channelPeers(Vec<AccountId>), seqNums(Vec<u128>)]');
    api.tx.celerPayModule
        .emitStateSeqNumMap(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitTransferOutMap(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit transfer_out map of a duplex channel");
    console.log('\t', 'celerPayModule.TranferOutMap [channelPeers(Vec<AccountId>), transferOuts(Vec<BalanceOf<T>)]');
    api.tx.celerPayModule
        .emitTransferOutMap(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitNextPayIdListHashMap(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit next_pay_id_list_hash_map of a duplex channel");
    console.log('\t', 'celerPayModule.NextPayIdListHashMap [channelPeers(Vec<AccountId>), nextPayIdListHashMap(Vec<Hash>)]');
    api.tx.celerPayModule
        .emitNextPayIdListHashMap(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitLastPayResolveDeadlineMap(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit last_pay_resolve_deadline map of a duplex channel");
    console.log('\t', 'celerPayModule.LastPayResolveDeadlineMap [channelPeers(Vec<AccountId>), stateLastPayResolveDeadline(Vec<Hash>)]');
    api.tx.celerPayModule
        .emitLastPayResolveDeadlineMap(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitPendingPayOutMap(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit pending_pay_out_map of a duplex channel");
    console.log('\t', 'celerPayModule.PendingPayOutMap [channelPeers(Vec<AccountId>), pendingPayOutMap(Vec<Balance>)]');
    api.tx.celerPayModule
        .emitPendingPayOutMap(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitWithdrawIntent(
    api: ApiPromise,
    channelId: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit withdraw intent of the channel");
    console.log('\t', 'celerPayModule.WithdrawIntent [intentReceiver(AccountId), intentAmount(Balance), intentRequestTime(BlockNumber), recipientChannelId(Hash)]');
    api.tx.celerPayModule
        .emitWithdrawIntent(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitChannelStatusNum(
    api: ApiPromise,
    channelStatus: number
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit channel number if given status");
    console.log('\t', 'celerPayModule.ChannelStatusNums [channelStatNums(u8)]');
    api.tx.celerPayModule
        .emitChannelStatusNum(channelStatus)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitPeersMigrationInfo(
    api: ApiPromise,
    channelId: string,
){
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit migration info of the peers in the channel");
    console.log('\t', 'celerPayModule.PeersMigrationInfo [channelPeers(Vec<AccountId>), deposits(Vec<Balance>), wihtdrawals(Vec<Balance>), seqNums(Vec<u128>), transferOuts(Vec<Balance>), pendingPayOut(Vec<Balance>)]');
    api.tx.celerPayModule
        .emitPeersMigrationInfo(channelId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitCelerWalletId(
    api: ApiPromise
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit AccountId of Celer Wallet module");
    console.log('\t', 'celerPayModule.CelerWalletId [celerWalletId(AccountId)]');
    api.tx.celerPayModule
        .emitCelerWalletId()
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitWalletInfo(
    api: ApiPromise,
    walletId: string,
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit wallet info corresponding to wallet_id");
    console.log('\t', 'celerPayModule.WalletInfo [owners(Vec<AccountId>), walletBalances(Vec<Balance>)]');
    api.tx.celerPayModule
        .emitWalletInfo(walletId)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());                             
            }
        });

    await waitBlockNumber(2);
}

export async function emitPoolId(
    api: ApiPromise
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit AccountId of Pool");
    console.log('\t', 'celerPayModule.PoolId [poolId(AccountId)]');
    api.tx.celerPayModule
        .emitPoolId()
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());
            }  
        });

    await waitBlockNumber(2);
}

export async function emitPoolBalance(
    api: ApiPromise,
    _owner: string,
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');

    let owner;
    if (_owner === 'alice' || _owner === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        owner = api.registry.createType("AccountId", alice.address);
    } else if (_owner === 'bob' || _owner === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
        owner = api.registry.createType("AccountId", bob.address);
    }

    console.log("Emit Amount of funds which is pooled of specifed address");
    console.log('\t', 'celerPayModule.PoolBalance [balance(Balance)]');
    api.tx.celerPayModule
        .emitPoolBalance(owner)
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());
            }             
        });
    
    await waitBlockNumber(2);
}

export async function emitAllowance(
    api: ApiPromise,
    _owner: string,
    _spender: string
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');

    let owner;
    if (_owner === 'alice' || _owner === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        owner = api.registry.createType("AccountId", alice.address);
    } else if (_owner === 'bob' || _owner === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
        owner = api.registry.createType("AccountId", bob.address);
    }

    console.log('Emit Amount of funds which owner allowed to a spender');
    if (_spender === 'bob') {
        let spender = api.registry.createType("AccountId", bob.address);
        console.log('\t', 'celerPayModule.Allowance [amount(Balance)]');
        api.tx.celerPayModule
            .emitAllowance(owner, spender)
            .signAndSend(alice, ({ events = [] }) => {
                for (const record of events) {
                    const { event, } = record;
                    console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());
                }            
            });
    } else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        console.log('\t', 'celerPayModule.Allowance [amount(Balance)]');
        api.tx.celerPayModule
            .emitAllowance(owner, spender)
            .signAndSend(alice, ({ events = [] }) => {
                for (const record of events) {
                    const { event, } = record;
                    console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());
                }
        });
    }

    await waitBlockNumber(2);
}

export async function emitPayResolverId(
    api: ApiPromise
) {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');

    console.log("Emit AccountId of PayResolver module");
    console.log('\t', 'celerPayModule.PayResolverId [payResolverId(AccountId)]');

    api.tx.celerPayModule
        .emitPayResolverId()
        .signAndSend(alice, ({ events = [] }) => {
            for (const record of events) {
                const { event, } = record;
                console.log(`\t`, `${event.data.section}.${event.data.method}`, event.data.toString());
            }
        });

    await waitBlockNumber(2);
}
