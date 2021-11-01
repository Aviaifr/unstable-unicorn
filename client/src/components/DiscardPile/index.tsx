import { useState } from 'react';
import { Box, Modal } from '@material-ui/core';
import Card from '../Card/Card'
import {IPlayingCard} from '../gameTypes'
import CardContainer from '../CardContrainer'
import useClasses from '../../hooks/useClasses'
import {styles} from './style'
import { styles as stableStyle} from '../Stable/style'

type Props = {
    onSelectedClick: (area: string) => void;
    highlighted: boolean,
    pile: IPlayingCard[],
};

export default function DiscardPile({ onSelectedClick, highlighted, pile}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const {discard} = useClasses(styles);
    const {highlight} = useClasses(stableStyle);
    
    return (
        <Box className={highlighted ? highlight : ''}>
            {!pile.length ? (
                <Box style={{minWidth:100, border:'1px solid black'}}>
                    Played Cards
                </Box>
            ) : (
                <Box style={{transform: 'rotate(90deg)'}}>
                    <Card onClickHandler={() => highlighted ? onSelectedClick('discard') : setModalOpen(true)} cardData={pile[0]}/>
                    <Modal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}>
                        <div className={discard}>
                            <CardContainer cards={pile} containerName={'discard'} highlighted={false} onSelectedClick={() => {} }/>
                        </div>
                    </Modal>
                </Box>
            )
            }
        </Box>
    )
}
