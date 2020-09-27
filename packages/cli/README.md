## Requirements
- Install docker
- Install Node 10
- Install Yarn >= 1.10.1

## Install and Build
1. Install celer-substrate-demo repository
```
git clone git@github.com:celer-network/celer-substrate-client.git
```
2. Go to cli file
``` 
cd ./packages/cli
```
3. Install dependency
``` 
npm install
```
4. Build
```
yarn build
```


## Run
1. Run Celer substrate local testnet. Repository is [here](https://github.com/celer-network/cChannel-substrate)
```
docker run -p 9944:9944 -p 9615:9615 thashimoto19980924/celer-network:latest
```

2. Send transaction
### [Open Channel](https://www.celer.network/docs/celercore/channel/pay_contracts.html#open-channel)
Open a state channle through auth withdraw message
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|zeroTotalDeposit|No|amount of funds to deposit is zero|
|msgValue|Yes|amount of funds to deposit from caller|

```
ex1) open channel with [bob's deposit, alice's deposit] = [1000, 2000]
yarn start openChannel --caller 'bob' --msgValue 1000
ex2) open channel with total deposit amount is zero
yarn start openChannel --caller 'alice' --zeroTotalDeposit --msgValue 0
```
### Set Balance Limits
Set the balance limits of channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of the channel|
|limits|Yes|Limits amount of channel|
```
yarn start setBalanceLimits --caller 'alice' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30" --limits 20000
```

### Enable Balance Limits
Enable balacne limits
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of the channel|
```
yarn start enabelBalanceLimits --caller 'alice' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30"
```

### Disable Balance Limits
Disable balance limits
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of the channel|
```
yarn start disabelBalanceLimits --caller 'bob' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30"
```

### [Deposit](https://www.celer.network/docs/celercore/channel/pay_contracts.html#deposit)
Deposit funds into the channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of the channel|
|receiver|Yes|receiver of funds|
|msgValue|Yes|amounts of funds to deposit from caller|
|transferFromAmount|Yes|amount of funds to be transfered from Pool|
```
yarn start deposit --caller 'alice' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30" --receiver 'alice' --msgValue 1000 --transferFromAmount 1000
```

### Deposit In Batch
Deposit funds into the channel in batch
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelIds|Yes|Ids list of channels|
|receivers|Yes|addresses list of receiver|
|msgValues|Yes|msgValues list of funds to deposit from caller|
|transferFromAmounts|Yes|amounts list of funds to be transfeed from Pool|

```
yarn start depositInBatch --caller 'alice' --channelIds '0x811d25466cf620a5fb3d551b6d3603e7f78cb11e7034955d552eba733da3dc2b','0x0b2a00bb808e7deb38ceccf7493fd34708c4fd5d2ae8d6396e657d9fd7e76e82' --receivers 'alice','bob' --msgValues 1000,100 --transferFromAmounts 0,1000
```

### Snapshot States
Store signed simplex states on-chain as checkpoints
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|payAmounts|Yes|pay amounts list of linked pay id list|
|channelId|Yes|Id of channel| 
|transferAmounts|Yes|amount of token already transferred|
```
yarn start snapshotStates --caller 'alice' --payAmounts 10,20 --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNum 5 --transferAmounts 100 
```

### [Intend Withdraw](https://www.celer.network/docs/celercore/channel/pay_contracts.html#unilateral-withdraw)
Intend to withdraw funds from channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|payAmounts|Yes|pay amounts list of linked pay id list|
|channelId|Yes|Id of channel| 
|amount|Yes|amount of funds to withdraw|
```
yarn start intendWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'  --amount 1000
```

### [Confrim Withdraw](https://www.celer.network/docs/celercore/channel/pay_contracts.html#unilateral-withdraw)
Confirm channel withdrawal
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
```
yarn start confirmWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### [Veto Withdraw](https://www.celer.network/docs/celercore/channel/pay_contracts.html#unilateral-withdraw)
Veto current withdrawal intent
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
```
yarn start vetoWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```
### [Cooperative Withdraw](https://www.celer.network/docs/celercore/channel/pay_contracts.html#cooperative-withdraw)
Cooperatively withdraw specfic amount of balance
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
|seqNum|Yes|sequence number|
|amount|Yes|amount of funds to withdraw|
|receiverAccount|Yes|receiver address of funds|
```
yarn start cooperativeWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'  --seqNum 1 --amount 1000 --receiverAccount 'alice'
```

### [Intend Settle](https://www.celer.network/docs/celercore/channel/pay_contracts.html#unilateral-settle)
Intend to settle channel with an array of signed simplex states
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
|seqNums|Yes|sequence number list|
|transferAmounts|Yes|amount of token already transferred|
```
yarn start intendSettle --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNums 1,1 --transferAmounts 100,200
```

### Clear Pays
Read payment results and add results to corresponding simplex payment channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
|seqNums|Yes|sequence number list|
|transferAmounts|Yes|amount of token already transferred|
|peerFrom|Yes|adress of the peer who send out funds|
|peerIndex|Yes|peerIndex of linked pay id list|
|listIndex|Yes|listIndex of linked pay id list|
```
yarn start clearPays --caller 'bob' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNums 1,1 --transferAmounts 100,200 --peerFrom 'bob' --peerIndex 0 --listIndex 1
```

### [Confirm Settle](https://www.celer.network/docs/celercore/channel/pay_contracts.html#unilateral-settle)
Confirm channel settlement
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
```
yarn start confirmSettle --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### [Cooperative Settle](https://www.celer.network/docs/celercore/channel/pay_contracts.html#cooperative-settle)
Cooperatively settle the channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
|seqNum|Yes|sequence number|
|settleAmounts|Yes|settle amounts list|
```
yarn start cooperativeSettle --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNum 2 --settleAmounts 1000,4000
```

### Deposit Pool
Deposit Native token into Pool
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|receiver|Yes|the address native token is deposited to pool|
|msgValue|Yes|amount of funds to deposit to pool|
```
yarn start depositPool --caller 'alice' --receiver 'alice' --msgValue 20000
```

### Withdraw From Pool
Withdraw native token from Pool
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|value|Yes|amount of funds to withdraw from pool|
```
yarn start withdrawFromPool --caller 'alice' --value 100
```

### Approve
Approve the passed address the spend the specified amount of funds on behalf of caller.
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|spender|Yes|the address which will spend the funds|
|value|Yes|amount of funds to spent|
```
yarn start approve --caller 'alice' --spender 'celerLedgerId' --value 20000
```

### Transfer From
Transfer funds from one address to another.
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|from|Yes|the address which you want to transfer funds from|
|to|Yes|the address which you want to transfer to|
|value|Yes|amount of funds to be transferred|
```
yarn start transferFrom --caller 'bob' --from 'alice' --to 'charlie' --value 1000
```

### Increase Allowance
Increase the amount of native token that an owner allowed to a spender
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|spender|Yes|the address which will spend the funds|
|addedValue|Yes|amount of funds to increase the allowance by spender|
```
yarn start increaseAllowance --caller 'alice' --spender 'celerLedgerId' --addedValue 1000
```

### Decrease Allowance
Decrease the amount of native token that an owner allowed to a spender
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|spender|Yes|the address which will spend the funds|
|subtractedValue|Yes|amount of funds to decrease the allowance by spender|
```
yarn start decreaseAllowance --caller 'alice' --spender 'celerLedgerId' --subtractedValue 1000
```

### [Resolve Payment By Conditions](https://www.celer.network/docs/celercore/channel/pay_contracts.html#resolve-payment-by-conditions)
Resolve a payment by onchain getting its conditons outcomes
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|channelId|Yes|Id of channel| 
|seqNums|Yes|sequence number list|
|transferAmounts|Yes|amount of token already transferred|
|peerFrom|Yes|adress of the peer who send out funds|
|peerIndex|Yes|peerIndex of linked pay id list|
|listIndex|Yes|listIndex of linked pay id list|
|payIdex|Yes|payIndex of linked pay id list|
```
yarn start resolvePaymentByConditions --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNums 1,1 --transferAmounts 100,200 --peerIndex 0 --listIndex 0 --payIndex 0
```

### [Resolve Payment By Vouched Result](https://www.celer.network/docs/celercore/channel/pay_contracts.html#resolve-payment-by-vouched-result)
Resolve a payment by submitting an offchain vouched result
#### Parameter
|Name|Required|Description|
|---|---|---|
|caller|Yes|caller of dispatchable function|
|conditions|Yes|type of conditions list|
|maxAmounts|Yes|maximum token transfer amount|
|logicType|Yes|type of resolving logic based on condition outcome|
|amount|Yes|vouch amount|
```
yarn start resolvePaymentByVouchedResult --caller 'alice' --conditions 5 --maxAmounts 100 --logicType 3 --amount 20
```

### Emit Celer Ledger Id
Emit AccountId of Ledger Operation module
```
yarn start emitCelerLedgerId
```

### Emit ChannelInfo
Emit channel basic info
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitChannelInfo --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Settle finalized time
Emit confrim settle open time
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitSettleFinalizedTime --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Cooperative Withdraw Seq Num
Emit cooperative withdraw seq num
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitCooperativeWithdrawSeqNum --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Total Balance
Emit one channel's total balance amount
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitTotalBalance --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Balance Map
Emit one channel's balance info
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitBalanceMap --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Dispute Time Out
Emit dispute timeout
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitDisputeTimeout --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit State Seq Num Map
Emit state seq_num map of a duplex channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitStateSeqNumMap --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Transfer Out Map
Emit transfer_out map of a duplex channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitTransferOutMap --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Next Pay Id List Hash Map
Emit next_pay_id_list_hash_map of a duplex channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitNextPayIdListHashMap --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Last Pay Resolve Deadline Map 
Emit last_pay_resolve_deadline map of a duplex channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitLastPayResolveDeadlineMap --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Pending Pay Out Map
Emit pending_pay_out_map of a duplex channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitPendingPayOutMap --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Withdraw Intent
Emit withdraw intent of the channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelId|Yes|Id of channel|
```
yarn start emitWithdrawIntent --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit channel number if given status
Emit channel number if given status
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelStatus|Yes|status of channel|
```
yarn start emitChannelStatusNum --channelStatus 1
```

### Emit Peers Migration Info
Emit migration info of the peers in the channel
#### Parameter
|Name|Required|Description|
|---|---|---|
|channelStatus|Yes|status of channel|
```
yarn start emitPeersMigrationInfo --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Celer Wallet Id
Emit AccountId of Celer Wallet module
#### Parameter
|Name|Required|Description|
|---|---|---|
|walletId|Yes|Id of wallet|
```
yarn start emitCelerWalletId --walletId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Wallet Info
Emit wallet info corresponding to wallet_id
#### Parameter
|Name|Required|Description|
|---|---|---|
|walletId|Yes|Id of wallet|
```
yarn start emitWalletInfo --walletId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

### Emit Pool Id
Emit AccountId of Pool
```
yarn start emitPoolId
```

### Emit Pool Balance
Emit Amount of funds which is pooled of specified address
#### Parameter
|Name|Required|Description|
|---|---|---|
|owner|Yes|the address of query balance of|
```
yarn start emitPoolBalance --owner 'alice'
```

### Emit Allowance
Emit Amount of funds which owner allowed to a spender
#### Parameter
|Name|Required|Description|
|---|---|---|
|owner|Yes|the address of query balance of|
|spender|Yes|the address which will spend the funds|
```
yarn start emitAllowance --owner 'alice' --spender 'celerLedgerId'
```

### Emit Pay Reoslver Id
Emit AccountId of PayResolver module
```
yarn start emitPayResolverId
```







