import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React from 'react';
import './css_modules/nav.css'



export default function NavbarDiv() {

    return (
    <Navbar className="bg-info-subtle border border-info-subtle py-0 mb-2">
        <Navbar.Brand className='py-0'>
            <img
            src="https://www.gutenberg.org/gutenberg/pg-logo-129x80.png"
            className="d-inline-block align-top"
            alt="PG LOGO"
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
        <Container className='px-0'>
            <Row>
                <Col className='px-0' xs lg="8.5">
                        <Nav>
                        <NavDropdown title="About">
                            <NavDropdown.Item href='https://www.gutenberg.org/about/'>About Project Gutenberg</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/policy/collection_development.html'>Collection Development</NavDropdown.Item>                                       
                            <NavDropdown.Item href='https://www.gutenberg.org/about/contact_information.html'>Contact Us</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/about/background/'>History & Philosophy</NavDropdown.Item>                  
                            <NavDropdown.Item href='https://www.gutenberg.org/policy/permission.html'>Permissions & License</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/policy/privacy_policy.html'>Privacy Policy</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/policy/terms_of_use.html'>Terms of Use</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Search & Browse">
                            <NavDropdown.Item href='https://www.gutenberg.org/ebooks/'>Book Search</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/ebooks/bookshelf/'>Bookshelves</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/browse/scores/top'>Frequently Downloaded</NavDropdown.Item>
                            <NavDropdown.Item href='https://www.gutenberg.org/ebooks/offline_catalogs.html'>Offline Catalogs</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Help">
                                <NavDropdown.Item href='https://www.gutenberg.org/help/'>All help topics&nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                    </svg>
                                </NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/copyright.html'>Copyright How-To</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/errata.html'>Errata, Fixes and Bug Reports</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/file_formats.html'>File Formats</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/faq.html'>Frequently Asked Questions</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/policy/'>Policies&nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                    </svg>
                                </NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/public_domain_ebook_submission.html'>Public Domain eBook Submission</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/submitting_your_own_work.html'>Submitting Your Own Work</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/help/mobile.html'>Tablets, Phones and eReaders</NavDropdown.Item>
                                <NavDropdown.Item href='https://www.gutenberg.org/attic/'>The Attic&nbsp;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                    </svg>
                                </NavDropdown.Item>

                    
                        </NavDropdown>
                    </Nav>
                </Col>
                <Col md='auto'>
                    <Form className='d-flex me-2 align-self-right'>
                        <InputGroup className="mb-0">
                            <Form.Control placeholder='Search...'
                            aria-describedby="searchbar"  id='searchbar'
                            />
                            <InputGroup.Text id="search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            </Container>
        </Navbar.Collapse>
    </Navbar>
    );
}
