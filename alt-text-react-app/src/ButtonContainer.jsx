import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SubmitAllButton from './SubmitAllButton';
import SubmitOneButton from './SubmitOneButton';

import axios from "axios";
import { getCookie } from "./helpers";




export default function ButtonContainer({stateObj, refObj}) {

    //change button names to reflect what they do more accurately
        //"save all suggestions", "suggest all"

    //user input in state for each image, and automatically saved
        //1 text input <-> 1 image (blank on new image, saved value on returning)
        //save button stores user input obj to their user instance in database
        //pk: (fk to user, fk to document), att: json obj blob representing img user state
        //clear button would delete obj from the database - delete button rename
        //update button not needed, locking books to one user editing at a time
    
    //get username from session object that contains auth cookie for backend 
        //fetch saved user input, if exists, from backend and load
        //check django REST framework documentation

    //accordion title: "working on {book title}, {book number}, {extra description if needed}"

    //reorder alt texts based on status attribute, updated by upvotes (maybe add animation for change in order)
        //hide negative status texts

    const saveLocalStorage = () => {
        if(Object.keys(stateObj["storedUserInput"][0]).length === 0) {return;}
        if(stateObj["userInputPK"][0] === null) {
            postLocalStorage();
        }
        else {
            patchLocalStorage();
        }
        
    }

    function postLocalStorage() {
        axios.post(import.meta.env.DATABASE_URL + '/api/user_submissions/',
            { "document": 1, //TODO: change to booknum here and in django models
              "user_json": stateObj["storedUserInput"][0],
              "submission_type": "SV"
            },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }
        ).then((response) => {
            localStorage.setItem(stateObj["bookNum"][0], JSON.stringify(response.data.user_json));
            stateObj["userInputPK"][1](response.data.id);
        }).catch((error) => {
            console.log(error);
        });
    }

    function patchLocalStorage() {
        axios.patch(import.meta.env.DATABASE_URL + '/api/user_submissions/' + stateObj["userInputPK"][0] + "/",
            {
              "user_json": stateObj["storedUserInput"][0],
              "submission_type": "SV"
            },
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }
        ).then((response) => {
            localStorage.setItem(stateObj["bookNum"][0], JSON.stringify(response.data.user_json));
        }).catch((error) => {
            console.log(error);
        });
    }

    const deleteLocalStorage = () => {
        localStorage.removeItem(stateObj["bookNum"][0]);
        stateObj["storedUserInput"][1]({});
        if(stateObj["userInputPK"][0] === null) {return;}
        axios.delete(import.meta.env.DATABASE_URL + '/api/user_submissions/' + stateObj["userInputPK"][0] + "/",
            {'withCredentials': true,
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }
        ).catch((error) => {
            console.log(error);
        });
    }


    return (
        <>
            <Container className="px-0">
                <Row>
                    <Col className="d-grid">
                        <Button onClick={saveLocalStorage}>Save All In Progress</Button>
                    </Col>
                    <Col className="d-grid">
                        <SubmitAllButton stateObj={stateObj}/>
                    </Col>
                </Row>
            </Container>
            <Container className="px-0">
                <Row>
                    <Col className="d-grid">
                        <SubmitOneButton userInput={refObj["user_input"]} stateObj={stateObj}/>
                    </Col>
                    <Col className="d-grid">
                        <Button onClick={deleteLocalStorage}>Delete All In Progress</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}