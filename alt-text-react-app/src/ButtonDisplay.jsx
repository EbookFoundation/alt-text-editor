import ButtonContainer from "./ButtonContainer";
import ChangeStatusButton from "./ChangeStatusButton";
import DecorativeButton from "./DecorativeButton";


export default function ButtonDisplay({bookNum, storedUserInput, setImgIdtoAltsMap, imgIdtoAltsMap, imgToggleValue, userSubStatus,
                                        setUserSubStatus, numSelected, noEditImg, docPK, imgIdToPKMap}) {

    if(userSubStatus === 'Complete') { //reopen completed book btn
        return(<ChangeStatusButton userSubStatus={userSubStatus} setUserSubStatus={setUserSubStatus} bookNum={bookNum}/>);
    }
    else if(imgIdtoAltsMap[imgToggleValue]?.img_type === 1) {
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


              