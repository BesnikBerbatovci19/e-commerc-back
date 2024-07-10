const Validator = require('validator');
const isEmpty = require('../isEmpty');

function validationLoginInput(data) {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isLength(data.email, { min: 2, max: 40 })) {
        errors.email = "Fusha e emailit duhet të jetë nga 2 deri në 40 karaktere";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Kërkohet fusha e emailit";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Kërkohet fusha e fjalëkalimit';
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
        errors.name = "Fusha të pakten duhë të ketë 2 karaktere dhe maksimumi 30";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Fusha duhët të plotësohet';
    }
    
    if(!Validator.isLength(data.surname, {min: 3, max: 30})){
        errors.surname = "Fusha të pakten duhë të ketë 3 karaktere dhe maksimumi 30";
    }

    if(Validator.isEmpty(data.surname)){
        errors.surname = 'Fusha duhët të plotësohet';
    }

    if(!Validator.isLength(data.phone, {min: 6, max: 12})){
        errors.phone = "Fusha të pakten duhë të ketë 6 karaktere dhe maksimumi 12";
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone = 'Fusha duhët të plotësohet';
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email-i nuk është valid';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'Fusha duhët të plotësohet';
    }
    
    if(!Validator.isLength(data.password, { min: 6, max: 30})){
        errors.password = 'Fusha të pakten duhë të ketë 6 karaktere ';
    }

    if(Validator.isEmpty(data.address)) {
        errors.address = "Fusha duhët të plotësohet";
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