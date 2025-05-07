import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';

import axios from 'axios';
import { getCookie, createAltsObj } from './helpers';
import { useState, useEffect } from 'react';

import './css_modules/accordion.css';



export default function BookpageChildren({stateObj, refObj}) {

    const [imgList, setImgList] = useState([]);
    const [iframeImgObj, setIframeImgObj] = useState({});
    // const [alts, setAlts] = useState(null);


    //load images from urls, their related alt texts, and their primary keys from django database
    async function getImagesAltsAndPKs() {
        const img_api_obj_list = await axios.get('http://127.0.0.1:8000/api/documents/1/',
            {'withCredentials': true,
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }).then((response) => {
                stateObj["loadedImgList"][1](true);
                return response.data.imgs;
            });
         
        // if pulling from local file instead of api for alt texts:
        // const altjson = await fetch("alt67098.json").then(response => response.json());
        // setAlts(altjson);

        //await img list for state
        const render = await Promise.all(img_api_obj_list);
        render.sort((a, b) => a.id - b.id);
        setImgList(render);
        stateObj["numImgs"][1](render.length);

        //create maps
        let tempIdMap = {};
        let tempAltMap = {};
        for(let i = 0; i < render.length; i++) {
            tempIdMap = {...tempIdMap, [render[i].img_id]: render[i].id}
            tempAltMap = {...tempAltMap, [render[i].img_id]: createAltsObj(render[i].id, render[i].alt, render[i].alts)}
        }
        stateObj["imgIdToPKMap"][1]({...tempIdMap})
        stateObj["imgIdtoAltsMap"][1]({...tempAltMap})

    }

    useEffect(() => {
        getImagesAltsAndPKs();

        const iframe = refObj["iframe"].current;

        //get all images from iframe, then match them to images in list to add event listeners
        //possible error occurring if list of images from website is different from list of images pulled from api
        //right now it just lets the user know there's a mismatch and deselects

        //Case: PG element references something outside of the book
            //Not available for alt text editing at this time
            //temp solution for case that should not happen (database should match DOM)
        const handleIframeLoad = () => {
            try {
                const images = iframe.contentDocument.body.querySelectorAll("img");
                const imgArr = Array.from(images);
                let imgObj = {};
                if(imgArr.length !== 0) {
                  for(const img of imgArr) {
                    imgObj = {...imgObj, [img.id]: img};
                    img.addEventListener('click', () => {
                        const list_img = document.getElementById("list_" + img.id); //eventually we want to avoid using vanilla JS like this
                        if(list_img !== null) {list_img.click();}
                        else {
                            img.scrollIntoView({behavior: "smooth", block: "center"});
                            stateObj["noEditImg"][1](true);
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

    //map images pulled from database to toggle buttons containing img elements, render in accordion body
    const mappedImages = function (img_type, img_id, img_details, index) {

            const iframe = refObj["iframe"];    
    
            return (
                <Col className='px-2 py-2' key={"list_" + img_id}>
                    <ToggleButton id={"radio_" + img_id} type="radio" name="radio" className="px-1 py-1 mx-0 my-0" value={img_id} variant='outline-primary'
                    checked={img_id === stateObj["imgToggleValue"][0]} onChange={(e) => stateObj["imgToggleValue"][1](e.currentTarget.value)}
                    onClick={(e) => {
                        iframeImgObj[img_id].scrollIntoView({behavior: "smooth", block: "center"});
                        e.currentTarget.scrollIntoView({behavior: "smooth", block: "center"});
                        iframe.current.classList.remove("flash");
                        setTimeout(function() {iframe.current.classList.add("flash")}, 100);
                        stateObj["numSelected"][1](index + 1);
                        if(img_type === 1) {
                            stateObj["noEditImg"][1](true);
                        }
                        else if(img_details.x !== null && img_details.x < 100 && img_details.y !== null && img_details.y < 100) {
                            stateObj["noEditImg"][1](true);
                        }
                        else {
                            stateObj["noEditImg"][1](false);
                        }
                    }}>
                        <img id={"list_" + img_id} src={img_details.url} className="rounded"
                        style={{"maxWidth": "150px", "height": "auto"}} />
                    </ToggleButton>
                </Col>
            );
    }


    if(stateObj["loadedImgList"][0]) {
        return (

            <Accordion.Body className="accordion_align">
                <Container>
                    <Row ref={refObj["list_row"]} className='align-items-center overflow-scroll' style={{"maxWidth": "100%", overflowX: "auto"}} id="list_row">
                        {imgList.map((img, index) => mappedImages(img.img_type, img.img_id, img.image, index))}
                    </Row>
                </Container>
            </Accordion.Body>
        );
    }

    //placeholders for api load wait
    return (
        <Accordion.Body className='accordion_align'>
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