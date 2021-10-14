import { useState } from 'react';
import { Box } from '@material-ui/core';

import useClasses from '../../hooks/useClasses'
import {styles} from './style'
import { IPlayingCard} from 'components/gameTypes'
import cardback from '../../resources/cardback.jpg'
import babyback from '../../resources/babyback.png'
import getTarget from './CardTargets'

type Props = {
  onClickHandler: (cardData?: IPlayingCard) => void;
  cardData: IPlayingCard,
  selected?: boolean
};
//to be replaced with const?
const serverRscUrl = 'http://localhost:8000/static-resources/cards';

export default function Card({ onClickHandler, cardData, selected}: Props) {
  const isSelected = selected === undefined ? false : selected;
  const classes = useClasses(styles);
  const {name, slug, text, type, uid} = cardData;
  return (
    <>
      {name ? (
        <Box onClick={()=> {onClickHandler(!isSelected ? cardData ?? undefined: undefined)}} className={`${classes.card} ${isSelected? classes.selected : ''}`} data-carduid={uid}>
          <img src={`${serverRscUrl}/typeIcons/${cardData.type}.gif`} className={classes.icon} alt='typeIcon' />
          <p 
            className={`${classes.title} ${name.length > 16 ? classes.smallerTitle: ''}`}>
              {cardData.name}
            </p>
          <img src={`${serverRscUrl}/images/${slug}.jpg`} alt='art'/>
          <p className={`${classes.type} ${type ? classes[type] : ''}`}>Card Type: {type}</p>
          <p className={classes.text}>{text}</p>
        </Box>
      ) : (
        <Box className={classes.card} data-carduid={uid}>
          <img src={type === 'baby' ? babyback : cardback} alt='anonymousCard' className={classes.anonymousCard}/>
        </Box>
      )}
  </>
  );
}
