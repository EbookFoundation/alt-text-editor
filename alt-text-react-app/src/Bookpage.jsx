import Accordion from 'react-bootstrap/Accordion';
import { BookpageChildren}  from './BookpageChildren';


export default function Bookpage({altOnClick, setNumImgs, listRef, iframeRef, setNumSelected}) {
    return(
    <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
            <Accordion.Header>List of Images</Accordion.Header>
            <BookpageChildren altOnClick={altOnClick} listRef={listRef} iframeRef={iframeRef} setNumImgs={setNumImgs} setNumSelected={setNumSelected}/>
        </Accordion.Item>
      </Accordion>
    );
}