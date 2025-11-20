import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import React from 'react';
import axios from 'axios';
import { getCookie, createAltsObj } from './helpers';
import { useState, useEffect } from 'react';

import './css_modules/accordion.css';



export default function BookpageChildren({loadedImgList, setLoadedImgList, setNumImgs, setImgIdtoPKMap, bookNum, iframe_url,
    setImgIdtoAltsMap, setNoEditImg, setNumSelected, storedUserInput, imgToggleValue, setImgToggleValue, iframe_ref, list_row_ref}) {

    const [imgList, setImgList] = useState([]);
    const [iframeImgObj, setIframeImgObj] = useState({});
    const [filterImgRadioValue, setFilterImgRadioValue] = useState("all");


    //load images from urls, their related alt texts, and their primary keys from django database
    async function getImagesAltsAndPKs() {
        const img_api_obj_list = await axios.get(import.meta.env.DATABASE_URL + 
            '/api/documents/get-project-item/?project=Project+Gutenberg&item=' + bookNum,
            {'withCredentials': true,
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
                },
            }).then((response) => {
                setLoadedImgList(true);
                return response.data.imgs;
            }).catch((error) => {
                setNoEditImg(true);
                console.log(error);
                return null;
            });
        
        if(img_api_obj_list === null) {return;}
         
        // if pulling from local file instead of api for alt texts:
        // const altjson = await fetch("your_alt_json_file.txt").then(response => response.json());
        // setAlts(altjson);

        //await img list for state
        const render = await Promise.all(img_api_obj_list);
        render.sort((a, b) => a.id - b.id);
        setImgList(render);
        setNumImgs(render.length);

        //create maps
        let tempIdMap = {};
        let tempAltMap = {};
        for(let i = 0; i < render.length; i++) {
            tempIdMap = {...tempIdMap, [render[i].img_id]: render[i].id};
            tempAltMap = {...tempAltMap, [render[i].img_id]: createAltsObj(render[i].id, render[i].alt, render[i].alts, render[i].img_type)};
        }
        setImgIdtoPKMap({...tempIdMap});
        setImgIdtoAltsMap({...tempAltMap});

    }

    //get all images from iframe, then match them to images in list to add event listeners
        //possible error occurring if list of images from website is different from list of images pulled from api
        //right now it just lets the user know there's a mismatch and deselects

    //Case: PG element references something outside of the book
        //Not available for alt text editing at this time
        //temp solution for case that should not happen (database should match DOM)
    const handleIframeLoad = (e) => {
        try {
            //remove all <a> links that do not have '#' (internal links / chapter markers)
            Array.from(e.currentTarget.contentDocument.body.querySelectorAll("a")).map(a => {
                if(a.href === undefined || (a.href !== "" && a.href.match(iframe_url + "#") !== null))
                    return;
                a.href = "javascript:void(0)";
            });

            //make images clickable to select
            const images = e.currentTarget.contentDocument.body.querySelectorAll("img");
            const imgArr = Array.from(images);
            let imgObj = {};
            if(imgArr.length !== 0) {
                for(const img of imgArr) {
                    imgObj = {...imgObj, [img.id]: img};
                    img.addEventListener('click', () => {
                        setFilterImgRadioValue('all');
                        //possible to avoid using DOM manipulation / vanilla JS like this?
                        //probably better if not, but we need querySelector to get <img> anyway
                        const list_img = document.getElementById("list_" + img.id); 
                        if(list_img !== null && list_img !== undefined) {
                            list_img.click(); 
                        }
                        else {
                            img.scrollIntoView({behavior: "smooth", block: "center"});
                            setNoEditImg(true);
                        }
                    });
                }
                setIframeImgObj({...imgObj});
            }
        } catch (error) {
            console.error("Error accessing iframe content:", error);
        }
    };
    

    useEffect(() => {
        getImagesAltsAndPKs();
    }, []);

    useEffect(() => {
        const iframe = iframe_ref.current;

        iframe.addEventListener("load", (e) => handleIframeLoad(e));

        return () => {
            iframe.removeEventListener("load", (e) => handleIframeLoad(e));
        };
    }, []);

    //map images pulled from database to toggle buttons containing img elements, render in accordion body
    const mappedImages = function (img_type, img_id, img_details, index) {

            const iframe = iframe_ref.current;    
    
            return (
                <Col className='px-2 py-2' key={"list_" + img_id}>
                    <ToggleButton id={"radio_" + img_id} type="radio" name="radio" className="px-1 py-1 mx-0 my-0" value={img_id} variant='outline-primary'
                    checked={img_id === imgToggleValue} onChange={(e) => setImgToggleValue(e.currentTarget.value)}
                    onClick={(e) => {
                        e.currentTarget.scrollIntoView({behavior: "smooth", block: "center"});
                        setNumSelected(index + 1);
                        iframeImgObj[img_id].scrollIntoView({behavior: "smooth", block: "center"});
                        iframe.classList.remove("flash");
                        setTimeout(function() {iframe.classList.add("flash")}, 100);
                    }}>
                        <img id={"list_" + img_id} src={img_details.url} className="rounded"
                        style={{"maxWidth": "150px", "height": "auto"}} />
                    </ToggleButton>
                </Col>
            );
    }

    function filterEdited(id, stored_user_input, bool) {
        if(stored_user_input !== undefined && id in stored_user_input) {
            return bool;
        }
        return !bool;
    }


    if(loadedImgList) {

        const edited = filterImgRadioValue === "edited" ? true : false;
        const filter_func = filterImgRadioValue === "all" ? () => true : (id, stored_user_input) => filterEdited(id, stored_user_input, edited)

        return (

            <Accordion.Body className="accordion_align">
                <Container>
                    <Row>
                        <Col>
                            <Form>
                                <Form.Check
                                    inline
                                    type="radio"
                                    id="all_imgs"
                                    name="filter"
                                    label="All"
                                    value="all"
                                    checked={filterImgRadioValue === "all"}
                                    onChange={(e) => setFilterImgRadioValue(e.target.value)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="In Progress"
                                    id="edited_imgs"
                                    name="filter"
                                    value="edited"
                                    checked={filterImgRadioValue === "edited"}
                                    onChange={(e) => setFilterImgRadioValue(e.target.value)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Unedited"
                                    id="unedited_imgs"
                                    name="filter"
                                    value="unedited"
                                    checked={filterImgRadioValue === "unedited"}
                                    onChange={(e) => setFilterImgRadioValue(e.target.value)}
                                />
                            </Form>
                        </Col>
                    </Row>
                    <Row ref={list_row_ref} className='align-items-center overflow-scroll' style={{"maxWidth": "100%", overflowX: "auto"}} id="list_row">
                        {imgList.filter((img) => filter_func(img.img_id, storedUserInput))
                        .map((img, index) => mappedImages(img.img_type, img.img_id, img.image, index))}
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