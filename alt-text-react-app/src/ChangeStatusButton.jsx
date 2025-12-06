import Button from 'react-bootstrap/Button';

import { useContext } from 'react';
import { UserContext } from './App';

import { set_status } from './helpers';

export default function ChangeStatusButton({userSubStatus, setUserSubStatus, docPK}) {

    const username = useContext(UserContext);

    function close_or_open() {
        if(userSubStatus === 1)
            return 2;
        else if (userSubStatus === 2)
            return 1;
        else
            return 0;
    }

    function button_text() {
        if(userSubStatus === 2)
            return "Reopen Document For Editing";
        else 
            return "Close Document And Mark As Complete";
    }        


    return (
        <Button variant="success" onClick={() => set_status(close_or_open(), setUserSubStatus, docPK)}>
            {button_text()}
        </Button>
    )
}