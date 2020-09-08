import { Keyring } from '@polkadot/keyring';
import { u8aConcat, u8aToHex } from '@polkadot/util';
import { Option, Vec} from '@polkadot/types'
import { ApiRx } from '@polkadot/api';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import { 
    PayIdList, 
    TokenTransfer, 
    SignedSimplexState, 
    ConditionalPay, 
    TransferFunction,
    Condition,
    OpenChannelRequestOf
} from 'celer-substrate-types';
import { KeyringPair } from '@polkadot/keyring/types';
import { blake2AsU8a } from '@polkadot/util-crypto';

const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

export async function caluculateChannelId(
    api: ApiRx,
    openRequest: OpenChannelRequestOf
): Promise<string> {
    let paymentChannelInitializer = openRequest.channelInitializer;
    let encoded1 = u8aConcat(
        paymentChannelInitializer.balanceLimitsEnabled.toU8a(),
        paymentChannelInitializer.balanceLimits.toU8a(),
        paymentChannelInitializer.initDistribution.token.tokenType.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[0].account.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[0].amt.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[1].account.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[1].amt.toU8a(),
        paymentChannelInitializer.openDeadline.toU8a(),
        paymentChannelInitializer.disputeTimeout.toU8a(),
        paymentChannelInitializer.msgValueReceiver.toU8a(),
    );
    let hash1 = blake2AsU8a(encoded1);
    let nonce = api.registry.createType("Hash", u8aToHex(hash1));
    
    let channelPeers = await getChannelPeers(api);
    let encoded2 = u8aConcat(
        channelPeers[0].toU8a(),
        channelPeers[1].toU8a(),
        nonce.toU8a()
    );
    let hash2 = blake2AsU8a(encoded2);
    let channelId = u8aToHex(hash2);

    return channelId;
}

export async function getOpenChannelRequest(
    api: ApiRx,
    balanceLimitsEnabled: boolean,
    balanceLimits: number,
    channelPeerBalance0: number,
    channelPeerBalance1: number,
    openDeadline: number, 
    disputeTimeout: number,
    zeroTotalDeposit: boolean,
    msgValueReceiver: number,
): Promise<OpenChannelRequestOf> {
    let channelPeers = await getChannelPeers(api);

    enum _tokenType {
        Invalid,
        Celer
    }
    
    let tokenType = api.registry.createType("TokenType", _tokenType.Celer);
    let tokenInfo = {
        tokenType: tokenType
    };

    let accountAmtPair1;
    let accountAmtPair2;
    let tokenDistribution;
    if (zeroTotalDeposit === true) {
        let _accountAmtPair1 = {
            account: new Option(api.registry, "AccountId", channelPeers[0]),
            amt: api.registry.createType("Balance", 0),
        };
        accountAmtPair1 = api.registry.createType("AccountAmtPair", _accountAmtPair1);
        let _accountAmtPair2 = {
            account: new Option(api.registry, "AccountId", channelPeers[1]),
            amt: api.registry.createType("Balance", 0),
        };
        accountAmtPair2 = api.registry.createType("AccountAmtPair", _accountAmtPair2);
        tokenDistribution = {
            token: api.registry.createType("TokenInfo", tokenInfo),
            distribution:  new Vec(api.registry, "AccountAmtPair", [accountAmtPair1, accountAmtPair2]),
        };
    } else {
        let _accountAmtPair1 = {
            account: new Option(api.registry, "AccountId", channelPeers[0]),
            amt: api.registry.createType("Balance", channelPeerBalance0),
        };
        accountAmtPair1 = api.registry.createType("AccountAmtPair", _accountAmtPair1);
        let _accountAmtPair2 = {
            account: new Option(api.registry, "AccountId", channelPeers[1]),
            amt: api.registry.createType("Balance", channelPeerBalance1),
        };
        accountAmtPair2 = api.registry.createType("AccountAmtPair", _accountAmtPair2);
        tokenDistribution = {
            token: api.registry.createType("TokenInfo", tokenInfo),
            distribution:  new Vec(api.registry, "AccountAmtPair", [accountAmtPair1, accountAmtPair2]),
        };
    }
    let _paymentChannelInitializer = {
        balanceLimitsEnabled: api.registry.createType("bool", balanceLimitsEnabled),
        balanceLimits: new Option(api.registry, "Balance", api.registry.createType("Balance", balanceLimits)),
        initDistribution: api.registry.createType("TokenDistribution", tokenDistribution),
        openDeadline: api.registry.createType("BlockNumber", openDeadline),
        disputeTimeout: api.registry.createType("BlockNumber", disputeTimeout),
        msgValueReceiver: api.registry.createType("u8", msgValueReceiver),
    };
    let paymentChannelInitializer = api.registry.createType("PaymentChannelInitializer", _paymentChannelInitializer);

    let encoded = u8aConcat(
        paymentChannelInitializer.balanceLimitsEnabled.toU8a(),
        paymentChannelInitializer.balanceLimits.toU8a(),
        paymentChannelInitializer.initDistribution.token.tokenType.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[0].account.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[0].amt.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[1].account.toU8a(),
        paymentChannelInitializer.initDistribution.distribution[1].amt.toU8a(),
        paymentChannelInitializer.openDeadline.toU8a(),
        paymentChannelInitializer.disputeTimeout.toU8a(),
        paymentChannelInitializer.msgValueReceiver.toU8a(),
    );
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, {withType: true}));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, {withType: true}));

    let _openChannelRequestOf = {
        channelInitializer: paymentChannelInitializer,
        sigs: new Vec(api.registry, "MultiSignature", [sig1, sig2]),
    };

    let openChannelRequestOf = api.registry.createType("OpenChannelRequestOf", _openChannelRequestOf);
    return openChannelRequestOf;
}

