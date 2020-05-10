import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { withRouter, useHistory } from 'react-router';
import constants from '../constants';
import '../App.css';
import UserContext from './UserContext';





const CreateIssuePage = (props) => {
    // const handleClickEvent = (event) => {

    let { projectid, issueid } = props.match.params;

    // get the status list 
    const [statusList, setStatusList] = useState([]);

    const [title, setTitle] = useState(' ');
    const [description, setDescription] = useState(' ');
    const [actualStatus, setStatus] = useState('NULL');
    const [currentStatus, setCurrentStatus] = useState('');
    // history object
    const history = useHistory();

    // get the user id 
    const userid = useContext(UserContext).userid;
    // first get the information regarding that particular issue 
    useEffect(() => {
        if(issueid === undefined) return;
        fetch(constants.LOCALHOST_URL + 'issues/' + issueid)
        .then(res => res.json())
        .then(result => {
            setTitle(result[0].title);
            setDescription(result[0].description);
            setStatus(result[0].status);
        });
    }, [issueid])

    useEffect(() => {
        if(projectid === null) return;
        fetch(constants.LOCALHOST_URL + 'project/' + projectid + '/status/' + actualStatus)
            .then(res => res.json())
            .then(result => {
                result = result.map((x) => x.status_to);
                setStatusList(result);
                setCurrentStatus(result[0]);
            })
    }, [projectid, issueid, actualStatus])

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
        {statusList.length > 0 && <FormGroup row>
            <Label for="Status" sm={2} className="LineFontFamily" style={{ fontWeight: 'bold', fontSize: 20 }}>Status</Label>
            <Col sm={10}>
                <Input type="select" name="statusSelect" id="statusSelect" className="w-25" onChange={(e) => setCurrentStatus(e.target.value)}>
                    {statusList.map((x, i) => <option key={i}>{x}</option>)}
                </Input>
            </Col>
        </FormGroup>}
        <Col>
            <Button color='primary' onClick={() => {
                // create body for post request 
                if(issueid === undefined){
                    let post_body_req = {
                        'title': title,
                        'description': description,
                        'reporter_id': userid,
                        'project_id': projectid,
                        'created_date': '',
                        'latest_status': currentStatus 
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
                        history.push('/project/' + projectid);
                    });
                }
                else{
                    let put_body_request = {
                        'title': title,
                        'description': description,
                        'status': currentStatus,
                        'project_id': projectid
                    }
                    console.log(put_body_request);
                    const putRequestOptions = {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(put_body_request)
                    }
                    fetch(constants.LOCALHOST_URL + 'issues/' + issueid, putRequestOptions)
                    .then(res => res.json())
                    .then(result => {
                        history.push('/project/' + projectid);
                    })
                }
                
                // console.log(post_body_req);

            }}>Submit</Button>
        </Col>
    </Form>);
}

export default withRouter(CreateIssuePage);
