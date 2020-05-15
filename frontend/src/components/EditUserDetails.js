import React, { useContext, useEffect, useRef, useState } from "react";
import { withRouter, useHistory } from "react-router";
// import UserContext from "./UserContext";
import constants from '../constants';
import AlertContext from './AlertContext';
import UserContext from "./UserContext";
import { emailValidate, isNullOrUndefined } from './UtilityFunc';


const EditUser = (props) => {
    const [emailAddress, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const history = useHistory();
    // need to fetch the user details first 
    const userid = useContext(UserContext).userid;
    useEffect(() => {
        fetch(constants.LOCALHOST_URL + 'users/' + userid)
        .then(res => res.json())
        .then(result => {
            setEmail(result[0].email_address);
            setUserName(result[0].username);
            setDisplayName(result[0].displayname);
        }) 
    }, [userid]);
    // const setUserId = useContext(UserContext).setUserId;
    const displayMessage = useContext(AlertContext).showMessage;
    const buttonClickEvent = async () =>  {
        // get all the current values 
        let currentEmailAddress       = emailAddress;
        let currentUserName           = userName;
        let currentDisplayName        = displayName;
        if(isNullOrUndefined(currentEmailAddress)){
            displayMessage('email address cannot be empty!');
            return;
        }
        if(!emailValidate(currentEmailAddress)){
            displayMessage('email address is not valid!');
            return;
        }
        if(isNullOrUndefined(currentUserName)){
            displayMessage('user name cannot be empty!');
            return;
        }
        if(isNullOrUndefined(currentDisplayName)){
            displayMessage('display name cannot be empty!');
            return;
        }
        let put_body_req = {
            'email_address': currentEmailAddress,
            'username'     : currentUserName,
            'displayname'  : currentDisplayName,
        }
        const putRequestOptions = {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(put_body_req)
        }
        fetch(constants.LOCALHOST_URL + 'users/edit/' + userid, putRequestOptions)
        .then(res => res.json())
        .then(result => {
            if('error' in result){
                displayMessage('User with this email already exists');
            }
            else {
                displayMessage('User updated successfully!', 'info')
                history.push('/dashboard');
            }
        })
    }

    return ( userid && 
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Edit User Details</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder={emailAddress} value={emailAddress} onChange={(ev) => {setEmail(ev.target.value)}}/>
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder={userName} value={userName} onChange={(ev) => {setUserName(ev.target.value)}}/>
                    </div>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input type="text" className="form-control" placeholder={displayName} value={displayName} onChange={(ev) => {setDisplayName(ev.target.value)}}/>
                    </div>
                    <button type="button" className="btn btn-primary btn-block" onClick={() => buttonClickEvent()}>Save Details</button>
                </form>
            </div>
        </div>
    );
}

export default withRouter(EditUser);