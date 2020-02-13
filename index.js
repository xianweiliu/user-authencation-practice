const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repo/users");
const app = express();

// automatically use the bodyParser for us when everytime there's a post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ["fdslkjfklewijfeibc"],
    }),
);
/*
    req = request
    res = response
*/

app.get("/signup", (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input type="text" name="email" placeholder="email">
                <input type="password" name="password" placeholder="password">
                <input type="password" name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

// bodyParser function is a helper function that helps to process the data and worked here as a middleware
// whenever having a post request, it would run the bodyParser
app.post("/signup", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send("Email in use");
    }
    if (password !== passwordConfirmation) {
        return res.send("Password must match");
    }

    // create a user in our users repo to represent this person
    const user = await usersRepo.create({ email: email, password: password });

    // store the id of that user inside the users cookie
    // req.session -> added by the cookie session that was imported
    // req.session.{this is what you decide to put}
    req.session.userId = user.id;
    res.send("Account Created!");
});

// signout

app.get("/signout", (req, res) => {
    req.session = null;
    res.send("You are logged Out");
});

app.get("/signin", (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input type="text" name="email" placeholder="email">
                <input type="password" name="password" placeholder="password">
                <button>Sign In</button>
            </form>
        </div>
    `);
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send("Email not found");
    }

    const validPass = await usersRepo.comparePasswords(user.password, password);

    if (!validPass) {
        return res.send("Invalid password");
    }

    req.session.userId = user.id;
    res.send("You are signed in!");
});

// listening to the request
app.listen(3000, () => {
    console.log("listening....");
});
