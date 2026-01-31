import ButtonContainer from "./ButtonContainer";
import ChangeStatusButton from "./ChangeStatusButton";
import DecorativeButton from "./DecorativeButton";


export default function ButtonDisplay({bookNum, storedUserInput, setImgIdtoAltsMap, imgIdtoAltsMap, imgToggleValue, userSubStatus,
                                        setUserSubStatus, numSelected, noEditImg, docPK, imgIdToPKMap}) {

    if(userSubStatus === 2) { //reopen after set to "Complete"
        return(<ChangeStatusButton userSubStatus={userSubStatus} setUserSubStatus={setUserSubStatus} bookNum={bookNum} docPK={docPK}/>);
    }
    else if(imgIdtoAltsMap[imgToggleValue]?.img_type === 1) { // no editing if img is decorative
        return(<DecorativeButton imgIdToPKMap={imgIdToPKMap} imgIdtoAltsMap={imgIdtoAltsMap} 
        setImgIdtoAltsMap={setImgIdtoAltsMap} imgToggleValue={imgToggleValue}/>);
    }

    //default / normal editing
    return (
        <ButtonContainer storedUserInput={storedUserInput} setImgIdtoAltsMap={setImgIdtoAltsMap} imgIdtoAltsMap={imgIdtoAltsMap} 
                imgToggleValue={imgToggleValue} bookNum={bookNum} numSelected={numSelected} noEditImg={noEditImg} docPK={docPK}
                  userSubStatus={userSubStatus} setUserSubStatus={setUserSubStatus} imgIdToPKMap={imgIdToPKMap}
                />
    );

}


              