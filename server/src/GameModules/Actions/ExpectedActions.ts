import { Card } from '../Card'

export default interface ExpectedAction {
    player: string;
    action: string;
    managed: boolean;
    blocking?: boolean;
    data?: Array<string>;
    initiator?: Card;
  }