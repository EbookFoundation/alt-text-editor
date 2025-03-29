import { useState, useRef } from 'react';
import './App.css';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.css';
import Bookpage from './Bookpage';
import NavbarDiv from './NavbarDiv';
import AltTexts from './AltTexts';
import ButtonContainer from './ButtonContainer';
import IframeNav from './IframeNav';
// TODO: client save functionality for edits that are yet to be submitted

function App() {

  const [AIText, setAIText] = useState('ai suggestion');
  const [numSelected, setNumSelected] = useState(0);
  const [numImgs, setNumImgs] = useState(0);
  const [imgIdToPKMap, setImgIdToPKMap] = useState({});
  const [imgToggleValue, setImgToggleValue] = useState('');
  const [userSubRadioValue, setUserSubRadioValue] = useState('');
  const [loadedImgList, setLoadedImgList] = useState(false);
  const [imgIdtoAltsMap, setImgIdtoAltsMap] = useState({});

  const iframe = useRef();
  const list_row = useRef();
  const user_input = useRef();

  const stateObj = {
    "AIText": [AIText, setAIText],
    "numSelected": [numSelected, setNumSelected],
    "numImgs": [numImgs, setNumImgs],
    "imgIdToPKMap": [imgIdToPKMap, setImgIdToPKMap],
    "imgToggleValue": [imgToggleValue, setImgToggleValue],
    "loadedImgList": [loadedImgList, setLoadedImgList],
    "imgIdtoAltsMap": [imgIdtoAltsMap, setImgIdtoAltsMap],
    "userSubRadioValue": [userSubRadioValue, setUserSubRadioValue]
  }

  const refObj = {
    "iframe": iframe,
    "list_row": list_row,
    "user_input": user_input
  }

  const oldUserInput = localStorage.getItem("alt_text_input") || "";

  return (
    <>
    <NavbarDiv/>
    <Container fluid className='px-4 py-2'>
      <Row align="end">
        <Col>
          <Stack className='gap-3'>
            <IframeNav stateObj={stateObj} refObj={refObj}/>
            <iframe ref={iframe} id="book" style={{height: "80vh", width: "auto"}} className="border border-secondary border-4" src="/iframe"></iframe>
          </Stack>
        </Col>
        <Col>
          <Stack className='gap-3'>
            <Bookpage stateObj={stateObj} refObj={refObj}/>
            <AltTexts stateObj={stateObj}/>
            <InputGroup>
              <Form.Control id="ai" placeholder={AIText}></Form.Control>
            </InputGroup>
            <InputGroup>
              <Form.Control id="userInput" ref={user_input} placeholder="user input" defaultValue={oldUserInput}></Form.Control>
            </InputGroup>
            <ButtonContainer stateObj={stateObj} refObj={refObj}/>
          </Stack>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default App