export async function getCooperativeWithdrawRequest(
    api: ApiRx,
    channelId: string,
    seqNum: number,
    amount: number,
    _receiverAccount: string,
    withdrawDeadline: number,
    isZeroHash: boolean,
    recipientChannelId?: string,
): Promise<any>{
    let receiverAccount;
    if (_receiverAccount === 'alice' || _receiverAccount === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        receiverAccount = api.registry.createType("AccountId", ALICE);   
    } else {
        receiverAccount = api.registry.createType("AccountId", BOB);
    }

    let _accountAmtPair = {
        account: new Option(api.registry, "AccountId", receiverAccount),
        amt: api.registry.createType("Balance", amount),
    };
    let accountAmtPair = api.registry.createType("AccountAmtPair", _accountAmtPair);

    let cooperativeWithdrawInfo;
    if (isZeroHash === true) {
        let zeroU8a = blake2AsU8a(api.registry.createType("u8", 0).toU8a());
        let zeroHash = u8aToHex(zeroU8a);
        let _cooperativeWithdrawInfo = {
            channelId: channelId,
            seqNum: seqNum,
            withdraw: accountAmtPair,
            withdrawDeadline: withdrawDeadline,
            recipientChannelId: zeroHash
        };
        cooperativeWithdrawInfo = api.registry.createType("CooperativeWithdrawInfo", _cooperativeWithdrawInfo);
    } else {
        let _cooperativeWithdrawInfo = {
            channelId: channelId,
            seqNum: api.registry.createType("u128", seqNum),
            withdraw: accountAmtPair,
            withdrawDeadline: api.registry.createType("BlockNumber", withdrawDeadline),
            recipientChannelId: recipientChannelId
        };
        cooperativeWithdrawInfo = api.registry.createType("CooperativeWithdrawInfo", _cooperativeWithdrawInfo);
    }

    let encoded = u8aConcat (
        cooperativeWithdrawInfo.channelId.toU8a(),
        cooperativeWithdrawInfo.seqNum.toU8a(),
        cooperativeWithdrawInfo.withdraw.account.toU8a(),
        cooperativeWithdrawInfo.withdraw.amt.toU8a(),
        cooperativeWithdrawInfo.withdrawDeadline.toU8a(),
        cooperativeWithdrawInfo.recipientChannelId.toU8a(),
    );
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, {withType: true}));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, {withType: true}));

    let _cooperativeWithdrawRequest = {
        withdrawInfo: cooperativeWithdrawInfo,
        sigs: new Vec(api.registry, "MultiSignature", [sig1, sig2])
    };
    let cooperativeWithdrawRequest = api.registry.createType("CooperativeWithdrawRequestOf", _cooperativeWithdrawRequest);

    return cooperativeWithdrawRequest;
}

