
import { Link } from "react-router-dom";

export const NavBar = (): React.JSX.Element => {

    return (
        <div className="navbar bg-base-100">
            {/* NavBar Start */}
            <div className="navbar-start">
                <ul className="menu menu-horizontal px-1">
                <li><a>datasets</a></li>
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
                <Link to="/" className="btn btn-ghost text-xl">walking wizard</Link>
            </div>


            {/* NavBar End */}
            <div className="navbar-end">
                <ul className="menu menu-horizontal px-1">
                <li>
                    <details>
                    <summary>
                        profile
                    </summary>
                    <ul className="p-2 bg-base-100 rounded-t-none">
                        <li><Link to="/signup">signup</Link></li>
                        <li><a>login</a></li>
                    </ul>
                    </details>
                </li>
                </ul>
            </div>
        </div>
    )
}