import React, { useContext, useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import { Col, Button, Form, FormGroup, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import '../App.css';
import constants from '../constants';
import UserContext from './UserContext';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const CustomIssueHistory = (props) => {
    const [isActive, setActive] = useState(false);
    const activeChange = () => { setActive(!isActive) };
    // handle the clicking event here 
    // const handleClick = () => {history.push("/project/" + props.item.project_id)};
    return (
        <ListGroupItem active={isActive} onMouseEnter={activeChange} onMouseLeave={activeChange}>
            <ListGroupItemHeading className="LineFontFamily">{props.item.status}</ListGroupItemHeading>
            <ListGroupItemText className="LineFontFamily">{props.item.updated_time}</ListGroupItemText>
        </ListGroupItem>
    );
}

const useStyles = makeStyles((theme) => ({
    control: {
        padding: theme.spacing(2),
    },
}));



const IssuePage = (props) => {
    const { issueid } = props.match.params;
    // get all the issue details 
    const [issueDetails, setIssueDetails] = useState([]);
    const [isAssigned, setIsAssigned] = useState(false);
    const [issueHistory, setIssueHistory] = useState([]);
    // const [assigned, setAssigned] = useState([]);
    const userid = useContext(UserContext).userid;
    const [project_id, setProjectId] = useState('');
    const history = useHistory();
    // css classes 
    const classes = useStyles();
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/' + issueid)
            .then(res => res.json())
            .then(result => {
                setIssueDetails(result[0]);
                setProjectId(result[0].project_id);
                fetch(constants.LOCALHOST_URL + 'project/' + result[0].project_id + '/lead/' + userid)
                    .then(res => res.json())
                    .then(result => {
                        if (result['message'] === true) {
                            setIsAssigned(true);
                        }
                    })
            })
    }, [issueid, userid]);


    // get information about people who are assigned to this issue
    useEffect(() =>{
        fetch(constants.LOCALHOST_URL + 'issues/assigned/' + issueid)
        .then(res => res.json())
        .then(result => {
            // now for each issue id get the details of the user 

        })
    }, [issueid])


    // check if the user is assigned to this particular issue 
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/assigned/' + userid)
        .then(res => res.json())
        .then(result => {
            if (result.includes(userid)) {
                setIsAssigned(true);
            }
            fetch(constants.LOCALHOST_URL + 'issues/history/' + issueid)
            .then(res => res.json())
            .then(result => {
                setIssueHistory(result);
            })
        });
    }, [issueid, userid]);

    // should be allowed to edit the issue only on these two criteria
    // 1) The user is assigned to this issue 
    // 2) The user is a lead of the project   
    return (<div>
        {issueDetails &&
            <Form>
                <h1 className="HeaderFontFamily">Issue Id #{issueid}</h1>
                {' '}
                <FormGroup row>
                    <Label for="Title" sm={12} className="LineFontFamily" style={{ fontSize: 20 }}>
                        <Label style={{ fontWeight: 700 }}>
                            Title:
                        </Label>
                        {issueDetails.title}
                    </Label>
                </FormGroup>
                <FormGroup row>
                    <Label for="Description" sm={12} className="LineFontFamily" style={{ fontSize: 20 }}>
                        <Label style={{ fontWeight: 700 }}>
                            Description:
                        </Label>
                        {issueDetails.description}
                    </Label>
                </FormGroup>
                <FormGroup row>
                    <Label for="Status" sm={12} className="LineFontFamily" style={{ fontSize: 20 }}>
                        <Label style={{ fontWeight: 700 }}>
                            Status:
                        </Label>
                        {issueDetails.status}
                    </Label>
                </FormGroup>
                <FormGroup row>

                </FormGroup>
                {isAssigned && <FormGroup row>
                    <Col>
                        <Button color='primary' onClick={() => { history.push('/project/' + project_id + '/issue/' + issueid) }}>Edit Issue</Button>
                    </Col>
                </FormGroup>}
                {issueHistory && <div className="justify-content-center">
                    <Paper className={classes.control}>
                        <h1 className="HeaderFontFamily">Issue History</h1>
                        <ListGroup>
                            {issueHistory.map((element, index) => (
                                <CustomIssueHistory key={index} item={element} />
                            ))}
                        </ListGroup>
                    </Paper>
                </div>}
            </Form>}</div>);
}

export default withRouter(IssuePage);
