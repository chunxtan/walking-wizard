import React, { useState } from 'react';
import './SignUpForm.css';
import { hashData } from "../../../util/security";
import { signUp } from "../../../service/users";

export type SignUpFormInput = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword?: string
}

type SignUpFormSubmit = SignUpFormInput & {
    salt?: string,
    iterations?: number
}

export const SignUpForm = (): React.JSX.Element => {

    const [signUpInput, setSignUpInput] = useState<SignUpFormInput>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [signupSucc, setSignupSucc] = useState<boolean>(false);

    const handleInputChange = (evt: React.FormEvent<HTMLInputElement>): void => {
        setSignUpInput({
            ...signUpInput,
            [evt.currentTarget.name]: evt.currentTarget.value
        });
    }

    function hashPassword() {
        var currForm: SignUpFormSubmit = signUpInput;
        if (currForm.password) {
            console.log(currForm.password)
            var hash = hashData(currForm.password);
            currForm.password = hash.hash;
            currForm.salt = hash.salt;
            currForm.iterations = hash.iterations;
        }  
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {

        try {
            evt.preventDefault();

            hashPassword();
            const signUpData = {...signUpInput};
            delete signUpData.confirmPassword;
            console.log("signUpData ", signUpData);
            const user = await signUp(signUpData);
            console.log("user: ", user);

            setSignUpInput({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            })
            setSignupSucc(true);

        } catch(err) {
            console.error(err);
        }
    }

    return (
            <div className="card card-side bg-base-100 shadow-xl">
                <form onSubmit={handleSubmit} className="userForm">

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="lavel-text font-bold">First Name</span>
                        </div>
                        <input 
                            type="text"
                            name="firstName"
                            value={signUpInput.firstName}
                            onChange={handleInputChange}
                            placeholder="Type here" 
                            className="input input-bordered input-sm w-full max-w-xs" />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="lavel-text font-bold">Last Name</span>
                        </div>
                        <input 
                        type="text" 
                        name="lastName"
                        value={signUpInput.lastName}
                        onChange={handleInputChange}
                        placeholder="Type here" 
                        className="input input-bordered input-sm w-full max-w-xs" />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="lavel-text font-bold">Email</span>
                        </div>
                        <input 
                            type="text" 
                            name="email"
                            value={signUpInput.email}
                            onChange={handleInputChange}
                            placeholder="Type here" 
                            className="input input-bordered input-sm w-full max-w-xs" />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="lavel-text font-bold">Password</span>
                        </div>
                        <input 
                            type="password" 
                            name="password"
                            value={signUpInput.password}
                            onChange={handleInputChange}
                            placeholder="Type here" 
                            className="input input-bordered input-sm w-full max-w-xs" />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="lavel-text font-bold">Confirm Password</span>
                        </div>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={signUpInput.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Type here" 
                            className="input input-bordered input-sm w-full max-w-xs" />
                    </label>

                    {
                        signupSucc
                        ? <p className='text-success'>Sign Up Success!</p>
                        : null
                    }

                    <button className="btn btn-submit">Sign Up</button>
                </form>
            </div>
    )
}