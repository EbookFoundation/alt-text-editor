import Button from 'react-bootstrap/Button';
import React from 'react';

import axios from 'axios';
import { getCookie, updateAltsObj } from './helpers';



export default function SubmitAllButton({storedUserInput, noEditImg, numSelected, imgIdtoAltsMap, setImgIdtoAltsMap}) {

    async function updateAltTextDatabase() {
        if(noEditImg) {return;}
        if(numSelected === 0) {return;}
        if(Object.keys(storedUserInput).length === 0) {return;}

        /*
            - user input automatically posts on submission_type: "SB" 
            - returns list of alts_created in obj
        */
        axios.post(import.meta.env.DATABASE_URL + '/api/user_submissions/',
            { 
              "user_json": storedUserInput,
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
                for (const [key, value] of Object.entries(imgIdtoAltsMap)) {
                    if(value.img_key === alt_created.img) {
                        current_alts_obj = imgIdtoAltsMap[key];
                        break;
                    }
                }
                if(current_alts_obj === null) {return;}
                updateAltsObj(alt_created, current_alts_obj);
                setImgIdtoAltsMap({...imgIdtoAltsMap, [alt_created.img_id]: {...current_alts_obj}});
            }
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase()}>
            Submit All In Progress
        </Button>
    );

}