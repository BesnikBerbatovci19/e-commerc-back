const Validator = require('validator');
const isEmpty = require('../isEmpty');

function validationAddProductInput(data) {
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : '';
    data.category_id = !isEmpty(data.category_id) ? data.category_id : '';
    data.category_name = !isEmpty(data.category_name) ? data.category_name : '';
    data.subcategory_id = !isEmpty(data.subcategory_id) ? data.subcategory_id : '';
    data.subcategory_slug = !isEmpty(data.subcategory_slug) ? data.subcategory_slug : '';
    data.manufacter_id = !isEmpty(data.manufacter_id) ? data.manufacter_id : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    data.price = !isEmpty(data.price) ? data.price : '';
    data.instock = !isEmpty(data.instock)  ? data.instock : '';
    data.barcode = !isEmpty(data.barcode) ? data.barcode : '';
    data.SKU = !isEmpty(data.SKU) ? data.SKU : '';
    data.status = !isEmpty(data.status) ? data.status : '';

    if(!Validator.isLength(data.name, {min: 2, max: 255})){
        errors.name = "Fusha të pakten duhet të ketë 2 karaktere dhe maksimumi 255 karaktere";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Fusha duhët të plotësohet';
    }

    if(Validator.isEmpty(data.category_id)){
        errors.subcategory = 'Fusha duhët të plotësohet ';
    }

    
    if(Validator.isEmpty(data.subcategory_id)){
        errors.subcategory = 'Fusha duhët të plotësohet ';
    }

    if(!Validator.isLength(data.description, {min: 2})){
        errors.description ="Fusha duhët të ketë të paktën 2 karaktere";
    }

    if(Validator.isEmpty(data.description)){
        errors.description = 'Fusha duhët të plotësohet';
    }

    if(Validator.isEmpty(data.manufacter_id)) {
        errors.manufacter = "Fusha duhët të plotësohet";
    }

    if(Validator.isEmpty(data.barcode)) {
        errors.barcode =  "Fusha duhët të plotësohet";
    }

    if(Validator.isEmpty(data.SKU)) {
        errors.SKU = "Fusha duhët të plotësohet";
    }

    if(Validator.isEmpty(data.price)) {
        errors.price = "Fusha duhët të plotësohet";
    }

    if(Validator.isEmpty(data.instock)) {
        errors.instock =  "Fusha duhët të plotësohet";
    }

    if(Validator.isEmpty(data.status)) {
        data.status = "Fusha duhët të plotësohet";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = {
    validationAddProductInput
}