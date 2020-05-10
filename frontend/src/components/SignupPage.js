import React, { useRef, useContext } from "react";
import AlertContext from './AlertContext';
import { isNullOrUndefined, hashPassword, emailValidate } from './UtilityFunc'; 
import UserContext from "./UserContext";
import constants from '../constants';
import { useHistory } from "react-router";


const SignUp = (props) => {
    const emailAddress = useRef('');
    const userName = useRef('');
    const displayName = useRef('');
    const password = useRef('');
    const history = useHistory();
    const setUserId = useContext(UserContext).setUserId;
    const displayMessage = useContext(AlertContext).showMessage;
    const buttonClickEvent = async () =>  {
        // get all the current values 
        let currentEmailAddress = emailAddress.current.value;
        let currentUserName           = userName.current.value;
        let currentDisplayName        = displayName.current.value;
        let currentPassword           = password.current.value;
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
        if(isNullOrUndefined(currentPassword)){
            displayMessage('password cannot be empty!');
            return;
        }
        // encrypt password 
        hashPassword(currentPassword, (encryptedVal) => {
            console.log(encryptedVal);
            console.log(currentUserName);
            console.log(currentEmailAddress);
            console.log(currentDisplayName);
            let post_body_req = {
                'email_address': currentEmailAddress,
                'username'     : currentUserName,
                'displayname'  : currentDisplayName,
                'password'     : encryptedVal
            }
            const postRequestOptions = {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(post_body_req)
            }
            fetch(constants.LOCALHOST_URL + 'users', postRequestOptions)
            .then(res => res.json())
            .then(result => {
                if('message' in result){
                    displayMessage('User already exists');
                }
                else {
                    setUserId(result.userid);
                    displayMessage('User signed up successfully!', 'info')
                    history.push('/login');
                }
            })
        })
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign Up</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" ref={emailAddress} />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Choose username" ref={userName}/>
                    </div>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input type="text" className="form-control" placeholder="Choose display name" ref={displayName}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Choose password" ref={password}/>
                    </div>

                    <button type="button" className="btn btn-primary btn-block" onClick={() => buttonClickEvent()}>Sign Up</button>
                    <p className="forgot-password text-right">
                        Already registered <a href="/login">sign in?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;