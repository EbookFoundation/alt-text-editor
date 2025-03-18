import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getCookie } from './BookpageChildren';



export default function SubmitButton({userInput, stateObj}) {

    async function updateAltTextDatabase(pk, updated_alt_text) {
        if(updated_alt_text === null || updated_alt_text === "") {return;}
        if(stateObj["numSelected"][0] === 0) {return;}

        //update pk of related alt, if successful, then update text in related alt
        //should be atomic? maybe different approach is needed
        axios.patch('http://127.0.0.1:8000/api/alts/' + pk.toString() + '/',
            { "alt": pk },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
             }
        ).then((response) => {
            console.log(response);
            axios.patch('http://127.0.0.1:8000/api/alts/' + pk.toString() + '/',
                { "text": updated_alt_text },
                {'withCredentials': true,
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                    },
                }
            ).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase(stateObj["imgIdToPKMap"][0][stateObj["radioValue"][0]], userInput.current.value)}>
            Submit
        </Button>
    );

}