const express = require("express");
const { validationResult } = require("express-validator");
const usersRepo = require("../../repo/users");
const signupTemplate = require("../../views/signup");
const signinTemplate = require("../../views/signin");

//created validators for email password when sign in or sign up
const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireValidEmail,
    requireValidPasswordForUser,
} = require("./validators");
// this help to link to the index.js file
const router = express.Router();

/*
    req = request
    res = response
*/

router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});

// passed the validators for the email, pass, passconfirmation
router.post(
    "/signup",
    [requireEmail, requirePassword, requirePasswordConfirmation],
    async (req, res) => {
        // for communicating with the express checker and associated with req
        const errors = validationResult(req);
        // check see if there's an errors
        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }
        const { email, password } = req.body;
        // create a user in our users repo to represent this person
        const user = await usersRepo.create({
            email,
            password,
        });

        // store the id of that user inside the users cookie
        // req.session -> added by the cookie session that was imported
        // req.session.{this is what you decide to put}
        req.session.userId = user.id;
        res.send("Account Created!");
    },
);

// signout

router.get("/signout", (req, res) => {
    req.session = null;
    res.send("You are logged Out");
});

router.get("/signin", (req, res) => {
    // render the template for the signin page
    res.send(signinTemplate({}));
});

// passed validators when signin check if there's any mis-match info
router.post(
    "/signin",
    [requireValidEmail, requireValidPasswordForUser],
    async (req, res) => {
        const errors = validationResult(req);
        // check and see if there's any errors
        if (!errors.isEmpty()) {
            return res.send(signinTemplate({ errors }));
        }

        const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });
        req.session.userId = user.id;
        res.send("You are signed in!");
    },
);

module.exports = router;
