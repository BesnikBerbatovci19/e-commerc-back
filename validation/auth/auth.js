const Validator = require('validator');
const isEmpty = require('../isEmpty');

function validationLoginInput(data) {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isLength(data.email, { min: 2, max: 40 })) {
        errors.email = "Email field must be between 2 and 40 character";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required!";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


function validationRegisterInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name : '';
    data.surname = !isEmpty(data.surname) ? data.surname : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.address = !isEmpty(data.address) ? data.address : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    
    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = "Name field must be betwen 2 and 30 character";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name field is required';
    }
    
    if(!Validator.isLength(data.surname, {min: 3, max: 30})){
        errors.surname = "Surname field must be betwen 3 and 30 character";
    }

    if(Validator.isEmpty(data.surname)){
        errors.surname = 'Surname field is required';
    }

    if(!Validator.isLength(data.phone, {min: 6, max: 12})){
        errors.phone = "Phone field must be betwen 6 and 12 character";
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone = 'Phone field is required';
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }
    
    if(!Validator.isLength(data.password, { min: 6, max: 30})){
        errors.password = 'Password field must be at list 6 character';
    }

    if(Validator.isEmpty(data.address)) {
        errors.address = "Address field is require";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


module.exports = {
    validationLoginInput,
    validationRegisterInput
}