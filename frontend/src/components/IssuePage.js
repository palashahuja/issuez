import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { withRouter } from 'react-router';
import constants from '../constants';
import '../App.css';





const IssuePage = (props) => {
    // const handleClickEvent = (event) => {
    // }
    const { issueid } = props.match.params;
    // get all the issue details 
    const [issueDetails, setIssueDetails] = useState([]);
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/' + issueid)
            .then(res => res.json())
            .then(result => {
                setIssueDetails(result[0]);
            })
    }, [issueid]);


    // should be allowed to edit the issue only on these two criteria
    // 1) The user is assigned to this issue 
    // 2) The user is a lead of the project   
    // 3) 
    return (<div>
        {issueDetails &&
            <Form>
                <h1 className="HeaderFontFamily">Issue Id #{issueid}</h1>
                {' '}
                <FormGroup row>
                    <Label for="Title" sm={12} className="LineFontFamily" style={{ fontSize: 20 }}>
                        <Label style={{fontWeight: 'italic'}}>
                            Title: 
                        </Label>
                        {issueDetails.title}
                    </Label>
                </FormGroup>
                <FormGroup row>
                    <Label for="Description" sm={12} className="LineFontFamily" style={{ fontSize: 20 }}> 
                        <Label style={{fontWeight: 'italic'}}>
                            Description:
                        </Label>
                    {issueDetails.description}
                    </Label>
                </FormGroup>
                <FormGroup row>
                    <Label for="Status" sm={2} className="LineFontFamily" style={{ fontSize: 20 }}>Status</Label>
                    <Col sm={10}>
                        <Input type="select" name="statusSelect" id="statusSelect" className="w-25">
                            <option>OPEN</option>
                            <option>IN REVIEW</option>
                            <option>DONE</option>
                        </Input>
                    </Col>
                </FormGroup>
                <Col>
                    <Button color='primary'>Submit</Button>
                </Col>
            </Form>}</div>);
}

export default withRouter(IssuePage);
