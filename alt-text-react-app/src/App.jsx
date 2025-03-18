import { useState, useRef } from 'react';
import './App.css';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import 'bootstrap/dist/css/bootstrap.css';
import Bookpage from './Bookpage';
import NavbarDiv from './NavbarDiv';
import SubmitButton from './SubmitButton'


function App() {

  const [altText, setAltText] = useState('');
  const [numSelected, setNumSelected] = useState(0);
  const [numImgs, setNumImgs] = useState(0);

  const iframe = useRef();
  const list_row = useRef();
  const user_input = useRef();

  const leftButtonClick = () => {
    if (numSelected <= 1) {return;}
    let r = list_row.current.children;
    r[numSelected - 2].querySelector("img").click();
  }

  const rightButtonClick = () => {
    if (numSelected >= numImgs) {return;}
    let r = list_row.current.children;
    r[numSelected].querySelector("img").click();
  }

  return (
    <>
    <NavbarDiv/>
    <Container fluid className='px-4 py-2'>
      <Row align="end">
        <Col className=''>
          <Stack className='gap-3'>
            <InputGroup className='px-6 justify-content-center'>
              <Button onClick={leftButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
              </Button>
              <span className='input-group-text'>{numSelected}/{numImgs}</span>
              <Button onClick={rightButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>
              </Button>
            </InputGroup>
            <iframe ref={iframe} id="book" style={{height: "80vh", width: "auto"}} className="border border-secondary border-4" src="/iframe"></iframe>
          </Stack>
        </Col>
        <Col>
          <Stack className='gap-3'>
            <Bookpage altOnClick={(text) => {setAltText(text)}} listRef={list_row} iframeRef={iframe} setNumImgs={setNumImgs} setNumSelected={setNumSelected}/>
            <InputGroup>
              <FloatingLabel label="Existing Alt Text">
                <Form.Control id="altText" disabled as='textarea' style={{"height": "100px"}} value={altText}></Form.Control>
              </FloatingLabel>
            </InputGroup>
            <InputGroup>
              <Form.Control id="ai" placeholder="ai suggestion"></Form.Control>
            </InputGroup>
            <InputGroup>
              <Form.Control id="userInput" ref={user_input} placeholder="user input"></Form.Control>
            </InputGroup>
            <SubmitButton userInput={user_input}/>
          </Stack>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default App
