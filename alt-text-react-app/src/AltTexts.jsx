import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Votes from './Votes';
import './alt.css'


export default function AltTexts({stateObj}) {

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

    const mappedAlts = (alt_text, img_key, alt_key, source, index) => {
        if(alt_text === "") {return;}
        return (
            <InputGroup key={alt_key}>
                <Votes vote_identifier={"img_" + img_key + "_alt_" + alt_key}></Votes>
                <FloatingLabel label={"Option " + (index + 1) + " (source: " + source + ")"} controlId={'altText_' + alt_key}>
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

    const pref = imgAltObj.preferred_alt_text;

    function PreferredVotes() {
        return (<Votes vote_identifier={"img_" + pref.img + "_alt_" + pref.id}></Votes>);
    }

    return (
        <>
            <InputGroup>
                <PreferredVotes/>
                <FloatingLabel label={"Preferred (source: " + pref.source + ")"} controlId='altTextPref' className='preferred'>
                    <Form.Control disabled as='textarea' style={{"height": "100px"}} value={pref.text}></Form.Control>
                </FloatingLabel>
            </InputGroup>
            {imgAltObj.alts_arr.map((altObj, index) => mappedAlts(altObj.text, altObj.img, altObj.id, altObj.source, index))}
        </> 
    );



}