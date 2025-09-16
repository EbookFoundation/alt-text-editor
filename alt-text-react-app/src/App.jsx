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
import NoImage from './NoImage';

export const UserContext = createContext("");


function App() {

  //change default from winnie the pooh?
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const [bookNum, setBookNum] = useState(params.get('book') ?? '67098');

  const [docExists, setDocExists] = useState(true);


  const [numSelected, setNumSelected] = useState(0);
  const [numImgs, setNumImgs] = useState(0);
  const [imgIdToPKMap, setImgIdToPKMap] = useState({});
  const [imgToggleValue, setImgToggleValue] = useState('');
  const [loadedImgList, setLoadedImgList] = useState(false);
  const [imgIdtoAltsMap, setImgIdtoAltsMap] = useState({});
  const [noEditImg, setNoEditImg] = useState(false);
  const [storedUserInput, setStoredUserInput] = useState({});
  const [docPK, setDocPK] = useState(0);

  // user must be set via API call for editing to be enabled – implement "you need to sign in page"
  const [username, setUsername] = useState('');

  const iframe = useRef(null);
  const list_row = useRef(null);

  const prod_url = 'https://altpoet.ebookfoundation.org:8443/cache/epub/' + bookNum + '/pg' + bookNum + '-images.html';
  const iframe_url = import.meta.env.PROD ? prod_url : '/iframe';

  //change user sub to make preferred if ONLY ONE alt text in image is one just submitted

  //user document relations table – status: working, finished, etc.
    //button to mark as finished; represented by enum in json; progress not necessarily linear
    //if document is marked as finished, return "view only" page with no editing box / buttons
  
  //fix whatever is going on in django (migration? revert?)
  //make sure can post alt text with empty text string
  //change how decorative images are checked – if decorative, no edit
    //have button next to save one / save all for "mark as decorative" third option

  //django admin can post / patch / delete outside of api viewmodels
    // add check for username but no user

  //page when loading booknum == # with no images, message user saying "check gutenberg, if images, we will add soon"

  //add frontend button + api
    //load all new alt texts when claude generates through document
  
  //get <title> from iframe: you are now editing <title>CONTENT</title>

  //iframe nav for pages
    //link == contentDocument.location.href
    //submit one image -> click next arrow button
      //rename button to "submit alt text for this image only"

  // alt text lists don't have to have preferred alt texts
    //alt == null just means no preferred, still display options\
  
  //pop up alert when user closes page -> do you want to save?

  //UI tool / info -> edits waiting to be saved / number of images worked on: #

  //TODO (Eric): saving == submitting, make them the same thing
    //still add delete button, replace edit / save button on alt text options list
    //submit one == save one, submit all = save all, delete all = delete all submitted
      //for both delete one and delete all, user auth check
      //create admin user for django who can do anything without auth check on a per user basis
    //keep list of alt texts created by user submission, to keep track of what session alt texts were created in
      //remove user_json field, have localStorage updated by iterating over alt array
      //submit one == submit all, just with json of one image + text key-value pair

  //TODO: status system for ranking

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

    axios.get(import.meta.env.DATABASE_URL + '/api/documents/doc-check/?project=Project+Gutenberg&item=' + bookNum,
    {'withCredentials': true,
      headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
      },
    }).then((res) => {
        setDocExists(true);
        setDocPK(res.data.id);
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
          }).catch((error) => {
            console.log(error);
          })
        })
        .catch((error) => {
          console.log("No user found: " + error);
          setUsername("No User Found");
        });
      }).catch((error) => {
          console.log(error);
          setDocExists(false);
          return;
        });
  }, []);
  
  if(!docExists) {
    return (
     <>
      <NavbarDiv/>
      <NoImage/>
     </> 
    );
  }

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
              <AltTexts bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} imgToggleValue={imgToggleValue} 
              storedUserInput={storedUserInput} setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>
              <ButtonContainer storedUserInput={storedUserInput} setImgIdtoAltsMap={setImgIdtoAltsMap} imgIdtoAltsMap={imgIdtoAltsMap} 
                imgToggleValue={imgToggleValue} bookNum={bookNum} numSelected={numSelected} noEditImg={noEditImg} docPK={docPK}/>
            </Stack>
          </Col>
        </Row>
      </Container>
    </UserContext.Provider>
  );
}

export default App;