export async function getSignedSimplexStateArray(
    api: ApiRx,
    channelIds: string[],
    seqNums = [1, 1],
    transferAmounts: number[],
    lastPayResolveDeadlines: number[],
    payIdLists: PayIdList[],
    totalPendingAmounts = [0, 0],
    signers?: string | undefined,
): Promise<any> {
    let peerFroms = await getChannelPeers(api);
    let signedSimplexStates: SignedSimplexState[] = [];
    for (let i = 0; i < channelIds.length; i++) {
        if (seqNums[i] > 0) { // co-signed non-null state
            signedSimplexStates[i] = await getCoSignedSimplexState(
                api,
                channelIds[i],
                peerFroms[i],
                seqNums[i],
                transferAmounts[i],
                payIdLists[i],
                lastPayResolveDeadlines[i],
                totalPendingAmounts[i]
            );
        } else if (seqNums[i] === 0) {
            signedSimplexStates[i] = await getSingleSignedSimplexState(
                api,
                channelIds[i],
                signers
            )
        }
    }
    let _signedSimplexStateArray = {
        signedSimplexStates: new Vec(api.registry, "SignedSimplexState", signedSimplexStates)
    };
    let signedSimplexStateArray = api.registry.createType("SignedSimplexStateArrayOf", _signedSimplexStateArray);

    return signedSimplexStateArray;
}

export async function getCooperativeSettleRequest(
    api: ApiRx,
    channelId: string,
    seqNum: number,
    settleAmounts: number[],
    settleDeadline = 999999,
): Promise<any> {
    let channelPeers = await getChannelPeers(api);
    let _accountAmtPair1 = {
        account: new Option(api.registry, "AccountId", channelPeers[0]),
        amt: api.registry.createType("Balance", settleAmounts[0])
    };
    let accountAmtPair1 = api.registry.createType("AccountAmtPair", _accountAmtPair1);
    let _accountAmtPair2 = {
        account: new Option(api.registry, "AccountId", channelPeers[1]),
        amt: api.registry.createType("Balance", settleAmounts[1])
    };
    let accountAmtPair2 = api.registry.createType("AccountAmtPair", _accountAmtPair2);
    let _settleInfo = {
        channelId: channelId,
        seqNum: api.registry.createType("u128", seqNum),
        settleBalance: new Vec(api.registry, "AccountAmtPair", [accountAmtPair1, accountAmtPair2]),
        settleDeadline: api.registry.createType("BlockNumber", settleDeadline),
    };
    let settleInfo = api.registry.createType("CooperativeSettleInfo", _settleInfo);

    let encoded = u8aConcat(
        settleInfo.channelId.toU8a(),
        settleInfo.seqNum.toU8a(),
        settleInfo.settleBalance[0].account.toU8a(),
        settleInfo.settleBalance[0].amt.toU8a(),
        settleInfo.settleBalance[1].account.toU8a(),
        settleInfo.settleBalance[1].amt.toU8a(),
        settleInfo.settleDeadline.toU8a()
    );
    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, {withType: true}));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, {withType: true}));
    let _cooperativeSettleRequest = {
        settleInfo: settleInfo,
        sigs: new Vec(api.registry, "Signature", [sig1, sig2])
    };
    let cooperativeSettleRequest = api.registry.createType("CooperativeSettleRequestOf", _cooperativeSettleRequest);

    return cooperativeSettleRequest;    
}

export async function getResolvePayByCondtionsRequest(
    api: ApiRx,
    condPay: ConditionalPay,
    hashPreimages: string[] = []
): Promise<any> {
    let _resolvePaymentConditionsRequest = {
        condPay: condPay,
        hashPreimages: new Vec(api.registry, "Hash", hashPreimages)
    };
    
    let resolvePaymentConditionsRequest = api.registry.createType("ResolvePaymentConditionsRequestOf", _resolvePaymentConditionsRequest);

    return resolvePaymentConditionsRequest;
}

