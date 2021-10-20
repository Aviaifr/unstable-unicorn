import { useEffect, useState } from "react"
import {IPlayer, IPlayingCard, emptyCard} from '../gameTypes'
import Card from '../Card/Card'

type Props = {
    player: IPlayer,
    onCardSelected?: (cardData: IPlayingCard) => void,
  };

export default function Hand({ player, onCardSelected }: Props) {
    const {hand} = player;
    const [selectedCard, setSelectedCard] = useState<IPlayingCard>(emptyCard)
    const onCardSelection = (cardData?: IPlayingCard)=>{
        if(!cardData){
            setSelectedCard(emptyCard);
            return;
        }
        setSelectedCard(cardData);
    }
    useEffect(()=> {
        onCardSelected && onCardSelected(selectedCard);
    //so will not highlight again after card is played
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCard]);
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
