import UserInput from "./UserInput";
import AltTexts from "./AltTexts";


export default function AltDisplay({bookNum, imgIdtoAltsMap, setImgIdtoAltsMap, imgToggleValue, storedUserInput,
                                    setStoredUserInput, numSelected, noEditImg, userSubStatus}) {


    const book_complete = "This book has been marked as complete. If you wish to add or edit to it, please reopen.";
    const decorative_msg = "This image has been marked as decorative and is not currently editable.";
    const default_no_edit_msg = "This image is not available for editing at this time.";

    const imgAltObj = imgIdtoAltsMap[imgToggleValue];

    // "Complete" (not open for editing)
    if(userSubStatus === 2) { 
        return(<UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} noEditMsg={book_complete}
            setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={true}/>);
    }
    // img(s) not yet selected or loaded
    else if(noEditImg || imgToggleValue === '' || imgAltObj == undefined) { 
        return (
            <UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} noEditMsg={default_no_edit_msg}
            setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>
        );
    }
    //decorative image
    else if(imgAltObj.img_type === 1) {
        return(<UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} noEditMsg={decorative_msg}
            setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={true}/>);
    }
    // accordion is not displayed if there are no alt texts for img
    else if(imgAltObj.alt_key === null && imgAltObj.alts_arr.length === 0) {
        return(<UserInput imgToggleValue={imgToggleValue} storedUserInput={storedUserInput} noEditMsg={default_no_edit_msg}
                    setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>);
    }
    //default
    return (<AltTexts bookNum={bookNum} imgIdtoAltsMap={imgIdtoAltsMap} setImgIdtoAltsMap={setImgIdtoAltsMap} imgToggleValue={imgToggleValue} 
                  storedUserInput={storedUserInput} setStoredUserInput={setStoredUserInput} numSelected={numSelected} noEditImg={noEditImg}/>);
    
}