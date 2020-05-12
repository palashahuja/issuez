import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import '../App.css';
import constants from '../constants';
import AlertContextProvider from './AlertContext';


const AssignUser = (props) => {
    // now either this will be an issue 
    // now need to get dropdown for all the users
    const [allUsers, setAllUsers] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const displayMessage = useContext(AlertContextProvider).showMessage;
    const history = useHistory();



    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'users')
            .then(res => res.json())
            .then(result => {
                let result_dict = {}
                result.forEach(element => {
                    result_dict[element.user_id] = element;
                });
                console.log(result_dict);
                setAllUsers(result_dict);
            })
    }, []);

    let correctid;

    if(props.assign === 'issue'){
        correctid = props.match.params.issueid;
    }
    else {
        correctid = props.match.params.projectid;
    }
    // first create the dropdown for options 
    let selectionComponent = allUsers &&
        <FormGroup row style={{ marginTop: 10 }}>
            <Label for="Status" sm={2} className="LineFontFamily" style={{ fontWeight: 'bold', fontSize: 20 }}>Select User</Label>
            <Col sm={10}>
                <Input type="select" name="statusSelect" id="statusSelect" className="w-25" onChange={(e) => {
                    // get the user id 
                    let userid;
                    for(const key of Object.keys(allUsers)){
                        if(allUsers[key].username === e.target.value){
                            userid = key;
                            break;
                        }
                    }
                    setUserDetails(userid);
                }}>
                    {/* {allUsers.map((x, i) => <option key={i}>{x.user_id}</option>)} */}
                    {Object.keys(allUsers).map((k, ind) => <option key={ind}>{allUsers[k].username}</option>)}
                </Input>
            </Col>
        </FormGroup>;
    return (
        <Form>
            <h1 className="HeaderFontFamily" style={{ marginTop: 10 }}>Assign User</h1>
            {selectionComponent}
            <FormGroup row>
                <Col>
                    <Button type='button' color='primary' onClick={() => {
                        // now need to assign based on whether this is an assignee of the issue or a project lead 
                        if (props.assign === 'issue') {
                            const postRequestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                            }
                            fetch(constants.LOCALHOST_URL + 'issues/' + correctid + '/user/' + userDetails, postRequestOptions)
                                .then(res => res.json())
                                .then((_) => {
                                    displayMessage('User assigned as a assignee successfully!');
                                    history.push('/issue/' + correctid);
                                })
                        }
                        else {
                            const postRequestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                            }
                            fetch(constants.LOCALHOST_URL + 'project/' + correctid + '/lead/' + userDetails, postRequestOptions)
                                .then(res => res.json())
                                .then((_) => {
                                    displayMessage('User assigned as a lead successfully!');
                                    history.push('/project/' + correctid);
                                })
                        }
                    }}> Assign User</Button>
                </Col>
            </FormGroup>
        </Form>
    );
}

export default withRouter(AssignUser);