export async function getVouchedCondPayResult(
    api: ApiRx,
    condPay: ConditionalPay,
    amount: number,
): Promise<any> {
    const keyring = new Keyring({ type: 'sr25519' });
    const src = keyring.addFromUri('//Dave');
    const dest = keyring.addFromUri('//Eve');
    let condPayResult = {
        condPay: condPay,
        amount: api.registry.createType("Balance", amount)
    };
    
    let encoded = await encodeCondPay(condPay);
    let _vouchedCondPayResult = {
        condPayResult: api.registry.createType("CondPayResult", condPayResult),
        sigOfSrc: api.registry.createType("MultiSignature", src.sign(encoded, {withType: true})),
        sigOfDest: api.registry.createType("MultiSignature", dest.sign(encoded, {withType: true}))
    };
    let vouchedCondPayResult = api.registry.createType("VouchedCondPayResultOf", _vouchedCondPayResult);
    
    return vouchedCondPayResult;
}

export async function getPayIdListInfo(
    api: ApiRx,
    payAmounts: number[][],
    payConditions = null,
): Promise<any> {
    // 1-d array of PayIdList
    let payIdLists: PayIdList[] = [];
    // 1-d array of PayIdList bytes, for clearing pays on CelerLedger
    let payIdListHashArray: string[] = [];
    // 2-d array of pay bytes in list of PayIdList of a simplex channel,
    // for resolving pays with PayRegistry.
    // Index is consistent with payAmounts.
    let condPayArray: ConditionalPay[][] = [];
    // total pending amount in payAmounts/this state
    let totalPendingAmount = 0;

    for (let i = 0; i < payAmounts.length; i++) {
        condPayArray[i] = [];
    }

    for (let i = payAmounts.length - 1; i >= 0; i--) {
        let payIds: string[] = [];
        for (let j = 0; j < payAmounts[i].length; j++) {
            totalPendingAmount += payAmounts[i][j];
            let conditions: Condition[] = []; 
            if (payConditions === null) {
                // use true boolean condition by default
                conditions = [await getCondition(api, 1)];
            } else {
                if (payConditions[i][j]) {
                    conditions = [await getCondition(api, 1)];
                } else {
                    conditions = [await getCondition(api, 2)];
                }
            }
            
            condPayArray[i][j] = await getConditionalPay(
                api, 
                conditions, 
                payAmounts[i][j],
            );
            let encodedCondPay = await encodeCondPay(condPayArray[i][j]);
            let hash = blake2AsU8a(encodedCondPay);
            let payHash = u8aToHex(hash);
            payIds[j] = await calculatePayId(api, payHash);
        }

        let _payIdList;
        if ( i === payAmounts.length - 1) {
            _payIdList = {
                payIds: new Vec(api.registry, "Hash", payIds),
                nextListHash: new Option(api.registry, "Hash", null)
            };
        } else {
            _payIdList = {
                payIds: new Vec(api.registry, "Hash", payIds),
                nextListHash: new Option(api.registry, "Hash", payIdListHashArray[i + 1])
            };
        }
        payIdLists[i] = api.registry.createType("PayIdList", _payIdList);
        
        let encoded = payIdLists[i].payIds[0].toU8a();
        for (let k = 1; k < payIdLists[i].payIds.length; k++) {
            encoded = u8aConcat(
                encoded,
                payIdLists[i].payIds[k].toU8a(),
            );
        }
        encoded = u8aConcat(
            encoded,
            payIdLists[i].nextListHash.toU8a()
        );
        let hash = blake2AsU8a(encoded);
        payIdListHashArray[i] = u8aToHex(hash); 
    }

    return {
        payIdLists,
        condPayArray,
        payIdListHashArray,
        totalPendingAmount
    };
}

