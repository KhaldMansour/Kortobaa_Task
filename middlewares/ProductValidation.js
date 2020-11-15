const Joi = require('joi');



let ProductValidation = (data) =>
{

    const  schema =  Joi.object({
        title: Joi.string()
            .required(),
    
        price: Joi.number()
            .required(),
    
        // image: Joi.object().keys({
        //     offset: joi.array().items(joi.number().min(-60).max(60)).min(1).max(2)
        // })
    
    });

    // return "hi";

    return schema.validate(data);

}

module.exports = ProductValidation;