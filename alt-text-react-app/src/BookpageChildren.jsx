import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import { getCookie, createAltsObj } from './helpers';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';


import './css_modules/accordion.css';
import FadeInToggleButton from './FadeInToggleButton';


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
                setTimeout(function() {setLoadedImgList(true);}, 1000);
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
            let atags_with_anchors = [];
            Array.from(e.currentTarget.contentDocument.body.querySelectorAll("a")).map(a => {
                if(a.href === undefined) {return;}
                if(a.href !== "" && a.href.match(iframe_url + "#") !== null) {
                    atags_with_anchors.push(a);
                    return;
                }
                a.href = "javascript:void(0)";
            })

            //funky scrolling javascript bs. prevents entire page from moving when clicking on internal links / anchors
            let anchors = [];
            for(const atag of atags_with_anchors) {
                anchors.push(e.currentTarget.contentDocument.getElementById(atag.href.split("#")[1]));
            }

            for(let i = 0; i < atags_with_anchors.length; i++) {
                atags_with_anchors[i].addEventListener("click", (event) => {
                    event.preventDefault();
                    anchors[i].scrollIntoView({behavior: "instant", block: "start", container: "nearest"});
                });
            }

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
                            img.scrollIntoView({behavior: "smooth", block: "center", container: "nearest"});
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
    

    // preload imgs
    useEffect(() => {
        getImagesAltsAndPKs();
    }, []);

    // preload iframe
    useEffect(() => {
        const iframe = iframe_ref.current;

        iframe.addEventListener("load", (e) => handleIframeLoad(e));

        return () => {
            iframe.removeEventListener("load", (e) => handleIframeLoad(e));
        };
    }, []);

    //map images pulled from database to toggle buttons containing img elements, render in accordion body
        //now fades in instead of loading skeleton first
    const mappedImages = function (img_id, img_details, index) {
        return(<FadeInToggleButton imgToggleValue={imgToggleValue} key={"list_" + img_id} setImgToggleValue={setImgToggleValue} iframeImgObj={iframeImgObj}
                setNumSelected={setNumSelected} iframe_ref={iframe_ref} img_id={img_id} img_details={img_details} index={index}/>);
    }

    // filter by if user has submitted or started writing alt texts (inverse if bool = false)
    function filterEdited(id, stored_user_input, bool) {
        if(stored_user_input !== undefined && id in stored_user_input) {
            return bool;
        }
        return !bool;
    }


    const edited = filterImgRadioValue === "edited" ? true : false;
    const filter_func = filterImgRadioValue === "all" ? () => true : (id, stored_user_input) => filterEdited(id, stored_user_input, edited)

    return (
        <Accordion.Body className="accordion_align" style={{minHeight: "40vh"}}>
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
                    .map((img, index) => mappedImages(img.img_id, img.image, index))}
                </Row>
            </Container>
        </Accordion.Body>
    );
}