export async function getCoSignedIntendSettle(
    api: ApiRx,
    channelIds: string[],
    payAmountsArray: number[][][],
    seqNums: number[],
    lastPayResolverDeadlines: number[],
    trasnferAmounts: number[],
): Promise<any> {
    let headPayIdLists = [];
    let condPays = [];
    let payIdListArrays: PayIdList[][] = [];
    let totalPendingAmounts = [];

    for (let i = 0; i < channelIds.length; i++) {
        const payIdListInfo = await getPayIdListInfo(
            api,
            payAmountsArray[i],
            null
        );
        headPayIdLists[i] = payIdListInfo.payIdLists[0];
        condPays[i] = payIdListInfo.condPayArray;
        payIdListArrays[i] = payIdListInfo.payIdLists;
        totalPendingAmounts[i] = payIdListInfo.totalPendingAmount;
    }

    const signedSimplexStateArray = await getSignedSimplexStateArray(
        api,
        channelIds,
        seqNums,
        trasnferAmounts,
        lastPayResolverDeadlines,
        headPayIdLists,
        totalPendingAmounts,
    );

    return {
        signedSimplexStateArray,
        lastPayResolverDeadlines,
        condPays,
        payIdListArrays
    }
}

export async function getConditions(
    api: ApiRx,
    type: number
): Promise<any> {
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

async function calculatePayId(
    api: ApiRx,
    payHash: string,
): Promise<string> {
    // encode(payHash, payResolver AccountId)
    let encoded = u8aConcat(
        api.registry.createType('Hash', payHash).toU8a(),
        api.registry.createType('AccountId', '0x6d6f646c5265736f6c7665720000000000000000000000000000000000000000').toU8a(),
    );
    let hash = blake2AsU8a(encoded);
    let payId = u8aToHex(hash);

    return payId;
}

export async function getCondition(
    api: ApiRx,
    type: number
): Promise<Condition> {
    enum _conditionType {
        HashLock,
        BooleanRuntimeModule,
        NumericRuntimeModule,
    }
     
    if (type === 0) {
        let hash = blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = u8aToHex(hash);
        let _conditionHashLock = {
            conditionType: api.registry.createType("ConditionType", _conditionType.HashLock),
            hashLock: new Option(api.registry, "Hash", hash_1),
            callIsFinalized: new Option(api.registry, "Call", null),
            callGetOutcome: new Option(api.registry, "Call", null),
            numericAppNum: new Option(api.registry, "u32", null),
            numericSessionId: new Option(api.registry, "Hash", null),
            argsQueryFinalization: new Option(api.registry, "Bytes", null),
            argsQueryOutcome: new Option(api.registry, "Bytes", null)
        };
        let conditionHashLock = api.registry.createType("Condition", _conditionHashLock);

        return conditionHashLock;
    } else if (type === 1) {
        let hash = blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = u8aToHex(hash);
        let callIsFinalizedTrue = api.tx.mockBooleanCondition.isFinalized(hash_1, 1);
        let callGetOutcomeTrue = api.tx.mockBooleanCondition.getOutcome(hash_1, 1);
        let _booleanConditionTrue = {
            conditionType: api.registry.createType("ConditionType", _conditionType.BooleanRuntimeModule),
            hashLock: new Option(api.registry, "Hash", null),
            callIsFinalized: new Option(api.registry, "Call", callIsFinalizedTrue),
            callGetOutcome: new Option(api.registry, "Call", callGetOutcomeTrue),
            numericAppNum: new Option(api.registry, "u32", null),
            numericSessionId: new Option(api.registry, "Hash", null),
            argsQueryFinalization: new Option(api.registry, "Bytes", null),
            argsQueryOutcome: new Option(api.registry, "Bytes", null)
        };
        let booleanConditionTrue = api.registry.createType("Condition", _booleanConditionTrue);

        return booleanConditionTrue;
    } else if (type === 2) {
        let hash = blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = u8aToHex(hash);
        let callIsFinalizedTrue = api.tx.mockBooleanCondition.isFinalized(hash_1, 1);
        let callGetOutcomeFalse = api.tx.mockBooleanCondition.getOutcome(hash_1, 0);
        let _booleanConditionFalse = {
            conditionType: api.registry.createType("ConditionType", _conditionType.BooleanRuntimeModule),
            hashLock: new Option(api.registry, "Hash", null),
            callIsFinalized: new Option(api.registry, "Call", callIsFinalizedTrue),
            callGetOutcome: new Option(api.registry, "Call", callGetOutcomeFalse),
            numericAppNum: new Option(api.registry, "u32", null),
            numericSessionId: new Option(api.registry, "Hash", null),
            argsQueryFinalization: new Option(api.registry, "Bytes", null),
            argsQueryOutcome: new Option(api.registry, "Bytes", null)
        };
        let booleanConditionFalse = api.registry.createType("Condition", _booleanConditionFalse);

        return booleanConditionFalse;
    } else if (type === 3) {
        let hash = blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = u8aToHex(hash);
        let u8_1 = api.registry.createType("u8", 1);
        let u32_10 = api.registry.createType("u32", 10);
        let _numericCondition10 = {
            conditionType: api.registry.createType("ConditionType", _conditionType.BooleanRuntimeModule),
            hashLock: new Option(api.registry, "Hash", null),
            callIsFinalized: new Option(api.registry, "Call", null),
            callGetOutcome: new Option(api.registry, "Call", null),
            numericAppNum: new Option(api.registry, "u32", api.registry.createType("u32", 0)),
            numericSessionId: new Option(api.registry, "Hash", hash_1),
            argsQueryFinalization: new Option(api.registry, "Bytes", u8_1.toU8a()),
            argsQueryOutcome: new Option(api.registry, "Bytes", u32_10.toU8a())
        };
        let numericCondition10= api.registry.createType("Condition", _numericCondition10);

        return numericCondition10;
    } else {
        let hash = blake2AsU8a(api.registry.createType("u64", 1).toU8a());
        let hash_1 = u8aToHex(hash);
        let u8_1 = api.registry.createType("u8", 1);
        let u32_25 = api.registry.createType("u32", 25);
        let _numericCondition25 = {
            conditionType: api.registry.createType("ConditionType", _conditionType.BooleanRuntimeModule),
            hashLock: new Option(api.registry, "Hash", null),
            callIsFinalized: new Option(api.registry, "Call", null),
            callGetOutcome: new Option(api.registry, "Call", null),
            numericAppNum: new Option(api.registry, "u32", api.registry.createType("u32", 0)),
            numericSessionId: new Option(api.registry, "Hash", hash_1),
            argsQueryFinalization: new Option(api.registry, "Bytes", u8_1.toU8a()),
            argsQueryOutcome: new Option(api.registry, "Bytes", u32_25.toU8a())
        };
        let numericCondition25= api.registry.createType("Condition", _numericCondition25);

        return numericCondition25;
    }
}

export async function getConditionalPay(
    api: ApiRx,
    conditions: Condition[],
    maxAmount: number,
    payTimestamp = 1,
    resolveDeadline = 999999,
    resolveTimeout = 5,
    logicType = 0,
): Promise<ConditionalPay> {
    const keyring = new Keyring({ type: 'sr25519' });
    const src = keyring.addFromUri('//Dave');
    const dest = keyring.addFromUri('//Eve');

    let transferToPeer = await getTokenTransfer(api, maxAmount);
    let transferFunc = await getTransferFunc(api, transferToPeer, logicType);

    let _conditionalPay = {
        payTimestamp: payTimestamp,
        src: api.registry.createType("AccountId", src.address),
        dest: api.registry.createType("AccountId", dest.address),
        conditions: conditions,
        transferFunc: transferFunc,
        resolveDeadline: api.registry.createType("BlockNumber", resolveDeadline),
        resolveTimeout: api.registry.createType("BlockNumber", resolveTimeout)
    };
    let condPay = api.registry.createType("ConditionalPay", _conditionalPay);
    
    return condPay;
}

async function getTransferFunc(
    api: ApiRx,
    tokenTransfer: TokenTransfer,
    logicType: number
): Promise<TransferFunction> {
    enum _logicType {
        BooleanAnd,
        BooleanOr,
        BooleanCircut,
        NumericAdd,
        NumericMax,
        NumericMin,
    }

    if (logicType === 0) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.BooleanAnd);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        
        return transferFunc;
    } else if (logicType === 1) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.BooleanOr);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        
        return transferFunc;
    } else if (logicType === 2) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.BooleanCircut);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        
        return transferFunc;
    } else if (logicType === 3) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.NumericAdd);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        
        return transferFunc;
    } else if (logicType === 4) {
        let transferFuncType = api.registry.createType("TransferFunctionType", _logicType.NumericMax);
        let _transferFunc = {
            logicType: transferFuncType,
            maxTransfer: tokenTransfer
        };
        let transferFunc = api.registry.createType("TransferFunction", _transferFunc);
        
        return transferFunc;
    } else {
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
async function getCoSignedSimplexState(
    api: ApiRx,
    channelId: string,
    peerFrom: AccountId,
    seqNum: number,
    transferAmount: number,
    pendingPayIds: PayIdList,
    lastPayResolveDeadline: number,
    totalPendingAmount: number
): Promise<any> {
    let transferToPeer: TokenTransfer = await getTokenTransfer(api, transferAmount);
    
    let _simplexPaymentChannel = {
        channelId: channelId,
        peerFrom: new Option(api.registry, "AccountId", peerFrom),
        seqNum: api.registry.createType("u128", seqNum),
        transferToPeer: new Option(api.registry, "TokenTransfer", transferToPeer),
        pendingPayIds: new Option(api.registry, "PayIdList", pendingPayIds),
        lastPayResolveDeadline: new Option(api.registry, "BlockNumber", api.registry.createType("BlockNumber", lastPayResolveDeadline)),
        totalPendingAmount: new Option(api.registry, "Balance", api.registry.createType("Balance", totalPendingAmount))
    };
    let simplexPaymentChannel = api.registry.createType("SimplexPaymentChannel", _simplexPaymentChannel);

    let encoded = u8aConcat(
        simplexPaymentChannel.channelId.toU8a(),
        simplexPaymentChannel.peerFrom.toU8a(),
        simplexPaymentChannel.seqNum.toU8a(),
        transferToPeer.token.tokenType.toU8a(),
        transferToPeer.receiver.account.toU8a(),
        transferToPeer.receiver.amt.toU8a(),
    );
    for (let i = 0; i < pendingPayIds.payIds.length; i++) {
        encoded = u8aConcat(
            encoded,
            pendingPayIds.payIds[i].toU8a()
        );
    }
    encoded = u8aConcat(
        encoded,
        pendingPayIds.nextListHash.toU8a(),
        simplexPaymentChannel.lastPayResolveDeadline.toU8a(),
        simplexPaymentChannel.totalPendingAmount.toU8a(),
    );

    let channelPairs = await getChannelPairs(api);
    let sig1 = api.registry.createType("MultiSignature", channelPairs[0].sign(encoded, {withType: true}));
    let sig2 = api.registry.createType("MultiSignature", channelPairs[1].sign(encoded, {withType: true}));

    let _signedSimplexState = {
        simplexState: simplexPaymentChannel,
        sigs: new Vec(api.registry, "Signature", [sig1, sig2])
    };
    let signedSimplexState = api.registry.createType("SignedSimplexState", _signedSimplexState);

    return signedSimplexState;
}


// get single-signed null SignedSimplexState
async function getSingleSignedSimplexState(
    api: ApiRx,
    channelId: string,
    _signer: string | undefined
): Promise<any> {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');

    let signer;
    if (_signer === 'alice' || _signer === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        signer = alice;
    } else {
        signer = bob;
    }
    let _simplexPaymentChannel = {
        channelId: channelId,
        peerFrom: new Option(api.registry, "AccountId", null),
        seqNum: api.registry.createType("u128", 0),
        transferToPeer: new Option(api.registry, "TokenTransfer", null),
        pendingPayIds: new Option(api.registry, "PayIdList", null),
        totalPendingAmount: new Option(api.registry, "Balance", null)
    };
    let simplexPaymentChannel = api.registry.createType("SimplexPaymentChannel", _simplexPaymentChannel);

    let encoded = u8aConcat(
        simplexPaymentChannel.channelId.toU8a(),
        simplexPaymentChannel.peerFrom.toU8a(),
        simplexPaymentChannel.seqNum.toU8a(),
        simplexPaymentChannel.transferToPeer.toU8a(),
        simplexPaymentChannel.pendingPayIds.toU8a(),
        simplexPaymentChannel.lastPayResolveDeadline.toU8a(),
        simplexPaymentChannel.totalPendingAmount.toU8a(),
    );
    let sig = api.registry.createType("MultiSignature", signer.sign(encoded, {withType: true}));
    let _signedSimplexState = {
        simplexState: simplexPaymentChannel,
        sigs: new Vec(api.registry, "Signature", [sig])
    };
    let signedSimplexState = api.registry.createType("SignedSimplexState", _signedSimplexState);

    return signedSimplexState; 
}

async function getTokenTransfer(
    api: ApiRx,
    amount: number,
    _account = null
): Promise<any> {
    let account;
    if (_account === 'alice' || _account === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
        account = api.registry.createType("AccountId", ALICE);   
    } else {
        account = api.registry.createType("AccountId", BOB);
    }
    let _accountAmtPair;
    if (_account != null) {
        _accountAmtPair = {
            account: new Option(api.registry, "AccountId", api.registry.createType("AccountId", account)),
            amt: api.registry.createType("Balance", amount)
        };
    } else {
        _accountAmtPair = {
            account: new Option(api.registry, "AccountId", null),
            amt: api.registry.createType("Balance", amount)
        };
    }

    enum _tokenType {
        Invalid,
        Celer
    }
    
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

async function getChannelPairs(api: ApiRx): Promise<KeyringPair[]> {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let aliceAccountId = api.registry.createType("AccountId", ALICE);
    let bobAccountId = api.registry.createType("AccountId", BOB);
    if (aliceAccountId < bobAccountId) {
        return [alice, bob];
    } else {
        return [bob, alice];
    }
}

export async function getChannelPeers(api: ApiRx): Promise<AccountId[]> {
    const keyring = new Keyring({ type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');
    let aliceAccountId = api.registry.createType("AccountId", alice.address);
    let bobAccountId = api.registry.createType("AccountId", bob.address);
    if (aliceAccountId < bobAccountId) {
        return [aliceAccountId, bobAccountId];
    } else {
        return [bobAccountId, aliceAccountId];
    }
}

async function encodeCondPay(
    condPay: ConditionalPay
): Promise<Uint8Array> {
    let encodedCondPay = u8aConcat(
        condPay.payTimestamp.toU8a(),
        condPay.src.toU8a(),
        condPay.dest.toU8a()
    );
    for (let i = 0; i < condPay.conditions.length; i++) {
        encodedCondPay = u8aConcat(
            encodedCondPay,
            condPay.conditions[i].conditionType.toU8a(),
            condPay.conditions[i].hashLock.toU8a(),
            condPay.conditions[i].callIsFinalized.toU8a(),
            condPay.conditions[i].callGetOutcome.toU8a(),
            condPay.conditions[i].numericAppNum.toU8a(),
            condPay.conditions[i].numericSessionId.toU8a(),
            condPay.conditions[i].argsQueryFinalization.toU8a(),
            condPay.conditions[i].argsQueryOutcome.toU8a()
        );
    }
    encodedCondPay = u8aConcat(
       encodedCondPay,
       condPay.transferFunc.logicType.toU8a(),
       condPay.transferFunc.maxTransfer.token.tokenType.toU8a(),
       condPay.transferFunc.maxTransfer.receiver.account.toU8a(),
       condPay.transferFunc.maxTransfer.receiver.amt.toU8a(),
       condPay.resolveDeadline.toU8a(),
       condPay.resovleTimeout.toU8a(),
    );

    return encodedCondPay;
}

export async function waitBlockNumber(block: number) {
    return new Promise(resolve => setTimeout(resolve, block*6000))
}