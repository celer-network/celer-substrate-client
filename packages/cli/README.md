## Run
1. Install dependency
```
npm install
```
2. Build
```
yarn build
```
3. Run Celer substrate local testnet
```
docker run -p 9944:9944 -p 9615:9615 thashimoto19980924/celer-network:latest
```
4. Send transaction
- Open Channel
```
ex1)
yarn start openChannel --caller 'bob' --msgValue 1000
ex2)
yarn start openChannel --caller 'alice' --zeroTotalDeposit --msgValue 0
```
- Set Balance Limits
```
ex)
yarn start setBalanceLimits --caller 'alice' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30" --limits 20000
```

- Enable Balance Limits
```
yarn start enabelBalanceLimits --caller 'alice' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30"
```

- Disable Balance Limits
```
yarn start disabelBalanceLimits --caller 'bob' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30"
```

- Deposit
```
yarn start deposit --caller 'alice' --channelId "0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30" --receiver 'alice' --msgValue 1000 --transferFromAmount 1000
```

- Deposit In Batch
```
yarn start depositInBatch --caller 'alice' --channelIds '0x811d25466cf620a5fb3d551b6d3603e7f78cb11e7034955d552eba733da3dc2b','0x0b2a00bb808e7deb38ceccf7493fd34708c4fd5d2ae8d6396e657d9fd7e76e82' --receivers 'alice','alice' --msgValues 1000,100 --transferFromAmounts 0,0
```

- Snapshot States
```
yarn start snapshotStates --caller 'alice' --payAmounts 10,20 --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNum 5 --transferFromAmount 100 
```

- Intend Withdraw
```
yarn start intendWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'  --amount 1000
```

- Confrim Withdraw
```
yarn start confirmWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

- Veto Withdraw
```
yarn start vetoWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```
- Cooperative Withdraw
```
yarn start cooperativeWithdraw --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'  --seqNum 1 --amount 1000 --receiverAccount 'alice'
```

- Intend Settle
```
yarn start intendSettle --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNums 1,1 --transferFromAmounts 100,200
```

- Clear Pays
```
yarn start clearPays --caller 'bob' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNums 1,1 --transferFromAmounts 100,200 --peerFrom 'bob' --peerIndex 0 --listIndex 1
```

- Confirm Settle
```
yarn start confirmSettle --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30'
```

- Cooperative Settle
```
yarn start cooperativeSettle --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNum 2 --settleAmounts 1000,4000
```

- Deposit Native Token
```
yarn start depositNativetoken --caller 'alice' --walletId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --msgValue 1000
```

- Deposit Pool
```
yarn start depositPool --caller 'alice' --receiver 'alice' --msgValue 20000
```

- Withdraw From Pool
```
yarn start withdrawFromPool --caller 'alice' --value 100
```

- Approve
```
yarn start approve --caller 'alice' --spender 'celerLedgerId' --value 20000
```

- Transfer To Celer Wallet
```
yarn start transferToCelerWallet --caller 'bob' --from 'alice' --walletId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --amount 1000
```

- Increase Allowance
```
yarn start increaseAllowance --caller 'alice' --spender 'celerLedgerId' --addedValue 1000
```

- Decrease Allowance
```
yarn start decreaseAllowance --caller 'alice' --spender 'celerLedgerId' --subtractedValue 1000
```

- Resolve Payment By Conditions
```
yarn start resolvePaymentByConditions --caller 'alice' --channelId '0x73f3379879d5945f4abf4f1f726f89ca45cc8865e00f3d4c52fe0289889c1c30' --seqNums 1,1 --transferFromAmounts 100,200 --peerIndex 0 --listIndex 0 --payIndex 0
```

- Resolve Payment By Vouched Result
```
yarn start resolvePaymentByVouchedResult --caller 'alice' --conditions 5 --maxAmounts 100 --logicType 3 --amount 20
```

