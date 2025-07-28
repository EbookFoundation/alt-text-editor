import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';

import Votes from './Votes';
import UserInput from './UserInput';
import { UserContext } from './App';

import { useState, useContext, useEffect } from 'react';
import React from 'react';
import { getCookie } from './helpers';
import axios from 'axios';


import './css_modules/alt.css'
import './css_modules/accordion.css'


export default function AltTexts({bookNum, imgIdtoAltsMap, setImgIdtoAltsMap, imgToggleValue, storedUserInput, 
                                    setStoredUserInput, numSelected, noEditImg}) {

    const username = useContext(UserContext);

    //3 dot button on all alt text submissions
        //if you submitted, have 'edit' that allows you to edit in place then submit patch request on completion
        //if other agent submitted, copy text to 'new alt text' field for editing and a new submission

    //accordion menu to hide / display all submitted alt texts, so you can see image while writing

    //return img obj instead of alt obj when sending 201? up for discussion
        //see update button comment (two users updating same book)

    //display source name to the right of alt text (agent)
        //name of source but no user - special case
    //instead of radio buttons, reddit upvote/downvote system
        //keep track in "status" key in table, sort by status rating, hide negative status objs until user requests to see
        //when users start being added, endorsement table to keep track (backend)
            //keep in mind that status is not displayed yet, be ready to refactor to display status
        //add ai suggestion to this reddit post style list
    //make preferred alt text display visually distinct (border, color, etc.)
    //save user input alt text locally with save button, make it stateful on reload
        //start on image that we left off on
        //for later: alert popup on reload to save before reloading
    //update button: pull img obj selected, update alt text list

    //presentational elements:
        //have some feature to be able to mark as presentational, mark as one of two options as radio list
        //"This image is adequately described by nearby text."
        //"This is a presentational image... blah blah"
        //do not display or have any editable alt text on these <imgs>
        //first as button, then as checkdown list once above gets working adequately
            //checkdown list with user display (alt text edited, unedited, presentational, no objs yet, submitted, etc.)

    //img "type" field:
        //0: normal
        //1: purely decorational
        //2: cover
        //3: button
        //-1: other?

    // Create refs array for dynamic alt texts
    const [disabledStates, setDisabledStates] = useState({});
    const [preferredDisabled, setPreferredDisabled] = useState(true);
    const [textStates, setTextStates] = useState({});
    const [preferredText, setPreferredText] = useState("");


    const map = imgIdtoAltsMap;
    const imgAltObj = imgIdtoAltsMap[imgToggleValue];
    const pref = imgAltObj?.preferred_alt_text;
  
    useEffect(() => {
        if (imgAltObj?.alts_arr) {
            const initialTexts = {};
            const initialDisabled = {};
            
            imgAltObj.alts_arr.forEach(alt => {
                initialTexts[alt.id] = alt.text;
                initialDisabled[alt.id] = true;
            });
            
            setTextStates(initialTexts);
            setDisabledStates(initialDisabled);
        }

        if (pref) {
            setPreferredText(pref.text);
        }
    }, [map, imgAltObj]);


    // function editExistingAltText(alt_id) {
    //     if(!disabledStates[alt_id]) {
    //         try {
    //             patchSubmittedText(alt_id, textStates[alt_id]);
    //         }
    //         catch(error) {
    //             alert("Failed to update alt text: " + error);
    //             return;
    //         }
    //     }
    //     setDisabledStates(prev => ({
    //       ...prev,
    //       [alt_id]: !prev[alt_id]
    //     }));
    // };

    // function editPreferredAltText(alt_id) {
    //     if(!preferredDisabled) {
    //         try {
    //             patchSubmittedText(alt_id, preferredText);
    //         }
    //         catch(error) {
    //             alert("Failed to update preferred alt text: " + error);
    //             return;
    //         }
    //     }
    //     setPreferredDisabled(!preferredDisabled);
    // }

    // async function patchSubmittedText(alt_id, text) {
    //     axios.patch(import.meta.env.DATABASE_URL + '/api/alts/' + alt_id + "/",
    //     {
    //         "text": text
    //     },
    //     {'withCredentials': true,
    //         headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCookie('csrftoken')
    //         },
    //     }) // maybe add Bootstrap <Alert> here instead of vanilla js?
    // }

    // const handleAltTextChange = (alt_id, newText) => {
    //     setTextStates(prev => ({
    //       ...prev,
    //       [alt_id]: newText
    //     }));
    // };
      
    const handlePreferredTextChange = (e) => {
        setPreferredText(e.target.value);
    };

    async function deleteUserAltText(alt_id) {
        axios.delete(import.meta.env.DATABASE_URL + '/api/alts/' + alt_id + "/", 
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }}
        ).then((response) => {
            // remove alt text from local storage
            const localStorageUserInput = JSON.parse(localStorage.getItem(bookNum));
            if(localStorageUserInput !== null && localStorageUserInput !== undefined) {
                delete localStorageUserInput[imgToggleValue];
                localStorage.setItem(bookNum, JSON.stringify(localStorageUserInput));
            }
            setStoredUserInput({...storedUserInput, [imgToggleValue]: ""});

            //find alt in state and delete it
            if(imgAltObj.alt_key !== null && imgAltObj.alt_key === alt_id) {
                imgAltObj.alt_key = null;
                delete imgAltObj.preferred_alt_text;
            }
            else {
                for(let i = 0; i < imgAltObj.alts_arr.length; i++) {
                    if(imgAltObj.alts_arr[i].id === alt_id) {
                        imgAltObj.alts_arr.splice(i, 1);
                        break;
                    }
                }
            }
        })
        .catch((error) => {
            alert("Failed to delete alt text: " + error);
            console.log(error);
        });
    }

    function DeleteButton({alt_key, class_name}) {
        return (
            <Button className={class_name} 
                    size='sm' 
                    onClick={() => deleteUserAltText(alt_key)}>
                {"Delete..."}
            </Button>
        );
    }

    function CopyThenEditButton({text_value_state, class_name}) {
        const [buttonText, setButtonText] = useState("Duplicate...");
        return (
            <Button className={class_name}
                    size='sm' 
                    onClick={() => {
                        setStoredUserInput({...storedUserInput, [imgToggleValue]: text_value_state});
                        setButtonText("Duplicated!");
                        setTimeout(() => {
                            setButtonText("Copy...");
                        }, 2000);
                    }}>
                {buttonText}
            </Button>
        );
    }

    function CheckUserButton({alt_key, text_value_state, source, class_name}) {
        if(username === source) {
            return (<DeleteButton alt_key={alt_key} class_name={class_name}/>);
        }
        return (<CopyThenEditButton text_value_state={text_value_state} class_name={class_name}/>);
    }

    

    const mappedAlts = (alt_obj, alt_text, img_key, alt_key, source, votes, sort_func, index) => {

        source = source ?? "Project Gutenberg"

        return (
            <Container className='px-0 mx-0' key={alt_key}>
                <Row>
                    <Col className='coltext mb-3'>
                        <InputGroup>
                            <Votes vote_identifier={"img_" + img_key + "_alt_" + alt_key} pk={alt_key} num_votes={votes} 
                            alt_obj={alt_obj} sort_func={sort_func}/>
                            <FloatingLabel label={"Option " + (index + 1) + " (source: " + source + ")"} controlId={'altText_' + alt_key}>
                                <Form.Control disabled={disabledStates[alt_key] ?? true} as='textarea' style={{"height": "100px"}} 
                                value={alt_text === "" ? "[none]" : textStates[alt_key]} onChange={(e) => handleAltTextChange(alt_key, e.target.value)}/>
                            </FloatingLabel>
                        </InputGroup>
                        <CheckUserButton alt_key={alt_key} text_value_state={textStates[alt_key]} source={source} class_name={'overtext'}/>
                    </Col>
                </Row>
            </Container>
        );
    }
    // before user selects image or editing is forbidden
    if(noEditImg || imgToggleValue === '') {
        return (
            <UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} 
            setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>
        );
    }

    //if no alt text options, don't display accordion
    if(imgAltObj.alt_key === null && imgAltObj.alts_arr.length === 0) {
        return (
            <UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} 
            setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>
        );
    }

    function PreferredVotes() {
        return (<Votes vote_identifier={"img_" + pref.img + "_alt_" + pref.id} 
        pk={pref.id} num_votes={pref.votes} alt_obj={pref} sort_func={() => {}}></Votes>);
    }

    function PreferredAltText() {
        if(pref === null || pref === undefined || pref == {}) {return(<></>);}
        return(
            <Container className='px-0 mx-0'>
                <Row>
                    <Col className='coltext mb-3'>
                        <InputGroup>
                            <PreferredVotes/>
                            <FloatingLabel label={"Preferred (source: " + (pref.source ?? "Project Gutenberg") + ")"} controlId='altTextPref' className='preferred'>
                                <Form.Control disabled={preferredDisabled} as='textarea' 
                                style={{"height": "100px"}} value={preferredText === "" ? "[none]" : preferredText} onChange={handlePreferredTextChange}/>
                            </FloatingLabel>
                        </InputGroup>
                        <CheckUserButton alt_key={pref.id} source={pref.source}
                        text_value_state={preferredText} class_name="prefovertext overtext"/>
                    </Col>
                </Row>
            </Container>
        );
    }

    function sort_alts_arr(alts_arr) {
        const sorted_arr = alts_arr.toSorted((a, b) => b.votes - a.votes);
        setImgIdtoAltsMap({...imgIdtoAltsMap, [imgToggleValue]: {...imgAltObj, "alts_arr": sorted_arr}});
    }

    return (
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Alt Text Options</Accordion.Header>
                    <Accordion.Body className="accordion_align">
                        <PreferredAltText/>
                        {imgAltObj.alts_arr.sort((a, b) => b.votes - a.votes)
                                            .map((altObj, index) => mappedAlts(altObj, altObj.text, altObj.img, altObj.id, altObj.source, 
                                                                    altObj.votes, () => sort_alts_arr(imgAltObj.alts_arr), index))}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} 
                setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>
        </>
    );



}