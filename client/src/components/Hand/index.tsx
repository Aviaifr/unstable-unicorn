import { useState } from "react"
import {IPlayer, IPlayingCard, emptyCard} from '../gameTypes'
import Card from '../Card/Card'

type Props = {
    player: IPlayer,
  };

export default function Hand({ player }: Props) {
    const {hand} = player;
    const [selectedCard, setSelectedCard] = useState<IPlayingCard>(emptyCard)
    const onCardSelection = (cardData?: IPlayingCard)=>{
        if(!cardData){
            setSelectedCard(emptyCard);
            return;
        }
        setSelectedCard(cardData);
    }
    return (
        <div>
            {hand.map(card => (
                <Card
                 key={card.uid}
                 cardData={card}
                 selected={selectedCard.uid === card.uid}
                 onClickHandler={onCardSelection} />))}
        </div>
    );
}
