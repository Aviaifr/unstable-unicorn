import { useContext, useEffect, useRef, useState } from 'react';
import { Box } from '@material-ui/core';
import useClasses from '../../hooks/useClasses'
import {styles} from './style'
import {IPlayingCard} from 'components/gameTypes'
import cardback from '../../resources/cardback.jpg'
import babyback from '../../resources/babyback.png'
import ActivatableList from '../context/ActivateableCardsContext'
import TargetedCards from '../context/TargetableCardsContext'
import socketContext from 'components/socketContext'
import ActivateOptionDialog from 'components/ActivateOptionDialog'

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
  const activatables = useContext(ActivatableList);
  const targetedList = useContext(TargetedCards);
  const socket = useContext(socketContext);
  const [activatable, setActivatable] = useState(false);
  const [targeted, setTargeted] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const onClick = useRef(onClickHandler);
  const [mainCardClass, setMainCardClass] = useState('');

  useEffect(() => {
    var className =  isSelected ? ' ' + classes.selected : '';
    className+= activatable ? ' ' + classes.activatable : '';
    className+= targeted ? ' ' + classes.targeted : '';

    setMainCardClass(className);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatable, isSelected, targeted]);

  useEffect(() => {
    if(targetedList.includes(uid ?? '')){
      setTargeted(true);
      onClick.current = () => {
        socket?.emit('pendingAction', 'destroy', uid);
      }
    }else{
      setTargeted(false);
      onClick.current = onClickHandler;
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetedList, uid]);

  useEffect(() => {
    if(activatables.includes(uid ?? '')){
      setActivatable(true);
      onClick.current = () => {
        setActivateDialogOpen(true);
      }
    }else{
      setActivatable(false);
    }
  }, [activatables, uid])
  
  return (
    <>
      {activatable && (
        <ActivateOptionDialog setResponse={(selection) => {
          selection ?
          socket?.emit("pendingAction", uid, "y") : console.log('no');
          setActivateDialogOpen(false);
        } } open={activateDialogOpen} yesText={'Yes'} noText={'No'}>
          <Box>Would you like to activate {cardData.name} effect<br/><b>{cardData.text}</b>?</Box>
        </ActivateOptionDialog>
      )}
      {name ? (
        <Box onClick={()=> {onClick.current(!isSelected ? cardData ?? undefined: undefined)}}
          className={classes.card + ' ' + mainCardClass} data-carduid={uid}>
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
        <Box className={classes.card} data-carduid={uid} onClick={()=> onClick.current()}>
          <img src={type === 'baby' ? babyback : cardback} alt='anonymousCard' className={`${classes.anonymousCard} ${isSelected? classes.selected: ''}`} />
        </Box>
      )}
  </>
  );
}
