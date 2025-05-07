import './css_modules/alt.css';
import { useState, useRef } from 'react';


export default function Votes({vote_identifier}) {
    const upvoteRef = useRef(null);
    const downvoteRef = useRef(null);

    const [upvoteChecked, setUpvoteChecked] = useState(false);
    const [downvoteChecked, setDownvoteChecked] = useState(false);

    const upvoteToggle = () => {
        if(downvoteRef.current.checked) {
            downvoteRef.current.checked = false;
            setDownvoteChecked(false);
        }

        setUpvoteChecked(upvoteRef.current.checked);
    }

    const downvoteToggle = () => {
        if(upvoteRef.current.checked) {
            upvoteRef.current.checked = false;
            setUpvoteChecked(false);
        }

        setDownvoteChecked(downvoteRef.current.checked);
    }

    const upvoteStyle = {
        "backgroundColor": upvoteChecked ? "#59a9f9" : "inherit",
    }

    const downvoteStyle = {
        "backgroundColor": downvoteChecked ? "#F88107" : "inherit",
    }


    return (
        <span className="input-group-text">
            <input className="form-check-input input-upvote" type="checkbox" name="altTextSubmission" 
            id={vote_identifier + "_up"} ref={upvoteRef} onChange={upvoteToggle}/>
            <input className="form-check-input input-downvote" type="checkbox" name="altTextSubmission" 
            id={vote_identifier + "_down"} ref={downvoteRef} onChange={downvoteToggle}/>
            <label htmlFor={vote_identifier + "_up"}>
                <svg style={upvoteStyle} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="vote bi bi-arrow-up-square" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                </svg>
            </label>
            <label htmlFor={vote_identifier + "_down"}>
                <svg style={downvoteStyle} xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" className="vote bi bi-arrow-down-square" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                </svg>
            </label>
        </span>
    );
}