import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import ButtonContainer from './ButtonContainer';

import './css_modules/alt.css'
import { useState } from 'react';



export default function UserInput({stateObj}) {

    const strUsr = stateObj["storedUserInput"][0];
    const setStrUsr = stateObj["storedUserInput"][1];


    function updateUserInputState(e) {
        if(stateObj["numSelected"][0] === 0) {return;}
        if(e.currentTarget.value === "") {
            const newStrUsr = {...strUsr};
            delete newStrUsr[[stateObj["imgToggleValue"][0]]]; // or whichever key you want
            setStrUsr(newStrUsr);
            return;
        }
        
        setStrUsr({...strUsr, [stateObj["imgToggleValue"][0]]: e.currentTarget.value});
    }

    function getUserInput() {
        if(strUsr[stateObj["imgToggleValue"][0]] == null || strUsr[stateObj["imgToggleValue"][0]] === "") {
            return "";
        }
        return strUsr[stateObj["imgToggleValue"][0]];
    }

    if(stateObj["numSelected"][0] === 0) {
        return (
            <InputGroup>
                <FloatingLabel label={"New Alt Text"} controlId='userAltTextDisabled'>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}}
                    value="Please select an image to begin alt text editing."/>
                </FloatingLabel>
            </InputGroup>
        );
    }

    if(stateObj["noEditImg"][0]) {
        return (
            <InputGroup>
                <FloatingLabel label={"New Alt Text"} controlId='userAltTextDisabled'>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}}
                    value="This image is not available for alt text editing at this time."/>
                </FloatingLabel>
            </InputGroup>
        );
    }

    //normal img
    return (
        <InputGroup>
            <FloatingLabel label={"New Alt Text"} controlId={'userAltText_' + stateObj["imgToggleValue"][0]}>
                <Form.Control as='textarea' style={{"height": "100px"}} 
                onChange={(e) => updateUserInputState(e)} value={getUserInput()}/>
            </FloatingLabel>
        </InputGroup>
    );


}