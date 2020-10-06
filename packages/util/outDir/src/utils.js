"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyring_1 = require("@polkadot/keyring");
const util_1 = require("@polkadot/util");
const types_1 = require("@polkadot/types");
const util_crypto_1 = require("@polkadot/util-crypto");
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
async function selectChannelPeerKeyring(_channelPeer) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    if (_channelPeer === 'alice' || _channelPeer === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        return alice;
    }
    else if (_channelPeer === 'bob' || _channelPeer === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
        return bob;
    }
    else {
        throw new Error('Channel Peers is alice and bob');
    }
}
exports.selectChannelPeerKeyring = selectChannelPeerKeyring;
async function selectChannelPeer(api, _channelPeer) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    if (_channelPeer === 'alice' || _channelPeer === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        return api.registry.createType("AccountId", alice.address);
    }
    else if (_channelPeer === 'bob' || _channelPeer === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
        return api.registry.createType("AccountId", bob.address);
    }
    else {
        throw new Error('Channel Peers is alice and bob');
    }
}
exports.selectChannelPeer = selectChannelPeer;
async function caluculateChannelId(api, openRequest) {
    let paymentChannelInitializer = openRequest.channelInitializer;
    let encoded1 = util_1.u8aConcat(paymentChannelInitializer.balanceLimitsEnabled.toU8a(), paymentChannelInitializer.balanceLimits.toU8a(), paymentChannelInitializer.initDistribution.token.tokenType.toU8a(), paymentChannelInitializer.initDistribution.distribution[0].account.toU8a(), paymentChannelInitializer.initDistribution.distribution[0].amt.toU8a(), paymentChannelInitializer.initDistribution.distribution[1].account.toU8a(), paymentChannelInitializer.initDistribution.distribution[1].amt.toU8a(), paymentChannelInitializer.openDeadline.toU8a(), paymentChannelInitializer.disputeTimeout.toU8a(), paymentChannelInitializer.msgValueReceiver.toU8a());
    let hash1 = util_crypto_1.blake2AsU8a(encoded1);
    let nonce = api.registry.createType("Hash", util_1.u8aToHex(hash1));
    let channelPeers = await getChannelPeers(api);
    let encoded2 = util_1.u8aConcat(channelPeers[0].toU8a(), channelPeers[1].toU8a(), nonce.toU8a());
    let hash2 = util_crypto_1.blake2AsU8a(encoded2);
    let channelId = util_1.u8aToHex(hash2);
    return channelId;
}
exports.caluculateChannelId = caluculateChannelId;
async function getOpenChannelRequest(api, balanceLimitsEnabled, balanceLimits, channelPeerBalance0, channelPeerBalance1, openDeadline, disputeTimeout, zeroTotalDeposit, msgValueReceiver) {
    let channelPeers = await getChannelPeers(api);
    let _tokenType;
    (function (_tokenType) {
        _tokenType[_tokenType["Invalid"] = 0] = "Invalid";
        _tokenType[_tokenType["Celer"] = 1] = "Celer";
    })(_tokenType || (_tokenType = {}));
    let tokenType = api.registry.createType("TokenType", _tokenType.Celer);
    let tokenInfo = {
        tokenType: tokenType
    };
    let accountAmtPair1;
    let accountAmtPair2;
    let tokenDistribution;
    if (zeroTotalDeposit === true) {
        let _accountAmtPair1 = {
            account: new types_1.Option(api.registry, "AccountId", channelPeers[0]),
            amt: api.registry.createType("Balance", 0),
        };
        accountAmtPair1 = api.registry.createType("AccountAmtPair", _accountAmtPair1);
        let _accountAmtPair2 = {
            account: new types_1.Option(api.registry, "AccountId", channelPeers[1]),
            amt: api.registry.createType("Balance", 0),
        };
        accountAmtPair2 = api.registry.createType("AccountAmtPair", _accountAmtPair2);
        tokenDistribution = {
            token: api.registry.createType("TokenInfo", tokenInfo),
            distribution: new types_1.Vec(api.registry, "AccountAmtPair", [accountAmtPair1, accountAmtPair2]),
        };
    }
    else {
        let _accountAmtPair1 = {
            account: new types_1.Option(api.registry, "AccountId", channelPeers[0]),
            amt: api.registry.createType("Balance", channelPeerBalance0),
        };
        accountAmtPair1 = api.registry.createType("AccountAmtPair", _accountAmtPair1);
        let _accountAmtPair2 = {
            account: new types_1.Option(api.registry, "AccountId", channelPeers[1]),
            amt: api.registry.createType("Balance", channelPeerBalance1),
        };
        accountAmtPair2 = api.registry.createType("AccountAmtPair", _accountAmtPair2);
        tokenDistribution = {
            token: api.registry.createType("TokenInfo", tokenInfo),
            distribution: new types_1.Vec(api.registry, "AccountAmtPair", [accountAmtPair1, accountAmtPair2]),
        };
    }
    let _paymentChannelInitializer = {
        balanceLimitsEnabled: api.registry.createType("bool", balanceLimitsEnabled),
        balanceLimits: new types_1.Option(api.registry, "Balance", api.registry.createType("Balance", balanceLimits)),
        initDistribution: api.registry.createType("TokenDistribution", tokenDistribution),
        openDeadline: api.registry.createType("BlockNumber", openDeadline),
        disputeTimeout: api.registry.createType("BlockNumber", disputeTimeout),
        msgValueReceiver: api.registry.createType("u8", msgValueReceiver),
    };
    let paymentChannelInitializer = api.registry.createType("PaymentChannelInitializer", _paymentChannelInitializer);
    let encoded = util_1.u8aConcat(paymentChannelInitializer.balanceLimitsEnabled.toU8a(), paymentChannelInitializer.balanceLimits.toU8a(), paymentChannelInitializer.initDistribution.token.tokenType.toU8a(), paymentChannelInitializer.initDistribution.distribution[0].account.toU8a(), paymentChannelInitializer.initDistribution.distribution[0].amt.toU8a(), paymentChannelInitializer.initDistribution.distribution[1].account.toU8a(), paymentChannelInitializer.initDistribution.distribution[1].amt.toU8a(), paymentChannelInitializer.openDeadline.toU8a(), paymentChannelInitializer.disputeTimeout.toU8a(), paymentChannelInitializer.msgValueReceiver.toU8a());
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, { withType: true }));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, { withType: true }));
    let _openChannelRequestOf = {
        channelInitializer: paymentChannelInitializer,
        sigs: new types_1.Vec(api.registry, "MultiSignature", [sig1, sig2]),
    };
    let openChannelRequestOf = api.registry.createType("OpenChannelRequestOf", _openChannelRequestOf);
    return openChannelRequestOf;
}
exports.getOpenChannelRequest = getOpenChannelRequest;
async function getCooperativeWithdrawRequest(api, channelId, seqNum, amount, _receiverAccount, withdrawDeadline, isZeroHash, recipientChannelId) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let receiverAccount;
    if (_receiverAccount === 'alice' || _receiverAccount === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        receiverAccount = api.registry.createType("AccountId", alice.address);
    }
    else if (_receiverAccount === 'bob' || _receiverAccount === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
        receiverAccount = api.registry.createType("AccountId", bob.address);
    }
    let _accountAmtPair = {
        account: new types_1.Option(api.registry, "AccountId", receiverAccount),
        amt: api.registry.createType("Balance", amount),
    };
    let accountAmtPair = api.registry.createType("AccountAmtPair", _accountAmtPair);
    let cooperativeWithdrawInfo;
    if (isZeroHash === true) {
        let zeroU8a = util_crypto_1.blake2AsU8a(api.registry.createType("u8", 0).toU8a());
        let zeroHash = util_1.u8aToHex(zeroU8a);
        let _cooperativeWithdrawInfo = {
            channelId: channelId,
            seqNum: seqNum,
            withdraw: accountAmtPair,
            withdrawDeadline: withdrawDeadline,
            recipientChannelId: zeroHash
        };
        cooperativeWithdrawInfo = api.registry.createType("CooperativeWithdrawInfo", _cooperativeWithdrawInfo);
    }
    else {
        let _cooperativeWithdrawInfo = {
            channelId: channelId,
            seqNum: api.registry.createType("u128", seqNum),
            withdraw: accountAmtPair,
            withdrawDeadline: api.registry.createType("BlockNumber", withdrawDeadline),
            recipientChannelId: recipientChannelId
        };
        cooperativeWithdrawInfo = api.registry.createType("CooperativeWithdrawInfo", _cooperativeWithdrawInfo);
    }
    let encoded = util_1.u8aConcat(cooperativeWithdrawInfo.channelId.toU8a(), cooperativeWithdrawInfo.seqNum.toU8a(), cooperativeWithdrawInfo.withdraw.account.toU8a(), cooperativeWithdrawInfo.withdraw.amt.toU8a(), cooperativeWithdrawInfo.withdrawDeadline.toU8a(), cooperativeWithdrawInfo.recipientChannelId.toU8a());
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, { withType: true }));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, { withType: true }));
    let _cooperativeWithdrawRequest = {
        withdrawInfo: cooperativeWithdrawInfo,
        sigs: new types_1.Vec(api.registry, "MultiSignature", [sig1, sig2])
    };
    let cooperativeWithdrawRequest = api.registry.createType("CooperativeWithdrawRequestOf", _cooperativeWithdrawRequest);
    return cooperativeWithdrawRequest;
}
exports.getCooperativeWithdrawRequest = getCooperativeWithdrawRequest;
async function getSignedSimplexStateArray(api, channelIds, seqNums = [1, 1], transferAmounts, lastPayResolveDeadlines, payIdLists, totalPendingAmounts = [0, 0], signers) {
    let peerFroms = await getChannelPeers(api);
    let signedSimplexStates = [];
    for (let i = 0; i < channelIds.length; i++) {
        if (seqNums[i] > 0) { // co-signed non-null state
            signedSimplexStates[i] = await getCoSignedSimplexState(api, channelIds[i], peerFroms[i], seqNums[i], transferAmounts[i], payIdLists[i], lastPayResolveDeadlines[i], totalPendingAmounts[i]);
        }
        else if (seqNums[i] === 0) {
            signedSimplexStates[i] = await getSingleSignedSimplexState(api, channelIds[i], signers);
        }
    }
    let _signedSimplexStateArray = {
        signedSimplexStates: new types_1.Vec(api.registry, "SignedSimplexState", signedSimplexStates)
    };
    let signedSimplexStateArray = api.registry.createType("SignedSimplexStateArrayOf", _signedSimplexStateArray);
    return signedSimplexStateArray;
}
exports.getSignedSimplexStateArray = getSignedSimplexStateArray;
async function getCooperativeSettleRequest(api, channelId, seqNum, settleAmounts, settleDeadline = 999999) {
    let channelPeers = await getChannelPeers(api);
    let _accountAmtPair1 = {
        account: new types_1.Option(api.registry, "AccountId", channelPeers[0]),
        amt: api.registry.createType("Balance", settleAmounts[0])
    };
    let accountAmtPair1 = api.registry.createType("AccountAmtPair", _accountAmtPair1);
    let _accountAmtPair2 = {
        account: new types_1.Option(api.registry, "AccountId", channelPeers[1]),
        amt: api.registry.createType("Balance", settleAmounts[1])
    };
    let accountAmtPair2 = api.registry.createType("AccountAmtPair", _accountAmtPair2);
    let _settleInfo = {
        channelId: channelId,
        seqNum: api.registry.createType("u128", seqNum),
        settleBalance: new types_1.Vec(api.registry, "AccountAmtPair", [accountAmtPair1, accountAmtPair2]),
        settleDeadline: api.registry.createType("BlockNumber", settleDeadline),
    };
    let settleInfo = api.registry.createType("CooperativeSettleInfo", _settleInfo);
    let encoded = util_1.u8aConcat(settleInfo.channelId.toU8a(), settleInfo.seqNum.toU8a(), settleInfo.settleBalance[0].account.toU8a(), settleInfo.settleBalance[0].amt.toU8a(), settleInfo.settleBalance[1].account.toU8a(), settleInfo.settleBalance[1].amt.toU8a(), settleInfo.settleDeadline.toU8a());
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, { withType: true }));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, { withType: true }));
    let _cooperativeSettleRequest = {
        settleInfo: settleInfo,
        sigs: new types_1.Vec(api.registry, "Signature", [sig1, sig2])
    };
    let cooperativeSettleRequest = api.registry.createType("CooperativeSettleRequestOf", _cooperativeSettleRequest);
    return cooperativeSettleRequest;
}
exports.getCooperativeSettleRequest = getCooperativeSettleRequest;
async function getResolvePayByCondtionsRequest(api, condPay, hashPreimages = []) {
    let _resolvePaymentConditionsRequest = {
        condPay: condPay,
        hashPreimages: new types_1.Vec(api.registry, "Hash", hashPreimages)
    };
    let resolvePaymentConditionsRequest = api.registry.createType("ResolvePaymentConditionsRequestOf", _resolvePaymentConditionsRequest);
    return resolvePaymentConditionsRequest;
}
exports.getResolvePayByCondtionsRequest = getResolvePayByCondtionsRequest;
async function getVouchedCondPayResult(api, condPay, amount) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const src = keyring.addFromUri('//Dave');
    const dest = keyring.addFromUri('//Eve');
    let condPayResult = {
        condPay: condPay,
        amount: api.registry.createType("Balance", amount)
    };
    let encoded = await encodeCondPay(condPay);
    let _vouchedCondPayResult = {
        condPayResult: api.registry.createType("CondPayResult", condPayResult),
        sigOfSrc: api.registry.createType("MultiSignature", src.sign(encoded, { withType: true })),
        sigOfDest: api.registry.createType("MultiSignature", dest.sign(encoded, { withType: true }))
    };
    let vouchedCondPayResult = api.registry.createType("VouchedCondPayResultOf", _vouchedCondPayResult);
    return vouchedCondPayResult;
}
exports.getVouchedCondPayResult = getVouchedCondPayResult;
async function getPayIdListInfo(api, payAmounts, payConditions = null) {
    // 1-d array of PayIdList
    let payIdLists = [];
    // 1-d array of PayIdList bytes, for clearing pays on CelerLedger
    let payIdListHashArray = [];
    // 2-d array of pay bytes in list of PayIdList of a simplex channel,
    // for resolving pays with PayRegistry.
    // Index is consistent with payAmounts.
    let condPayArray = [];
    // total pending amount in payAmounts/this state
    let totalPendingAmount = 0;
    for (let i = 0; i < payAmounts.length; i++) {
        condPayArray[i] = [];
    }
    for (let i = payAmounts.length - 1; i >= 0; i--) {
        let payIds = [];
        for (let j = 0; j < payAmounts[i].length; j++) {
            totalPendingAmount += payAmounts[i][j];
            let conditions = [];
            if (payConditions === null) {
                // use true boolean condition by default
                conditions = [await getCondition(api, 1)];
            }
            else {
                if (payConditions[i][j]) {
                    conditions = [await getCondition(api, 1)];
                }
                else {
                    conditions = [await getCondition(api, 2)];
                }
            }
            condPayArray[i][j] = await getConditionalPay(api, conditions, payAmounts[i][j]);
            let encodedCondPay = await encodeCondPay(condPayArray[i][j]);
            let hash = util_crypto_1.blake2AsU8a(encodedCondPay);
            let payHash = util_1.u8aToHex(hash);
            payIds[j] = await calculatePayId(api, payHash);
        }
        let _payIdList;
        if (i === payAmounts.length - 1) {
            _payIdList = {
                payIds: new types_1.Vec(api.registry, "Hash", payIds),
                nextListHash: new types_1.Option(api.registry, "Hash", null)
            };
        }
        else {
            _payIdList = {
                payIds: new types_1.Vec(api.registry, "Hash", payIds),
                nextListHash: new types_1.Option(api.registry, "Hash", payIdListHashArray[i + 1])
            };
        }
        payIdLists[i] = api.registry.createType("PayIdList", _payIdList);
        let encoded = payIdLists[i].payIds[0].toU8a();
        for (let k = 1; k < payIdLists[i].payIds.length; k++) {
            encoded = util_1.u8aConcat(encoded, payIdLists[i].payIds[k].toU8a());
        }
        encoded = util_1.u8aConcat(encoded, payIdLists[i].nextListHash.toU8a());
        let hash = util_crypto_1.blake2AsU8a(encoded);
        payIdListHashArray[i] = util_1.u8aToHex(hash);
    }
    return {
        payIdLists,
        condPayArray,
        payIdListHashArray,
        totalPendingAmount
    };
}
exports.getPayIdListInfo = getPayIdListInfo;
async function getCoSignedIntendSettle(api, channelIds, payAmountsArray, seqNums, lastPayResolverDeadlines, trasnferAmounts) {
    let headPayIdLists = [];
    let condPays = [];
    let payIdListArrays = [];
    let totalPendingAmounts = [];
    for (let i = 0; i < channelIds.length; i++) {
        const payIdListInfo = await getPayIdListInfo(api, payAmountsArray[i], null);
        headPayIdLists[i] = payIdListInfo.payIdLists[0];
        condPays[i] = payIdListInfo.condPayArray;
        payIdListArrays[i] = payIdListInfo.payIdLists;
        totalPendingAmounts[i] = payIdListInfo.totalPendingAmount;
    }
    const signedSimplexStateArray = await getSignedSimplexStateArray(api, channelIds, seqNums, trasnferAmounts, lastPayResolverDeadlines, headPayIdLists, totalPendingAmounts);
    return {
        signedSimplexStateArray,
        lastPayResolverDeadlines,
        condPays,
        payIdListArrays
    };
}
exports.getCoSignedIntendSettle = getCoSignedIntendSettle;
async function getConditions(api, type) {
    switch (type) {
        case 0: // [conditionHashLock, booleanConditionFalse, booleanConditionFalse]
            return [
                await getCondition(api, 0),
                await getCondition(api, 2),
                await getCondition(api, 2)
            ];
        case 1: // [conditionHashLock, booleanConditionFalse, booleanConditionTrue]
            return [
                await getCondition(api, 0),
                await getCondition(api, 2),
                await getCondition(api, 1)
            ];
        case 2: // [conditionHashLock, booleanCondtionTrue, booleanCondtionFalse]
            return [
                await getCondition(api, 0),
                await getCondition(api, 1),
                await getCondition(api, 2)
            ];
        case 3: // [conditionHashLock, booleanConditionTrue, booleanConditiontrue]
            return [
                await getCondition(api, 0),
                await getCondition(api, 1),
                await getCondition(api, 1)
            ];
        case 4: // [conditionHashLock, booleanConditionTrue, conditionHashLock]
            return [
                await getCondition(api, 0),
                await getCondition(api, 1),
                await getCondition(api, 0)
            ];
        case 5: // [conditionHashLock, numericCondition10, numericCondition25]
            return [
                await getCondition(api, 0),
                await getCondition(api, 3),
                await getCondition(api, 4)
            ];
        case 6: // [conditionHashLock]
            return [
                await getCondition(api, 0)
            ];
    }
}
exports.getConditions = getConditions;
async function calculatePayId(api, payHash) {
    // encode(payHash, payResolver AccountId)
    let encoded = util_1.u8aConcat(api.registry.createType('Hash', payHash).toU8a(), api.registry.createType('AccountId', '0x6d6f646c5265736f6c7665720000000000000000000000000000000000000000').toU8a());
    let hash = util_crypto_1.blake2AsU8a(encoded);
    let payId = util_1.u8aToHex(hash);
    return payId;
}
async function getCondition(api, type) {
    let _conditionType;
    (function (_conditionType) {
        _conditionType[_conditionType["HashLock"] = 0] = "HashLock";
        _conditionType[_conditionType["BooleanRuntimeModule"] = 1] = "BooleanRuntimeModule";
        _conditionType[_conditionType["NumericRuntimeModule"] = 2] = "NumericRuntimeModule";
    })(_conditionType || (_conditionType = {}));
    if (type === 0) {
        let hash = util_crypto_1.blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = util_1.u8aToHex(hash);
        let _conditionHashLock = {
            conditionType: api.registry.createType("ConditionType", _conditionType.HashLock),
            hashLock: new types_1.Option(api.registry, "Hash", hash_1),
            callIsFinalized: new types_1.Option(api.registry, "Call", null),
            callGetOutcome: new types_1.Option(api.registry, "Call", null),
            numericAppNum: new types_1.Option(api.registry, "u32", null),
            numericSessionId: new types_1.Option(api.registry, "Hash", null),
            argsQueryFinalization: new types_1.Option(api.registry, "Bytes", null),
            argsQueryOutcome: new types_1.Option(api.registry, "Bytes", null)
        };
        let conditionHashLock = api.registry.createType("Condition", _conditionHashLock);
        return conditionHashLock;
    }
    else if (type === 1) {
        let hash = util_crypto_1.blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = util_1.u8aToHex(hash);
        let callIsFinalizedTrue = api.tx.mockBooleanCondition.isFinalized(hash_1, 1);
        let callGetOutcomeTrue = api.tx.mockBooleanCondition.getOutcome(hash_1, 1);
        let _booleanConditionTrue = {
            conditionType: api.registry.createType("ConditionType", _conditionType.BooleanRuntimeModule),
            hashLock: new types_1.Option(api.registry, "Hash", null),
            callIsFinalized: new types_1.Option(api.registry, "Call", callIsFinalizedTrue),
            callGetOutcome: new types_1.Option(api.registry, "Call", callGetOutcomeTrue),
            numericAppNum: new types_1.Option(api.registry, "u32", null),
            numericSessionId: new types_1.Option(api.registry, "Hash", null),
            argsQueryFinalization: new types_1.Option(api.registry, "Bytes", null),
            argsQueryOutcome: new types_1.Option(api.registry, "Bytes", null)
        };
        let booleanConditionTrue = api.registry.createType("Condition", _booleanConditionTrue);
        return booleanConditionTrue;
    }
    else if (type === 2) {
        let hash = util_crypto_1.blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = util_1.u8aToHex(hash);
        let callIsFinalizedTrue = api.tx.mockBooleanCondition.isFinalized(hash_1, 1);
        let callGetOutcomeFalse = api.tx.mockBooleanCondition.getOutcome(hash_1, 0);
        let _booleanConditionFalse = {
            conditionType: api.registry.createType("ConditionType", _conditionType.BooleanRuntimeModule),
            hashLock: new types_1.Option(api.registry, "Hash", null),
            callIsFinalized: new types_1.Option(api.registry, "Call", callIsFinalizedTrue),
            callGetOutcome: new types_1.Option(api.registry, "Call", callGetOutcomeFalse),
            numericAppNum: new types_1.Option(api.registry, "u32", null),
            numericSessionId: new types_1.Option(api.registry, "Hash", null),
            argsQueryFinalization: new types_1.Option(api.registry, "Bytes", null),
            argsQueryOutcome: new types_1.Option(api.registry, "Bytes", null)
        };
        let booleanConditionFalse = api.registry.createType("Condition", _booleanConditionFalse);
        return booleanConditionFalse;
    }
    else if (type === 3) {
        let hash = util_crypto_1.blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = util_1.u8aToHex(hash);
        let u8_1 = api.registry.createType("u8", 1);
        let hex1 = util_1.u8aToHex(u8_1.toU8a());
        let bytes1 = api.registry.createType("Bytes", hex1);
        let u32_10 = api.registry.createType("u32", 10);
        let hex10 = util_1.u8aToHex(u32_10.toU8a());
        let bytes10 = api.registry.createType("Bytes", hex10);
        let _numericCondition10 = {
            conditionType: api.registry.createType("ConditionType", _conditionType.NumericRuntimeModule),
            hashLock: new types_1.Option(api.registry, "Hash", null),
            callIsFinalized: new types_1.Option(api.registry, "Call", null),
            callGetOutcome: new types_1.Option(api.registry, "Call", null),
            numericAppNum: new types_1.Option(api.registry, "u32", api.registry.createType("u32", 0)),
            numericSessionId: new types_1.Option(api.registry, "Hash", hash_1),
            argsQueryFinalization: new types_1.Option(api.registry, "Bytes", bytes1),
            argsQueryOutcome: new types_1.Option(api.registry, "Bytes", bytes10)
        };
        let numericCondition10 = api.registry.createType("Condition", _numericCondition10);
        return numericCondition10;
    }
    else {
        let hash = util_crypto_1.blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = util_1.u8aToHex(hash);
        let u8_1 = api.registry.createType("u8", 1);
        let hex1 = util_1.u8aToHex(u8_1.toU8a());
        let bytes1 = api.registry.createType("Bytes", hex1);
        let u32_25 = api.registry.createType("u32", 25);
        let hex25 = util_1.u8aToHex(u32_25.toU8a());
        let bytes25 = api.registry.createType("Bytes", hex25);
        let _numericCondition25 = {
            conditionType: api.registry.createType("ConditionType", _conditionType.NumericRuntimeModule),
            hashLock: new types_1.Option(api.registry, "Hash", null),
            callIsFinalized: new types_1.Option(api.registry, "Call", null),
            callGetOutcome: new types_1.Option(api.registry, "Call", null),
            numericAppNum: new types_1.Option(api.registry, "u32", api.registry.createType("u32", 0)),
            numericSessionId: new types_1.Option(api.registry, "Hash", hash_1),
            argsQueryFinalization: new types_1.Option(api.registry, "Bytes", bytes1),
            argsQueryOutcome: new types_1.Option(api.registry, "Bytes", bytes25),
        };
        let numericCondition25 = api.registry.createType("Condition", _numericCondition25);
        return numericCondition25;
    }
}
exports.getCondition = getCondition;
async function getConditionalPay(api, conditions, maxAmount, payTimestamp = 1, resolveDeadline = 999999, resolveTimeout = 5, logicType = 0) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const src = keyring.addFromUri('//Dave');
    const dest = keyring.addFromUri('//Eve');
    let transferToPeer = await getTokenTransfer(api, maxAmount);
    let transferFunc = await getTransferFunc(api, transferToPeer, logicType);
    let _conditionalPay = {
        payTimestamp: api.registry.createType("Moment", payTimestamp),
        src: api.registry.createType("AccountId", src.address),
        dest: api.registry.createType("AccountId", dest.address),
        conditions: new types_1.Vec(api.registry, "Condition", conditions),
        transferFunc: transferFunc,
        resolveDeadline: api.registry.createType("BlockNumber", resolveDeadline),
        resolveTimeout: api.registry.createType("BlockNumber", resolveTimeout)
    };
    let condPay = api.registry.createType("ConditionalPay", _conditionalPay);
    return condPay;
}
exports.getConditionalPay = getConditionalPay;
async function getTransferFunc(api, tokenTransfer, logicType) {
    let _logicType;
    (function (_logicType) {
        _logicType[_logicType["BooleanAnd"] = 0] = "BooleanAnd";
        _logicType[_logicType["BooleanOr"] = 1] = "BooleanOr";
        _logicType[_logicType["BooleanCircut"] = 2] = "BooleanCircut";
        _logicType[_logicType["NumericAdd"] = 3] = "NumericAdd";
        _logicType[_logicType["NumericMax"] = 4] = "NumericMax";
        _logicType[_logicType["NumericMin"] = 5] = "NumericMin";
    })(_logicType || (_logicType = {}));
    if (logicType === 0) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.BooleanAnd);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        return transferFunc;
    }
    else if (logicType === 1) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.BooleanOr);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        return transferFunc;
    }
    else if (logicType === 2) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.BooleanCircut);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        return transferFunc;
    }
    else if (logicType === 3) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.NumericAdd);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        return transferFunc;
    }
    else if (logicType === 4) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.NumericMax);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        return transferFunc;
    }
    else {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.NumericMin);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        return transferFunc;
    }
}
// get co-signed non-null SignedSimplexState
async function getCoSignedSimplexState(api, channelId, peerFrom, seqNum, transferAmount, pendingPayIds, lastPayResolveDeadline, totalPendingAmount) {
    let transferToPeer = await getTokenTransfer(api, transferAmount);
    let _simplexPaymentChannel = {
        channelId: channelId,
        peerFrom: new types_1.Option(api.registry, "AccountId", peerFrom),
        seqNum: api.registry.createType("u128", seqNum),
        transferToPeer: new types_1.Option(api.registry, "TokenTransfer", transferToPeer),
        pendingPayIds: new types_1.Option(api.registry, "PayIdList", pendingPayIds),
        lastPayResolveDeadline: new types_1.Option(api.registry, "BlockNumber", api.registry.createType("BlockNumber", lastPayResolveDeadline)),
        totalPendingAmount: new types_1.Option(api.registry, "Balance", api.registry.createType("Balance", totalPendingAmount))
    };
    let simplexPaymentChannel = api.registry.createType("SimplexPaymentChannel", _simplexPaymentChannel);
    let encoded = util_1.u8aConcat(simplexPaymentChannel.channelId.toU8a(), simplexPaymentChannel.peerFrom.toU8a(), simplexPaymentChannel.seqNum.toU8a(), transferToPeer.token.tokenType.toU8a(), transferToPeer.receiver.account.toU8a(), transferToPeer.receiver.amt.toU8a());
    for (let i = 0; i < pendingPayIds.payIds.length; i++) {
        encoded = util_1.u8aConcat(encoded, pendingPayIds.payIds[i].toU8a());
    }
    encoded = util_1.u8aConcat(encoded, pendingPayIds.nextListHash.toU8a(), simplexPaymentChannel.lastPayResolveDeadline.toU8a(), simplexPaymentChannel.totalPendingAmount.toU8a());
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, { withType: true }));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, { withType: true }));
    let _signedSimplexState = {
        simplexState: simplexPaymentChannel,
        sigs: new types_1.Vec(api.registry, "Signature", [sig1, sig2])
    };
    let signedSimplexState = api.registry.createType("SignedSimplexState", _signedSimplexState);
    return signedSimplexState;
}
// get single-signed null SignedSimplexState
async function getSingleSignedSimplexState(api, channelId, _signer) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let signer;
    if (_signer === 'alice' || _signer === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        signer = alice;
    }
    else if (_signer === 'bob' || _signer === '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty') {
        signer = bob;
    }
    let _simplexPaymentChannel = {
        channelId: channelId,
        peerFrom: new types_1.Option(api.registry, "AccountId", null),
        seqNum: api.registry.createType("u128", 0),
        transferToPeer: new types_1.Option(api.registry, "TokenTransfer", null),
        pendingPayIds: new types_1.Option(api.registry, "PayIdList", null),
        totalPendingAmount: new types_1.Option(api.registry, "Balance", null)
    };
    let simplexPaymentChannel = api.registry.createType("SimplexPaymentChannel", _simplexPaymentChannel);
    let encoded = util_1.u8aConcat(simplexPaymentChannel.channelId.toU8a(), simplexPaymentChannel.peerFrom.toU8a(), simplexPaymentChannel.seqNum.toU8a(), simplexPaymentChannel.transferToPeer.toU8a(), simplexPaymentChannel.pendingPayIds.toU8a(), simplexPaymentChannel.lastPayResolveDeadline.toU8a(), simplexPaymentChannel.totalPendingAmount.toU8a());
    let sig = api.registry.createType("MultiSignature", signer.sign(encoded, { withType: true }));
    let _signedSimplexState = {
        simplexState: simplexPaymentChannel,
        sigs: new types_1.Vec(api.registry, "Signature", [sig])
    };
    let signedSimplexState = api.registry.createType("SignedSimplexState", _signedSimplexState);
    return signedSimplexState;
}
async function getTokenTransfer(api, amount, _account = null) {
    let account;
    if (_account === 'alice' || _account === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        account = api.registry.createType("AccountId", ALICE);
    }
    else {
        account = api.registry.createType("AccountId", BOB);
    }
    let _accountAmtPair;
    if (_account != null) {
        _accountAmtPair = {
            account: new types_1.Option(api.registry, "AccountId", api.registry.createType("AccountId", account)),
            amt: api.registry.createType("Balance", amount)
        };
    }
    else {
        _accountAmtPair = {
            account: new types_1.Option(api.registry, "AccountId", null),
            amt: api.registry.createType("Balance", amount)
        };
    }
    let _tokenType;
    (function (_tokenType) {
        _tokenType[_tokenType["Invalid"] = 0] = "Invalid";
        _tokenType[_tokenType["Celer"] = 1] = "Celer";
    })(_tokenType || (_tokenType = {}));
    let tokenType = api.registry.createType("TokenType", _tokenType.Celer);
    let _tokenInfo = {
        tokenType: tokenType
    };
    let _tokenTransfer = {
        token: api.registry.createType("TokenInfo", _tokenInfo),
        receiver: api.registry.createType("AccountAmtPair", _accountAmtPair)
    };
    let tokenTransfer = api.registry.createType("TokenTransfer", _tokenTransfer);
    return tokenTransfer;
}
async function getChannelPairs(api) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let aliceAccountId = api.registry.createType("AccountId", ALICE);
    let bobAccountId = api.registry.createType("AccountId", BOB);
    if (aliceAccountId < bobAccountId) {
        return [alice, bob];
    }
    else {
        return [bob, alice];
    }
}
async function getChannelPeers(api) {
    const keyring = new keyring_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let aliceAccountId = api.registry.createType("AccountId", alice.address);
    let bobAccountId = api.registry.createType("AccountId", bob.address);
    if (aliceAccountId < bobAccountId) {
        return [aliceAccountId, bobAccountId];
    }
    else {
        return [bobAccountId, aliceAccountId];
    }
}
exports.getChannelPeers = getChannelPeers;
async function encodeCondPay(condPay) {
    let encodedCondPay = util_1.u8aConcat(condPay.payTimestamp.toU8a(), condPay.src.toU8a(), condPay.dest.toU8a());
    for (let i = 0; i < condPay.conditions.length; i++) {
        encodedCondPay = util_1.u8aConcat(encodedCondPay, condPay.conditions[i].conditionType.toU8a(), condPay.conditions[i].hashLock.toU8a(), condPay.conditions[i].callIsFinalized.toU8a(), condPay.conditions[i].callGetOutcome.toU8a(), condPay.conditions[i].numericAppNum.toU8a(), condPay.conditions[i].numericSessionId.toU8a(), condPay.conditions[i].argsQueryFinalization.toU8a(), condPay.conditions[i].argsQueryOutcome.toU8a());
    }
    encodedCondPay = util_1.u8aConcat(encodedCondPay, condPay.transferFunc.logicType.toU8a(), condPay.transferFunc.maxTransfer.token.tokenType.toU8a(), condPay.transferFunc.maxTransfer.receiver.account.toU8a(), condPay.transferFunc.maxTransfer.receiver.amt.toU8a(), condPay.resolveDeadline.toU8a(), condPay.resolveTimeout.toU8a());
    return encodedCondPay;
}
exports.encodeCondPay = encodeCondPay;
async function waitBlockNumber(block) {
    return new Promise(resolve => setTimeout(resolve, block * 6000));
}
exports.waitBlockNumber = waitBlockNumber;
