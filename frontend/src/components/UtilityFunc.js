import bcrypt, { hash } from 'bcryptjs';
export const isNullOrUndefined = (str) => {
    return (!str || /^\s*$/.test(str));
};

const SALT_WORK_FACTOR = 10;


export const hashPassword = (currentPassword, callback) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) throw err;
        // hash the password 
        bcrypt.hash(currentPassword, salt, (err, hash) => {
            if(err) throw err;
            // override the clear text password with the hash 
            // eslint-disable-next-line
            callback(hash);
            // eslint-disable-next-line
        })
    });
};

export const emailValidate = (email) => {
    /*eslint-disable*/
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
