import axios from "axios";

// maybe switch to class model at some point
// class AltsList {
//     constructor(img_key, alt_key, alts_arr) {
//         this.alts_arr = [];
//         this.img_key = null;
//         this.alt_key = null;
//         if(alts_arr == []) {return;}

//         this.img_key = img_key;
//         this.alt_key = alt_key;
//         for (const alt_text of alts_arr) {
//             if(alt_text.id === alt_key) {
//                 alts_obj["preferred_alt_text"] = alt_text;
//             }
//             else {
//                 alts_obj["alts_arr"].push(alt_text);
//             }
//     }
//  }
//  

// }

//get csrf token for django auth with name == 'csrftoken'
export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function createAltsObj(img_key, alt_key, alts_arr, img_type) {
    const alts_obj = {};

    alts_obj["img_key"] = img_key;
    alts_obj["alt_key"] = alt_key;
    alts_obj["alts_arr"] = [];
    alts_obj["img_type"] = img_type;

    if(alts_arr.length == 0 && alt_key == null) {return alts_obj;}

    for (const alt_text of alts_arr) {
        if(alt_text.id === alt_key) {
            alts_obj["preferred_alt_text"] = alt_text;
        }
        else {
            alts_obj["alts_arr"].push(alt_text);
        }
    }

    return alts_obj;
}

export function updateAltsObj(response_alt_obj, current_alts_obj) {

    // if no id, do not update
    if(response_alt_obj.id === null || response_alt_obj.id === undefined) {
        return;
    }

    //if response is updated preferred text, or only alt text submitted, make preferred

    if(response_alt_obj.id === current_alts_obj.alt_key || current_alts_obj.alts_arr.length == 0) {
        current_alts_obj.preferred_alt_text = response_alt_obj;
        current_alts_obj.alt_key = response_alt_obj.id;
    }

    else {
        current_alts_obj.alts_arr.push(response_alt_obj);
    }

    

    // const prev_preferred = current_alts_obj.preferred_alt_text;
    // const prev_alt_key =  current_alts_obj.alt_key;

    // if(prev_preferred === null || prev_alt_key === null) {return;}
    
    // //if response exists already, but isn't preferred, swap preferred and response
    // for(let i = 0; i < current_alts_obj.alts_arr.length; i++) {
    //     if(current_alts_obj.alts_arr[i].id === response_alt_obj.id) {
    //         current_alts_obj.alts_arr.splice(i, 1, prev_preferred);
    //         return;
    //     }
    // }
}

export function set_preferred(img_key, new_pref_alt_key, current_alts_obj) {

    //axios post -> set new alt key
    //then(): 
        //current_alts_obj.preferred_alt_text = res alt obj;
        //current_alts_obj.alt_key = res alt obj id;

}

export function set_status(status, set_user_status_state, doc_key) {
    
    axios.post(import.meta.env.DATABASE_URL + '/api/documents/' + doc_key + '/set_status/',
        {
            'status': status
        },
        {'withCredentials': true,
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
        }).then((res) => {
            if (res.data.status != status && res.data.status == 1) {
                alert("We have received your submission and marked it for review. An authorized user will close this book after reviewing.");
            }
            else if (res.data.status != status && res.data.status == 2) {
                alert("You are not authorized to reopen this book for editing.");
            }
            else {set_user_status_state(res.data.status);}

        }).catch((error) => {
            console.log(error);
            set_user_status_state(1);
        });
}