import {Button, Input} from '@material-ui/core'
import { useContext, useEffect, useState } from 'react';
import SocketContext from '../components/socketContext'

type Props = {
    onLogInClickHandler: (userName: string) => void;
    forceRename?: boolean ;
  };
  
export default function LoginPage({onLogInClickHandler, forceRename = false}: Props) {
    const socket = useContext(SocketContext);
    const [userName, setUserName] = useState('');
    const [err, setErr] = useState('');
    useEffect(() => {
        socket?.emit('get_player_name', (name : string)  =>{
            if(name && !forceRename){
                onLogInClickHandler(name);
            }else{
                setUserName(name ?? '');
            }
            
        })
    }, []);
    useEffect(()=>{
        if(!userName || userName.length < 3){
            setErr('Name Too short');
        }else{
            setErr('');
        }
    }, [userName])
    return (
        <div>
            <h2>Choose display Name</h2>
            <Input type='text' value={userName} onChange={e => setUserName(e.target.value)}/>
            <p>{err.length > 0 ? err : ''}</p>
            <Button onClick={() => onLogInClickHandler(userName)}>Login</Button>
        </div>
    )
}
