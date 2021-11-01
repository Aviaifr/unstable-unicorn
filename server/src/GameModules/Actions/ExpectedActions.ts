import { Card } from '../Card'

export default interface ExpectedAction {
    player: string;
    action: string;
    blocking?: boolean;
    data?: Array<string>;
    initiator?: Card;
  }