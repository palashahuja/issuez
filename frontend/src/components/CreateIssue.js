import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { withRouter, useHistory } from 'react-router';
import constants from '../constants';
import '../App.css';
import UserContext from './UserContext';





const CreateIssuePage = (props) => {
    // const handleClickEvent = (event) => {

    const { projectid } = props.match.params;

    // get the status list 
    const [statusList, setStatusList] = useState([]);

    const [title, setTitle] = useState(' ');
    const [description, setDescription] = useState(' ');

    // history object
    const history = useHistory();

    // get the user id 
    const userid = useContext(UserContext).userid;

    useEffect(() => {
        if(projectid === null) return;
        fetch(constants.LOCALHOST_URL + 'project/' + projectid + '/status/NULL')
            .then(res => res.json())
            .then(result => {
                result = result.map((x) => x.status_to);
                setStatusList(result);
            })
    }, [projectid])

    return (<Form>
        <h1 className="HeaderFontFamily" style={{ marginTop: 10 }}>Edit/Create an Issue</h1>
        <FormGroup row>
            <Label sm={2} style={{ fontWeight: 'bold', fontSize: 20 }} className="LineFontFamily">Project ID: </Label>
            <Col sm={1} style={{ marginTop: 10 }}>
                {projectid}
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="Title" sm={2} className="LineFontFamily" style={{ fontWeight: 'bold', fontSize: 20 }}>Title</Label>
            <Col sm={10}>
                <Input value={title} onChange={e => setTitle(e.target.value)} type="text" name="title" id="inputTitle" className="w-75" placeholder="Enter title here"></Input>
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="Description" sm={2} className="LineFontFamily" style={{ fontWeight: 'bold', fontSize: 20 }}>Description</Label>
            <Col sm={10}>
                <Input value={description} onChange={e => setDescription(e.target.value)} type="text" name="description" id="inputDescription" className="w-75" placeholder="Enter description here"></Input>
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="Status" sm={2} className="LineFontFamily" style={{ fontWeight: 'bold', fontSize: 20 }}>Status</Label>
            <Col sm={10}>
                <Input type="select" name="statusSelect" id="statusSelect" className="w-25">
                    {statusList.map((x, i) => <option key={i}>{x}</option>)}
                </Input>
            </Col>
        </FormGroup>
        <Col>
            <Button color='primary' onClick={() => {
                // create body for post request 
                let post_body_req = {
                    'title': title,
                    'description': description,
                    'reporter_id': userid,
                    'project_id': projectid,
                    'created_date': ''
                }
                const postRequestOptions = {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(post_body_req)
                }
                // create an issue and then assign the status 
                fetch(constants.LOCALHOST_URL + 'issues', postRequestOptions)
                .then(res => res.json())
                .then(result => {
                    // redirect to the project page
                    console.log(result);
                    history.push('/project/' + projectid);
                });
                
                // console.log(post_body_req);

            }}>Submit</Button>
        </Col>
    </Form>);
}

export default withRouter(CreateIssuePage);
