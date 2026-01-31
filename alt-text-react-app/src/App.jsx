import { useState, useRef, useEffect, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Bookpage from './Bookpage';
import NavbarDiv from './NavbarDiv';
import IframeNav from './IframeNav';
import NoImage from './NoImage';
import AltDisplay from './AltDisplay';
import ButtonDisplay from './ButtonDisplay';

import axios from 'axios';
import { getCookie } from './helpers';
import './css_modules/App.css';

export const UserContext = createContext("");


function App() {

  //change default from winnie the pooh?
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const [bookNum, setBookNum] = useState(params.get('book') ?? '67098');

  const [docExists, setDocExists] = useState(true);
  const [userSubStatus, setUserSubStatus] = useState(0);


  const [numSelected, setNumSelected] = useState(0);
  const [numImgs, setNumImgs] = useState(0);
  const [imgIdToPKMap, setImgIdToPKMap] = useState({});
  const [imgToggleValue, setImgToggleValue] = useState('');
  const [loadedImgList, setLoadedImgList] = useState(false);
  const [imgIdtoAltsMap, setImgIdtoAltsMap] = useState({});
  const [noEditImg, setNoEditImg] = useState(false);
  const [storedUserInput, setStoredUserInput] = useState({});
  const [docPK, setDocPK] = useState(0);

  const [username, setUsername] = useState('');

  const iframe = useRef(null);
  const list_row = useRef(null);

  const prod_url = 'https://altpoet.ebookfoundation.org:8443/cache/epub/' + bookNum + '/pg' + bookNum + '-images.html';
  const iframe_url = import.meta.env.PROD ? prod_url : '/iframe';

  const axios_headers = {'withCredentials': true,
                          headers: {'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': getCookie('csrftoken')}}


  //preload all necessary user data before loading editor
  useEffect(() => {

    //get document by item #
    axios.get(import.meta.env.DATABASE_URL + '/api/documents/doc-check/?project=Project+Gutenberg&item=' + bookNum, axios_headers)
    .then((res) => {
        setDocExists(true);
        setDocPK(res.data.id);
        setUserSubStatus(res.data.status);
        if(res.data.status === 2) {return;}
        get_username();
      }).catch((error) => {
          console.log(error);
          setDocExists(false);
          return;
        });
  }, []);


  function get_user_submission(res) {
    axios.get(import.meta.env.DATABASE_URL + '/api/user_submissions/?username=' + res.data.username +'&item=' + bookNum, axios_headers)
    .then((response) => {
      store_in_local(response);
    }).catch((error) => {
      console.log(error);
    })
  }


  function get_username() {
    axios.get(import.meta.env.DATABASE_URL + '/api/users/get-username', axios_headers) //get username for Context
    .then((res) => {
        setUsername(res.data.username);
        get_user_submission(res);
      }).catch((error) => {
        console.log("No user found: " + error);
        setUsername("No User Found");
      });
  }

  function store_in_local(response) {
    let oldUserInput = {};
    if(response.status === 200) {
      for (const alt_created of response.data.alts_created) {
        oldUserInput = {...oldUserInput, [alt_created.img]: alt_created.text}
      }
      localStorage.setItem(bookNum, JSON.stringify(oldUserInput));
      setStoredUserInput(oldUserInput);
    }
    else {
      oldUserInput = localStorage.getItem(bookNum);
      if(oldUserInput !== null && oldUserInput !== undefined) {
        setStoredUserInput(JSON.parse(oldUserInput));
      }
    }
  }
  
  // if doc is not in database, return alternative page explaining
  if(!docExists) {
    return (
     <>
      <NavbarDiv/>
      <NoImage/>
     </> 
    );
  }

  // main app
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
                storedUserInput={storedUserInput} iframe_ref={iframe} list_row_ref={list_row} iframe_url={iframe_url}/>
              <AltDisplay bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} 
              imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} setStoredUserInput={setStoredUserInput} 
              numSelected={numSelected} noEditImg={noEditImg} userSubStatus={userSubStatus}/>
              <ButtonDisplay storedUserInput={storedUserInput} setImgIdtoAltsMap={setImgIdtoAltsMap} imgIdtoAltsMap={imgIdtoAltsMap} 
                imgToggleValue={imgToggleValue} bookNum={bookNum} numSelected={numSelected} noEditImg={noEditImg} docPK={docPK}
                  userSubStatus={userSubStatus} setUserSubStatus={setUserSubStatus} imgIdToPKMap={imgIdToPKMap}/>
            </Stack>
          </Col>
        </Row>
      </Container>
    </UserContext.Provider>
  );
}

export default App;
