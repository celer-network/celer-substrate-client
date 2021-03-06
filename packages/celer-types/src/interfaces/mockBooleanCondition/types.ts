// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, u8 } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces/runtime';

/** @name BooleanArgsQueryFinalization */
export interface BooleanArgsQueryFinalization extends Struct {
  readonly sessionId: Hash;
  readonly queryData: u8;
}

/** @name BooleanArgsQueryOutcome */
export interface BooleanArgsQueryOutcome extends Struct {
  readonly sessionId: Hash;
  readonly queryData: u8;
}

export type PHANTOM_MOCKBOOLEANCONDITION = 'mockBooleanCondition';
