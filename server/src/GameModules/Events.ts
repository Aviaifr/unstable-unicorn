export enum Events {
  ENTERED_STABLE = 'entered',
  DESTROYED = 'destroyed',
  BEFORE_CARD_PLAYED = 'beforeCardPlayed',
  CARD_PLAYED = 'cardPlayed',
  AFTER_CARD_PLAYED = 'afterCardPlayed',
  DISCARDED = 'cardDiscard',
  RESOLVE_CHAIN = 'resolve',
  ADD_GAME_ACTION = "addAction",
  ON_PLAYER_ACTION = "ON_PLAYER_ACTION",
  REMOVE_EXPECTED_ACTION = "REMOVE_EXPECTED_ACTION",
  PUSH_TO_CHAIN = "PUSH_TO_CHAIN",
  DISCARD_FROM_CHAIN_IF_EXISTS = "DISCARD_FROM_CHAIN_IF_EXISTS",
  BEFORE_RESOLVE_CHAIN = "BEFORE_RESOLVE_CHAIN",
  BEFORE_TURN_START = "BEFORE_TURN_START",
  TURN_START = "TURN_START",
  AFTER_DESTROY = "AFTER_DESTROY",
  FORCE_END_TURN = "FORCE_END_TURN",
  BEFORE_CARD_RESOLVE = "BEFORE_CARD_RESOLVE",
  CARD_RESOLVED = "CARD_RESOLVED",
  SACRIFICE = "SACRIFICE",
  AFTER_SACRIFICE = "AFTER_SACRIFICE",
  AFTER_RESOLVE_CHAIN = "AFTER_RESOLVE_CHAIN",
  EFFECT_DISABLED = "EFFECT_DISABLED",
  PLAYER_SELECTED = "PLAYER_SELECTED",
  CHANGE_HAND_VISIBILITY = "CHANGE_HAND_VISIBILITY",
  AFTER_CARD_RESOLVED = "AFTER_CARD_RESOLVED",
  REMOVE_FROM_DISCARD = "REMOVE_FROM_DISCARD",
  GAME_LOADED = "GAME_LOADED",
  CHECK_PRECONDITION = "CHECK_PRECONDITION",
  FAILED_CHECK_PRECONDITION = "FAILED_CHECK_PRECONDITION",
  BEFORE_DESTROY = "BEFORE_DESTROY"
}