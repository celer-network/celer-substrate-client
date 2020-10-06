"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyring_1 = require("@polkadot/keyring");
const utils_1 = require("./utils");
const util_crypto_1 = require("@polkadot/util-crypto");
const util_1 = require("@polkadot/util");
async function setBalanceLimits(api, _caller, channelId, limits) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .setBalanceLimits(channelId, api.registry.createType("Balance", limits))
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Set Balance Limits:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.SetBalanceLimits [channelId(Hash), limits(Balance)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.setBalanceLimits = setBalanceLimits;
async function disableBalanceLimits(api, _caller, channelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .disableBalanceLimits(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Disable Balance Limits:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.DisableBalanceLimits [channelId(Hash)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.disableBalanceLimits = disableBalanceLimits;
async function enableBalanceLimits(api, _caller, channelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .enableBalanceLimits(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Enable Balance Limits:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.EnableBalanceLimits [channelId(Hash)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.enableBalanceLimits = enableBalanceLimits;
async function openChannel(api, _caller, zeroTotalDeposit = true, msgValue = 0, balanceLimitsEnabled = true, balanceLimits = 1000000, channelPeerBalance0 = 1000, channelPeerBalance1 = 2000, openDeadline = 999999, disputeTimeout = 10, msgValueReceiver = 0) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let openChannelRequestOf = await utils_1.getOpenChannelRequest(api, balanceLimitsEnabled, balanceLimits, channelPeerBalance0, channelPeerBalance1, openDeadline, disputeTimeout, zeroTotalDeposit, msgValueReceiver);
    let channelId = await utils_1.caluculateChannelId(api, openChannelRequestOf);
    console.log(`channel id is ${channelId}`);
    console.log(`channelPeers[0] is bob, channelPeers[1] is alice \n`);
    await utils_1.waitBlockNumber(2);
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
            console.log('\t', `balances.Endowed [createdAccount(AccountId), freeBalance(Balance)]`);
            console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
            console.log('\t', `celerPayModule.OpenChannel [channelId(Hash), channelPeers(Vec<AccountId>), deposits(Vec<Balance>)]`);
            console.log('\t', 'celerPayModule.CreateWallet [walletId(Hash), channelPeers(Vec<AccountId>)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
    return channelId;
}
exports.openChannel = openChannel;
async function deposit(api, _caller, channelId, _receiver, msgValue, transferFromAmount) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let receiver = await utils_1.selectChannelPeer(api, _receiver);
    api.tx.celerPayModule
        .deposit(channelId, receiver, api.registry.createType("Balance", msgValue), api.registry.createType("Balance", transferFromAmount))
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Deposit:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
            console.log('\t', 'celerPaymodule.DepositToChannel [channelId(Hash), channelPeers(Vec<AccountId>), deposits(Vec<Balance>), withdrawals(Vec<Balance>)\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.deposit = deposit;
async function depositInBatch(api, _caller, _channelIds, _receivers, _msgValues, _transferFromAmounts) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let receivers = [];
    for (let i = 0; i < _receivers.length; i++) {
        receivers[i] = await utils_1.selectChannelPeer(api, _receivers[i]);
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
            console.log('\t', 'celerPaymodule.DepositToChannel [channelId(Hash), channelPeers(Vec<AccountId>), deposits(Vec<Balance>), withdrawals(Vec<Balance>)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.depositInBatch = depositInBatch;
async function snapshotStates(api, _caller, signedSimplexStateArray) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .snapshotStates(signedSimplexStateArray)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Snapshot states:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.SnapshotStates [channelId(Hash), seqNums(Vec<u128>)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.snapshotStates = snapshotStates;
async function intendWithdraw(api, _caller, channelId, amount, isZeroHash = true, recipientChannelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    if (isZeroHash === true) {
        let zeroU8a = util_crypto_1.blake2AsU8a(api.registry.createType("u8", 0).toU8a());
        let zeroHash = util_1.u8aToHex(zeroU8a);
        api.tx.celerPayModule
            .intendWithdraw(channelId, amount, zeroHash)
            .signAndSend(caller, ({ events = [], status }) => {
            console.log('Intend Withdraw:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.IntendWithdraw [channelId(Hash), receiver(AccountId), amount(Balance)]\n');
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
    else {
        api.tx.celerPayModule
            .intendWithdraw(channelId, amount, recipientChannelId)
            .signAndSend(caller, ({ events = [], status }) => {
            console.log('Intend Withdraw:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.IntendWithdraw [channelId(Hash), receiver(AccountId), amount(Balance)]\n');
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
}
exports.intendWithdraw = intendWithdraw;
async function confirmWithdraw(api, _caller, channelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .confirmWithdraw(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Confirm Withdraw:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.confirmWithdraw [channelId(Hash), withdrawnAmount(Balance), receiver(AccountId), receipientChannelId(Hash), deposits(Vec<Balance>), withdrawals(Vec<Balance>)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.confirmWithdraw = confirmWithdraw;
async function vetoWithdraw(api, _caller, channelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .vetoWithdraw(channelId)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Veto Withdraw:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.VetoWithdraw [channelId(Hash)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.vetoWithdraw = vetoWithdraw;
async function cooperativeWithdraw(api, _caller, channelId, seqNum, amount, _receiverAccount, withdrawDeadline = 9999999, isZeroHash = true, recipientChannelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let cooperativeWithdrawRequest;
    if (isZeroHash === true) {
        cooperativeWithdrawRequest = await utils_1.getCooperativeWithdrawRequest(api, channelId, seqNum, amount, _receiverAccount, withdrawDeadline, isZeroHash);
    }
    else {
        cooperativeWithdrawRequest = await utils_1.getCooperativeWithdrawRequest(api, channelId, seqNum, amount, _receiverAccount, withdrawDeadline, isZeroHash, recipientChannelId);
    }
    api.tx.celerPayModule
        .cooperativeWithdraw(cooperativeWithdrawRequest)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Cooperative Withdraw:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.CooperativeWithdraw [channelId(Hash), withdrawnAmount(Balance), receiver(AccountId), recipientChannelId(Hash), deposits(Vec<Balnace>), withdrawals(Vec<Balance>), seqNum(u128)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.cooperativeWithdraw = cooperativeWithdraw;
async function intendSettle(api, _caller, signedSimplexStateArray) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .intendSettle(signedSimplexStateArray)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Intend Settle:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.ClearOnePay [channelId(Hash), payId(Hash), peerFrom(AccountId), amount(Balance)]');
            console.log('\t', 'celerPayModule.IntendSettle [channelId(Hash), seqNums(Vec<Hash>)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.intendSettle = intendSettle;
async function clearPays(api, _caller, channelId, _peerFrom, payIdList) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let peerFrom = await utils_1.selectChannelPeer(api, _peerFrom);
    api.tx.celerPayModule
        .clearPays(channelId, peerFrom, payIdList)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Clear Pays:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.ClearOnePay [channelId(Hash), payId(Hash), peerFrom(AccountId), amount(Balance)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.clearPays = clearPays;
async function confirmSettle(api, _caller, channelId) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
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
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.confirmSettle = confirmSettle;
async function cooperativeSettle(api, _caller, settleRequest) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .cooperativeSettle(settleRequest)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Cooperative Settle:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
            console.log('\t', 'celerPayModule.WithdrawFromWallet [walletId(Hash), receiver(AccountId), amount(Balance)]');
            console.log('\t', 'celerPayModule.CooperativeSettle [channelId(Hash), settleBalances(Vec<Balance>)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.cooperativeSettle = cooperativeSettle;
async function depositPool(api, _caller, _receiver, amount) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let receiver = await utils_1.selectChannelPeer(api, _receiver);
    api.tx.celerPayModule
        .depositPool(receiver, amount)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Deposit to Pool:', status.type);
        if (status.isInBlock) {
            console.log('Events: ');
            console.log('\t', `system.NewAccount [newAccount(AccountId)]`);
            console.log('\t', `balances.Endowed [createdAccount(AccountId), freeBalance(Balance)]`);
            console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
            console.log('\t', 'celerPayModule.DepositToPool [receiver(AccountId), amount(Balance)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.depositPool = depositPool;
async function withdrawFromPool(api, _caller, value) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .withdrawFromPool(api.registry.createType("Balance", value))
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Withdraw from Pool:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.WithdrawFromPool [receiver(AccountId), amount(Balance)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.withdrawFromPool = withdrawFromPool;
async function approve(api, _caller, _spender, value) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const bob = keyring.addFromUri('//Bob');
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
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
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
    else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        api.tx.celerPayModule
            .approve(spender, value)
            .signAndSend(caller, ({ events = [], status }) => {
            console.log('Approve:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), amount(Balance)]\n');
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
}
exports.approve = approve;
async function transferFrom(api, _caller, _from, _to, value) {
    await util_crypto_1.cryptoWaitReady();
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const charlie = keyring.addFromUri('//Charlie');
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    let from = await utils_1.selectChannelPeer(api, _from);
    let to;
    if (_to === 'alice' || _to === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        to = api.registry.createType("AccountId", alice.address);
    }
    else if (_to === 'charlie' || _to === '5EYCAe5fKkaKKxUTp36E2KW1q785EuQDLNuCRm7k7opzCMfq') {
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
            console.log('\t', `balances.Endowed [createdAccount(AccountId), freeBalance(Balance)]`);
            console.log('\t', `balances.Transfer [from(AccountId), to(AccountId), value(Balance)]`);
            console.log('\t', 'celerPayModule.Transfer [from(AccountId), receiver(AccountId), amount(Balance)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.transferFrom = transferFrom;
async function increaseAllowance(api, _caller, _spender, addedValue) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const bob = keyring.addFromUri('//Bob');
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
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
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
    else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        api.tx.celerPayModule
            .increaseAllowance(spender, addedValue)
            .signAndSend(caller, ({ events = [], status }) => {
            console.log('Increase allowance:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), increasedAmount(Balance)]\n');
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
}
exports.increaseAllowance = increaseAllowance;
async function decreaseAllowance(api, _caller, _spender, subtractedValue) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const bob = keyring.addFromUri('//Bob');
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
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
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
    else if (_spender === 'celerLedgerId') {
        let spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
        api.tx.celerPayModule
            .decreaseAllowance(spender, subtractedValue)
            .signAndSend(caller, ({ events = [], status }) => {
            console.log('Decrease allowance:', status.type);
            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events: ');
                console.log('\t', 'celerPayModule.Approval [owner(AccountId), spender(AccountId), decreasedAmount(Balance)]\n');
                events.forEach(({ event: { data, method, section } }) => {
                    const [error] = data;
                    if (error.isModule) {
                        const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                        console.log(`${section}: error message is ${name}, ${documentation}`);
                    }
                    else {
                        console.log('\t', `${section}.${method}`, data.toString());
                    }
                });
            }
        });
    }
}
exports.decreaseAllowance = decreaseAllowance;
async function resolvePaymentByConditions(api, _caller, resolvePayRequest) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .resolvePaymentByConditions(resolvePayRequest)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Resolve payment by conditions:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.PayInfoUpdate [payId(Hash), amount(Balance), resolveDeadline(BlockNumber)');
            console.log('\t', 'celerPayModule.ResolvePayment [payId(Hash), amount(Balance), resolveDeadline(BlockNumber)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.resolvePaymentByConditions = resolvePaymentByConditions;
async function resolvePaymentByVouchedResult(api, _caller, voucehdPayResult) {
    let caller = await utils_1.selectChannelPeerKeyring(_caller);
    api.tx.celerPayModule
        .resolvePaymentByVouchedResult(voucehdPayResult)
        .signAndSend(caller, ({ events = [], status }) => {
        console.log('Resolve payment by vouched result:', status.type);
        if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            console.log('Events: ');
            console.log('\t', 'celerPayModule.ResolvePayment [payId(Hash), amount(Balance), resolveDeadline(BlockNumber)]\n');
            events.forEach(({ event: { data, method, section } }) => {
                const [error] = data;
                if (error.isModule) {
                    const { documentation, name, section } = api.registry.findMetaError(error.asModule);
                    console.log(`${section}: error message is ${name}, ${documentation}`);
                }
                else {
                    console.log('\t', `${section}.${method}`, data.toString());
                }
            });
        }
    });
}
exports.resolvePaymentByVouchedResult = resolvePaymentByVouchedResult;
async function getCelerLedgerId(api) {
    const celerLedgerId = await api.rpc.celerPayModule.getCelerLedgerId();
    return celerLedgerId.toHuman();
}
exports.getCelerLedgerId = getCelerLedgerId;
async function getSettleFinalizedTime(api, channelId) {
    const settleFinalizedTime = await api.rpc.celerPayModule.getSettleFinalizedTime(channelId);
    return settleFinalizedTime.toNumber();
}
exports.getSettleFinalizedTime = getSettleFinalizedTime;
async function getChannelStatus(api, channelId) {
    const channelStatus = await api.rpc.celerPayModule.getChannelStatus(channelId);
    return channelStatus.toNumber();
}
exports.getChannelStatus = getChannelStatus;
async function getCooperativeWithdrawSeqNum(api, channelId) {
    const seqNum = await api.rpc.celerPayModule.getCooperativeWithdrawSeqNum(channelId);
    return seqNum.number.toNumber();
}
exports.getCooperativeWithdrawSeqNum = getCooperativeWithdrawSeqNum;
async function getTotalBalance(api, channelId) {
    const totalBalance = await api.rpc.celerPayModule.getTotalBalance(channelId);
    return totalBalance.amount.toNumber();
}
exports.getTotalBalance = getTotalBalance;
async function getBalanceMap(api, channelId) {
    const [channelPeers, deposits, withdrawals] = await api.rpc.celerPayModule.getBalanceMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [deposits[0].amount.toNumber(), deposits[1].amount.toNumber()],
        [withdrawals[0].amount.toNumber(), deposits[1].amount.toNumber()]
    ];
}
exports.getBalanceMap = getBalanceMap;
async function getDisputeTimeOut(api, channelId) {
    const disputeTimeOut = await api.rpc.celerPayModule.getDisputTimeOut(channelId);
    return disputeTimeOut.toNumber();
}
exports.getDisputeTimeOut = getDisputeTimeOut;
async function getStateSeqNumMap(api, channelId) {
    const [channelPeers, seqNums] = await api.rpc.celerPayModule.getStateSeqNumMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [seqNums[0].number.toNumber(), seqNums[1].number.toNumber()]
    ];
}
exports.getStateSeqNumMap = getStateSeqNumMap;
async function getTransferOutMap(api, channelId) {
    const [channelPeers, transferOuts] = await api.rpc.celerPayModule.getTransferOutMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [transferOuts[0].amount.toNumber(), transferOuts[1].amount.toNumber()]
    ];
}
exports.getTransferOutMap = getTransferOutMap;
async function getNextPayIdListHashMap(api, channelId) {
    const [channelPeers, nextPayIdListsHashs] = await api.rpc.celerPayModule.getNextPayIdListHashMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [nextPayIdListsHashs[0].toHex(), nextPayIdListsHashs[1].toHex()]
    ];
}
exports.getNextPayIdListHashMap = getNextPayIdListHashMap;
async function getLastPayResolveDeadlineMap(api, channelId) {
    const [channelPeers, lastPayResolveDeadlines] = await api.rpc.celerPayModule.getLastPayResolveDeadlineMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [lastPayResolveDeadlines[0].toNumber(), lastPayResolveDeadlines[1].toNumber()]
    ];
}
exports.getLastPayResolveDeadlineMap = getLastPayResolveDeadlineMap;
async function getPendingPayOutMap(api, channelId) {
    const [channelPeers, pendingPayOuts] = await api.rpc.celerPayModule.getPendingPayOutMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [pendingPayOuts[0].amount.toNumber(), pendingPayOuts[1].amount.toNumber()]
    ];
}
exports.getPendingPayOutMap = getPendingPayOutMap;
async function getWithdrawIntent(api, channelId) {
    const [receiver, withdrawIntentAmount, withdrawIntentRequestTime, recipientChannelId] = await api.rpc.celerPayModule.getWithdrawIntent(channelId);
    return [
        receiver.toHuman(),
        withdrawIntentAmount.amount.toNumber(),
        withdrawIntentRequestTime.toNumber(),
        recipientChannelId.toHex()
    ];
}
exports.getWithdrawIntent = getWithdrawIntent;
async function getChannelStatusNum(api, channelStatus) {
    const statusNums = await api.rpc.celerPayModule.getChannelStatusNum(channelStatus);
    return statusNums.toHuman();
}
exports.getChannelStatusNum = getChannelStatusNum;
async function getBalanceLimits(api, channelId) {
    const balanceLimits = await api.rpc.celerPayModule.getBalanceLimits(channelId);
    return balanceLimits.amount.toNumber();
}
exports.getBalanceLimits = getBalanceLimits;
async function getBalanceLimitsEnabled(api, channelId) {
    const balanceLimitsEnabled = await api.rpc.celerPayModule.getBalanceLimitsEnabled(channelId);
    return balanceLimitsEnabled.toHuman();
}
exports.getBalanceLimitsEnabled = getBalanceLimitsEnabled;
async function getPeersMigrationInfo(api, channelId) {
    const [channelPeers, deposits, withdrawals, seqNums, transferOuts, pendingPayOuts] = await api.rpc.celerPayModule.getPeersMigrationInfo(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [deposits[0].amount.toNumber(), deposits[1].amount.toNumber()],
        [withdrawals[0].amount.toNumber(), withdrawals[1].amount.toNumber()],
        [seqNums[0].number.toNumber(), seqNums[1].number.toNumber()],
        [transferOuts[0].amount.toNumber(), transferOuts[1].amount.toNumber()],
        [pendingPayOuts[0].amount.toNumber(), pendingPayOuts[1].amount.toNumber()]
    ];
}
exports.getPeersMigrationInfo = getPeersMigrationInfo;
async function getCelerWalletId(api) {
    const celerWalletId = await api.rpc.celerPayModule.getCelerWalletId();
    return celerWalletId.toHex();
}
exports.getCelerWalletId = getCelerWalletId;
async function getWalletOwners(api, walletId) {
    const walletOwners = await api.rpc.celerPayModule.getWalletOwners(walletId);
    return [walletOwners[0].toHuman(), walletOwners[1].toHuman()];
}
exports.getWalletOwners = getWalletOwners;
async function getPoolId(api) {
    const poolId = await api.rpc.celerPayModule.getPoolId();
    return poolId.toHuman();
}
exports.getPoolId = getPoolId;
async function getAllowance(api, owner, spender) {
    const allowance = await api.rpc.celerPayModule.getAllowance(owner, spender);
    return allowance.amount.toNumber();
}
exports.getAllowance = getAllowance;
async function getPayResolverId(api) {
    const payResolverId = await api.rpc.celerPayModule.getPayResolverId();
    return payResolverId.toHuman();
}
exports.getPayResolverId = getPayResolverId;
async function calculatePayId(api, payHash) {
    const payId = await api.rpc.celerPayModule.calculatePayId(payHash);
    return payId.toHex();
}
exports.calculatePayId = calculatePayId;
async function emitCelerLedgerId(api) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitCelerLedgerId = emitCelerLedgerId;
async function emitChannelInfo(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitChannelInfo = emitChannelInfo;
async function emitSettleFinalizedTime(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    });
    await utils_1.waitBlockNumber(2);
}
exports.emitSettleFinalizedTime = emitSettleFinalizedTime;
async function emitCooperativeWithdrawSeqNum(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitCooperativeWithdrawSeqNum = emitCooperativeWithdrawSeqNum;
async function emitTotalBalance(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitTotalBalance = emitTotalBalance;
async function emitBalanceMap(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitBalanceMap = emitBalanceMap;
async function emitDisputeTimeOut(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitDisputeTimeOut = emitDisputeTimeOut;
async function emitStateSeqNumMap(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitStateSeqNumMap = emitStateSeqNumMap;
async function emitTransferOutMap(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitTransferOutMap = emitTransferOutMap;
async function emitNextPayIdListHashMap(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitNextPayIdListHashMap = emitNextPayIdListHashMap;
async function emitLastPayResolveDeadlineMap(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitLastPayResolveDeadlineMap = emitLastPayResolveDeadlineMap;
async function emitPendingPayOutMap(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitPendingPayOutMap = emitPendingPayOutMap;
async function emitWithdrawIntent(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitWithdrawIntent = emitWithdrawIntent;
async function emitChannelStatusNum(api, channelStatus) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitChannelStatusNum = emitChannelStatusNum;
async function emitPeersMigrationInfo(api, channelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitPeersMigrationInfo = emitPeersMigrationInfo;
async function emitCelerWalletId(api) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitCelerWalletId = emitCelerWalletId;
async function emitWalletInfo(api, walletId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitWalletInfo = emitWalletInfo;
async function emitPoolId(api) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitPoolId = emitPoolId;
async function emitPoolBalance(api, _owner) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let owner;
    if (_owner === 'alice' || _owner === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        owner = api.registry.createType("AccountId", alice.address);
    }
    else if (_owner === 'bob' || _owner === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
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
    await utils_1.waitBlockNumber(2);
}
exports.emitPoolBalance = emitPoolBalance;
async function emitAllowance(api, _owner, _spender) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let owner;
    if (_owner === 'alice' || _owner === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        owner = api.registry.createType("AccountId", alice.address);
    }
    else if (_owner === 'bob' || _owner === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
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
    }
    else if (_spender === 'celerLedgerId') {
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
    await utils_1.waitBlockNumber(2);
}
exports.emitAllowance = emitAllowance;
async function emitPayResolverId(api) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
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
    await utils_1.waitBlockNumber(2);
}
exports.emitPayResolverId = emitPayResolverId;
