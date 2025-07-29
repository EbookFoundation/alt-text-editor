import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import React, { useEffect } from 'react';





export default function IframeNav({numSelected, list_row_ref, numImgs, loadedImgList}) {

    const leftButtonClick = () => {
        if (numSelected <= 1) {return;}
        let r = list_row_ref.current.children;
        r[numSelected - 2].querySelector("img").click();
    }
    
    const rightButtonClick = () => {
        if (numSelected >= numImgs) {return;}
        let r = list_row_ref.current.children;
        r[numSelected].querySelector("img").click();
    }

    useEffect(() => {
        if(list_row_ref.current == null) {return;}
        if(numImgs > 0) {setTimeout(function() {rightButtonClick();}, 300);}
    }, [loadedImgList, list_row_ref]);
    
    function loadImgNav() {
        if(loadedImgList) {
            return  numSelected + "/" + numImgs;
        }

        return "Loading...";
    }

    return(
        <InputGroup className='px-6 justify-content-center'>
            <Button onClick={leftButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
            </Button>
            <span className='input-group-text'>{loadImgNav()}</span>
            <Button onClick={rightButtonClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>
            </Button>
        </InputGroup>
    );
}