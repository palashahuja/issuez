import React, { useState, useEffect, useContext } from 'react'
import constants from '../constants';
import { Row, Col, ListGroup, Button } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import '../App.css';
import UserContext from './UserContext';
import CustomListComponent from './CustomListComponent';
import { useHistory } from 'react-router'; 

const useStyles = makeStyles((theme) => ({
    control: {
        padding: theme.spacing(2),
    },
}));



const fetchIssues = (issue_set, callback_fn) => {
    let issue_info = []
    issue_set.forEach(element => {
        fetch(constants.LOCALHOST_URL + 'issues/' + element.issue_id)
            .then(res => res.json())
            .then(result => {
                issue_info.push(result[0]);
                if (issue_info.length === issue_set.length) {
                    callback_fn(issue_info);
                }
            })
    });
}


const ProjectPage = (props) => {
    const { projectid } = props.match.params;
    const userid = useContext(UserContext).userid;
    // three main functionality 
    // 1) see unassigned issues  (if project lead)
    // 2) see assigned issues to me 
    // 3) ability to create new issues (if project lead)
    // 4) see active issues (it means that these are the issues that are assigned to somebody)
    const [isLead, setLead] = useState(false);

    // history for going to create issues 
    const classes = useStyles();
    const projectURL = constants.LOCALHOST_URL + 'project/' + projectid;
    // check if the current user is a lead of the current project 
    useEffect(() => {
        if(projectid == null) return;
        fetch(projectURL + '/lead/' + userid)
            .then(res => res.json())
            .then(result => {
                setLead(true);
            })
    }, [projectid, projectURL, userid]);

    // setLead(true);
    const history = useHistory();

    const [unAssigned, setUnAssigned] = useState([]);
    // get the unassigned issues 
    useEffect(() => {
        if (isLead) {
            fetch(projectURL + '/issues/unassigned')
                .then(res => res.json())
                .then(result => {
                    // setUnAssigned(result);
                    fetchIssues(result, setUnAssigned);
                });
        }
    }, [isLead, projectURL]);


    const [assigned, setAssigned] = useState([]);
    // get the assigned issues 
    useEffect(() => {
            fetch(projectURL + '/issues/assigned')
                .then(res => res.json())
                .then(result => {
                    // setAssigned(result);
                    fetchIssues(result, setAssigned);
                })
    }, [projectURL, isLead]);

    let left_component = isLead ? <Grid className="w-90">
        <Paper className={classes.control}>
            <h1 className="HeaderFontFamily">Unassigned Issues</h1>
            <ListGroup>
                {unAssigned.map((item, index) => (
                    <CustomListComponent key={index} item={item} isassign={true}/>
                ))}
            </ListGroup>
        </Paper>
    </Grid> : null;

    let left_len = isLead ? 6 : 0;
    let right_len = isLead ? 6 : 12;
    let right_component = <Grid className="w-90">
        <Paper className={classes.control}>
            <h1 className="HeaderFontFamily">Assigned Issues</h1>
            <ListGroup>
                {assigned.map((item, index) => (
                    <CustomListComponent key={index} item={item} />
                ))}
            </ListGroup>
        </Paper>
    </Grid>;
    return (<div>
        <Row>
            <Col sm={left_len}>
                {left_component}
            </Col>
            <Col sm={right_len}>
                {right_component}
            </Col>
        </Row>
        <Row style={{marginTop: 10}}>
            <Col>
                <Button className='align-self-center' color='primary' onClick={() => {history.push('/project/' + projectid + '/issue/create')}}>Create Issue</Button>
            </Col>
        </Row>
    </div>)

}


export default withRouter(ProjectPage);