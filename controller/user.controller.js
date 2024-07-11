const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../model/user.model');
const { validationRegisterInput, validationLoginInput } = require('../validation/auth/auth');

require('dotenv').config();



exports.getUser = async function (req, res) {
    try {
        UserModel.getAllUser()
            .then((users) => {
                res.json(users)
            })
            .catch((error) => {
                console.error("Error get user:", error)
                res.status(500).json({ message: "Error get user" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getUserById = async function(req, res) {
    const { id } = req.params
    try {
        UserModel.findUserById(id)
            .then((user) => {
                res.json(user)
            })
            .catch((error) => {
                console.error("Error get user:", error)
                res.status(500).json({ message: "Error get user" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getUserById = async function(req, res) {
    const { id } = req.user;
    try {
        UserModel.findUserById(id)
            .then((user) => {
                res.json(user)
            })
            .catch((error) => {
                console.error("Error get user:", error)
                res.status(500).json({ message: "Error get user" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}
exports.register = async function (req, res) {
    try {
        const { name, surname, email, phone, address, password, role } = req.body;

        const { errors, isValid } = validationRegisterInput(req.body);
        if (!isValid) {
            return res.status(404).json(errors);
        }

        UserModel.findByEmail(email)
            .then((results) => {
                const user = results[0];

                if (user) {
                    return res.status(404).json({ email: "Email-i egziston" })
                } else {
                    UserModel.createUser(name, surname, email, phone, address, password, role)
                        .then(() => {
                            res.json({
                                success: true,
                                message: "U regjistrua me sukses",
                            })
                        })
                        .catch((error) => {
                            console.error("Error registering user:", error)
                            res.status(500).json({ message: "Error registering user" })
                        })
                }
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        const { errors, isValid } = validationLoginInput(req.body);
        if (!isValid) {
            return res.status(404).json(errors);
        }

        UserModel.findByEmail(email)
            .then((results) => {
                const user = results[0];
                if (!user) {
                    return res.status(404).json({
                        message: "Email-i ose fjalkalimi janë gabimë!"
                    })
                }

                const passwordMatch = bcrypt.compareSync(password, user.password);

                if (!passwordMatch) {
                    return res.status(404).json({
                        message: "Email-i ose fjalkalimi janë gabimë!"
                    })
                }

                const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                }, process.env.SECRETORKEY)

                res.json({ token })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.delete = async function (req, res) {
    try {
        const { id } = req.params;

        UserModel.deleteUser(id)
            .then(() => {
                res.json({
                    success: true,
                    message: "User deleted successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error deleting user" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.update = async function (req, res) {
    try {
        const { id } = req.params;
        const { name, surname, email, phone, address, password, role } = req.body;
        UserModel.updateUser(name, surname, email, phone, address, password, role, id)
            .then(() => {
                res.json({
                    success: true,
                    message: "User update successfull",
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error update user" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna update Error" })
    }
}

exports.updateRoleUser = async function (req, res) {
    const { id } = req.user;
    const { name, surname, email, phone, address } = req.body;
    try {
        UserModel.updateRoleUser(name, surname, email, phone, address, id)
        .then(() => {
            res.json({
                success: true,
                message: "User update successfull",
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error update user" })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna update Error" })
    }
}