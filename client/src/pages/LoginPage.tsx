import {Button, Input} from '@material-ui/core'
import { useContext, useEffect, useState } from 'react';
import SocketContext from '../components/socketContext'

type Props = {
    onLogInClickHandler: (userName: string) => void;
  };
  
export default function LoginPage(props: Props) {
    const socket = useContext(SocketContext);
    const [userName, setUserName] = useState('');
    const [err, setErr] = useState('');
    useEffect(()=>{
        if(userName.length < 3){
            setErr('Name Too short');
        }else{
            setErr('');
        }
    }, [socket, userName])
    return (
        <div>
            <h2>Choose display Name</h2>
            <Input type='text' value={userName} onChange={e => setUserName(e.target.value)}/>
            <p>{err.length > 0 ? err : ''}</p>
            <Button onClick={()=>props.onLogInClickHandler(userName)}>Login</Button>
        </div>
    )
}
