import { Box } from '@material-ui/core';
import useClasses from '../../hooks/useClasses'
import {styles} from './style'
import { IPlayingCard} from 'components/gameTypes'

type Props = {
  onClickHandler: Function;
  cardData: IPlayingCard,
};
//to be replaced with const?
const serverRscUrl = 'http://localhost:8000/static-resources/cards';

export default function Card({ onClickHandler, cardData }: Props) {
  const classes = useClasses(styles);
  console.log(onClickHandler);
  return (
    <>
      {cardData.name ? (
        <Box onClick={()=> onClickHandler()} className={classes.card}>
          <img src={`${serverRscUrl}/typeIcons/${cardData.type}.gif`} className={classes.icon} alt='typeIcon' />
          <p 
            className={`${classes.title} ${cardData.name.length > 16 ? classes.smallerTitle: ''}`}>
              {cardData.name}
            </p>
          <img src={`${serverRscUrl}/images/${cardData.slug}.jpg`} alt='art'/>
          <p className={`${classes.type} ${classes[cardData.type]}`}>Card Type: {cardData.type}</p>
          <p className={classes.text}>{cardData.text}</p>
        </Box>
      ) : (
        <Box onClick={()=>onClickHandler} className={classes.card}>
          <p className={`${classes.title}`}>Unknown Card</p>
        </Box>
      )}
  </>
  );
}
