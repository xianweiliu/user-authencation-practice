const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
// linked to the router that created under routes folder
const authRouter = require("./routes/admin/auth");

const app = express();

// automatically use the bodyParser for us when everytime there's a post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ["fdslkjfklewijfeibc"],
    }),
);
app.use(authRouter);

// listening to the request
app.listen(3000, () => {
    console.log("listening....");
});
