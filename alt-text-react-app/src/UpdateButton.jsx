import Button from "react-bootstrap/Button";
import axios from 'axios';
import { getCookie, createAltsObj } from "./helpers";


export default function UpdateButton({stateObj}) {
    
    function imgObjUpdate() {

        let img_id = stateObj["imgToggleValue"][0];
        if(img_id === null || img_id === "") {return;}
        let map = stateObj["imgIdToPKMap"][0];
        let img_key = map[img_id];

        axios.get("http://127.0.0.1:8000/api/imgs/" + img_key.toString() + "/",
            {'withCredentials': true,
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }).then((response) => {
                stateObj["imgIdtoAltsMap"][1]({...stateObj["imgIdtoAltsMap"][0], [img_id]: createAltsObj(response.data.id, response.data.alt, response.data.alts)});
            }).catch((error) => {
                console.log(error);
            });
    }


    return (
        <Button onClick={() => imgObjUpdate()}>Update</Button>
    );
}