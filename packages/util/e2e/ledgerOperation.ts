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
    cooperativeWithdraw
} from "../src/funcs";
import {
    waitBlockNumber
} from "../src/utils";

async function main(): Promise<void> {
    const api = await connect();

    console.log("====================== intend withdraw and confirm withdraw =========================")
    await depositPool(api, 'alice', 'alice', 20000);
    await waitBlockNumber(2);
    
    await approve(api, 'alice', 'celerLedgerId', 20000);
    await waitBlockNumber(2);

    const channelId = await openChannel(api, 'bob', false, 1000);
    await waitBlockNumber(2);
    await deposit(api, 'alice', channelId, 'bob', 2000, 0);
    await waitBlockNumber(2);
 
    await intendWithdraw(api, 'bob', channelId, 1000);
    await waitBlockNumber(2);
    await emitWithdrawIntent(api, channelId);
    await waitBlockNumber(10);

    await confirmWithdraw(api, 'bob', channelId);
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId);
    await waitBlockNumber(3);

    console.log("========================= intend withdraw and veto withdraw ============================")
    await intendWithdraw(api, 'alice', channelId, 1000);
    await waitBlockNumber(2);
    await emitWithdrawIntent(api, channelId);
    await waitBlockNumber(3);

    await vetoWithdraw(api, 'bob', channelId);
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId);
    await waitBlockNumber(2);

    console.log("=============================== cooperative withdraw ====================================")
    await cooperativeWithdraw(api, 'alice', channelId, 1, 1000, 'bob');
    await waitBlockNumber(2);
    await emitPeersMigrationInfo(api, channelId);
    await waitBlockNumber(3);

    process.exit(0);
}

main();