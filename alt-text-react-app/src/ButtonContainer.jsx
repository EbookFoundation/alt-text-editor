import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SubmitButton from './SubmitButton'
import UpdateButton from "./UpdateButton";




export default function ButtonContainer({stateObj, refObj}) {

    const saveLocalStorage = () => {
        let current_user_input = refObj["user_input"].current.value;
        if(current_user_input === "" || current_user_input === null) {return;}
        localStorage.setItem("alt_text_input", current_user_input);
    }

    const deleteLocalStorage = () => {
        localStorage.removeItem("alt_text_input");
        refObj["user_input"].current.value = "";
    }


    return (
        <>
            <Container className="px-0">
                <Row>
                    <Col className="d-grid">
                        <Button onClick={saveLocalStorage}>Save</Button>
                    </Col>
                    <Col className="d-grid">
                        <SubmitButton userInput={refObj["user_input"]} stateObj={stateObj}/>
                    </Col>
                </Row>
            </Container>
            <Container className="px-0">
                <Row>
                    <Col className="d-grid">
                        <UpdateButton stateObj={stateObj}/>
                    </Col>
                    <Col className="d-grid">
                        <Button onClick={deleteLocalStorage}>Clear</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}