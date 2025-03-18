import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getCookie } from './BookpageChildren';



export default function SubmitButton({userInput}) {

    async function updateAltTextDatabase(img_id, updated_alt_text) {
        if(updated_alt_text === null || updated_alt_text === "") {return;}

        const alt_id = axios.patch('http://127.0.0.1:8000/api/alts/' + img_id + '/',
            { "text": updated_alt_text },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
             }
        ).then((response) => {
            response.data.id;
        }).catch((error) => {
            console.log(error);
        });

        // axios.patch('http://127.0.0.1:8000/api/imgs/' + img_id,
        //     { "text": updated_alt_text },
        //     { headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCookie('csrftoken')}, }
        // ).then((response) => {
        //     response.data.id;
        // }).catch((error) => {
        //     console.log(error);
        // });
        
    }

    return (
        <Button onClick={() => updateAltTextDatabase(1, userInput.current.value)}>
            Submit
        </Button>
    );

}