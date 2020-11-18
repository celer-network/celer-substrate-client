"use strict";
// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */
{
    BitVec, Bool, Bytes, Compact, Data, DoNotConstruct, I128, I16, I256, I32, I64, I8, Json, Null, Option, Raw, StorageKey, Text, Type, U128, U16, U256, U32, U64, U8, USize, Vec, bool, i128, i16, i256, i32, i64, i8, u128, u16, u256, u32, u64, u8, usize;
}
from;
'@polkadot/types';
{
    BlockAttestations, IncludedBlocks, MoreAttestations;
}
from;
'@polkadot/types/interfaces/attestations';
{
    RawAuraPreDigest;
}
from;
'@polkadot/types/interfaces/aura';
{
    ExtrinsicOrHash, ExtrinsicStatus;
}
from;
'@polkadot/types/interfaces/author';
{
    UncleEntryItem;
}
from;
'@polkadot/types/interfaces/authorship';
{
    AllowedSlots, BabeAuthorityWeight, BabeBlockWeight, BabeEquivocationProof, BabeWeight, EpochAuthorship, MaybeRandomness, MaybeVrf, NextConfigDescriptor, NextConfigDescriptorV1, Randomness, RawBabePreDigest, RawBabePreDigestCompat, RawBabePreDigestPrimary, RawBabePreDigestPrimaryTo159, RawBabePreDigestSecondaryPlain, RawBabePreDigestSecondaryTo159, RawBabePreDigestSecondaryVRF, RawBabePreDigestTo159, SlotNumber, VrfData, VrfOutput, VrfProof;
}
from;
'@polkadot/types/interfaces/babe';
{
    AccountData, BalanceLock, BalanceLockTo212, BalanceStatus, Reasons, VestingSchedule, WithdrawReasons;
}
from;
'@polkadot/types/interfaces/balances';
{
    BlockHash;
}
from;
'@polkadot/types/interfaces/chain';
{
    PrefixedStorageKey;
}
from;
'@polkadot/types/interfaces/childstate';
{
    EthereumAddress, StatementKind;
}
from;
'@polkadot/types/interfaces/claims';
{
    CollectiveOrigin, MemberCount, ProposalIndex, Votes, VotesTo230;
}
from;
'@polkadot/types/interfaces/collective';
{
    AuthorityId, RawVRFOutput;
}
from;
'@polkadot/types/interfaces/consensus';
{
    AliveContractInfo, CodeHash, ContractCallRequest, ContractExecResult, ContractExecResultErr, ContractExecResultErrModule, ContractExecResultOk, ContractExecResultResult, ContractExecResultSuccessTo255, ContractExecResultSuccessTo260, ContractExecResultTo255, ContractExecResultTo260, ContractInfo, ContractStorageKey, Gas, HostFnWeights, InstructionWeights, Limits, PrefabWasmModule, PrefabWasmModuleReserved, Schedule, ScheduleTo212, ScheduleTo258, SeedOf, TombstoneContractInfo, TrieId;
}
from;
'@polkadot/types/interfaces/contracts';
{
    ContractConstructorSpec, ContractContractSpec, ContractCryptoHasher, ContractDiscriminant, ContractDisplayName, ContractEventParamSpec, ContractEventSpec, ContractLayoutArray, ContractLayoutCell, ContractLayoutEnum, ContractLayoutHash, ContractLayoutHashingStrategy, ContractLayoutKey, ContractLayoutStruct, ContractLayoutStructField, ContractMessageParamSpec, ContractMessageSpec, ContractProject, ContractProjectContract, ContractProjectSource, ContractSelector, ContractStorageLayout, ContractTypeSpec;
}
from;
'@polkadot/types/interfaces/contractsAbi';
{
    AccountVote, AccountVoteSplit, AccountVoteStandard, Conviction, Delegations, PreimageStatus, PreimageStatusAvailable, PriorLock, PropIndex, Proposal, ProxyState, ReferendumIndex, ReferendumInfo, ReferendumInfoFinished, ReferendumInfoTo239, ReferendumStatus, Tally, Voting, VotingDelegating, VotingDirect, VotingDirectVote;
}
from;
'@polkadot/types/interfaces/democracy';
{
    ApprovalFlag, DefunctVoter, Renouncing, SetIndex, Vote, VoteIndex, VoteThreshold, VoterInfo;
}
from;
'@polkadot/types/interfaces/elections';
{
    CreatedBlock, ImportedAux;
}
from;
'@polkadot/types/interfaces/engine';
{
    EthereumAccountId, EthereumLookupSource;
}
from;
'@polkadot/types/interfaces/ethereum';
{
    Account, Log, Vicinity;
}
from;
'@polkadot/types/interfaces/evm';
{
    AnySignature, EcdsaSignature, Ed25519Signature, Extrinsic, ExtrinsicEra, ExtrinsicPayload, ExtrinsicPayloadUnknown, ExtrinsicPayloadV4, ExtrinsicSignature, ExtrinsicSignatureV4, ExtrinsicUnknown, ExtrinsicV4, ImmortalEra, MortalEra, MultiSignature, Signature, SignerPayload, Sr25519Signature;
}
from;
'@polkadot/types/interfaces/extrinsics';
{
    AssetOptions, Owner, PermissionLatest, PermissionVersions, PermissionsV1;
}
from;
'@polkadot/types/interfaces/genericAsset';
{
    AuthorityIndex, AuthorityList, AuthorityWeight, EncodedFinalityProofs, GrandpaEquivocation, GrandpaEquivocationProof, GrandpaEquivocationValue, GrandpaPrevote, JustificationNotification, KeyOwnerProof, NextAuthority, PendingPause, PendingResume, Precommits, Prevotes, ReportedRoundStates, RoundState, SetId, StoredPendingChange, StoredState;
}
from;
'@polkadot/types/interfaces/grandpa';
{
    IdentityFields, IdentityInfo, IdentityInfoAdditional, IdentityJudgement, RegistrarIndex, RegistrarInfo, Registration, RegistrationJudgement;
}
from;
'@polkadot/types/interfaces/identity';
{
    AuthIndex, AuthoritySignature, Heartbeat, HeartbeatTo244, OpaqueMultiaddr, OpaqueNetworkState, OpaquePeerId;
}
from;
'@polkadot/types/interfaces/imOnline';
{
    DoubleMapTypeLatest, DoubleMapTypeV10, DoubleMapTypeV11, DoubleMapTypeV12, DoubleMapTypeV9, ErrorMetadataV10, ErrorMetadataV11, ErrorMetadataV12, ErrorMetadataV9, EventMetadataLatest, EventMetadataV10, EventMetadataV11, EventMetadataV12, EventMetadataV9, ExtrinsicMetadataLatest, ExtrinsicMetadataV11, ExtrinsicMetadataV12, FunctionArgumentMetadataLatest, FunctionArgumentMetadataV10, FunctionArgumentMetadataV11, FunctionArgumentMetadataV12, FunctionArgumentMetadataV9, FunctionMetadataLatest, FunctionMetadataV10, FunctionMetadataV11, FunctionMetadataV12, FunctionMetadataV9, MapTypeLatest, MapTypeV10, MapTypeV11, MapTypeV12, MapTypeV9, MetadataAll, MetadataLatest, MetadataV10, MetadataV11, MetadataV12, MetadataV9, ModuleConstantMetadataLatest, ModuleConstantMetadataV10, ModuleConstantMetadataV11, ModuleConstantMetadataV12, ModuleConstantMetadataV9, ModuleMetadataLatest, ModuleMetadataV10, ModuleMetadataV11, ModuleMetadataV12, ModuleMetadataV9, StorageEntryMetadataLatest, StorageEntryMetadataV10, StorageEntryMetadataV11, StorageEntryMetadataV12, StorageEntryMetadataV9, StorageEntryModifierLatest, StorageEntryModifierV10, StorageEntryModifierV11, StorageEntryModifierV12, StorageEntryModifierV9, StorageEntryTypeLatest, StorageEntryTypeV10, StorageEntryTypeV11, StorageEntryTypeV12, StorageEntryTypeV9, StorageHasher, StorageHasherV10, StorageHasherV11, StorageHasherV12, StorageHasherV9, StorageMetadataLatest, StorageMetadataV10, StorageMetadataV11, StorageMetadataV12, StorageMetadataV9;
}
from;
'@polkadot/types/interfaces/metadata';
{
    StorageKind;
}
from;
'@polkadot/types/interfaces/offchain';
{
    DeferredOffenceOf, Kind, OffenceDetails, Offender, OpaqueTimeSlot, ReportIdOf, Reporter;
}
from;
'@polkadot/types/interfaces/offences';
{
    AbridgedCandidateReceipt, AttestedCandidate, AuctionIndex, Bidder, CandidateCommitments, CandidateReceipt, CollatorId, CollatorSignature, DoubleVoteReport, DownwardMessage, GlobalValidationSchedule, HeadData, IncomingParachain, IncomingParachainDeploy, IncomingParachainFixed, LeasePeriod, LeasePeriodOf, LocalValidationData, NewBidder, ParaId, ParaInfo, ParaPastCodeMeta, ParaScheduling, ParachainDispatchOrigin, ParachainProposal, RegisteredParachainInfo, RelayChainBlockNumber, Remark, Retriable, Scheduling, SigningContext, SlotRange, Statement, SubId, UpwardMessage, ValidationCode, ValidationFunctionParams, ValidatorSignature, ValidityAttestation, WinningData, WinningDataEntry;
}
from;
'@polkadot/types/interfaces/parachains';
{
    RuntimeDispatchInfo;
}
from;
'@polkadot/types/interfaces/payment';
{
    Approvals;
}
from;
'@polkadot/types/interfaces/poll';
{
    ProxyAnnouncement, ProxyDefinition, ProxyType;
}
from;
'@polkadot/types/interfaces/proxy';
{
    AccountStatus, AccountValidity;
}
from;
'@polkadot/types/interfaces/purchase';
{
    ActiveRecovery, RecoveryConfig;
}
from;
'@polkadot/types/interfaces/recovery';
{
    RpcMethods;
}
from;
'@polkadot/types/interfaces/rpc';
{
    AccountId, AccountIdOf, AccountIndex, Address, AssetId, Balance, BalanceOf, Block, BlockNumber, Call, CallHash, CallHashOf, ChangesTrieConfiguration, Consensus, ConsensusEngineId, Digest, DigestItem, ExtrinsicsWeight, Fixed128, Fixed64, FixedI128, FixedI64, FixedU128, FixedU64, GenericAddress, H160, H256, H512, Hash, Header, I32F32, Index, Justification, KeyTypeId, KeyValue, LockIdentifier, LookupSource, LookupTarget, ModuleId, Moment, MultiAddress, OpaqueCall, Origin, OriginCaller, PalletVersion, PalletsOrigin, Pays, PerU16, Perbill, Percent, Permill, Perquintill, Phantom, PhantomData, PreRuntime, Releases, RuntimeDbWeight, Seal, SealV0, SignedBlock, StorageData, TransactionPriority, U32F32, ValidatorId, Weight, WeightMultiplier;
}
from;
'@polkadot/types/interfaces/runtime';
{
    SiField, SiLookupTypeId, SiPath, SiType, SiTypeDef, SiTypeDefArray, SiTypeDefComposite, SiTypeDefPrimitive, SiTypeDefSequence, SiTypeDefTuple, SiTypeDefVariant, SiVariant;
}
from;
'@polkadot/types/interfaces/scaleInfo';
{
    Period, Priority, SchedulePeriod, SchedulePriority, Scheduled, ScheduledTo254, TaskAddress;
}
from;
'@polkadot/types/interfaces/scheduler';
{
    FullIdentification, IdentificationTuple, Keys, MembershipProof, SessionIndex, SessionKeys1, SessionKeys2, SessionKeys3, SessionKeys4, SessionKeys5, SessionKeys6, ValidatorCount;
}
from;
'@polkadot/types/interfaces/session';
{
    Bid, BidKind, SocietyJudgement, SocietyVote, StrikeCount, VouchingStatus;
}
from;
'@polkadot/types/interfaces/society';
{
    ActiveEraInfo, CompactAssignments, CompactAssignmentsTo257, CompactScore, CompactScoreCompact, ElectionCompute, ElectionResult, ElectionScore, ElectionSize, ElectionStatus, EraIndex, EraPoints, EraRewardPoints, EraRewards, Exposure, Forcing, IndividualExposure, KeyType, MomentOf, Nominations, NominatorIndex, NominatorIndexCompact, OffchainAccuracy, OffchainAccuracyCompact, PhragmenScore, Points, RewardDestination, RewardDestinationTo257, RewardPoint, SlashJournalEntry, SlashingSpans, SlashingSpansTo204, SpanIndex, SpanRecord, StakingLedger, StakingLedgerTo223, StakingLedgerTo240, UnappliedSlash, UnappliedSlashOther, UnlockChunk, ValidatorIndex, ValidatorIndexCompact, ValidatorPrefs, ValidatorPrefsTo145, ValidatorPrefsTo196;
}
from;
'@polkadot/types/interfaces/staking';
{
    ApiId, KeyValueOption, ReadProof, RuntimeVersion, RuntimeVersionApi, StorageChangeSet;
}
from;
'@polkadot/types/interfaces/state';
{
    WeightToFeeCoefficient;
}
from;
'@polkadot/types/interfaces/support';
{
    AccountInfo, ApplyExtrinsicResult, ChainProperties, ChainType, DigestOf, DispatchClass, DispatchError, DispatchErrorModule, DispatchErrorTo198, DispatchInfo, DispatchInfoTo190, DispatchInfoTo244, DispatchOutcome, DispatchResult, DispatchResultOf, DispatchResultTo198, Event, EventId, EventIndex, EventRecord, Health, InvalidTransaction, Key, LastRuntimeUpgradeInfo, NetworkState, NetworkStatePeerset, NetworkStatePeersetInfo, NodeRole, NotConnectedPeer, Peer, PeerEndpoint, PeerEndpointAddr, PeerInfo, PeerPing, Phase, RawOrigin, RefCount, RefCountTo259, SyncState, SystemOrigin, TransactionValidityError, UnknownTransaction;
}
from;
'@polkadot/types/interfaces/system';
{
    Bounty, BountyIndex, BountyStatus, BountyStatusActive, BountyStatusCuratorProposed, BountyStatusPendingPayout, OpenTip, OpenTipFinderTo225, OpenTipTip, OpenTipTo225, TreasuryProposal;
}
from;
'@polkadot/types/interfaces/treasury';
{
    Multiplier;
}
from;
'@polkadot/types/interfaces/txpayment';
{
    Multisig, Timepoint;
}
from;
'@polkadot/types/interfaces/utility';
{
    VestingInfo;
}
from;
'@polkadot/types/interfaces/vesting';
{
    AccountAmtPair, BalanceWrapper, BooleanModuleCallData, ChannelOf, ChannelStatus, CondPayResult, Condition, ConditionType, ConditionalPay, ConditionalPayOf, CooperativeSettleInfo, CooperativeSettleInfoOf, CooperativeSettleRequest, CooperativeSettleRequestOf, CooperativeWithdrawInfo, CooperativeWithdrawInfoOf, CooperativeWithdrawRequest, CooperativeWithdrawRequestOf, NumericModuleCallData, OpenChannelRequest, OpenChannelRequestOf, PayIdList, PayInfo, PayInfoOf, PaymentChannelInitializer, PaymentChannelInitializerOf, PeerProfile, PeerProfileOf, PeerState, PeerStateOf, ResolvePaymentConditionsRequest, ResolvePaymentConditionsRequestOf, SeqNumWrapper, SignedSimplexState, SignedSimplexStateArray, SignedSimplexStateArrayOf, SimplexPaymentChannel, SmartContractCallData, TokenDistribution, TokenInfo, TokenTransfer, TokenType, TransferFunction, TransferFunctionType, VouchedCondPayResult, VouchedCondPayResultOf, Wallet, WalletOf, WithdrawIntent, WithdrawIntentOf;
}
from;
'celer-types/interfaces/celerPayModule';
