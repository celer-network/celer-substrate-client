// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import { Enum, Option, Set, Struct, Vec } from '@polkadot/types/codec';
import { Bytes, bool, u128, u32, u8 } from '@polkadot/types/primitive';
import { Signature } from '@polkadot/types/interfaces/extrinsics';
import { AccountId, Balance, BlockNumber, Call, Hash, Moment } from '@polkadot/types/interfaces/runtime';

/** @name AccountAmtPair */
export interface AccountAmtPair extends Struct {
  readonly account: Option<AccountId>;
  readonly amt: Balance;
}

/** @name ChannelOf */
export interface ChannelOf extends Struct {
  readonly balanceLimitsEnabled: bool;
  readonly balanceLimits: Option<Balance>;
  readonly settleFinalizedTime: Option<BlockNumber>;
  readonly disputeTimeout: BlockNumber;
  readonly token: TokenInfo;
  readonly status: ChannelStatus;
  readonly peerProfiles: Vec<PeerProfile>;
  readonly cooperativeWithdrawSeqNum: Option<u128>;
  readonly withdrawIntent: WithdrawIntent;
}

/** @name ChannelStatus */
export interface ChannelStatus extends Set {
  readonly isUninitialized: boolean;
  readonly isOperable: boolean;
  readonly isSettling: boolean;
  readonly isClosed: boolean;
}

/** @name Condition */
export interface Condition extends Struct {
  readonly conditionType: ConditionType;
  readonly hashLock: Option<Hash>;
  readonly callIsFinalized: Option<Call>;
  readonly callGetOutcome: Option<Call>;
  readonly numericAppNum: Option<u32>;
  readonly numericSessionId: Option<Hash>;
  readonly argsQueryFinalization: Option<Bytes>;
  readonly argsQueryOutcome: Option<Bytes>;
}

/** @name ConditionalPay */
export interface ConditionalPay extends Struct {
  readonly payTimestamp: Moment;
  readonly src: AccountId;
  readonly dest: AccountId;
  readonly conditions: Vec<Condition>;
  readonly transferFunc: TransferFunction;
  readonly resolveDeadline: BlockNumber;
  readonly resovleTimeout: BlockNumber;
}

/** @name ConditionalPayOf */
export interface ConditionalPayOf extends Struct {
  readonly payTimestamp: Moment;
  readonly src: AccountId;
  readonly dest: AccountId;
  readonly conditions: Vec<Condition>;
  readonly transferFunc: TransferFunction;
  readonly resolveDeadline: BlockNumber;
  readonly resolveTimeout: BlockNumber;
}

/** @name ConditionType */
export interface ConditionType extends Enum {
  readonly isHashLock: boolean;
  readonly isBooleanRuntimeModule: boolean;
  readonly isNumericRuntimeModule: boolean;
}

/** @name CondPayResult */
export interface CondPayResult extends Struct {
  readonly condPay: ConditionalPay;
  readonly amount: Balance;
}

/** @name CooperativeSettleInfo */
export interface CooperativeSettleInfo extends Struct {
  readonly channelId: Hash;
  readonly seqNum: u128;
  readonly settleBalance: Vec<AccountAmtPair>;
  readonly settleDeadline: BlockNumber;
}

/** @name CooperativeSettleInfoOf */
export interface CooperativeSettleInfoOf extends Struct {
  readonly channelId: Hash;
  readonly seqNum: u128;
  readonly settleBalance: Vec<AccountAmtPair>;
  readonly settleDeadline: BlockNumber;
}

/** @name CooperativeSettleRequest */
export interface CooperativeSettleRequest extends Struct {
  readonly settleInfo: CooperativeSettleInfo;
  readonly sigs: Vec<Signature>;
}

/** @name CooperativeSettleRequestOf */
export interface CooperativeSettleRequestOf extends Struct {
  readonly settleInfo: CooperativeSettleInfo;
  readonly sigs: Vec<Signature>;
}

