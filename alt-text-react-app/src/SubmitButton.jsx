import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getCookie, updateAltsObj } from './helpers';



export default function SubmitButton({userInput, stateObj}) {

    async function updateAltTextDatabase(pk, updated_alt_text) {
        if(updated_alt_text === null || updated_alt_text === "") {return;}
        if(stateObj["numSelected"][0] === 0) {return;}

        /*
            - create new alt with text and source
                - if alt text exists already in list, update the source and alt preferred id
                    - get request on image alts [] and compare (radio button?)
                - if new user text, add new alt obj to imgs alts [] (should also post to alt table)
                    - update img alt id with new obj id
                - return img obj for radio list


        */
        axios.post('http://127.0.0.1:8000/api/alts/' + pk.toString() + '/',
            { "img": pk,
              "text": updated_alt_text  
            },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
             }
        ).then((response) => {
            const current_alts_obj = stateObj["imgIdtoAltsMap"][0][stateObj["imgToggleValue"][0]];
            updateAltsObj(response.data, current_alts_obj);
            stateObj["imgIdtoAltsMap"][1]({...stateObj["imgIdtoAltsMap"][0], [stateObj["imgToggleValue"][0]]: {...current_alts_obj}});
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase(stateObj["imgIdToPKMap"][0][stateObj["imgToggleValue"][0]], userInput.current.value)}>
            Submit
        </Button>
    );

}