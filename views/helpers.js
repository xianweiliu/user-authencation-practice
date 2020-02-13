module.exports = {
    getErrors(errors, prop) {
        // prop = 'email' / 'password'/ 'passwordConfirmation'
        try {
            //errors.mapped() contains email, password, and passwordConfirmation
            return errors.mapped()[prop].msg;
        } catch (errors) {
            return "";
        }
    },
};
