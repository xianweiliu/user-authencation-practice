const { check } = require("express-validator");
const usersRepo = require("../../repo/users");

// the check is using express-validator
module.exports = {
    // email validator
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must be a valid email")
        .custom(async email => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error("Email in use");
            }
        }),
    // password validator
    requirePassword: check("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters"),
    // passwordConfirmation validator
    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters")
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error("Passwords must match");
            }
            return true;
        }),

    // email valicator for sign-in
    requireValidEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must provide a valid email")
        .custom(async email => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error("Email not found!");
            }
        }),
    // password valicator for sign-in
    requireValidPasswordForUser: check("password")
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) {
                throw new Error("Invalid password");
            }

            const validPassword = await usersRepo.comparePasswords(
                user.password,
                password,
            );
            if (!validPassword) {
                throw new Error("Invalid password");
            }
        }),
};
