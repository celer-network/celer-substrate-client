import { 
    connect,
    openChannel, 
    approve,
    intendWithdraw, 
    depositPool, 
    vetoWithdraw, 
    setBalanceLimits,
    disableBalanceLimits,
    enableBalanceLimits,
    deposit,
    confirmWithdraw,
    cooperativeWithdraw,
    withdrawFromPool,
    transferToCelerWallet,
    increaseAllowance,
    decreaseAllowance,
    waitBlockNumber,
    getCoSignedIntendSettle,
    intendSettle,
    resolvePaymentByConditions,
    getConditions,
    getConditionalPay,
    getVouchedCondPayResult,
    resolvePaymentByVouchedResult,
    clearPays,
    confirmSettle,
    getCooperativeSettleRequest,
    cooperativeSettle,
    getPayIdListInfo,
    getSignedSimplexStateArray,
    snapshotStates,
    depositInBatch,
    getResolvePayByCondtionsRequest,
    transferFrom,
    emitCelerLedgerId,
    emitChannelInfo,
    emitChannelStatusNum,
    emitPeersMigrationInfo,
    emitCelerWalletId,
    emitWalletInfo,
    emitPoolBalance,
    emitAllowance,
    emitPayResolverId,
    emitSettleFinalizedTime,
    emitCooperativeWithdrawSeqNum,
    emitTotalBalance,
    emitBalanceMap,
    emitDisputeTimeOut,
    emitStateSeqNumMap,
    emitTransferOutMap,
    emitLastPayResolveDeadlineMap,
    emitNextPayIdListHashMap,
    emitPendingPayOutMap,
    emitWithdrawIntent,
    emitPoolId,
} from "celer-substrate-utils";

import program from 'commander';

program.version('1.0.4', '-v, --version');

program
    .command('setBalanceLimits')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-l, --limits <limits>', 'Limits amount of channel')
    .action(async options => {
        const api = await connect();
        await setBalanceLimits(api, options.caller, options.channelId, options.limits);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('enableBalanceLimits')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await enableBalanceLimits(api, options.caller, options.channelId);
        await waitBlockNumber(3);
        process.exit(0);
    })

