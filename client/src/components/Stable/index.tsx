import { IPlayingCard } from "components/gameTypes";
import useClasses from "../../hooks/useClasses";
import Card from "../Card/Card";
import {styles} from './style'

type Props = {
    stable:{
        unicorns: Array<IPlayingCard>,
        upgrades: Array<IPlayingCard>,
        downgrades: Array<IPlayingCard>,
    }
};

export default function Stable({stable} : Props) {
    const classes = useClasses(styles);
    const {unicorns, upgrades, downgrades} = stable;
        return (
            <div  className={classes.stable}>
                <div className={classes.downup}>
                    <div>{upgrades}</div>
                    <div>downgrades</div>
                </div>
                <div className={classes.unicorns}>Stable</div>
            </div>
        )

}