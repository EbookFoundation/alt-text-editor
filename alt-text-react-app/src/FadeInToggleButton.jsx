import Transition from "react-transition-group/Transition";
import ToggleButton from "react-bootstrap/ToggleButton";
import Col from "react-bootstrap/Col";

import { useState, useRef } from "react";


export default function FadeInToggleButton({iframe_ref, imgToggleValue, setImgToggleValue, iframeImgObj, setNumSelected,
                                                img_id, img_details, index}) {

    const [inProp, setInProp] = useState(false);
    const nodeRef = useRef(null);
    const iframe = iframe_ref.current;    

    const transitionStyles = {
        entering: { opacity: 1 },
        entered:  { opacity: 1 },
        exiting:  { opacity: 0 },
        exited:  { opacity: 0 },
    };

    const duration = 500;
    let min_delay = Math.min(index * 300, 2000);
    if(index === 0) {min_delay = 0;}

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
    }

    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
            {state => (<Col className='px-2 py-2' ref={nodeRef} 
                            style={{...defaultStyle, ...transitionStyles[state]}}> 
                <ToggleButton id={"radio_" + img_id} type="radio" name="radio" className="px-1 py-1 mx-0 my-0"
                value={img_id} variant='outline-primary' checked={img_id === imgToggleValue}
                onChange={(e) => setImgToggleValue(e.currentTarget.value)}
                onClick={(e) => {
                    e.currentTarget.scrollIntoView({behavior: "smooth", block: "center"});
                    setNumSelected(index + 1);
                    iframeImgObj[img_id].scrollIntoView({behavior: "smooth", block: "center", container: "nearest"});
                    iframe.classList.remove("flash");
                    setTimeout(function() {iframe.classList.add("flash")}, 100);
                }}>
                    <img id={"list_" + img_id} src={img_details.url} className="rounded" 
                    onLoad={() => setTimeout(() => setInProp(true), min_delay)} style={{"maxWidth": "150px", "height": "auto"}} />
                </ToggleButton>
            </Col>)}
        </Transition>
    );


}