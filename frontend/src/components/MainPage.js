
// for the main page we would need the user id 
// then for the main page 
// we would need to navigate a project page 
import React, { useState, useEffect, useContext } from 'react'
import constants from '../constants';
import { ListGroup, Button } from 'reactstrap';
import { useHistory } from 'react-router';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';
import UserContext  from './UserContext';


const useStyles = makeStyles((theme) => ({
    control: {
        padding: theme.spacing(2),
    },
}));


const convertIssuesToProjectList = (issues, callback_fn, project_ids) => {
    if(!issues || issues === null) return;
    // get all the project ids and then fetch them all 
    if(issues.length === 0) return;
    let uniqueid_list = new Set();
    issues.forEach(element => {
        uniqueid_list.add(element.project_id);
        
    });
    project_ids.forEach(element => {
        uniqueid_list.add(element.project_id);
    })
    var all_project_info = []
    uniqueid_list.forEach((project_id) => {
        fetch(constants.LOCALHOST_URL + 'project/' + project_id)
        .then(res => res.json())
        .then(result => {
            // all_project_info.extend(result);
            result[0]['project_id'] = project_id;
            all_project_info.push.apply(all_project_info, result);
            // this will ensure all the project information is added 
            if(all_project_info.length === uniqueid_list.size){
                callback_fn(all_project_info);
            }
        })
    });
}


const CustomProjectListComponent = (props) => {
    const [isActive, setActive] = useState(false);
    const history = useHistory();
    const activeChange = () => { setActive(!isActive) };
    // handle the clicking event here 
    const handleClick = () => {history.push("/project/" + props.item.project_id)};
    return (
        <ListGroupItem active={isActive} onMouseEnter={activeChange} onMouseLeave={activeChange} onClick={() => {handleClick()}}>
            <ListGroupItemHeading className="LineFontFamily">{props.item.name}</ListGroupItemHeading>
            <ListGroupItemText className="LineFontFamily">{props.item.description}</ListGroupItemText>
        </ListGroupItem>
    );
}



// custom component for the main page 
export default function MainPage(props) {
    const [project_list, setProjectList] = useState([]);
    const [all_project_list, setAllProjectList] = useState([]);
    const userid = useContext(UserContext).userid;
    // history object 
    const history = useHistory();
    // style component for the component 
    const classes = useStyles();
    // fetch the data for the issues 
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/user/' + userid)
            .then(res => res.json())
            .then(result => {
                    if('message' in result) return;
                    fetch(constants.LOCALHOST_URL + 'project/user/' + userid)
                    .then(res => res.json())
                    .then(project_leads => {
                        if('message' in project_leads) return;
                        convertIssuesToProjectList(result, setProjectList, project_leads);
                    })
            });
    }, [userid]);

    // fetch the data for all projects 
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'project')
        .then(res => res.json())
        .then(result => {
            if('message' in result) return;
            setAllProjectList(result);
        })
    }, [userid]);

    // return the project list
    return (
        <div>
            <Grid container alignItems="stretch" spacing={2} direction="column" >
                <Grid item xs={12}>
                        <Paper className={classes.control}>
                            <h1 className="HeaderFontFamily">Your Projects</h1>
                            <ListGroup>
                                {project_list.map((item, index) => (
                                    <CustomProjectListComponent key={index} item={item} />
                                ))}
                            </ListGroup>
                        </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.control}>
                        <h1 className="HeaderFontFamily">All Projects</h1>
                        <ListGroup>
                            {all_project_list.map((item, index) => (
                                <CustomProjectListComponent key={index} item={item}/>
                            ))}
                        </ListGroup>
                    </Paper>
                </Grid>
                <Grid item xs={12} onClick={() => history.push('/createproject')}>
                    <Button color="primary">Create Project</Button>
                </Grid>
            </Grid>
        </div>
    );
}