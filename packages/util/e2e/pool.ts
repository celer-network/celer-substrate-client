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

    await approve(api, 'alice', 'celerLedgerId', 2000);
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'celerLedgerId');

    await increaseAllowance(api, 'alice', 'celerLedgerId', 1000);
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'celerLedgerId');

    await decreaseAllowance(api, 'alice', 'celerLedgerId', 1000);
    await waitBlockNumber(1);
    await emitAllowance(api, 'alice', 'celerLedgerId');

    console.log("\n", "======================== withdraw from pool ===================================")
    await withdrawFromPool(api, 'alice', 1000);
    await waitBlockNumber(1);
    await emitPoolBalance(api, 'alice');

    console.log("\n", "=================== transfer from alice to charlie ======================================")
    await approve(api, 'alice', 'bob', 10000);
    await waitBlockNumber(1);

    await transferFrom(api, 'bob', 'alice', 'charlie', 2000);
    await waitBlockNumber(1);
    await emitPoolBalance(api, 'alice');
    await emitAllowance(api, 'alice', 'bob');

    process.exit(0);
}

main();