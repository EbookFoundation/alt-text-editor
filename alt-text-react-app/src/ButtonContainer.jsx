import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SubmitAllButton from './SubmitAllButton';
import SubmitOneButton from './SubmitOneButton';
import AIAltsButton from "./AIAltsButton";
import ChangeStatusButton from "./ChangeStatusButton";
import DecorativeButton from "./DecorativeButton";





export default function ButtonContainer({storedUserInput, bookNum, imgIdtoAltsMap, setImgIdtoAltsMap, imgIdToPKMap,
                                            imgToggleValue, numSelected, noEditImg, docPK, userSubStatus, setUserSubStatus}) {


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