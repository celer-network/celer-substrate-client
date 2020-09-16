import { connect } from "../src/connect";
import { 
    depositPool,
    approve,
    emitPoolBalance,
    emitAllowance,
    increaseAllowance,
    decreaseAllowance,
    withdrawFromPool,
    transferFrom,
    openChannel,
    transferToCelerWallet,
    emitWalletInfo,
} from "../src/funcs";
import {
    waitBlockNumber
} from "../src/utils";

async function main(): Promise<void> {
    const api = await connect();

    console.log("====================== depositPool and approve ==============================")
    await depositPool(api, 'alice', 'alice', 20000);
    await waitBlockNumber(1);
    await emitPoolBalance(api, 'alice');
    await waitBlockNumber(1);

    await approve(api, 'alice', 'celerLedgerId', 2000);
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'celerLedgerId');
    await waitBlockNumber(1);

    await increaseAllowance(api, 'alice', 'celerLedgerId', 1000);
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'celerLedgerId');
    await waitBlockNumber(1);

    await decreaseAllowance(api, 'alice', 'celerLedgerId', 1000);
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'celerLedgerId');
    await waitBlockNumber(1);

    console.log("======================== withdraw from pool ===================================")
    await withdrawFromPool(api, 'alice', 1000);
    await waitBlockNumber(1);
    await emitPoolBalance(api, 'alice');
    await waitBlockNumber(1);

    console.log("=================== transfer from alice to charlie ======================================")
    await approve(api, 'alice', 'bob', 10000);
    await waitBlockNumber(1);

    await transferFrom(api, 'bob', 'alice', 'charlie', 2000);
    await waitBlockNumber(1);
    await emitPoolBalance(api, 'alice');
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'bob');
    await waitBlockNumber(1);

    console.log("====================== transfer to celer waiit =======================================");
    const channelId = await openChannel(api, 'alice', true, 0);
    await waitBlockNumber(1);

    await transferToCelerWallet(api, 'bob', 'alice', channelId, 2000);
    await waitBlockNumber(1);
    await emitPoolBalance(api, 'alice');
    await waitBlockNumber(1);
    await emitWalletInfo(api, channelId);
    await waitBlockNumber(3);

    process.exit(0);
}

main();