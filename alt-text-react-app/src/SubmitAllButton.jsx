import Button from 'react-bootstrap/Button';
import { UserContext } from './App';
import { useContext } from 'react';

import axios from 'axios';
import { getCookie, set_status, updateAltsObj } from './helpers';



export default function SubmitAllButton({bookNum, storedUserInput, noEditImg, numSelected, imgIdtoAltsMap, 
                                            setImgIdtoAltsMap, setUserSubStatus}) {


    const username = useContext(UserContext); 

    async function updateAltTextDatabase() {
        if(noEditImg) {return;}
        if(numSelected === 0) {return;}
        if(Object.keys(storedUserInput).length === 0) {return;}

        /*
            - user input automatically posts all in progress alt texts
            - returns list of alts_created in obj
        */
        axios.post(import.meta.env.DATABASE_URL + '/api/user_submissions/',
            { 
              "user_alt_text_json": storedUserInput,
              "item": bookNum,
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
                var current_alts_obj = imgIdtoAltsMap[alt_created.img];
                if(current_alts_obj === null || current_alts_obj === undefined) {continue;}
                updateAltsObj(alt_created, current_alts_obj);
                setImgIdtoAltsMap({...imgIdtoAltsMap, [alt_created.img_id]: {...current_alts_obj}});
            }
            localStorage.setItem(bookNum, JSON.stringify(storedUserInput));
            set_status(username, 1, setUserSubStatus, bookNum);
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase()}>
            Save All Alt Texts
        </Button>
    );

}