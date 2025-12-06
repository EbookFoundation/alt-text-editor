import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SubmitAllButton from './SubmitAllButton';
import SubmitOneButton from './SubmitOneButton';
import AIAltsButton from "./AIAltsButton";
import ChangeStatusButton from "./ChangeStatusButton";
import DecorativeButton from "./DecorativeButton";

// import React from 'react';
// import axios from "axios";
// import { getCookie } from "./helpers";




export default function ButtonContainer({storedUserInput, bookNum, imgIdtoAltsMap, setImgIdtoAltsMap, imgIdToPKMap,
                                            imgToggleValue, numSelected, noEditImg, docPK, userSubStatus, setUserSubStatus}) {

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
                    <SubmitOneButton bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} setUserSubStatus={setUserSubStatus}
                    storedUserInput={storedUserInput} imgToggleValue={imgToggleValue} numSelected={numSelected} noEditImg={noEditImg} docPK={docPK}/>
                </Col>
                <Col className="d-grid">
                    <SubmitAllButton bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} docPK={docPK}
                    storedUserInput={storedUserInput} noEditImg={noEditImg} numSelected={numSelected} setUserSubStatus={setUserSubStatus}/>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="d-grid">
                    <AIAltsButton pk={docPK} setImgIdtoAltsMap={setImgIdtoAltsMap}/>
                </Col>
                <Col className="d-grid">
                    <DecorativeButton imgIdToPKMap={imgIdToPKMap} imgIdtoAltsMap={imgIdtoAltsMap} 
                    setImgIdtoAltsMap={setImgIdtoAltsMap} imgToggleValue={imgToggleValue}/>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="d-grid">
                    <ChangeStatusButton userSubStatus={userSubStatus} setUserSubStatus={setUserSubStatus} docPK={docPK}/>
                </Col>
            </Row>
        </Container>
    );
}