/** @name CooperativeWithdrawInfo */
export interface CooperativeWithdrawInfo extends Struct {
  readonly channelId: Hash;
  readonly seqNum: u128;
  readonly withdraw: AccountAmtPair;
  readonly withdrawDeadline: BlockNumber;
  readonly recipientChannelId: Hash;
}

/** @name CooperativeWithdrawInfoOf */
export interface CooperativeWithdrawInfoOf extends Struct {
  readonly channelId: Hash;
  readonly seqNum: u128;
  readonly withdraw: AccountAmtPair;
  readonly withdrawDeadline: BlockNumber;
  readonly recipientChannelId: Hash;
}

/** @name CooperativeWithdrawRequest */
export interface CooperativeWithdrawRequest extends Struct {
  readonly withdrawInfo: CooperativeWithdrawInfo;
  readonly sigs: Vec<Signature>;
}

/** @name CooperativeWithdrawRequestOf */
export interface CooperativeWithdrawRequestOf extends Struct {
  readonly withdrawInfo: CooperativeWithdrawInfo;
  readonly sigs: Vec<Signature>;
}

/** @name OpenChannelRequest */
export interface OpenChannelRequest extends Struct {
  readonly channelInitializer: PaymentChannelInitializer;
  readonly sigs: Vec<Signature>;
}

/** @name OpenChannelRequestOf */
export interface OpenChannelRequestOf extends Struct {
  readonly channelInitializer: PaymentChannelInitializer;
  readonly sigs: Vec<Signature>;
}

/** @name PayIdList */
export interface PayIdList extends Struct {
  readonly payIds: Vec<Hash>;
  readonly nextListHash: Option<Hash>;
}

/** @name PayInfo */
export interface PayInfo extends Struct {
  readonly amount: Option<Balance>;
  readonly resolveDeadline: Option<BlockNumber>;
}

/** @name PayInfoOf */
export interface PayInfoOf extends Struct {
  readonly amount: Option<Balance>;
  readonly resolveDeadline: Option<BlockNumber>;
}

/** @name PaymentChannelInitializer */
export interface PaymentChannelInitializer extends Struct {
  readonly balanceLimitsEnabled: bool;
  readonly balanceLimits: Option<Balance>;
  readonly initDistribution: TokenDistribution;
  readonly openDeadline: BlockNumber;
  readonly disputeTimeout: BlockNumber;
  readonly msgValueReceiver: u8;
}

/** @name PaymentChannelInitializerOf */
export interface PaymentChannelInitializerOf extends Struct {
  readonly balanceLimitsEnabled: bool;
  readonly balanceLimits: Option<Balance>;
  readonly initDistribution: TokenDistribution;
  readonly openDeadline: BlockNumber;
  readonly disputeTimeout: BlockNumber;
  readonly msgValueReceiver: u8;
}

/** @name PeerProfile */
export interface PeerProfile extends Struct {
  readonly peerAddr: AccountId;
  readonly deposit: Balance;
  readonly withdrawal: Option<Balance>;
  readonly state: PeerState;
}

/** @name PeerProfileOf */
export interface PeerProfileOf extends Struct {
  readonly peerAddr: AccountId;
  readonly deposit: Balance;
  readonly withdrawal: Option<Balance>;
  readonly state: PeerState;
}

/** @name PeerState */
export interface PeerState extends Struct {
  readonly seqNum: u128;
  readonly transferOut: Balance;
  readonly nextPayIdListHash: Option<Hash>;
  readonly lastPayResolveDeadline: BlockNumber;
  readonly pendingPayOut: Balance;
}

/** @name PeerStateOf */
export interface PeerStateOf extends Struct {
  readonly seqNum: u128;
  readonly transferOut: Balance;
  readonly nextPayIdListHash: Option<Hash>;
  readonly lastPayResolveDeadline: BlockNumber;
  readonly pendingPayOut: Balance;
}

