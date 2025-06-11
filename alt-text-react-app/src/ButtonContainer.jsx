import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SubmitAllButton from './SubmitAllButton';
import SubmitOneButton from './SubmitOneButton';

import React from 'react';
import axios from "axios";
import { getCookie } from "./helpers";




export default function ButtonContainer({storedUserInput, setStoredUserInput, bookNum, 
    imgIdToPKMap, imgIdtoAltsMap, setImgIdtoAltsMap, imgToggleValue, numSelected, noEditImg}) {

    //accordion title: "working on {book title}, {book number}, {extra description if needed}"

    //reorder alt texts based on status attribute, updated by upvotes (maybe add animation for change in order)
        //hide negative status texts


    // TODO: make this functionality present on actual alt text listing, instead of "edit..." / "save..."

    // const deleteLocalStorage = () => {
    //     if(noEditImg) {return;}
    //     if(userInputPK === null) {
    //         localStorage.removeItem(bookNum);
    //         setStoredUserInput({});
    //         return;
    //     }
    //     axios.patch(import.meta.env.DATABASE_URL + '/api/user_submissions/' + userInputPK + "/",
    //         {
    //             "user_json": {},
    //         },
    //         {'withCredentials': true,
    //             headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': getCookie('csrftoken')
    //             },
    //         }
    //     ).then(() => {
    //         localStorage.removeItem(bookNum);
    //         setStoredUserInput({});
    //         setUserInputPK(null);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // }


    return (
        <Container className="px-0">
            <Row>
                <Col className="d-grid">
                    <SubmitOneButton bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} 
                    storedUserInput={storedUserInput} imgToggleValue={imgToggleValue} numSelected={numSelected} noEditImg={noEditImg}/>
                </Col>
                <Col className="d-grid">
                    <SubmitAllButton bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} 
                    storedUserInput={storedUserInput} noEditImg={noEditImg} numSelected={numSelected}/>
                </Col>
            </Row>
        </Container>
    );
}