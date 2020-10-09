import { ApiPromise } from '@polkadot/api';
import { bool } from '@polkadot/types';
import { selectChannelPeer } from './utils';

export async function getCelerLedgerId(api: ApiPromise): Promise<string> {
    const celerLedgerId = await api.rpc.celerPayModule.getCelerLedgerId();
    return celerLedgerId.toHuman();
}

export async function getSettleFinalizedTime(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const settleFinalizedTime = await api.rpc.celerPayModule.getSettleFinalizedTime(channelId);
    return settleFinalizedTime.toNumber();
}

export async function getChannelStatus(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const channelStatus = await api.rpc.celerPayModule.getChannelStatus(channelId);
    return channelStatus.toNumber();
}

export async function getCooperativeWithdrawSeqNum(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const seqNum = await api.rpc.celerPayModule.getCooperativeWithdrawSeqNum(channelId);
    return seqNum.number.toNumber();
}

export async function getTotalBalance(
    api: ApiPromise, 
    channelId: string
): Promise<number> {
    const totalBalance = await api.rpc.celerPayModule.getTotalBalance(channelId);
    return totalBalance.amount.toNumber();
}

export async function getBalanceMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[], number[]]> {
    const [channelPeers, deposits, withdrawals] = await api.rpc.celerPayModule.getBalanceMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [deposits[0].amount.toNumber(), deposits[1].amount.toNumber()],
        [withdrawals[0].amount.toNumber(), withdrawals[1].amount.toNumber()]
    ];
}

export async function getDisputeTimeOut(
    api: ApiPromise,
    channelId: string
): Promise<number> {
    const disputeTimeOut = await api.rpc.celerPayModule.getDisputTimeOut(channelId);
    return disputeTimeOut.toNumber();
}

export async function getStateSeqNumMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, seqNums] = await api.rpc.celerPayModule.getStateSeqNumMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [seqNums[0].number.toNumber(), seqNums[1].number.toNumber()]
    ];
}

export async function getTransferOutMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, transferOuts] = await api.rpc.celerPayModule.getTransferOutMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [transferOuts[0].amount.toNumber(), transferOuts[1].amount.toNumber()]
    ];
}

export async function getNextPayIdListHashMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], string[]]> {
    const [channelPeers, nextPayIdListsHashes] = await api.rpc.celerPayModule.getNextPayIdListHashMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [nextPayIdListsHashes[0].toHex(), nextPayIdListsHashes[1].toHex()]
    ];
}

export async function getLastPayResolveDeadlineMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, lastPayResolveDeadlines] = await api.rpc.celerPayModule.getLastPayResolveDeadlineMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [lastPayResolveDeadlines[0].toNumber(), lastPayResolveDeadlines[1].toNumber()]
    ];
}

export async function getPendingPayOutMap(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[]]> {
    const [channelPeers, pendingPayOuts] = await api.rpc.celerPayModule.getPendingPayOutMap(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [pendingPayOuts[0].amount.toNumber(), pendingPayOuts[1].amount.toNumber()]
    ];
}

export async function getWithdrawIntent(
    api: ApiPromise,
    channelId: string
): Promise<[string, number, number, string]> {
    const [receiver, withdrawIntentAmount, withdrawIntentRequestTime, recipientChannelId]
        = await api.rpc.celerPayModule.getWithdrawIntent(channelId);

    return [
        receiver.toHuman(),
        withdrawIntentAmount.amount.toNumber(),
        withdrawIntentRequestTime.toNumber(),
        recipientChannelId.toHex()
    ];
}

export async function getChannelStatusNum(
    api: ApiPromise,
    channelStatus: number
): Promise<number> {
    const statusNums = await api.rpc.celerPayModule.getChannelStatusNum(channelStatus);
    return statusNums.toHuman();
}

export async function getBalanceLimits(
    api: ApiPromise,
    channelId: string
): Promise<number> {
    const balanceLimits = await api.rpc.celerPayModule.getBalanceLimits(channelId);
    return balanceLimits.amount.toNumber();
}

export async function getBalanceLimitsEnabled(
    api: ApiPromise,
    channelId: string
): Promise<bool> {
    const balanceLimitsEnabled = await api.rpc.celerPayModule.getBalanceLimitsEnabled(channelId);
    return balanceLimitsEnabled.toHuman();
}

export async function getPeersMigrationInfo(
    api: ApiPromise,
    channelId: string
): Promise<[string[], number[], number[], number[], number[], number[]]> {
    const [channelPeers, deposits, withdrawals, seqNums, transferOuts, pendingPayOuts]
        = await api.rpc.celerPayModule.getPeersMigrationInfo(channelId);
    return [
        [channelPeers[0].toHuman(), channelPeers[1].toHuman()],
        [deposits[0].amount.toNumber(), deposits[1].amount.toNumber()],
        [withdrawals[0].amount.toNumber(), withdrawals[1].amount.toNumber()],
        [seqNums[0].number.toNumber(), seqNums[1].number.toNumber()],
        [transferOuts[0].amount.toNumber(), transferOuts[1].amount.toNumber()],
        [pendingPayOuts[0].amount.toNumber(), pendingPayOuts[1].amount.toNumber()]
    ];
}

export async function getCelerWalletId(
    api: ApiPromise
): Promise<string> {
    const celerWalletId = await api.rpc.celerPayModule.getCelerWalletId();
    return celerWalletId.toHex();
}

export async function getWalletOwners(
    api: ApiPromise,
    walletId: string
): Promise<string[]> {
    const walletOwners = await api.rpc.celerPayModule.getWalletOwners(walletId);
    return [walletOwners[0].toHuman(), walletOwners[1].toHuman()];
}

export async function getWalletBalance(
    api: ApiPromise,
    walletId: string
): Promise<number> {
    const walletBalance = await api.rpc.celerPayModule.getWalletBalance(walletId);
    return walletBalance.amount.toNumber();
}

export async function getPoolId(
    api: ApiPromise,
): Promise<string> {
    const poolId = await api.rpc.celerPayModule.getPoolId();
    return poolId.toHuman();
}

export async function getPoolBalance(
    api: ApiPromise,
    _owner: string
): Promise<number> {
    let owner = await selectChannelPeer(api, _owner);
    const poolBalance = await api.rpc.celerPayModule.getPoolBalance(owner);
    return poolBalance.amount.toNumber();
}

export async function getAllowance(
    api: ApiPromise,
    _owner: string,
    _spender: string
): Promise<number> {
    let owner = await selectChannelPeer(api, _owner);

    let spender;
    if (_spender == 'bob') {
        spender = api.registry.createType("AccountId", '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');
    } else if (_spender == 'celerLedgerId') {
        spender = '0x6d6f646c5f6c65646765725f0000000000000000000000000000000000000000';
    }
    const allowance = await api.rpc.celerPayModule.getAllowance(owner, spender);
    return allowance.amount.toNumber();
}

export async function getPayResolverId(
    api: ApiPromise
): Promise<string> {
    const payResolverId = await api.rpc.celerPayModule.getPayResolverId();
    return payResolverId.toHuman();
}

export async function calculatePayId(
    api: ApiPromise,
    payHash: string
): Promise<string> {
    const payId = await api.rpc.celerPayModule.calculatePayId(payHash);
    return payId.toHex();
}

