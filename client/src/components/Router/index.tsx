import { useContext } from "react";
import { Switch, Route, Router as ReactRouter} from 'react-router-dom';
import { createBrowserHistory } from "history";

import SocketContext from "components/socketContext";
import LoginPage from "pages/LoginPage";
import RoomsPage from "pages/RoomsPage";
import GamePage from "pages/GamePage"

export default function Router() {
    const customHistory = createBrowserHistory();
    const socket= useContext(SocketContext);
    return (
        <ReactRouter history={customHistory}>
            <Switch>
                <Route exact path='/' render={() => (
                    <LoginPage onLogInClickHandler={function (userName: string): void {
                        socket?.emit('setUserName', userName, () => {customHistory.push('/rooms');});
                    } } />
                )
                }/>
                <Route path='/rooms' render={ () => (
                    <RoomsPage onGameStarted={() => customHistory.push('/game')} onNoUser={ () => customHistory.push('/')} />
                )}/>
                <Route path='/game' component={GamePage}/>
            </Switch>
        </ReactRouter>
    )
}
