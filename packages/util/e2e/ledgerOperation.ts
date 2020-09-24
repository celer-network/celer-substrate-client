import { connect } from "../src/connect";
import { 
    openChannel,
    depositPool,
    approve,
    emitPeersMigrationInfo,
    deposit,
    emitWithdrawIntent,
    intendWithdraw,
    confirmWithdraw,
    vetoWithdraw,
    cooperativeWithdraw,
    cooperativeSettle,
    emitTransferOutMap,
    emitChannelInfo,
    emitWalletInfo,
    resolvePaymentByConditions,
    emitPendingPayOutMap,
    intendSettle,
    emitLastPayResolveDeadlineMap,
    clearPays,
    emitBalanceMap,
    emitTotalBalance,
    snapshotStates,
    emitSettleFinalizedTime,
    confirmSettle
} from "../src/funcs";
import {
    waitBlockNumber,
    getCooperativeSettleRequest, 
    getCoSignedIntendSettle,
    getResolvePayByCondtionsRequest,
    getPayIdListInfo,
    getSignedSimplexStateArray,
} from "../src/utils";

const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

async function main(): Promise<void> {
    const api = await connect();

    console.log("====================== intend withdraw and confirm withdraw =========================")
    await depositPool(api, 'alice', 'alice', 20000);
    await waitBlockNumber(2);
    
    await approve(api, 'alice', 'celerLedgerId', 20000);
    await waitBlockNumber(2);

    const channelId1 = await openChannel(api, 'bob', false, 1000);
    await waitBlockNumber(2);
    await deposit(api, 'alice', channelId1, 'bob', 2000, 0);
    await waitBlockNumber(2);
 
    await intendWithdraw(api, 'bob', channelId1, 1000);
    await waitBlockNumber(2);
    await emitWithdrawIntent(api, channelId1);
    await waitBlockNumber(10);

    await confirmWithdraw(api, 'bob', channelId1);
    await waitBlockNumber(2);
    await emitWalletInfo(api, channelId1);
    await emitPeersMigrationInfo(api, channelId1);
    await waitBlockNumber(3);
    
    console.log("\n", "========================= intend withdraw and veto withdraw ============================")
    await intendWithdraw(api, 'alice', channelId1, 1000);
    await waitBlockNumber(2);
    await emitWithdrawIntent(api, channelId1);

    await vetoWithdraw(api, 'bob', channelId1);
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId1);
    await waitBlockNumber(3);

    console.log("\n", "=============================== cooperative withdraw ====================================")
    await cooperativeWithdraw(api, 'alice', channelId1, 1, 1000, 'alice');
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId1);
    await emitWalletInfo(api, channelId1);
    await waitBlockNumber(3);

    console.log("\n", "================================ cooperative settle ======================================")
    const cooperativeSettleRequest = await getCooperativeSettleRequest(
        api,
        channelId1,
        1,
        [0, 3000]
    );
    await cooperativeSettle(api, 'alice', cooperativeSettleRequest);
    await waitBlockNumber(2);
    await emitWalletInfo(api, channelId1);
    await emitChannelInfo(api, channelId1);
    await waitBlockNumber(3);

    console.log("\n", "=============== intend withdraw and confirm withdraw to another channel ==================")
    const channelId2 = await openChannel(api, 'bob', false, 1000, true, 100000);
    await waitBlockNumber(2); 
    const channelId3 = await openChannel(api, 'alice', true, 0, true, 100001);
    await waitBlockNumber(2);

    await intendWithdraw(api, 'bob', channelId2, 1000, false, channelId3);
    await waitBlockNumber(3);
    await emitWithdrawIntent(api, channelId2);
    await waitBlockNumber(7);

    await confirmWithdraw(api, 'alice', channelId2);
    await waitBlockNumber(2);
    await emitBalanceMap(api, channelId3);
    await emitBalanceMap(api, channelId2);
    await emitWalletInfo(api, channelId3);
    await emitWalletInfo(api, channelId2)
    
    console.log("\n", "======================== cooperative withdraw to another channel ============================")
    await cooperativeWithdraw(api, 'bob', channelId2, 1, 1000, 'bob', 999999, false, channelId3);
    await waitBlockNumber(3);
    await emitBalanceMap(api, channelId3);
    await emitBalanceMap(api, channelId2);
    await emitWalletInfo(api, channelId2);
    await emitWalletInfo(api, channelId3);

    console.log("\n", "============================== Resolve Payment By Conditions ==========================================")
    const channelId4 = await openChannel(api, 'alice', true);
    await waitBlockNumber(2);
    await deposit(api, 'alice', channelId4, 'alice', 2000, 0);
    await waitBlockNumber(2);
    await deposit(api, 'bob', channelId4, 'bob', 2000, 0);
    await waitBlockNumber(2);

    const globalResult = await getCoSignedIntendSettle(
        api,
        [channelId4, channelId4],
        [[[10, 20], [30, 40]], [[50, 60], [70, 80]]],
        [1, 1],
        [999999, 999999],
        [100, 200]
    );
    const signedSimplexStateArray1 = globalResult.signedSimplexStateArray;

    for (let peerIndex = 0; peerIndex < 2; peerIndex++) {
        for (let listIndex = 0; listIndex < globalResult.condPays[peerIndex].length; listIndex++) {
            for (let payIndex = 0; payIndex < globalResult.condPays[peerIndex][listIndex].length; payIndex++) {
                let payRequest = await getResolvePayByCondtionsRequest(api, globalResult.condPays[peerIndex][listIndex][payIndex]);
                await resolvePaymentByConditions(api, 'alice', payRequest);
                await waitBlockNumber(2);
            }
        }
    }
    await waitBlockNumber(5);

    console.log("\n", "=================================== Intend Settle ============================================")
    await intendSettle(api, 'alice', signedSimplexStateArray1);
    await waitBlockNumber(3);
    await emitPeersMigrationInfo(api, channelId4);
    await emitLastPayResolveDeadlineMap(api, channelId4);

    console.log("\n", "==================================== Clear Pays ================================================")
    await clearPays(
        api,
        'bob',
        channelId4,
        'bob',
        globalResult.payIdListArrays[0][1]
    );
    await waitBlockNumber(2);

    await clearPays(
        api,
        'alice',
        channelId4,
        'alice',
        globalResult.payIdListArrays[1][1]
    );
    await waitBlockNumber(2);
    
    await emitChannelInfo(api, channelId4);
    await emitPeersMigrationInfo(api, channelId4);
    await waitBlockNumber(3);

    console.log("========================== Confirm Settle ============================")
    await emitSettleFinalizedTime(api, channelId4);
    await confirmSettle(api, 'alice', channelId4);
    await waitBlockNumber(3);
    await emitChannelInfo(api, channelId4);
    await waitBlockNumber(3);

    console.log("\n", "========== Intend Settle with 0 payments (null state) ============")
    const channelId5 = await openChannel(api, 'bob', false, 1000, true, 100004);
    await waitBlockNumber(2);
    let singleSignedNullState = await getSignedSimplexStateArray(
        api,
        [channelId5],
        [0],
        undefined,
        undefined,
        undefined,
        [0],
        'bob'
    );
    await intendSettle(api, 'bob', singleSignedNullState);
    await waitBlockNumber(3);
    await emitPeersMigrationInfo(api, channelId5);
    await waitBlockNumber(3);

    console.log("\n", "====== Snapshot States, Intend Withdraw and Confirm Withdraw =====")
    const channelId6 = await openChannel(api, 'bob', false, 1000, true, 1000002);
    await waitBlockNumber(2);
    const payIdListInfo = await getPayIdListInfo(
        api,
        [[10, 20]]
    );
    let signedSimplexStateArray2 = await getSignedSimplexStateArray(
        api,
        [channelId6],
        [5],
        [100],
        [999999],
        [payIdListInfo.payIdLists[0]],
        [payIdListInfo.totalPendingAmount]
    );
    await snapshotStates(api, 'alice', signedSimplexStateArray2);
    await waitBlockNumber(2);
    await emitChannelInfo(api, channelId6);

    await intendWithdraw(api, 'alice', channelId6, 1000, true);
    await waitBlockNumber(10);

    await confirmWithdraw(api, 'alice', channelId6);
    await waitBlockNumber(2);

    await emitPeersMigrationInfo(api, channelId6);
    await waitBlockNumber(2);

    console.log("\n", "=============== Intend Settle with a same seqNum as snapshot =======================")
    for (let i = 0; i < 2; i++) {
        let payRequest = await getResolvePayByCondtionsRequest(api, payIdListInfo.condPayArray[0][i]);
        await resolvePaymentByConditions(api, 'alice', payRequest);
        await waitBlockNumber(2);
    }
    await waitBlockNumber(6);

    await intendSettle(api, 'alice',signedSimplexStateArray2);
    await waitBlockNumber(3);
    await emitChannelInfo(api, channelId6);
    await emitPeersMigrationInfo(api, channelId6);

    await waitBlockNumber(3);
    process.exit(0);
}

main();
