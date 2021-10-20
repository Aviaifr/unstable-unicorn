import React, { useState } from 'react';
import { Box, Modal } from '@material-ui/core';
import Card, {} from '../Card/Card'
import {IPlayingCard} from '../gameTypes'
import CardContainer from '../CardContrainer'


type Props = {
    onCardClickHandler: (cardData?: IPlayingCard) => void;
    pile: IPlayingCard[],
};

export default function DiscardPile({ onCardClickHandler, pile}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    return !pile.length ? (
                <Box style={{minWidth:100, border:'1px solid black'}}>
                    Discard Pile
                </Box>
            ) : (
                <Box style={{transform: 'rotate(90deg)'}}>
                    <Card onClickHandler={() => setModalOpen(true)} cardData={pile[0]}/>
                    <Modal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description">
                        <CardContainer cards={pile} containerName={'discard'} highlighted={false} onSelectedClick={() => {} }/>
                    </Modal>
                </Box>
            );
}
