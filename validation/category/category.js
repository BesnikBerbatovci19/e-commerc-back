const Validator = require('validator');
const isEmpty = require('../isEmpty');


function validationCategoryInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if(!Validator.isLength(data.name, {min: 2, max: 80})){
        errors.name = "Name field must be betwen 2 and 80 character";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.description)) {
        errors.address = "Description field is require";
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}


function validationSubCategoryInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    data.category_id = !isEmpty(data.category_id) ? data.category_id : '';

    if(!Validator.isLength(data.name, {min: 2, max: 80})){
        errors.name = "Name field must be betwen 2 and 80 character";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.description)) {
        errors.address = "Description field is require";
    }

  
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = {
    validationCategoryInput,
    validationSubCategoryInput
}