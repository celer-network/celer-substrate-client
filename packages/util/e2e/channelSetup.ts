import { connect } from "../src/connect";
import { 
    setBalanceLimits,
    disableBalanceLimits,
    enableBalanceLimits,
    openChannel,
    depositPool,
    approve,
    emitChannelInfo,
    emitBalanceMap,
    emitPeersMigrationInfo,
    depositNativeToken,
    emitWalletInfo,
    depositInBatch,
    deposit,
} from "../src/funcs";
import {
    waitBlockNumber
} from "../src/utils";

async function main(): Promise<void> {
    const api = await connect();

    console.log("===================== open channel with total balance is zero ===============")
    const channelId1 = await openChannel(api, 'alice', true, 0);
    await waitBlockNumber(2);

    await emitChannelInfo(api, channelId1);
    await emitBalanceMap(api, channelId1);

    console.log("==================================== disable balance limits ==============================")
    await disableBalanceLimits(api, 'alice', channelId1);
    await waitBlockNumber(2);

    console.log("==================================== enable balance limits ===============================")
    await enableBalanceLimits(api, 'alice', channelId1);
    await waitBlockNumber(2);

    console.log("==================================== set balance limits ====================================")
    await setBalanceLimits(api, 'alice', channelId1, 10000);
    await waitBlockNumber(2);

    console.log("======================== open channel with deposits [1000, 2000] ===========================")
    await depositPool(api, 'alice', 'alice', 20000);
    await waitBlockNumber(2);
        
    await approve(api, 'alice', 'celerLedgerId', 20000);
    await waitBlockNumber(2);

    const channelId2 = await openChannel(api, 'bob', false, 1000);
    await waitBlockNumber(2);
    await emitChannelInfo(api, channelId2);
    await emitPeersMigrationInfo(api, channelId2);

    console.log("================================== deposit to channel =================================================")
    await deposit(api, 'alice', channelId1, 'bob', 1000, 100);
    await waitBlockNumber(2);
    await emitWalletInfo(api, channelId1);
    await waitBlockNumber(1);

    await depositInBatch(api, 'alice', [channelId1,channelId2], ['bob','alice'], [1000,1000], [100,100]);
    await waitBlockNumber(2);
    await emitWalletInfo(api, channelId1);
    await emitPeersMigrationInfo(api, channelId1);
    await emitWalletInfo(api, channelId2);
    await emitPeersMigrationInfo(api, channelId2);

    await depositNativeToken(api, 'alice', channelId1, 1000);
    await waitBlockNumber(2);
    await emitWalletInfo(api, channelId1);
    await emitPeersMigrationInfo(api, channelId1);
    await waitBlockNumber(3);
    process.exit(0);
}

main();