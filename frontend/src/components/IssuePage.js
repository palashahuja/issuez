import React, { useContext, useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import { Row, Col, Button, Form, FormGroup, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Breadcrumb, BreadcrumbItem } from 'reactstrap';
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

// replace NULL by start state 
const replaceStatus = (issue) => {
    if (issue.status === 'NULL') {
        issue.status = 'Start State';
    }
    return issue;
}


const IssuePage = (props) => {
    const { issueid } = props.match.params;
    // get all the issue details 
    const [issueDetails, setIssueDetails] = useState([]);
    const [isAssigned, setIsAssigned] = useState(false);
    const [isLead, setIsLead] = useState(false);
    const [issueHistory, setIssueHistory] = useState([]);
    const [assigned, setAssigned] = useState('');
    const userid = useContext(UserContext).userid;
    const [project_id, setProjectId] = useState('');
    const history = useHistory();
    // css classes 
    const classes = useStyles();
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/' + issueid)
            .then(res => res.json())
            .then(result => {
                setIssueDetails(replaceStatus(result[0]));
                setProjectId(result[0].project_id);
                fetch(constants.LOCALHOST_URL + 'project/' + result[0].project_id + '/lead/' + userid)
                    .then(res => res.json())
                    .then(result => {
                        if (result['message'] === true) {
                            setIsAssigned(true);
                            setIsLead(true);
                        }
                    })
            })
    }, [issueid, userid]);


    // get information about people who are assigned to this issue
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/assigned/' + issueid)
            .then(res => res.json())
            .then(result => {
                // currently assigned users 
                let currentlyAss = []
                // now for each issue id get the details of the user 
                result.forEach((elem) => {
                    fetch(constants.LOCALHOST_URL + 'users/' + elem.user_id)
                        .then(res => res.json())
                        .then(output => {
                            currentlyAss.push(output[0].username);
                            if (currentlyAss.length === result.length) {
                                setAssigned(currentlyAss.join());
                            }
                        })
                })
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
                        result = result.map((item, ind) => replaceStatus(item));
                        setIssueHistory(result);
                    })
            });
    }, [issueid, userid]);

    // should be allowed to edit the issue only on these two criteria
    // 1) The user is assigned to this issue 
    // 2) The user is a lead of the project   
    // should be allowed to assign users only if the lead of the project  
    return (<div>
        <Row>
            <Col>
                <Breadcrumb>
                    <BreadcrumbItem active><a href={"/project/" + project_id}>Project Page</a></BreadcrumbItem>
                </Breadcrumb>
            </Col>
        </Row>
        {issueDetails &&
            <Form>
                <h1 className="HeaderFontFamily" style={{ marginTop: 10 }}>Issue Id #{issueid}</h1>
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
                {assigned && <FormGroup row>
                    <Label for="Status" sm={12} className="LineFontFamily" style={{ fontSize: 20 }}>
                        <Label style={{ fontWeight: 700 }}>
                            Assigned Users:
                        </Label>
                        {assigned}
                    </Label>
                </FormGroup>}
                {isAssigned && <FormGroup row>
                    <Col>
                        <Button color='primary' onClick={() => { history.push('/project/' + project_id + '/issue/' + issueid) }}>Edit Issue</Button>
                    </Col>
                    {isLead &&
                        <Col>
                            <Button color='primary' onClick={() => { history.push('/assign/issue/' + issueid) }}>Assign Users</Button>
                        </Col>}
                </FormGroup>}
                {issueHistory && <div className="justify-content-center">
                    <Col>
                        <h1 className="HeaderFontFamily">Issue History</h1>
                    </Col>
                    <Paper className={classes.control} style={{ maxHeight: 400, overflow: 'auto' }}>
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
