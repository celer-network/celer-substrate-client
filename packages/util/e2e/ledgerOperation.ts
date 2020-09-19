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
    depositNativeToken,
    intendSettle,
    emitLastPayResolveDeadlineMap,
    clearPays,
    emitBalanceMap,
    emitTotalBalance,
    snapshotStates
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
    
    console.log("\n");
    console.log("========================= intend withdraw and veto withdraw ============================")
    await intendWithdraw(api, 'alice', channelId1, 1000);
    await waitBlockNumber(2);
    await emitWithdrawIntent(api, channelId1);

    await vetoWithdraw(api, 'bob', channelId1);
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId1);

    console.log("\n");
    console.log("=============================== cooperative withdraw ====================================")
    await cooperativeWithdraw(api, 'alice', channelId1, 1, 1000, 'alice');
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId1);
    await emitWalletInfo(api, channelId1);

    console.log("\n");
    console.log("================================ cooperative settle ======================================")
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

    console.log("\n");
    console.log("=============== intend withdraw and confirm withdraw to another channel ==================")
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
    await emitTotalBalance(api, channelId3);
    await emitBalanceMap(api, channelId2);
    await emitWalletInfo(api, channelId3);
    await emitWalletInfo(api, channelId2)
    
    console.log("\n");
    console.log("======================== cooperative withdraw to another channel ============================")
    await cooperativeWithdraw(api, 'bob', channelId2, 1, 1000, 'bob', 999999, false, channelId3);
    await waitBlockNumber(3);
    await emitTotalBalance(api, channelId3);
    await emitBalanceMap(api, channelId3);
    await emitWalletInfo(api, channelId2);
    await emitWalletInfo(api, channelId3);

    console.log("\n");
    console.log("============================== Resolve Payment By Conditions ==========================================")
    const channelId4 = await openChannel(api, 'alice', true);
    await waitBlockNumber(2);
    await depositNativeToken(api, 'alice', channelId4, 2000);
    await waitBlockNumber(2);
    await depositNativeToken(api, 'bob', channelId4, 1000);
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

    console.log("\n");
    console.log("========================= Intend Settle =====================================================")
    await intendSettle(api, 'alice', signedSimplexStateArray1);
    await waitBlockNumber(3);
    await emitPendingPayOutMap(api, channelId4);
    await emitTransferOutMap(api, channelId4);
    await emitLastPayResolveDeadlineMap(api, channelId4);


    console.log("\n")
    console.log("============================ Clear Pays ======================================================")
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            await clearPays(
                api,
                'bob',
                channelId4,
                'bob',
                globalResult.payIdListArrays[i][1]
            );
        } else {
            await clearPays(
                api,
                'alice',
                channelId4,
                'alice',
                globalResult.payIdListArrays[i][1]
            );
        }
        await waitBlockNumber(2);
    }
    await emitChannelInfo(api, channelId4);
    await emitPeersMigrationInfo(api, channelId4);
    await emitPendingPayOutMap(api, channelId4);
    await waitBlockNumber(3);

    console.log("\n");
    console.log("================================= Snapshot States ===============================")
    const channelId5 = await openChannel(api, 'bob', false, 1000, true, 1000002);
    await waitBlockNumber(2);
    const payIdListInfo = await getPayIdListInfo(
        api,
        [[10, 20]]
    );
    let signedSimplexStateArray2 = await getSignedSimplexStateArray(
        api,
        [channelId5],
        [5],
        [100],
        [999999],
        [payIdListInfo.payIdLists[0]],
        [payIdListInfo.totalPendingAmount]
    );
    await snapshotStates(api, 'alice', signedSimplexStateArray2);
    await waitBlockNumber(2);
    await emitChannelInfo(api, channelId5);
    await waitBlockNumber(3);

    process.exit(0);
}

main();