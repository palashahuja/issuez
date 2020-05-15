import React, { createRef, useContext } from "react";
import { useHistory } from "react-router";
import constants from '../constants';
import AlertContextProvider from "./AlertContext";
import UserContext from "./UserContext";
import { emailValidate, isNullOrUndefined } from './UtilityFunc';


const Login = () => {
    const emailAddress = createRef('');
    const password = createRef('');
    const setUserId = useContext(UserContext).setUserId;
    const displayMessage = useContext(AlertContextProvider).showMessage;
    const history = useHistory();
    const buttonPressEvent = async () => {
        let currentEmail = emailAddress.current.value;
        let currentPassword = password.current.value;
        if (isNullOrUndefined(currentEmail)) {
            displayMessage('Email address is empty!');
            return;
        }
        if (!emailValidate(currentEmail)) {
            displayMessage('Email address is invalid!');
            return;
        }
        if (isNullOrUndefined(currentPassword)) {
            displayMessage('Password is empty!');
            return;
        }

        let post_body_req =
        {
            'email_address': currentEmail,
            'password':currentPassword 
        }
        const postRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post_body_req)
        }
        fetch(constants.LOCALHOST_URL + 'users/verify', postRequestOptions)
            .then(res => res.json())
            .then(result => {
                if (('error' in result) || result.message.length <= 0 ){
                    displayMessage('Incorrect username or password');
                }
                else {
                    setUserId(result.message[0].user_id);
                    displayMessage('User signed in successfully!', 'info');
                    history.push('/dashboard');
                }
        });
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign In</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" ref={emailAddress} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" ref={password} />
                    </div>

                    <button type="button" className="btn btn-primary btn-block" onClick={() => buttonPressEvent()}>Submit</button>
                    <p className="forgot-password text-right">
                        <a href="/signup">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;