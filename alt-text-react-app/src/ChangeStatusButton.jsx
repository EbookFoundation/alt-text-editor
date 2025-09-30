import Button from 'react-bootstrap/Button';

import { useContext } from 'react';
import { UserContext } from './App';

import { set_status } from './helpers';

export default function ChangeStatusButton({userSubStatus, setUserSubStatus, bookNum}) {

    const username = useContext(UserContext);

    function close_or_open() {
        if(userSubStatus === "In Progress")
            return 2;
        else if (userSubStatus === "Complete")
            return 1;
        else
            return 0;
    }

    function button_text() {
        if(userSubStatus === "Complete")
            return "Reopen Document For Editing";
        else 
            return "Close Document And Mark As Complete";
    }        


    return (
        <Button onClick={() => set_status(username, close_or_open(), setUserSubStatus, bookNum)}>
            {button_text()}
        </Button>
    )
}