program
    .command('disableBalanceLimits')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await disableBalanceLimits(api, options.caller, options.channelId);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('openChannel')
    .option('-c, --caller <caller>', 'caller')
    .option('-z, --zeroTotalDeposit', 'amount of funds to deposit is zero')
    .option('-v, --msgValue <msgValue>', 'amount of funds to deposit from caller')
    .action(async options => {
        const api = await connect();
        if (options.zeroTotalDeposit === undefined) {
            await openChannel(api, options.caller, false, options.msgValue);
        } else {
            await openChannel(api, options.caller, true, options.msgValue);
        }
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('deposit')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-r, --receiver <receiver>', 'receiver of funds')
    .option('-v, --msgValue <msgValue>', 'amounts of funds to deposit from caller')
    .option('-a, --transferFromAmount <transferFromAmount>', 'amount of funds to be transfered from Pool')
    .action(async options => {
        const api = await connect();
        await deposit(api, options.caller, options.channelId, options.receiver, options.msgValue, options.transferFromAmount);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('depositInBatch')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelIds <channelIds>', 'Ids list of channel', (value) => { return (value).split(","); }, [])
    .option('-r, --receivers <receivers>', 'addresses list of receiver', (value) => { return (value).split(","); }, [])
    .option('-a, --msgValues <msgValues>', 'msgValues list of funds to deposit from caller', (value) => { return (value).split(","); }, [])
    .option('-f, --transferFromAmounts <transferFromAmounts>', 'amounts list of funds to be transfeed from Pool', (value) => { return (value).split(","); }, [])
    .action(async options => {
        const api = await connect();
        await depositInBatch(
            api,
            options.caller,
            options.channelIds,
            options.receivers,
            options.msgValues,
            options.transferFromAmounts,
        );
        await waitBlockNumber(3);
        process.exit(0);
    })

program
    .command('snapshotStates')
    .option('-c, --caller <caller>', 'caller')
    .option('-a, --payAmounts <payAmounts>', 'pay amounts list of linked pay id list', (value) => { return (value).split(","); }, [])
    .option('-i, --channelId <channelId>', 'Id of channel')
    .option('-n, --seqNum <seqNum>', 'sequence number')
    .option('-f, --transferFromAmount <transferFromAmount>', 'amounts of funds to be transfered from Pool')
    .action(async options => {
        const api = await connect();
        let payIdListInfo = await getPayIdListInfo(
            api,
            [options.payAmounts]
        );
        let signedSimplexStateArray = await getSignedSimplexStateArray(
            api,
            [options.channelId],
            [options.seqNum],
            [options.transferFromAmount],
            [999999],
            [payIdListInfo.payIdLists[0]],
            [payIdListInfo.totalPendingAmount]
        );

        await snapshotStates(api, options.caller, signedSimplexStateArray);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('intendWithdraw')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-a, --amount <amount>', 'amount of funds to withdraw')
    .action(async options => {
        const api = await connect();
        await intendWithdraw(api, options.caller, options.channelId, options.amount);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('confirmWithdraw')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await confirmWithdraw(api, options.caller, options.channelId);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('vetoWithdraw')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await vetoWithdraw(api, options.caller, options.channelId);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('cooperativeWithdraw')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-n, --seqNum <seqNum>', 'sequence number')
    .option('-a, --amount <amount>', 'amount of funds to withdraw')
    .option('-r, --receiverAccount <receiverAccount>', 'receiver address of funds')
    .action(async options => {
        const api = await connect();
        await cooperativeWithdraw(api, options.caller, options.channelId, options.seqNum, options.amount, options.receiverAccount);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('intendSettle')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of channel')
    .option('-n, --seqNums <seqNums>', 'sequence number list', (value) => { return (value).split(","); }, [])
    .option('-a, --transferAmounts <transferAmounts>',  'amount of token already transferred', (value) => { return (value).split(","); }, [])
    .action(async options => {
        const api = await connect();
        let globalResult = await getCoSignedIntendSettle(
            api,
            [options.channelId, options.channelId],
            [[[10, 20], [30, 40]], [[50, 60], [70, 80]]],
            options.seqNums,
            [999999, 999999],
            options.transferFromAmounts
        );
        const signedSimplexStateArray = globalResult.signedSimplexStateArray;

        await intendSettle(api, options.caller, signedSimplexStateArray);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('clearPays')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-n, --seqNums <seqNums>', 'sequence number list', (value) => { return (value).split(","); }, [])
    .option('-a, --transferFromAmounts <transferFromAmounts>', 'amounts list of funds to transfered from Pool', (value) => { return (value).split(","); }, [])
    .option('-f, --peerFrom <peerFrom>', 'address of the peer who owns and updates the simplex state')
    .option('-p, --peerIndex <peerIndex>', 'peerIndex of linked pay id list')
    .option('-l, --listIndex <listIndex>', 'listIndex of linked pay id list')
    .action(async options => {
        const api = await connect();
        let globalResult = await getCoSignedIntendSettle(
            api,
            [options.channelId, options.channelId],
            [[[10, 20], [30, 40]], [[50, 60], [70, 80]]],
            options.seqNums,
            [999999, 999999],
            options.transferFromAmounts
        );

        await clearPays(
            api,
            options.caller,
            options.channelId,
            options.peerFrom,
            globalResult.payIdListArrays[options.peerIndex][options.listIndex]
        );
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('confirmSettle')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options  => {
        const api = await connect();
        await confirmSettle(api, options.caller, options.channelId);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('cooperativeSettle')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-n, --seqNum <seqNum>', 'sequence number')
    .option('-a, --settleAmounts <settleAmounts>', 'cooperative settle amounts list', (value) => { return (value).split(","); }, [])
    .action(async options => {
        const api = await connect();
        let cooperativeSettleRequest = await getCooperativeSettleRequest(
            api,
            options.channelId,
            options.seqNum,
            options.settleAmounts
        );
        await cooperativeSettle(api, options.caller, cooperativeSettleRequest);
        await  waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('depositPool')
    .option('-c, --caller <caller>', 'caller')
    .option('-r, --receiver <receiver>', 'receiver of token')
    .option('-v, --msgValue <msgValue>', 'amount of funds to deposit from caller')
    .action(async options => {
        const api = await connect();
        await depositPool(api, options.caller, options.receiver, options.msgValue);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('withdrawFromPool')
    .option('-c, --caller <caller>', 'caller')
    .option('-v, --value <value>', 'amount of funds to withdraw from Pool')
    .action(async options => {
        const api = await connect();
        await withdrawFromPool(api, options.caller, options.value);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('transferFrom')
    .option('-c, --caller <caller>', 'caller')
    .option('-f, --from <from>', 'the address which you want to transfer funds from')
    .option('-t, --to <to>', 'the address which you want to transfer to')
    .option('-v, --value <value>', 'amount of funds to be transferred')
    .action(async options => {
        const api = await connect();
        await transferFrom(
            api,
            options.caller,
            options.from,
            options.to,
            options.value
        );
        await waitBlockNumber(3);
        process.exit(0);
    })

program
    .command('approve')
    .option('-c, --caller <caller>', 'caller')
    .option('-s, --spender <spender>', 'the address which will spend the funds')
    .option('-v, --value <value>', 'amount of funds to spend')
    .action(async options => {
        const api = await connect();
        await approve(api, options.caller, options.spender, options.value);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('transferToCelerWallet')
    .option('-c, --caller <caller>', 'caller')
    .option('-f, --from <from>', 'the address which you want to transfer funds from')
    .option('-i, --walletId <walletId>', 'Id of the wallet')
    .option('-a, --amount <amount>', 'amount of funds to be transfered')
    .action(async options => {
        const api = await connect();
        await transferToCelerWallet(api, options.caller, options.from, options.walletId, options.amount);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('increaseAllowance')
    .option('-c, --caller <caller>', 'caller')
    .option('-s, --spender <spender>', 'the address which will spend the funds')
    .option('-v, --addedValue <addedValue>', 'amount of funds to increase the allowance by spender')
    .action(async options => {
        const api = await connect();
        await increaseAllowance(api, options.caller, options.spender, options.addedValue);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('decreaseAllowance')
    .option('-c, --caller <caller>', 'caller')
    .option('-s, --spender <spender>', 'the address which will spend the funds')
    .option('-v, --subtractedValue <subtractedValue>', 'amount of funds to decrease the allowance by spender')
    .action(async options => {
        const api = await connect();
        await decreaseAllowance(api, options.caller, options.spender, options.subtractedValue);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('resolvePaymentByConditions')
    .option('-c, --caller <caller>', 'caller')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .option('-n, --seqNums <seqNums>', 'sequence number list', (value) => { return (value).split(","); }, [])
    .option('-a, --transferFromAmounts <transferFromAmounts>',  'amounts of funds to be transfered from Pool', (value) => { return (value).split(","); }, [])
    .option('-p, --peerIndex <peerIndex>', 'peerIndex of linked pay id list')
    .option('-l, --listIndex <listIndex>', 'listIndex of linked pay id list')
    .option('-x, --payIndex <payIndex>', 'payIndex of linked pay id list')
    .action(async options => {
        const api = await connect();
        let globalResult = await getCoSignedIntendSettle(
            api,
            [options.channelId, options.channelId],
            [[[10, 20], [30, 40]], [[50, 60], [70, 80]]],
            options.seqNums,
            [999999, 999999],
            options.transferFromAmounts
        );

        let payRequest = await getResolvePayByCondtionsRequest(api, globalResult.condPays[options.peerIndex][options.listIndex][options.payIndex]);
        await resolvePaymentByConditions(
            api, 
            options.caller, 
            payRequest
        );
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('resolvePaymentByVouchedResult')
    .option('-c, --caller <caller>', 'caller')
    .option('-s, --conditions <conditions>', 'type of conditions list')
    .option('-m, --maxAmounts <maxAmounts>', 'maximum token transfer amount')
    .option('-t, --logicType <logicType>', 'type of resolving logic based on condition outcome')
    .option('-a, --amount <amount>', 'vouch amount')
    .action(async options => {
        const api = await connect();
        let conditions = await getConditions(api, options.conditions);
        let sharedPay = await getConditionalPay(
            api,
            conditions,
            options.maxAmounts,
            0,
            999999,
            10,
            options.logicType
        );

        let vouchedCondPayResult = await getVouchedCondPayResult(
            api,
            sharedPay,
            options.amount
        );

        await resolvePaymentByVouchedResult(api, options.caller, vouchedCondPayResult);
        await waitBlockNumber(3);
        process.exit(0);
    });

program
    .command('emitCelerLedgerId')
    .action(async options => {
        const api = await connect();
        await emitCelerLedgerId(api);
        process.exit(0);
    });

program
    .command('emitChannelInfo')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitChannelInfo(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitSettleFinalizedTime')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitSettleFinalizedTime(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitCooperativeWithdrawSeqNum')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitCooperativeWithdrawSeqNum(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitTotalBalance')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitTotalBalance(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitBalanceMap')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitBalanceMap(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitDisputeTimeOut')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitDisputeTimeOut(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitStateSeqNumMap')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitStateSeqNumMap(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitTransferOutMap')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitTransferOutMap(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitNextPayIdListHashMap')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitNextPayIdListHashMap(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitLastPayResolveDeadlineMap')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitLastPayResolveDeadlineMap(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitPendingPayOutMap')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitPendingPayOutMap(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitWithdrawIntent')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitWithdrawIntent(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitChannelStatusNum')
    .option('-s, --channelStatus <channelStatus>', 'status of channel')
    .action(async options => {
        const api = await connect();
        await emitChannelStatusNum(api, options.channelStatus);
        process.exit(0);
    });

program
    .command('emitPeersMigrationInfo')
    .option('-i, --channelId <channelId>', 'Id of the channel')
    .action(async options => {
        const api = await connect();
        await emitPeersMigrationInfo(api, options.channelId);
        process.exit(0);
    });

program
    .command('emitCelerWalletId')
    .action(async options => {
        const api = await connect();
        await emitCelerWalletId(api);
        process.exit(0);
    });

program
    .command('emitWalletInfo')
    .option('-i, --walletId <walletId>', 'Id of the wallet')
    .action(async options => {
        const api = await connect();
        await emitWalletInfo(api, options.walletId)
        process.exit(0);
    });

program
    .command('emitPoolId')
    .action(async options => {
        const api = await connect();
        await emitPoolId(api);
        process.exit(0);
    });

program
    .command('emitPoolBalance')
    .option('-o, --owner <owner>', 'the address of query balance of')
    .action(async options => {
        const api = await connect();
        await emitPoolBalance(api, options.owner);
        process.exit(0);
    });

program
    .command('emitAllowance')
    .option('-o, --owner <owner>', 'the address of query balance of')
    .option('-s, --spender <spender>', 'the address which will spend the funds')
    .action(async options => {
        const api = await connect();
        await emitAllowance(api, options.owner, options.spender);
        process.exit(0);
    });

program
    .command('emitPayResolverId')
    .action(async options => {
        const api = await connect();
        await emitPayResolverId(api);
        process.exit(0);
    });



program.parse();

    