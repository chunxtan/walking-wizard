
export const NavBar = (): React.JSX.Element => {

    return (
        <div className="navbar bg-base-100">
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
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">walking wizard</a>
            </div>
        </div>
    )
}