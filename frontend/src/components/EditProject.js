import React, { useState, useEffect } from "react";
import constants from '../constants';
import { FormGroup } from "@material-ui/core";
import { Label, Col, Input, Form, Button } from 'reactstrap';
import { withRouter, useHistory } from 'react-router';




const EditProjectPage = (props) => {
    const { projectid } = props.match.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const history = useHistory();

    // get the title and description and store it 
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'project/' + projectid)
            .then(res => res.json())
            .then(result => {
                setTitle(result[0].name); setDescription(result[0].description);
            })
    }, [projectid]);

    return (<div>
        <h1 className="HeaderFontFamily" style={{ marginTop: 10 }}>Edit Project</h1>
        {projectid && <Form>
            <FormGroup row>
                <Label sm={2} style={{ fontWeight: 'bold', fontSize: 20 }} className="LineFontFamily">Enter Name:</Label>
                <Col sm={10}>
                    <Input value={title} onChange={e => setTitle(e.target.value)} type="text" name="title" id="inputTitle" className="w-75"></Input>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} style={{ fontWeight: 'bold', fontSize: 20 }} className="LineFontFamily">Enter Description:</Label>
                <Col sm={10}>
                    <Input value={description} onChange={e => setDescription(e.target.value)} type="text" name="description" id="inputDescription" className="w-75"></Input>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col>
                    <Button className='align-self-center' color='primary' onClick={() => {
                        // need to send the request here 
                        let put_body_req = {
                            'name': title,
                            'description': description
                        }
                        const putRequestOptions = {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(put_body_req)
                        }
                        fetch(constants.LOCALHOST_URL + 'project/' + projectid, putRequestOptions)
                        .then(res => res.json())
                        .then(result => {
                            history.push('/project/' + projectid);
                        })
                    }}>Edit Project</Button>
                </Col>
            </FormGroup>
        </Form>}
    </div>);
}

export default withRouter(EditProjectPage);