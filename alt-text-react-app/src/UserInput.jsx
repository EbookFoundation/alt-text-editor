import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import './css_modules/alt.css'



export default function UserInput({storedUserInput, setStoredUserInput, imgToggleValue, numSelected, noEditImg, noEditMsg}) {


    const label = "Add / Edit Alt Text";


    // update local storage as user types (even if doesn't save or submit when closing page, should be restored when reopening tab)
    function updateUserInputState(e) {
        if(numSelected === 0) {return;}
        if(e.currentTarget.value === "") {
            const newStrUsr = {...storedUserInput};
            delete newStrUsr[imgToggleValue];
            setStoredUserInput(newStrUsr);
            return;
        }
        
        setStoredUserInput({...storedUserInput, [imgToggleValue]: e.currentTarget.value});
    }

    function getUserInput() {
        if(storedUserInput[imgToggleValue] == null || storedUserInput[imgToggleValue] === "") {
            return "";
        }
        return storedUserInput[imgToggleValue];
    }

    // text editing space (form.control)

    if(numSelected === 0) {
        return (
            <InputGroup>
                <FloatingLabel label={label} controlId='userAltTextDisabled'>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}}
                    value="Please select an image to begin editing"/>
                </FloatingLabel>
            </InputGroup>
        );
    }

    if(noEditImg) {
        return (
            <InputGroup>
                <FloatingLabel label={label} controlId='userAltTextDisabled'>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}}
                    value={noEditMsg}/>
                </FloatingLabel>
            </InputGroup>
        );
    }

    //normal img
    return (
        <InputGroup>
            <FloatingLabel label={label} controlId={'userAltText_' + imgToggleValue}>
                <Form.Control as='textarea' style={{"height": "100px"}} 
                onChange={(e) => updateUserInputState(e)} value={getUserInput()}/>
            </FloatingLabel>
        </InputGroup>
    );


}