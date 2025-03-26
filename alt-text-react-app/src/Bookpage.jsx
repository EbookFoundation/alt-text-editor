import Accordion from 'react-bootstrap/Accordion';
import BookpageChildren from './BookpageChildren';


export default function Bookpage({stateObj, refObj}) {
    return(
    <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
            <Accordion.Header>List of Images</Accordion.Header>
            <BookpageChildren stateObj={stateObj} refObj={refObj}/>
        </Accordion.Item>
      </Accordion>
    );
}