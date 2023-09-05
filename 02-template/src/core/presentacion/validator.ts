import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { IError } from "../utils/ierror.interface";

export class Validator {

    static execute(validators: Record<string, any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            for (const key in Validator) {
                const validatorDto = validators[key];
                switch (key) {
                    case "body":
                        Object.assign(validatorDto, req.body);
                        break;
                    case "params":
                        Object.assign(validatorDto, req.body);
                        break;
                    case "query":
                        Object.assign(validatorDto, req.body);
                        break;
                    case "headers":
                        Object.assign(validatorDto, req.body);
                        break;
                    default:
                        break;
                }

                const errors = await validate(validatorDto);
                if(errors.length > 0 ){
                    const listErrors : string[] = [];
                    for(const error of errors){
                        for(const constrain in error.constraints){
                            listErrors.push(error.constraints[constrain])
                        }
                    }
                    const err: IError = new Error()
                    err.name = "ValidationError";
                    err.message = listErrors.join(", ");
                    err.status = 411;
                    
                    return next(err);
                
                }
            }
             return next();
        }
    }
}