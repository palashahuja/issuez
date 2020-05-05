
// for the main page we would need the user id 
// then for the main page 
// we would need to navigate a project page 
import React, { useState, useEffect, useContext } from 'react'
import constants from '../constants';
import { ListGroup } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';
import UserContext  from './UserContext';
import CustomListComponent from './CustomListComponent';


const useStyles = makeStyles((theme) => ({
    control: {
        padding: theme.spacing(2),
    },
}));




// custom component for the main page 
export default function MainPage(props) {
    const [project_list, setProjectList] = useState([]);
    const userid = useContext(UserContext).userid;
    // style component for the component 
    const classes = useStyles();
    // fetch the data for the issues 
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'issues/user/' + userid)
            .then(res => res.json())
            .then(result => {
                    setProjectList(result)
            });
    }, [userid])

    // return the project list
    // TODO: need to add the button for creating the project page
    return (
        <div>
            <Grid container alignItems="stretch" spacing={2} direction="column" >
                <Grid item xs={12}>
                        <Paper className={classes.control}>
                            <h1 className="HeaderFontFamily">Your Projects</h1>
                            <ListGroup>
                                {project_list.map((item, index) => (
                                    <CustomListComponent key={index} item={item} />
                                ))}
                            </ListGroup>
                        </Paper>
                </Grid>
            </Grid>
        </div>
    );
}