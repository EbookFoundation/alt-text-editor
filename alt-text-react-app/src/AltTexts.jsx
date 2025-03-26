import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';


export default function AltTexts({stateObj}) {

    const mappedAlts = (alt_text, alt_key, index) => {
        if(alt_text === "") {return;}
        return (
            <InputGroup key={alt_key}>
                <InputGroup.Radio name="altTextSubmission" onChange={(e) => stateObj["userSubRadioValue"][1](e.currentTarget.value)}/>
                <FloatingLabel label={"Alt Text Option " + (index + 1)} controlId={'altText_' + alt_key}>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}} value={alt_text}></Form.Control>
                </FloatingLabel>
            </InputGroup>
        );

        
    }

    const imgAltObj = stateObj["imgIdtoAltsMap"][0][stateObj["imgToggleValue"][0]];
    //before user selects image or no alt key set yet (means existing alt objs are not real options)
    if(stateObj["imgToggleValue"][0] === '' || imgAltObj.alt_key === null) {
        return (
            <></>
        );
    }

    return (
        <>
            <InputGroup>
                <InputGroup.Radio name="altTextSubmission" onChange={(e) => stateObj["userSubRadioValue"][1](e.currentTarget.value)}/>
                <FloatingLabel label="Current Preferred Alt Text" controlId='altTextPref'>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}} value={imgAltObj.preferred_alt_text.text}></Form.Control>
                </FloatingLabel>
            </InputGroup>
            {imgAltObj.alts_arr.map((altObj, index) => mappedAlts(altObj.text, altObj.id, index))}
        </> 
    );



}