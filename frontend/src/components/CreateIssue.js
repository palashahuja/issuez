import React, { useState, useEffect, useContext } from 'react'
import constants from '../constants';
import { ListGroup } from 'reactstrap';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import '../App.css';
import UserContext from './UserContext';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';




const CreateIssuePage = (props) => {

    return (<Form>
        <FormGroup>
            <Label for="Title"></Label>
            <Input type="text" name="title" id="inputTitle" placeholder="with a placeholder"></Input>
        </FormGroup>
    </Form>)

}