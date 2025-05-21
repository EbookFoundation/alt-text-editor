import React from 'react';
import { useState, useRef, useEffect, createContext } from 'react';
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
import { getCookie } from './helpers';
import './css_modules/App.css';

export const UserContext = createContext("");


function App() {

  const [numSelected, setNumSelected] = useState(0);
  const [numImgs, setNumImgs] = useState(0);
  const [imgIdToPKMap, setImgIdToPKMap] = useState({});
  const [imgToggleValue, setImgToggleValue] = useState('');
  const [loadedImgList, setLoadedImgList] = useState(false);
  const [imgIdtoAltsMap, setImgIdtoAltsMap] = useState({});
  const [noEditImg, setNoEditImg] = useState(false);
  const [storedUserInput, setStoredUserInput] = useState({});

  // user must be set via API call for editing to be enabled – implement "you need to sign in page"
  const [username, setUsername] = useState('');
  const [userInputPK, setUserInputPK] = useState(null);

  //change default from winnie the pooh?
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const [bookNum, setBookNum] = useState(params.get('book') ?? '67098');

  const iframe = useRef(null);
  const list_row = useRef(null);

  const iframe_url = import.meta.env.PROD ? 'https://dev.gutenberg.org/cache/epub/' + bookNum + '/pg' + bookNum + '-images.html' : '/iframe';

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

    axios.get(import.meta.env.DATABASE_URL + '/api/users/get-username',
      {'withCredentials': true,
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
        },
      })
      .then((res) => {
        setUsername(res.data.username);
        axios.get(import.meta.env.DATABASE_URL + '/api/user_submissions/?username=' + res.data.username +'&item=' + bookNum,
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
              localStorage.setItem(bookNum, JSON.stringify(response.data.user_json));
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
          })
      })
      .catch((error) => {
        console.log("No user found: " + error);
        setUsername("No User Found");
      });
    
  }, []);
  

  return (
    <UserContext.Provider value={username}>
      <NavbarDiv/>
      <Container fluid className='px-4 py-2'>
        <Row align="end">
          <Col>
            <Stack className='gap-3'>
              <IframeNav numSelected={numSelected} numImgs={numImgs} loadedImgList={loadedImgList} list_row_ref={list_row}/>
              <iframe ref={iframe} id="book" style={{height: "80vh", width: "auto"}} 
              className="border border-secondary border-4" src={iframe_url}/>
            </Stack>
          </Col>
          <Col>
            <Stack className='gap-3'>
              <Bookpage bookNum={bookNum} setImgIdtoAltsMap={setImgIdtoAltsMap} setImgIdtoPKMap={setImgIdToPKMap}
                setImgToggleValue={setImgToggleValue} imgToggleValue={imgToggleValue} setLoadedImgList={setLoadedImgList}
                loadedImgList={loadedImgList} setNoEditImg={setNoEditImg} setNumImgs={setNumImgs} setNumSelected={setNumSelected}
                storedUserInput={storedUserInput} iframe_ref={iframe} list_row_ref={list_row}/>
              <AltTexts imgIdtoAltsMap={imgIdtoAltsMap} imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} 
                setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>
              <ButtonContainer storedUserInput={storedUserInput} setStoredUserInput={setStoredUserInput} setImgIdtoAltsMap={setImgIdtoAltsMap}
                imgIdtoAltsMap={imgIdtoAltsMap} imgIdToPKMap={imgIdToPKMap} imgToggleValue={imgToggleValue} bookNum={bookNum} 
                setUserInputPK={setUserInputPK} userInputPK={userInputPK} numSelected={numSelected} noEditImg={noEditImg}/>
            </Stack>
          </Col>
        </Row>
      </Container>
    </UserContext.Provider>
  );
}

export default App;
