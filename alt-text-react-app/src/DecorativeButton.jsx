import Button from "react-bootstrap/Button";

import { getCookie } from "./helpers";
import axios from "axios";

export default function DecorativeButton({imgIdToPKMap, imgIdtoAltsMap, setImgIdtoAltsMap, imgToggleValue}) {

    function set_decorative(img_key, decorative) {
        let type = (decorative === 1) ? 0 : 1;
        axios.patch(import.meta.env.DATABASE_URL + '/api/imgs/' + img_key + '/',
            {"img_type": type},
            {'withCredentials': true,
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
            }).then((res) => {
                setImgIdtoAltsMap({...imgIdtoAltsMap, [imgToggleValue]: {...imgIdtoAltsMap[imgToggleValue], "img_type": type}});
            }).catch((e) => {
                alert("Could Not Mark As Decorative. Please Try Again Later.");
                console.log(e);
            })
    }

    const dec_text = "Mark As Decorative";
    const txt = (imgIdtoAltsMap[imgToggleValue]?.img_type === 1) ? "Undo " + dec_text : dec_text;

    return(<Button onClick={() => set_decorative(imgIdToPKMap[imgToggleValue], imgIdtoAltsMap[imgToggleValue].img_type)}>
               {txt}
            </Button>);

}