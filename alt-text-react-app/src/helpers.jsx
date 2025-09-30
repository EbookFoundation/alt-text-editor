import axios from "axios";

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

export function createAltsObj(img_key, alt_key, alts_arr) {
    if(alts_arr == []) {return;}
    const alts_obj = {};

    alts_obj["img_key"] = img_key;
    alts_obj["alt_key"] = alt_key;
    alts_obj["alts_arr"] = [];
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
    const prev_preferred = current_alts_obj.preferred_alt_text;
    const prev_alt_key =  current_alts_obj.alt_key;
    current_alts_obj.preferred_alt_text = response_alt_obj;
    current_alts_obj.alt_key = response_alt_obj.id;

    //if first obj or response is updated prev preferred text
    if(prev_preferred === null || prev_alt_key === null) {return;}
    if(response_alt_obj.id === prev_alt_key) {return;}
    
    //if response exists already, but isn't preferred, swap preferred and response
    for(let i = 0; i < current_alts_obj.alts_arr.length; i++) {
        if(current_alts_obj.alts_arr[i].id === response_alt_obj.id) {
            current_alts_obj.alts_arr.splice(i, 1, prev_preferred);
            return;
        }
    }

    //otherwise push old preferred onto options
    current_alts_obj.alts_arr.push(prev_preferred);
}

export function set_status(username, status, set_user_status_state, bookNum) {
    
    axios.get(import.meta.env.DATABASE_URL + '/api/user_submissions/?username=' + username +'&item=' + bookNum,
        {'withCredentials': true,
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
        }).then((res) => {
                if(res.data?.id === undefined || res.data?.id === null) {
                    alert("Please submit alt texts before closing this document.");
                    return;
                }
                axios.post(import.meta.env.DATABASE_URL + '/api/user_submissions/' + res.data.id + '/set_status/',
                {
                    'status': status
                },
                {'withCredentials': true,
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                    },
                }).then((post_res) => 
                    set_user_status_state(post_res.data.status)
                ).catch((post_error) => {
                    console.log(post_error);
                    set_user_status_state("In Progress");
                });
        }).catch((error) => {
            console.log(error);
        });
    }