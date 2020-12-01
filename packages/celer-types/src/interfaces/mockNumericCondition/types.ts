// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, u32, u8 } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces/runtime';

/** @name NumericArgsQueryFinalization */
export interface NumericArgsQueryFinalization extends Struct {
  readonly sessionId: Hash;
  readonly queryData: u8;
}

/** @name NumericArgsQueryOutcome */
export interface NumericArgsQueryOutcome extends Struct {
  readonly sessionId: Hash;
  readonly queryData: u32;
}

export type PHANTOM_MOCKNUMERICCONDITION = 'mockNumericCondition';
