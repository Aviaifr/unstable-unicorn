import { Box, Button, Modal } from '@material-ui/core';
import React from 'react';
import useClasses from '../../hooks/useClasses'
import {styles} from './style'

type Props = {
    setResponse: (toNeigh: boolean) => void;
    open: boolean;
    yesText: string;
    noText: string;
};

const ActivateOptionDialog: React.FC<Props> = ({
    setResponse,
    open,
    yesText,
    noText,
    children
}) => {
    const {discard} = useClasses(styles);
    return (
        <Modal open={open}>
            <Box className={discard}>
                {children}
                <Button onClick={() => setResponse(true)}>{yesText}</Button>
                <Button onClick={() => setResponse(false)}>{noText}</Button>
            </Box>
        </Modal>
    );
}

export default ActivateOptionDialog;
