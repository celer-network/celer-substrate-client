import { AnyNumber } from '@polkadot/types/types';
import { Compact, Option, Vec } from '@polkadot/types/codec';
import { Bytes, u32, u64, u8 } from '@polkadot/types/primitive';
import { Extrinsic } from '@polkadot/types/interfaces/extrinsics';
import { GrandpaEquivocationProof, KeyOwnerProof } from '@polkadot/types/interfaces/grandpa';
import { AccountId, AccountIndex, Address, Balance, BalanceOf, Call, ChangesTrieConfiguration, Hash, KeyValue, LookupSource, Moment, Perbill, Weight } from '@polkadot/types/interfaces/runtime';
import { Key } from '@polkadot/types/interfaces/system';
import { CooperativeSettleRequestOf, CooperativeWithdrawRequestOf, OpenChannelRequestOf, PayIdList, ResolvePaymentConditionsRequestOf, SignedSimplexStateArrayOf, VouchedCondPayResultOf } from 'celer-types/interfaces/celerPayModule';
import { ApiTypes, SubmittableExtrinsic } from '@polkadot/api/types';
declare module '@polkadot/api/types/submittable' {
    interface AugmentedSubmittables<ApiType> {
        balances: {
            /**
             * Exactly as `transfer`, except the origin must be root and the source account may be
             * specified.
             * # <weight>
             * - Same as transfer, but additional read and write because the source account is
             * not assumed to be in the overlay.
             * # </weight>
             **/
            forceTransfer: AugmentedSubmittable<(source: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array, dest: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array, value: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Set the balances of a given account.
             *
             * This will alter `FreeBalance` and `ReservedBalance` in storage. it will
             * also decrease the total issuance of the system (`TotalIssuance`).
             * If the new free or reserved balance is below the existential deposit,
             * it will reset the account nonce (`frame_system::AccountNonce`).
             *
             * The dispatch origin for this call is `root`.
             *
             * # <weight>
             * - Independent of the arguments.
             * - Contains a limited number of reads and writes.
             * ---------------------
             * - Base Weight:
             * - Creating: 27.56 µs
             * - Killing: 35.11 µs
             * - DB Weight: 1 Read, 1 Write to `who`
             * # </weight>
             **/
            setBalance: AugmentedSubmittable<(who: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array, newFree: Compact<Balance> | AnyNumber | Uint8Array, newReserved: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Transfer some liquid free balance to another account.
             *
             * `transfer` will set the `FreeBalance` of the sender and receiver.
             * It will decrease the total issuance of the system by the `TransferFee`.
             * If the sender's account is below the existential deposit as a result
             * of the transfer, the account will be reaped.
             *
             * The dispatch origin for this call must be `Signed` by the transactor.
             *
             * # <weight>
             * - Dependent on arguments but not critical, given proper implementations for
             * input config types. See related functions below.
             * - It contains a limited number of reads and writes internally and no complex computation.
             *
             * Related functions:
             *
             * - `ensure_can_withdraw` is always called internally but has a bounded complexity.
             * - Transferring balances to accounts that did not exist before will cause
             * `T::OnNewAccount::on_new_account` to be called.
             * - Removing enough funds from an account will trigger `T::DustRemoval::on_unbalanced`.
             * - `transfer_keep_alive` works the same way as `transfer`, but has an additional
             * check that the transfer will not kill the origin account.
             * ---------------------------------
             * - Base Weight: 73.64 µs, worst case scenario (account created, account removed)
             * - DB Weight: 1 Read and 1 Write to destination account
             * - Origin account is already in memory, so no DB operations for them.
             * # </weight>
             **/
            transfer: AugmentedSubmittable<(dest: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array, value: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Same as the [`transfer`] call, but with a check that the transfer will not kill the
             * origin account.
             *
             * 99% of the time you want [`transfer`] instead.
             *
             * [`transfer`]: struct.Module.html#method.transfer
             * # <weight>
             * - Cheaper than transfer because account cannot be killed.
             * - Base Weight: 51.4 µs
             * - DB Weight: 1 Read and 1 Write to dest (sender is in overlay already)
             * #</weight>
             **/
            transferKeepAlive: AugmentedSubmittable<(dest: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array, value: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
        };
        celerPayModule: {
            /**
             * Approve the passed address the spend the specified amount of native token on behalf of caller.
             *
             * Parameters:
             * `spender`: the address which will spend the funds
             * `value`: amount of native token to spent
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage write `Allowed`
             * # </weight>
             **/
            approve: AugmentedSubmittable<(spender: AccountId | string | Uint8Array, value: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Read payment results and add results to corresponding simplex payment channel
             *
             * Parameters:
             * `channel_id`: Id of channel
             * `peer_from`: address of the peer who send out funds
             * `pay_id_list`: PayIdList
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(N)`
             * - `N` pay_ids-len
             * - DB:
             * - 2 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * # </weight>
             **/
            clearPays: AugmentedSubmittable<(channelId: Hash | string | Uint8Array, peerFrom: AccountId | string | Uint8Array, payIdList: PayIdList | {
                payIds?: any;
                nextListHash?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Confirm channel settlement
             *
             * Dev: This must be called after settle_finalized_time
             *
             * Parameters:
             * `channel_id`: Id of channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `ChannelMap`
             * - 2 storage mutation `ChannelMap`
             * - 1 storage reads `ChannelStatusNums`
             * - 1 storage mutation `ChannelStatusNums`
             * - 1 storage reads `Wallets`
             * - 1 storage mutation `Wallets`
             * # </weight>
             **/
            confirmSettle: AugmentedSubmittable<(channelId: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Confirm channel withdrawal
             *
             * Dev: anyone can confirm a withdrawal intent
             *
             * Parameter:
             * `channel_id`: Id of channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `ChannelMap`
             * - 2 storage mutation `ChannelMap`
             * - 2 storage reads `Wallets`
             * - 2 storage mutation `Wallets`
             * # </weight>
             **/
            confirmWithdraw: AugmentedSubmittable<(channelId: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Cooperatively settle the channel
             *
             * Parameter
             * `settle_request`: CooperativeSettleRequest message
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * - 1 storage reads `ChannelStatusNums`
             * - 1 storage mutation `ChannelStatusNums`
             * - 1 storage reads `Wallets`
             * - 1 storage mutation `Wallets`
             * # </weight>
             **/
            cooperativeSettle: AugmentedSubmittable<(settleRequest: CooperativeSettleRequestOf | {
                settleInfo?: any;
                sigs?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Cooperatively withdraw specific amount of balance
             *
             * Parameter:
             * `cooperative_withdraw_request`: CooprativeWithdrawRequest message
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `ChannelMap`
             * - 2 storage mutation `ChannelMap`
             * - 2 storage reads `Wallets`
             * - 2 storage mutation `Wallets`
             * # </weight>
             **/
            cooperativeWithdraw: AugmentedSubmittable<(cooperativeWithdrawRequest: CooperativeWithdrawRequestOf | {
                withdrawInfo?: any;
                sigs?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Decrease the amount of native token that an owner allowed to a spender.
             *
             * Parameters:
             * `spender`: the address which will spend the funds
             * `subtracted_value`: amount of native tokent o decrease the allowance by
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `Allowed`
             * - 1 storage mutation `Allowed`
             * # </weight>
             **/
            decreaseAllowance: AugmentedSubmittable<(spender: AccountId | string | Uint8Array, subtractedValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Deposit native token into the channel
             *
             * Parameters:
             * `channel_id`: Id of the channel
             * `receiver`: address of the receiver
             * `msg_value`: caller's deposit amount
             * `transfer_from_amount`: amount of funds to be transfered from Pool
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * - 2 storage reads `Wallets`
             * - 2 storage mutation `Wallets`
             * - 1 storage reads `Balances`
             * - 1 storage mutation `Balances`
             * - 2 storage reads `Allowed`
             * - 1 storage mutation `Allowed`
             * # </weight>
             **/
            deposit: AugmentedSubmittable<(channelId: Hash | string | Uint8Array, receiver: AccountId | string | Uint8Array, msgValue: BalanceOf | AnyNumber | Uint8Array, transferFromAmount: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Deposit native tokens into the channel
             *
             * Parameters:
             * `channel_ids`: Ids of channel
             * `receivers`: addresses of receiver
             * `msg_values`: caller's deposit amounts
             * `transfer_from_amounts`: amounts of funds to be transfered from Pool
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(N)`
             * - `N` channel_ids-len
             * - DB:
             * - 2*N storage reads  `ChannelMap`
             * - 2*N storage reads `Wallets`
             * - 2*N storage mutation `Wallets`
             * - N storage reads `Balances`
             * - N storage mutation `Balances`
             * - 2*N storage reads `Allowed`
             * - N storage mutation `Allowed`
             * # </weight
             **/
            depositInBatch: AugmentedSubmittable<(channelIds: Vec<Hash> | (Hash | string | Uint8Array)[], receivers: Vec<AccountId> | (AccountId | string | Uint8Array)[], msgValues: Vec<BalanceOf> | (BalanceOf | AnyNumber | Uint8Array)[], transferFromAmounts: Vec<BalanceOf> | (BalanceOf | AnyNumber | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
            /**
             * Celer Wallet
             * Deposit native token to a wallet.
             *
             * Parameter:
             * `wallet_id`: Id of the wallet to deposit into
             * `msg_value`: depoist amount
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `Walletss`
             * - 1 storage mutation `Wallets`
             * # </weight>
             **/
            depositNativeToken: AugmentedSubmittable<(walletId: Hash | string | Uint8Array, msgValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Pool
             * Deposit native token into Pool
             *
             * Parameters:
             * `receiver`: the address native token is deposited to pool
             * `msg_value`: amount of deposit to pool
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `Balances`
             * - 1 storage mutation `Balances`
             * #</weight>
             **/
            depositPool: AugmentedSubmittable<(receiver: AccountId | string | Uint8Array, msgValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Disable balance limits
             *
             * Parameter:
             * `channel_id`: Id of the channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `0(1)
             * - DB:
             * - 1 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * #</weight>
             **/
            disableBalanceLimits: AugmentedSubmittable<(channelId: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Enable balance limits
             *
             * Parameter:
             * `channel_id`: Id of the channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `0(1)`
             * - DB:
             * - 1 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * #</weight>
             **/
            enableBalanceLimits: AugmentedSubmittable<(channelId: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Increase the amount of native token that an owner allowed to a spender.
             *
             * Parameters:
             * `spender`: the address which spend the funds.
             * `added_value`: amount of native token to increase the allowance by
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `Allowed`
             * - 1 storage mutation `Allowed`
             * # </weight>
             **/
            increaseAllowance: AugmentedSubmittable<(spender: AccountId | string | Uint8Array, addedValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Intent to settle channel with an array of signed simplex states
             *
             * Dev: simplex states in this array are not necessarily in the same channel,
             * which means intendSettle natively supports multi-channel batch processing.
             * A simplex state with non-zero seqNum (non-null state) must be co-signed by both peers,
             * while a simplex state with seqNum=0 (null state) only needs to be signed by one peer.
             *
             * Parameter:
             * `signed_simplex_state_array`: SignedSimplexStateArray message
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(N * M)`
             * - `N` signed_simplex_states-len
             * - `M` pay_hashes-len
             * - DB:
             * - N storage reads `ChannelMap`
             * - 2 * N storage mutation `ChannelMap`
             * - 2 * M storage reads `PayInfoMap`
             * # </weight>
             **/
            intendSettle: AugmentedSubmittable<(signedSimplexStateArray: SignedSimplexStateArrayOf | {
                signedSimplexStates?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Intend to withdraw funds from channel
             *
             * Dev: only peers can call intend_withdraw
             *
             * Parameters:
             * `channel_id`: Id of channel
             * `amount`: amount of funds to withdraw
             * `receipient_channel_id`: withdraw to receiver address if hash(0),
             * otherwise deposit to receiver address in the recipient channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * # </weight>
             **/
            intendWithdraw: AugmentedSubmittable<(channelId: Hash | string | Uint8Array, amount: BalanceOf | AnyNumber | Uint8Array, receipientChannelId: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Open a state channel through auth withdraw message
             *
             * Parameters:
             * `open_request`: open channel request message
             * `msg_value`: caller's deposit amount
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - 1 storage write `ChannelMap`
             * - 1 storage reads `Wallets`
             * - 1 storage mutation `Wallets`
             * - 1 storage reads `Balances`
             * - 1 storage mutation `Balances`
             * - 2 storage reads `Allowed`
             * - 1 storage mutation `Allowed`
             * - 1 storage write `WalletNum`
             * # </weight>
             **/
            openChannel: AugmentedSubmittable<(openRequest: OpenChannelRequestOf | {
                channelInitializer?: any;
                sigs?: any;
            } | string | Uint8Array, msgValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * PayResolver
             * Resolve a payment by onchain getting its conditons outcomes
             *
             * Dev: HASH_LOCK should only be used for establishing multi-hop paymetns,
             * and is always required to be true for all transfer function logic types.
             * a pay with not condiiton or only true HASH_LOCK conditions in condition array.
             *
             * Parameters:
             * `resolve_pay_request`: ResolvePayByConditionsRequest message
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(N)`
             * - N: condtions-len
             * - DB:
             * - 2 storage reads `PayRegistry`
             * - 1 storage mutation `PayRegistry`
             * # </weight>
             **/
            resolvePaymentByConditions: AugmentedSubmittable<(resolvePayRequest: ResolvePaymentConditionsRequestOf | {
                condPay?: any;
                hashPreimages?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Resolve a payment by submitting an offchain vouched result
             *
             * Parameter:
             * `vouched_pay_result`: VouchedCondPayResult message
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(N)`
             * - N: conditions-len
             * - DB:
             * - 2 storage reads `PayRegistry`
             * - 1 storage mutation `PayRegistry`
             * # </weight>
             **/
            resolvePaymentByVouchedResult: AugmentedSubmittable<(vouchedPayResult: VouchedCondPayResultOf | {
                condPayResult?: any;
                sigOfSrc?: any;
                sigOfDest?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Celer Ledger
             * Set the balance limits
             *
             * Parameters:
             * - `channel_id`: Id of the channel
             * - `limits`: Limits amount of channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * #</weight>
             **/
            setBalanceLimits: AugmentedSubmittable<(channelId: Hash | string | Uint8Array, limits: Compact<BalanceOf> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Store signed simplex states on-chain as checkpoints
             *
             * Dev: simplex states in this array are not necessarily in the same channel,
             * which means snapshotStates natively supports multi-channel batch processing.
             * This function only updates seqNum, transferOut, pendingPayOut of each on-chain
             * simplex state. It can't ensure that the pending pays will be cleared during
             * settling the channel, which requires users call intendSettle with the same state.
             *
             * Parameter:
             * `signed_simplex_state_array`: SignedSimplexStateArray message
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(N)`
             * - `N` signed_simplex_states-len
             * - DB:
             * - N storage reads `ChannelMap`
             * - N storage mutation `ChannelMap`
             * # </weight>
             **/
            snapshotStates: AugmentedSubmittable<(signedSimplexStateArray: SignedSimplexStateArrayOf | {
                signedSimplexStates?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Transfer native token from one address to another.
             *
             * Parameters:
             * `from`: the address which you want to transfer native token from
             * `to`: the address which you want to transfer to
             * `value`: amount of native token to be transferred
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `Allowed`
             * - 1 storage mutation `Allowed`
             * - 3 storage reads `Balances`
             * - 1 storage mutation `Balances`
             * # </weight>
             **/
            transferFrom: AugmentedSubmittable<(from: AccountId | string | Uint8Array, to: AccountId | string | Uint8Array, value: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Transfer to native token from one address to a wallet in CelerWallet Module.
             *
             * Parameters:
             * `from`: the address which you want to transfer native token from
             * `wallet_id`: Id of the wallet you want to deposit native token into
             * `amount`: amount of native token to be transfered
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `Wallets`
             * - 1 storage mutation `Wallets`
             * - 1 storage reads `Balances`
             * - 1 storage mutation `Balances`
             * - 2 storage reads `Allowed`
             * # </weight>
             **/
            transferToCelerWallet: AugmentedSubmittable<(from: AccountId | string | Uint8Array, walletId: Hash | string | Uint8Array, amount: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Veto current withdrawal intent
             *
             * Dev: only peers can veto withdrawal intent;
             * peers can veto a withdrawal even after (request_time + dispute_timeout)
             *
             * Parameter:
             * `channel_id`: Id of channel
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 1 storage reads `ChannelMap`
             * - 1 storage mutation `ChannelMap`
             * # </weight>
             **/
            vetoWithdraw: AugmentedSubmittable<(channelId: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Withdraw native token from Pool
             *
             * Parameter:
             * `value`: amount of native token to withdraw
             *
             * # <weight>
             * ## Weight
             * - Complexity: `O(1)`
             * - DB:
             * - 2 storage reads `Balances`
             * - 1 storage mutation `Balances`
             * # </weight>
             **/
            withdrawFromPool: AugmentedSubmittable<(value: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
        };
        grandpa: {
            /**
             * Report voter equivocation/misbehavior. This method will verify the
             * equivocation proof and validate the given key ownership proof
             * against the extracted offender. If both are valid, the offence
             * will be reported.
             *
             * Since the weight of the extrinsic is 0, in order to avoid DoS by
             * submission of invalid equivocation reports, a mandatory pre-validation of
             * the extrinsic is implemented in a `SignedExtension`.
             **/
            reportEquivocation: AugmentedSubmittable<(equivocationProof: GrandpaEquivocationProof | {
                setId?: any;
                equivocation?: any;
            } | string | Uint8Array, keyOwnerProof: KeyOwnerProof | {
                session?: any;
                trieNodes?: any;
                validatorCount?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
        };
        mockBooleanCondition: {
            getOutcome: AugmentedSubmittable<(appId: Hash | string | Uint8Array, number: u8 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            isFinalized: AugmentedSubmittable<(appId: Hash | string | Uint8Array, number: u8 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
        };
        sudo: {
            /**
             * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo key.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * # <weight>
             * - O(1).
             * - Limited storage reads.
             * - One DB change.
             * # </weight>
             **/
            setKey: AugmentedSubmittable<(updated: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Authenticates the sudo key and dispatches a function call with `Root` origin.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * # <weight>
             * - O(1).
             * - Limited storage reads.
             * - One DB write (event).
             * - Weight of derivative `call` execution + 10,000.
             * # </weight>
             **/
            sudo: AugmentedSubmittable<(call: Call | {
                callIndex?: any;
                args?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Authenticates the sudo key and dispatches a function call with `Signed` origin from
             * a given account.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * # <weight>
             * - O(1).
             * - Limited storage reads.
             * - One DB write (event).
             * - Weight of derivative `call` execution + 10,000.
             * # </weight>
             **/
            sudoAs: AugmentedSubmittable<(who: LookupSource | Address | AccountId | AccountIndex | LookupSource | string | Uint8Array, call: Call | {
                callIndex?: any;
                args?: any;
            } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Authenticates the sudo key and dispatches a function call with `Root` origin.
             * This function does not check the weight of the call, and instead allows the
             * Sudo user to specify the weight of the call.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * # <weight>
             * - O(1).
             * - The weight of this call is defined by the caller.
             * # </weight>
             **/
            sudoUncheckedWeight: AugmentedSubmittable<(call: Call | {
                callIndex?: any;
                args?: any;
            } | string | Uint8Array, weight: Weight | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
        };
        system: {
            /**
             * A dispatch that will fill the block weight up to the given ratio.
             **/
            fillBlock: AugmentedSubmittable<(ratio: Perbill | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Kill all storage items with a key that starts with the given prefix.
             *
             * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
             * the prefix we are removing to accurately calculate the weight of this function.
             *
             * # <weight>
             * - `O(P)` where `P` amount of keys with prefix `prefix`
             * - `P` storage deletions.
             * - Base Weight: 0.834 * P µs
             * - Writes: Number of subkeys + 1
             * # </weight>
             **/
            killPrefix: AugmentedSubmittable<(prefix: Key | string | Uint8Array, subkeys: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Kill some items from storage.
             *
             * # <weight>
             * - `O(IK)` where `I` length of `keys` and `K` length of one key
             * - `I` storage deletions.
             * - Base Weight: .378 * i µs
             * - Writes: Number of items
             * # </weight>
             **/
            killStorage: AugmentedSubmittable<(keys: Vec<Key> | (Key | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
            /**
             * Make some on-chain remark.
             *
             * # <weight>
             * - `O(1)`
             * - Base Weight: 0.665 µs, independent of remark length.
             * - No DB operations.
             * # </weight>
             **/
            remark: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Set the new changes trie configuration.
             *
             * # <weight>
             * - `O(1)`
             * - 1 storage write or delete (codec `O(1)`).
             * - 1 call to `deposit_log`: Uses `append` API, so O(1)
             * - Base Weight: 7.218 µs
             * - DB Weight:
             * - Writes: Changes Trie, System Digest
             * # </weight>
             **/
            setChangesTrieConfig: AugmentedSubmittable<(changesTrieConfig: Option<ChangesTrieConfiguration> | null | object | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Set the new runtime code.
             *
             * # <weight>
             * - `O(C + S)` where `C` length of `code` and `S` complexity of `can_set_code`
             * - 1 storage write (codec `O(C)`).
             * - 1 call to `can_set_code`: `O(S)` (calls `sp_io::misc::runtime_version` which is expensive).
             * - 1 event.
             * The weight of this function is dependent on the runtime, but generally this is very expensive.
             * We will treat this as a full block.
             * # </weight>
             **/
            setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Set the new runtime code without doing any checks of the given `code`.
             *
             * # <weight>
             * - `O(C)` where `C` length of `code`
             * - 1 storage write (codec `O(C)`).
             * - 1 event.
             * The weight of this function is dependent on the runtime. We will treat this as a full block.
             * # </weight>
             **/
            setCodeWithoutChecks: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Set the number of pages in the WebAssembly environment's heap.
             *
             * # <weight>
             * - `O(1)`
             * - 1 storage write.
             * - Base Weight: 1.405 µs
             * - 1 write to HEAP_PAGES
             * # </weight>
             **/
            setHeapPages: AugmentedSubmittable<(pages: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
            /**
             * Set some items of storage.
             *
             * # <weight>
             * - `O(I)` where `I` length of `items`
             * - `I` storage writes (`O(1)`).
             * - Base Weight: 0.568 * i µs
             * - Writes: Number of items
             * # </weight>
             **/
            setStorage: AugmentedSubmittable<(items: Vec<KeyValue> | (KeyValue)[]) => SubmittableExtrinsic<ApiType>>;
            /**
             * Kill the sending account, assuming there are no references outstanding and the composite
             * data is equal to its default value.
             *
             * # <weight>
             * - `O(1)`
             * - 1 storage read and deletion.
             * --------------------
             * Base Weight: 8.626 µs
             * No DB Read or Write operations because caller is already in overlay
             * # </weight>
             **/
            suicide: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
        };
        timestamp: {
            /**
             * Set the current time.
             *
             * This call should be invoked exactly once per block. It will panic at the finalization
             * phase, if this call hasn't been invoked by that time.
             *
             * The timestamp should be greater than the previous one by the amount specified by
             * `MinimumPeriod`.
             *
             * The dispatch origin for this call must be `Inherent`.
             *
             * # <weight>
             * - `O(T)` where `T` complexity of `on_timestamp_set`
             * - 1 storage read and 1 storage mutation (codec `O(1)`). (because of `DidUpdate::take` in `on_finalize`)
             * - 1 event handler `on_timestamp_set` `O(T)`.
             * - Benchmark: 7.678 (min squares analysis)
             * - NOTE: This benchmark was done for a runtime with insignificant `on_timestamp_set` handlers.
             * New benchmarking is needed when adding new handlers.
             * # </weight>
             **/
            set: AugmentedSubmittable<(now: Compact<Moment> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
        };
    }
    interface SubmittableExtrinsics<ApiType extends ApiTypes> extends AugmentedSubmittables<ApiType> {
        (extrinsic: Call | Extrinsic | Uint8Array | string): SubmittableExtrinsic<ApiType>;
    }
}
