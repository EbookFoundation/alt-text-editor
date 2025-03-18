import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';


import { useState, useEffect } from 'react';

//get csrf token for django auth with name == 'csrftoken'
export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export function BookpageChildren({altOnClick, listRef, iframeRef, setNumImgs, setNumSelected}) {

    const [imgList, setImgList] = useState([]);
    const [radioValue, setRadioValue] = useState('');
    const [iframeImgObj, setIframeImgObj] = useState({});
    const [alts, setAlts] = useState(null);
    const [loadedImgList, setLoadedImgList] = useState(false);

    const mappedImages = function (img_id, img_src, index) {

            return (
                <Col className='px-2 py-2' key={"list_" + img_id}>
                    <ToggleButton id={"radio_" + img_id} type="radio" name="radio" className="px-1 py-1 mx-0 my-0" value={img_id} variant='outline-primary'
                    checked={img_id === radioValue} onChange={(e) => setRadioValue(e.currentTarget.value)}
                    onClick={(e) => {
                            iframeImgObj[img_id].scrollIntoView({behavior: "smooth", block: "center"});
                            e.currentTarget.scrollIntoView({behavior: "smooth", block: "center"});
                            iframeRef.current.classList.remove("flash");
                            setTimeout(function() {iframeRef.current.classList.add("flash")}, 100);
                            altOnClick(alts[img_id]);
                            setNumSelected(index + 1);
                        }}>
                        <img id={"list_" + img_id} src={img_src} /*alt={img.alt}*/ className="rounded"
                        style={{"maxWidth": "150px", "height": "auto"}} />
                    </ToggleButton>
                </Col>
            );
    }

    async function getURLs() {
        const img_api_obj_list = await axios.get('http://127.0.0.1:8000/api/documents/1/',
            {'withCredentials': true,
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
             }).then((response) => {
                setLoadedImgList(true);
                return response.data.imgs;
                });
         
        //currently pulling from local file instead of api
        const altjson = await fetch("alt67098.json").then(response => response.json());

        const render = await Promise.all(img_api_obj_list);
        setImgList(render);
        setNumImgs(render.length);
        setAlts(altjson);
        
    }

    //api returns list of urls, not list of objs -> need to request each url which has high load time (1.5s)
    useEffect(() => {
        getURLs();

        const iframe = iframeRef.current;

        //get all images from iframe, then match them to images in list to add event listeners
        //possible error occurring if list of images from website is different from list of images pulled from api
        //right now it just lets the user know there's a mismatch and deselects

        //Case: PG element references something outside of the book
            //Not available for alt text editing at this time
        const handleIframeLoad = () => {
            try {
                const images = iframe.contentDocument.body.querySelectorAll("img");
                const imgArr = Array.from(images);
                let imgObj = {};
                if(imgArr.length !== 0) {
                  for(const img of imgArr) {
                    //console.log(img);
                    imgObj = {...imgObj, [img.id]: img};
                    img.addEventListener('click', () => {
                        const list_img = document.getElementById("list_" + img.id);
                        if(list_img !== null) {list_img.click();}
                        else {
                            img.scrollIntoView({behavior: "smooth", block: "center"});
                            altOnClick("This image is not available for alt text editing at this time.");
                            setNumSelected(0);
                            setRadioValue("NO IMAGE");
                        }

                    });
                  }
                  setIframeImgObj({...imgObj});
                }
            } catch (error) {
                console.error("Error accessing iframe content:", error);
            }
        };

        iframe.addEventListener("load", handleIframeLoad);

        return () => {
            iframe.removeEventListener("load", handleIframeLoad);
        };
    }, []);


    if(loadedImgList) {
        return (

            //move mapped images into new file again so render happens and scroll updates at same time?
            <Accordion.Body className="overflow-scroll" style={{"textAlign": "center", "scrollbarColor": "#00000080 rgba(255, 255, 255, 0.87)", "maxHeight": "40vh"}}>
                <Container style={{"minWidth": "100%", "width": "0", "height": "40vh"}}>
                    <Row ref={listRef} className='align-items-center overflow-scroll' style={{"maxWidth": "100%", overflowX: "auto"}} id="list_row">
                        {imgList.map((img, index) => mappedImages(img.img_id, img.image, index))}
                    </Row>
                </Container>
            </Accordion.Body>
        );
    }

    //placeholders for api load wait
    return (
        <Accordion.Body className="overflow-scroll" style={{"textAlign": "center", "scrollbarColor": "#00000080 rgba(255, 255, 255, 0.87)", "maxHeight": "40vh"}}>
                <Container style={{"minWidth": "100%", "width": "0", "height": "40vh"}}>
                    <Row className='align-items-center overflow-scroll' style={{"maxWidth": "100%", overflowX: "auto"}}>
                        {
                            Array.from({length: 6})
                            .map((_, index) => (
                                <Col className='px-2 py-2' key={index}>
                                    <svg width='170' height='204.73'>
                                        <rect width="150" height="184.73" x='10' y='10' rx='10' ry='10' fill="#D3D3D3" strokeWidth="1" stroke="blue"></rect>
                                    </svg>
                                </Col>
                            ))
                        }
                    </Row>
                </Container>
            </Accordion.Body>
    );
}