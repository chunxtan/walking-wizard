
import { Link } from "react-router-dom";
import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore"; 
import { logoutUser } from "../../service/users"; 
import { observer } from "mobx-react";

type NavBarProps = {
    userStore: LoginUserStore
}

export const NavBar = observer(({ userStore }: NavBarProps): React.JSX.Element => {

    return (
        <div className="navbar bg-base-100">
            {/* NavBar Start */}
            <div className="navbar-start">
                <ul className="menu menu-horizontal px-1">
                <li><Link to="/datasets">datasets</Link></li>
                <li>
                    <details>
                    <summary>
                        scenarios
                    </summary>
                    <ul className="p-2 bg-base-100 rounded-t-none">
                        <li><a>Link 1</a></li>
                        <li><a>Link 2</a></li>
                    </ul>
                    </details>
                </li>
                </ul>
            </div>


            {/* NavBar Center */}
            <div className="navbar-center">
                <Link to="/" className="btn btn-ghost text-xl">WALKING WIZARD</Link>
            </div>


            {/* NavBar End */}
            <div className="navbar-end">
                <ul className="menu menu-horizontal px-1">
                <li>
                    <details>
                    <summary>
                        {
                            userStore.user
                            ? <h1>hello, {userStore.user.firstName}</h1>
                            : <h1>profile</h1>
                        }
                    </summary>
                    {
                        userStore.user
                        ? 
                        <ul className="p-2 bg-base-100 rounded-t-none">
                            <li>
                                <a 
                                onClick={async () => {
                                await logoutUser();
                                window.location.reload();
                                }}>
                                    logout
                                </a>
                            </li>
                        </ul>
                        :
                        <ul className="p-2 bg-base-100 rounded-t-none">
                            <li><Link to="/login-signup">login | signup</Link></li>
                        </ul>
                    }
                    </details>
                </li>
                </ul>
            </div>
        </div>
    )
});