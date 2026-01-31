import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from 'react';

import axios from 'axios';
import { getCookie, createAltsObj } from './helpers';

export default function AIAltsButton({pk, setImgIdtoAltsMap}) {

    const [aiAlts, setAiAlts] = useState(0);

    // get ai suggestions (may only work in prod if you don't have LLM API key in backend / database)
    const getAIAlts = () => {
        setAiAlts(1);
        axios.post(import.meta.env.DATABASE_URL + '/api/documents/' + pk + '/add_ai_alts/',
            {},
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }
        ).then((res) => {
            let img_list = res.data.imgs;
            let tempAltMap = {};
            for(let i = 0; i < img_list.length; i++) {
                tempAltMap = {...tempAltMap, [img_list[i].img_id]: createAltsObj(img_list[i].id, img_list[i].alt, 
                                                                        img_list[i].alts, img_list[i].img_type)};
            }
            setImgIdtoAltsMap({...tempAltMap});
            setAiAlts(2);
        }).catch((error) => {
            console.log(error);
            setAiAlts(3);
        });
    }

    if(aiAlts === 1) {
        return(
            <Button disabled>
                <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                />
                AI Alt Texts Loading...
             </Button>
        );
    }

    if(aiAlts === 2) {
        return(
            <Button disabled>
               AI Alt Text Suggestions Generated!
            </Button>
        );
    }

    if(aiAlts === 3) {
        return(
            <Button onClick={() => getAIAlts()}>
               AI Alt Texts Failed to Generate. Try Again?
            </Button>
        );
    }

    return (
        <Button onClick={() => getAIAlts()}>
            Get AI Alt Text Suggestions
        </Button>
    );
}