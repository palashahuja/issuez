import React, { useContext, createRef } from "react";
import { emailValidate, hashPassword, isNullOrUndefined} from './UtilityFunc';
import AlertContextProvider from "./AlertContext";


const Login = () => {
    const emailAddress = createRef('');
    const password = createRef(''); 
    const displayMessage = useContext(AlertContextProvider).showMessage;

    const buttonPressEvent = async () => {
        let currentEmail = emailAddress.current.value; 
        let currentPassword = password.current.value; 
        if(isNullOrUndefined(currentEmail)){
            displayMessage('Email address is empty!');
            return;
        }
        if(!emailValidate(currentEmail)){
            displayMessage('Email address is invalid!');
            return;
        }
        if(isNullOrUndefined(currentPassword)){
            displayMessage('Password is empty!');
            return;
        }

        hashPassword(password, (encryptedVal) => {
            console.log(encryptedVal);
        })
        
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign In</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" ref={emailAddress}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" ref={password}/>
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