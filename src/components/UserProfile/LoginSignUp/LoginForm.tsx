import { useState } from "react";
import { getLoginDetails, loginUser } from "../../../service/users";
import { hashDataWithSaltRounds, storeToken } from "../../../util/security";
import { useNavigate } from "react-router";
import { LoginUserStore } from "./LoginUserStore";

export type LoginDetails = {
    email: string,
    password: string
}

type LoginFormProps = {
    userStore: LoginUserStore
}

export const LoginForm = ({ userStore }: LoginFormProps): React.JSX.Element => {
    const navigate = useNavigate();

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
        setLoginInput({
            ...loginInput,
            [evt.currentTarget.name]: evt.currentTarget.value
        });
    }

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        try {
            evt.preventDefault();

            const loginData = {...loginInput};
            console.log("loginForm data: ", loginData);

            // get user salt and iterations from DB
            const loginDetails = await getLoginDetails(loginData.email);
            console.log("loginDetails: ", loginDetails);

            // hash password
            const hashedPassword = hashDataWithSaltRounds(loginData.password, loginDetails.salt, loginDetails.iterations);
            loginData.password = hashedPassword;

            // get token
            const token = await loginUser(loginData);
            // store token in localStorage
            storeToken(token);
            userStore.setLogin(true);

            navigate("/");

        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <form onSubmit={handleSubmit} className="userForm">

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="lavel-text font-bold">Email</span>
                    </div>
                    <input 
                        type="text"
                        name="email"
                        value={loginInput.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email here" 
                        className="input input-bordered input-sm w-full max-w-xs" />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="lavel-text font-bold">Password</span>
                    </div>
                    <input 
                    type="password" 
                    name="password"
                    value={loginInput.password}
                    onChange={handleInputChange}
                    placeholder="Enter your email here" 
                    className="input input-bordered input-sm w-full max-w-xs" />
                </label>

                <button className="btn btn-submit">Login</button>
            </form>
        </div>
    )
}