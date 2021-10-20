import { IPlayingCard } from "../gameTypes";
import Card from "../Card/Card";
import { styles } from '../Stable/style'
import useClasses from "../../hooks/useClasses";

type Props = {
    cards: Array<IPlayingCard>
    containerName: string
    containerClass?: string,
    highlighted: boolean,
    onSelectedClick: (selectedArea: string) => void;
};

export default function CardContainer({cards, containerName, containerClass, highlighted, onSelectedClick} : Props) {
    const classes = useClasses(styles);
    return (
        <div className={`${containerClass ?? ''} ${highlighted ? classes.highlight : ''}`} onClick={() => {
            highlighted && onSelectedClick(containerName);
        }}>
            {cards?.map(card => (
                <Card onClickHandler={()=> {}} cardData={card} key={card.uid}/>
            )
            )}
        </div>
    )
}