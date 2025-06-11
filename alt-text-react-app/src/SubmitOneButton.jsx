import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getCookie, updateAltsObj } from './helpers';
import React from 'react';



export default function SubmitOneButton({imgIdtoAltsMap, setImgIdtoAltsMap, noEditImg, bookNum,
                                            storedUserInput, imgToggleValue, numSelected}) {

    async function updateAltTextDatabase() {
        if(noEditImg) {return;}
        if(storedUserInput === undefined) {return;}
        if(numSelected === 0) {return;}

        const updated_alt_text = storedUserInput[imgToggleValue];
        if(updated_alt_text === null || updated_alt_text === "") {return;}

        axios.post(import.meta.env.DATABASE_URL + '/api/user_submissions/',
            { 
              "item": bookNum,
              "user_alt_text_json": {[imgToggleValue]: updated_alt_text}
            },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }
        ).then((response) => {
            // get new and old alt objs
            const current_alts_obj = imgIdtoAltsMap[imgToggleValue];
            const new_alt_obj = response.data.alts_created.find((alt) => imgToggleValue === alt.img);

            //update alt objs with new alt text saved
            if (new_alt_obj === undefined) {return;}
            updateAltsObj(new_alt_obj, current_alts_obj);
            setImgIdtoAltsMap({...imgIdtoAltsMap, [imgToggleValue]: {...current_alts_obj}});

            //update local storage for img that was saved
            const localStorageUserInput = JSON.parse(localStorage.getItem(bookNum));
            if(localStorageUserInput !== null && localStorageUserInput !== undefined) {
                localStorageUserInput[imgToggleValue] = new_alt_obj.text;
                localStorage.setItem(bookNum, JSON.stringify(localStorageUserInput));
            }
        }).catch((error) => {
            console.log(error);
        });

        
    }

    return (
        <Button onClick={() => updateAltTextDatabase()}>
            Save Alt Text For This Image Only
        </Button>
    );

}