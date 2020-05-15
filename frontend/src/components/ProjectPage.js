import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router';
import { Breadcrumb, BreadcrumbItem, Button, Col, ListGroup, Row } from 'reactstrap';
import '../App.css';
import constants from '../constants';
import CustomListComponent from './CustomListComponent';
import UserContext from './UserContext';

const useStyles = makeStyles((theme) => ({
    control: {
        padding: theme.spacing(2),
    },
}));



const fetchIssues = (issue_set, callback_fn) => {
    let issue_info = []
    let correct_len = issue_set.length;
    issue_set.forEach(element => {
        fetch(constants.LOCALHOST_URL + 'issues/' + element.issue_id)
            .then(res => res.json())
            .then(result => {
                if (result.length === 0) correct_len--;
                else {
                    issue_info.push(result[0]);
                }
                if (issue_info.length === correct_len) {
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
    const [myIssues, setIssues] = useState([]);

    // history for going to create issues 
    const history = useHistory();
    const classes = useStyles();
    const projectURL = constants.LOCALHOST_URL + 'project/' + projectid;
    // check if the current user is a lead of the current project 
    useEffect(() => {
        if (projectid == null) return;
        fetch(projectURL + '/lead/' + userid)
            .then(res => res.json())
            .then(result => {
                if (result['message'] === true) {
                    setLead(true);
                }
            })
    }, [projectid, projectURL, userid]);

    // setLead(true);
    // const history = useHistory();

    // get the details of the project
    const [projectDetails, setProjectDetails] = useState({});
    useEffect(() => {
        if (projectid == null) return;
        fetch(projectURL)
            .then(res => res.json())
            .then(result => {
                setProjectDetails(result[0]);
            })
    }, [projectid, projectURL]);


    const [unAssigned, setUnAssigned] = useState([]);
    // get the unassigned issues 
    useEffect(() => {
        fetch(projectURL + '/issues/unassigned')
            .then(res => res.json())
            .then(result => {
                // setUnAssigned(result);
                fetchIssues(result, setUnAssigned);
            });
    }, [projectURL]);


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

    // get the assigned issues for the currently logged in user 
    useEffect(() => {
        if (userid === null) return;
        fetch(constants.LOCALHOST_URL + 'issues/user/' + userid)
            .then(res => res.json())
            .then(result => {
                // eslint-disable-next-line
                result = result.filter((x) => x.project_id == projectid);
                setIssues(result);
            })
    }, [userid, projectid])

    // should be able to assign leads

    let left_component =  <Grid className="w-90">
        <Col>
            <h1 className="HeaderFontFamily">Unassigned Issues</h1>
        </Col>
        <Paper className={classes.control} style={{ maxHeight: 400, overflow: 'auto' }}>
            <ListGroup>
                {unAssigned.map((item, index) => (
                    <CustomListComponent key={index} item={item} isassign={true} />
                ))}
            </ListGroup>
        </Paper>
    </Grid> ;

    let right_component = <Grid className="w-90">
        <Col>
            <h1 className="HeaderFontFamily">Assigned Issues</h1>
        </Col>
        <Paper className={classes.control} style={{ maxHeight: 400, overflow: 'auto' }}>
            <ListGroup>
                {assigned.map((item, index) => (
                    <CustomListComponent key={index} item={item} />
                ))}
            </ListGroup>
        </Paper>
    </Grid>;
    return (<div>
        <Row>
            <Col >
                <Breadcrumb style={{backgroundColor: 'white'}}>
                    <BreadcrumbItem active><a href="/dashboard">Dashboard</a></BreadcrumbItem>
                </Breadcrumb>
            </Col>
        </Row>
        <Row>
            <Col>
                <h1 className="HeaderFontFamily">
                    {projectDetails.name}
                </h1>
            </Col>
        </Row>
        <Row>
            <Col>
                {projectDetails.description}
            </Col>
        </Row>
        <Row style={{ marginBottom: 20, marginTop: 20 }}>
            <Col>
                <Button className='align-self-center' color='primary' onClick={() => { history.push('/project/' + projectid + '/issue/') }}>Create Issue</Button>
            </Col>
            {isLead && <Col>
                <Button className='align-self-center' color='primary' onClick={() => { history.push('/assign/project/' + projectid) }}>Assign Leads</Button>
            </Col>}
            {isLead && <Col>
                <Button className='align-self-center' color='primary' onClick={() => { history.push('/project/' + projectid + '/edit/') }}>Edit Project</Button>
            </Col>}
        </Row>
        <Row>
            {unAssigned.length > 0 &&
                <Col>
                    {left_component}
                </Col>}
            {assigned.length > 0 &&
                <Col>
                    {right_component}
                </Col>}
        </Row>
        <Row>
            <Col>
                <Grid className="w-90">
                    <Col>
                        <h1 className="HeaderFontFamily" style={{ marginTop: 10 }}>My Issues</h1>
                    </Col>
                    <Paper className={classes.control} style={{ maxHeight: 400, overflow: 'auto', marginTop: 10 }}>
                        <ListGroup>
                            {myIssues.map((item, index) => (
                                <CustomListComponent key={index} item={item} />
                            ))}
                        </ListGroup>
                    </Paper>
                </Grid>
            </Col>
        </Row>
    </div>)

}


export default withRouter(ProjectPage);