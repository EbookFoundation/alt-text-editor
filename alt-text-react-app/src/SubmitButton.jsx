import Button from 'react-bootstrap/Button';

import axios from 'axios';
import { getCookie, updateAltsObj } from './helpers';



export default function SubmitButton({stateObj}) {

    async function updateAltTextDatabase(stored_user_input, edit_check, num_selected, map, set_map) {
        if(edit_check) {return;}
        if(num_selected === 0) {return;}
        if(Object.keys(stored_user_input).length === 0) {return;}

        /*
            - user input automatically posts on submission_type: "SB" 
            - returns list of alts_created in obj
        */
        axios.post('http://127.0.0.1:8000/api/user_submissions/',
            { 
              "user_json": stored_user_input,
              "submission_type": "SB",
              "document": 1 // hard coded for document for now, switch to pk based on booknum state when multiple books supported
            },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
             }
        ).then((response) => {
            for (const alt_created of response.data.alts_created) {
                var current_alts_obj = null;
                for (const [key, value] of Object.entries(map)) {
                    if(value.img_key === alt_created.img) {
                        current_alts_obj = map[key];
                        break;
                    }
                }
                if(current_alts_obj === null) {return;}
                updateAltsObj(alt_created, current_alts_obj);
                set_map({...map, [alt_created.img_id]: {...current_alts_obj}});
            }
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase(stateObj["storedUserInput"][0], stateObj["noEditImg"][0],
                                                     stateObj["numSelected"][0], stateObj["imgIdtoAltsMap"][0], 
                                                     stateObj["imgIdtoAltsMap"][1])}>
            Submit
        </Button>
    );

}