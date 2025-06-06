import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getCookie, updateAltsObj } from './helpers';
import React from 'react';



export default function SubmitOneButton({imgIdToPKMap, imgIdtoAltsMap, setImgIdtoAltsMap, noEditImg, 
                                            storedUserInput, imgToggleValue, numSelected}) {

    async function updateAltTextDatabase() {
        if(noEditImg) {return;}
        const pk = imgIdToPKMap[imgToggleValue];
        if(storedUserInput === undefined) {return;}
        const updated_alt_text = storedUserInput[imgToggleValue];
        if(updated_alt_text === null || updated_alt_text === "") {return;}
        if(numSelected === 0) {return;}

        /*
            - create new alt with text and source
                - if alt text exists already in list, update the source and alt preferred id
                    - get request on image alts [] and compare (radio button?)
                - if new user text, add new alt obj to imgs alts [] (should also post to alt table)
                    - update img alt id with new obj id
                - return img obj for radio list
        */
        axios.post(import.meta.env.DATABASE_URL + '/api/alts/' + pk.toString() + '/',
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
            const current_alts_obj = imgIdtoAltsMap[imgToggleValue];
            updateAltsObj(response.data, current_alts_obj);
            setImgIdtoAltsMap({...imgIdtoAltsMap, [imgToggleValue]: {...current_alts_obj}});
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase()}>
            Submit Only This Image
        </Button>
    );

}