/** @name ResolvePaymentConditionsRequest */
export interface ResolvePaymentConditionsRequest extends Struct {
  readonly condPay: ConditionalPay;
  readonly hashPreimages: Vec<Hash>;
}

/** @name ResolvePaymentConditionsRequestOf */
export interface ResolvePaymentConditionsRequestOf extends Struct {
  readonly condPay: ConditionalPay;
  readonly hashPreimages: Vec<Hash>;
}

/** @name SignedSimplexState */
export interface SignedSimplexState extends Struct {
  readonly simplexState: SimplexPaymentChannel;
  readonly sigs: Vec<Signature>;
}

/** @name SignedSimplexStateArray */
export interface SignedSimplexStateArray extends Struct {
  readonly signedSimplexStates: Vec<SignedSimplexState>;
}

/** @name SignedSimplexStateArrayOf */
export interface SignedSimplexStateArrayOf extends Struct {
  readonly signedSimplexStates: Vec<SignedSimplexState>;
}

/** @name SimplexPaymentChannel */
export interface SimplexPaymentChannel extends Struct {
  readonly channelId: Hash;
  readonly peerFrom: Option<AccountId>;
  readonly seqNum: u128;
  readonly transferToPeer: Option<TokenTransfer>;
  readonly pendingPayIds: Option<PayIdList>;
  readonly lastPayResolveDeadline: Option<BlockNumber>;
  readonly totalPendingAmount: Option<Balance>;
}

/** @name TokenDistribution */
export interface TokenDistribution extends Struct {
  readonly token: TokenInfo;
  readonly distribution: Vec<AccountAmtPair>;
}

/** @name TokenInfo */
export interface TokenInfo extends Struct {
  readonly tokenType: TokenType;
}

/** @name TokenTransfer */
export interface TokenTransfer extends Struct {
  readonly token: TokenInfo;
  readonly receiver: AccountAmtPair;
}

/** @name TokenType */
export interface TokenType extends Enum {
  readonly isInvalid: boolean;
  readonly isCeler: boolean;
}

/** @name TransferFunction */
export interface TransferFunction extends Struct {
  readonly logicType: TransferFunctionType;
  readonly maxTransfer: TokenTransfer;
}

/** @name TransferFunctionType */
export interface TransferFunctionType extends Enum {
  readonly isBooleanAnd: boolean;
  readonly isBooleanOr: boolean;
  readonly isBooleanCircut: boolean;
  readonly isNumericAdd: boolean;
  readonly isNumericMax: boolean;
  readonly isNumericMin: boolean;
}

/** @name VouchedCondPayResult */
export interface VouchedCondPayResult extends Struct {
  readonly condPayResult: CondPayResult;
  readonly sigOfSrc: Signature;
  readonly sigOfDest: Signature;
}

/** @name VouchedCondPayResultOf */
export interface VouchedCondPayResultOf extends Struct {
  readonly condPayResult: CondPayResult;
  readonly sigOfSrc: Signature;
  readonly sigOfDest: Signature;
}

/** @name Wallet */
export interface Wallet extends Struct {
  readonly owners: Vec<AccountId>;
  readonly balance: Balance;
}

/** @name WalletOf */
export interface WalletOf extends Struct {
  readonly owners: Vec<AccountId>;
  readonly balance: Balance;
}

/** @name WithdrawIntent */
export interface WithdrawIntent extends Struct {
  readonly receiver: AccountId;
  readonly amount: Option<Balance>;
  readonly requestTime: Option<BlockNumber>;
  readonly recipientChannelId: Option<Hash>;
}

/** @name WithdrawIntentOf */
export interface WithdrawIntentOf extends Struct {
  readonly receiver: AccountId;
  readonly amount: Option<Balance>;
  readonly requestTime: Option<BlockNumber>;
  readonly recipientChannelId: Option<Hash>;
}

export type PHANTOM_CELERPAYMODULE = 'celerPayModule';
