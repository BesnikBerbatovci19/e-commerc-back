const Validator = require('validator');
const isEmpty = require('../isEmpty');

function validationOrderInput(data) {
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : "";
    data.surname = !isEmpty(data.surname) ? data.surname : "";
    data.emailUser = !isEmpty(data.emailUser) ? data.emailUser : "";
    data.phone = !isEmpty(data.phone) ? data.phone : "";
    data.address = !isEmpty(data.address) ? data.address : "";
    data.city = !isEmpty(data.city) ? data.city : "";
    data.company = !isEmpty(data.company) ? data.company : "";
    data.companyNumber = !isEmpty(data.companyNumber) ? data.companyNumber : "";

    if (!Validator.isLength(data.name, { min: 2, max: 255 })) {
        errors.name = "Fusha të pakten duhet të ketë 2 karaktere dhe maksimumi 255 karaktere";
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Fusha duhët të plotësohet';
    }


    if (!Validator.isLength(data.surname, { min: 2, max: 255 })) {
        errors.surname = "Fusha të pakten duhet të ketë 2 karaktere dhe maksimumi 255 karaktere";
    }

    if (Validator.isEmpty(data.surname)) {
        errors.name = 'Fusha duhët të plotësohet';
    }

    if (!Validator.isEmail(data.emailUser)) {
        errors.email = 'Emaili nuk është valid';
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone = 'Fusha duhët të plotësohet';
    }

    if(Validator.isEmpty(data.city)){
        errors.city = 'Fusha duhët të plotësohet';
    }
    
    if(Validator.isEmpty(data.address)){
        errors.address = 'Fusha duhët të plotësohet';
    }
    if(data.type === "bussnies") {
        if(Validator.isEmpty(data.company)){
            errors.company = 'Fusha duhët të plotësohet';
        }
        if(Validator.isEmpty(data.companyNumber)){
            errors.companyNumber = 'Fusha duhët të plotësohet';
        }
    }
  
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = {
    validationOrderInput
}