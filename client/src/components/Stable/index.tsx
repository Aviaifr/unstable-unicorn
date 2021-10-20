import { IPlayingCard } from "components/gameTypes";
import useClasses from "../../hooks/useClasses";
import CardContainer from "../CardContrainer"
import {styles} from './style'

type Props = {
    stable:{
        unicorns: Array<IPlayingCard>,
        upgrades: Array<IPlayingCard>,
        downgrades: Array<IPlayingCard>,
    },
    highlight?: string,
    isCurrentPlayer? : boolean,
    onSelectedClick: (selectedArea: string) => void;
};

export default function Stable({stable, highlight, isCurrentPlayer, onSelectedClick} : Props) {
    const classes = useClasses(styles);
    const {unicorns, upgrades, downgrades} = stable;
        return (
            <div className={classes.stable}>
                <div className={classes.downup}>
                <CardContainer cards={upgrades} containerName={'downgrade'} highlighted={highlight === 'upgrade'} onSelectedClick={onSelectedClick}/>
                <CardContainer cards={downgrades} containerName={'downgrade'} highlighted={highlight === 'downgrade'} onSelectedClick={onSelectedClick}/>
                </div>
                <CardContainer containerClass={classes.unicorns} cards={unicorns} containerName={'stable'} highlighted={highlight === 'stable'} onSelectedClick={onSelectedClick}/>
            </div>
        )

}