"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../src/connect");
const funcs_1 = require("../src/funcs");
const utils_1 = require("../src/utils");
async function main() {
    const api = await connect_1.connect();
    console.log("====================== depositPool and approve ==============================");
    await funcs_1.depositPool(api, 'alice', 'alice', 20000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.emitPoolBalance(api, 'alice');
    await funcs_1.approve(api, 'alice', 'celerLedgerId', 2000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.emitAllowance(api, 'alice', 'celerLedgerId');
    await funcs_1.increaseAllowance(api, 'alice', 'celerLedgerId', 1000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.emitAllowance(api, 'alice', 'celerLedgerId');
    await funcs_1.decreaseAllowance(api, 'alice', 'celerLedgerId', 1000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.emitAllowance(api, 'alice', 'celerLedgerId');
    console.log("\n", "======================== withdraw from pool ===================================");
    await funcs_1.withdrawFromPool(api, 'alice', 1000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.emitPoolBalance(api, 'alice');
    console.log("\n", "=================== transfer from alice to charlie ======================================");
    await funcs_1.approve(api, 'alice', 'bob', 10000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.transferFrom(api, 'bob', 'alice', 'charlie', 2000);
    await utils_1.waitBlockNumber(1);
    await funcs_1.emitPoolBalance(api, 'alice');
    await funcs_1.emitAllowance(api, 'alice', 'bob');
    process.exit(0);
}
main();
