import { Box, Button, Modal } from '@material-ui/core';
import useClasses from '../../hooks/useClasses'
import {styles} from './style'

type Props = {
    setResponse: (toNeigh: boolean) => void;
    open: boolean
};

export default function NeighDialog(props: Props) {
    const {discard} = useClasses(styles);
    return (
        <Modal open={props.open}>
            <Box className={discard}>
                <div>Would you like to Neigh Card played?</div>
                <Button onClick={() => props.setResponse(true)}>Neigh</Button>
                <Button onClick={() => props.setResponse(false)}>No Neigh</Button>
            </Box>
        </Modal>
    );
}
