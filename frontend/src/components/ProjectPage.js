import React, { useState, useEffect, useContext } from 'react'
import constants from '../constants';
import { ListGroup } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import '../App.css';
import UserContext from './UserContext';
import CustomListComponent from './CustomListComponent';

const useStyles = makeStyles((theme) => ({
    control: {
        padding: theme.spacing(2),
    },
}));



const ProjectPage = (props) => {
    const { projectid } = props.match.params;
    const userid = useContext(UserContext).userid;
    // three main functionality 
    // 1) see unassigned issues  (if project lead)
    // 2) see assigned issues to me 
    // 3) ability to create new issues (if project lead)
    // 4) see active issues (it means that these are the issues that are assigned to somebody)
    const [isLead, setLead] = useState(false);

    const classes = useStyles();
    const projectURL = constants.LOCALHOST_URL + 'project/' + projectid;
    console.log(projectURL);
    // check if the current user is a lead of the current project 
    useEffect(() => {
        fetch(projectURL + '/lead/' + userid)
            .then(res => res.json())
            .then(result => {
                setLead(true);
            })
    }, [projectURL, userid]);

    // setLead(true);

    const [unAssigned, setUnAssigned] = useState([]);
    // get the unassigned issues 
    useEffect(() => {
        if (isLead) {
            fetch(projectURL + '/issues/unassigned')
                .then(res => res.json())
                .then(result => {
                    setUnAssigned(result);
                });
        }
    }, [isLead, projectURL])


    const [assigned, setAssigned] = useState([]);
    // get the assigned issues 
    useEffect(() => {
        if (isLead) {
            fetch(projectURL + '/issues/assigned')
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    setAssigned(result);
                })
        }
    }, [isLead, projectURL]);

    let left_component = isLead ? <Grid item xs={6}>
        <Paper className={classes.control}>
            <h1 className="HeaderFontFamily">Unassigned Issues for the project </h1>
            <ListGroup>
                {unAssigned.map((item, index) => (
                    <CustomListComponent key={index} item={item} />
                ))}
            </ListGroup>
        </Paper>
    </Grid> : null;

    let right_len = isLead ? 6 : 12;
    let right_component = <Grid item xs={right_len}>
        <Paper className={classes.control}>
            <h1 className="HeaderFontFamily">Assigned issues for the project </h1>
            <ListGroup>
                {assigned.map((item, index) => (
                    <CustomListComponent key={index} item={item} />
                ))}
            </ListGroup>
        </Paper>
    </Grid>;
    return (<div>
        {left_component}
        {right_component}
    </div>)

}


export default withRouter(ProjectPage);