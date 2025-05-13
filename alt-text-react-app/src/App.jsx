import 'bootstrap/dist/css/bootstrap.css';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Bookpage from './Bookpage';
import NavbarDiv from './NavbarDiv';
import AltTexts from './AltTexts';
import ButtonContainer from './ButtonContainer';
import IframeNav from './IframeNav';

import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { getCookie } from './helpers';

import './css_modules/App.css';


function App() {

  const [numSelected, setNumSelected] = useState(0);
  const [numImgs, setNumImgs] = useState(0);
  const [imgIdToPKMap, setImgIdToPKMap] = useState({});
  const [imgToggleValue, setImgToggleValue] = useState('');
  const [userSubRadioValue, setUserSubRadioValue] = useState('');
  const [loadedImgList, setLoadedImgList] = useState(false);
  const [imgIdtoAltsMap, setImgIdtoAltsMap] = useState({});
  const [noEditImg, setNoEditImg] = useState(false);
  const [storedUserInput, setStoredUserInput] = useState({});

  //these states will be dependent on fetches to django user data via sessionid in the future
  const [username, setUsername] = useState('rowanmckereghan');
  const [bookNum, setBookNum] = useState('67098');
  const [userInputPK, setUserInputPK] = useState(null);

  const iframe = useRef();
  const list_row = useRef();

  const stateObj = {
    "numSelected": [numSelected, setNumSelected],
    "numImgs": [numImgs, setNumImgs],
    "imgIdToPKMap": [imgIdToPKMap, setImgIdToPKMap],
    "imgToggleValue": [imgToggleValue, setImgToggleValue],
    "loadedImgList": [loadedImgList, setLoadedImgList],
    "imgIdtoAltsMap": [imgIdtoAltsMap, setImgIdtoAltsMap],
    "userSubRadioValue": [userSubRadioValue, setUserSubRadioValue],
    "noEditImg": [noEditImg, setNoEditImg],
    "storedUserInput": [storedUserInput, setStoredUserInput],
    "bookNum": [bookNum, setBookNum],
    "username": [username, setUsername],
    "userInputPK": [userInputPK, setUserInputPK]
  }

  const refObj = {
    "iframe": iframe,
    "list_row": list_row
  }

  //proxy server for all pg books (just mirror content at diff url)
    //not rewriting, just mirroring
    //eric shares cloud server for proxying
  //user profile: list of saved and submitted books, trash can next to saved books to delete 
    //instead of delete button on individual books
    //urls stored in api backend, images stored on original database

  //django login and book list for editing
    //serve dynamic site quickly -> url param to get this react app based on book chosen
    //get user data from sid request: eric email
    //make environment variables based on url params so app is context dependent
      //eg; username, iframe src, get and post req domain, + more probably
    //refactor with usecontext and usereducer
  
  //edit/save button check username against database
  //make pull request for user submission model

  useEffect(() => {

    //get old user input if already started editing
    axios.get(import.meta.env.DATABASE_URL + '/api/user_submissions/?username=' + username +'&document=1',
      {'withCredentials': true,
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
          },
      }
      ).then((response) => {
        if(response.status === 200) {
          //backup to database, store in local storage.
          localStorage.setItem(stateObj["bookNum"][0], JSON.stringify(response.data.user_json));
          setStoredUserInput(response.data.user_json);
          setUserInputPK(response.data.id);
        }
        else {
          const oldUserInput = localStorage.getItem(bookNum);
          if(oldUserInput != null) {
          setStoredUserInput(JSON.parse(oldUserInput));
        }
        }
      }).catch((error) => {
        console.log(error);
      });
  }, []);
  

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
            <ButtonContainer stateObj={stateObj} refObj={refObj}/>
          </Stack>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default App
