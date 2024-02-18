import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { useState } from "react";
import { LoginUserStore } from "./LoginUserStore"; 

type LoginSignUpProps = {
    userStore: LoginUserStore
}

export const LoginSignUp = ({ userStore }: LoginSignUpProps): React.JSX.Element => {
    const [activeTab, setActiveTab] = useState("login");

    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
    }

    return (
        <>
        <div role="tablist" className="tabs tabs-bordered">
            <input type="radio" onChange={() => handleTabChange("login")} checked={activeTab === "login"} name="my_tabs_1" role="tab" className="tab" aria-label="Login" />
            <div role="tabpanel" className="tab-content p-10">
                <LoginForm userStore={userStore} />
            </div>

            <input type="radio" onChange={() => handleTabChange("signup")} checked={activeTab === "signup"} name="my_tabs_1" role="tab" className="tab" aria-label="Sign Up"  />
            <div role="tabpanel" className="tab-content p-10">
                <SignUpForm />
            </div>

        </div>
        </>
    )
}