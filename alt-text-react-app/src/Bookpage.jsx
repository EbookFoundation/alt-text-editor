import Accordion from 'react-bootstrap/Accordion';
import BookpageChildren from './BookpageChildren';
import React from 'react';



export default function Bookpage({bookNum, loadedImgList, setLoadedImgList, setNumImgs, setImgIdtoPKMap,
    setImgIdtoAltsMap, setNoEditImg, setNumSelected, storedUserInput, imgToggleValue, setImgToggleValue, 
    iframe_ref, list_row_ref, iframe_url}) {

    let title = iframe_ref.current?.contentDocument.querySelector("head > title")?.innerHTML ?? ("Book #" + bookNum)

    return(
    <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
            <Accordion.Header>Now Editing: {title}</Accordion.Header>
            <BookpageChildren loadedImgList={loadedImgList} setLoadedImgList={setLoadedImgList} setNumImgs={setNumImgs} bookNum={bookNum}
            setImgIdtoPKMap={setImgIdtoPKMap} setImgIdtoAltsMap={setImgIdtoAltsMap} setNoEditImg={setNoEditImg} iframe_ref={iframe_ref} 
            setNumSelected={setNumSelected} list_row_ref={list_row_ref} storedUserInput={storedUserInput} imgToggleValue={imgToggleValue} 
            setImgToggleValue={setImgToggleValue} iframe_url={iframe_url}/>
        </Accordion.Item>
      </Accordion>
    );
}