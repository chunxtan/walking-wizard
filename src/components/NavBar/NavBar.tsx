
import { Link } from "react-router-dom";
import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore"; 
import { logoutUser } from "../../service/users"; 
import { observer } from "mobx-react";
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import './NavBar.css'
import '@fontsource-variable/azeret-mono';
import '@fontsource/monofett';

type NavBarProps = {
    userStore: LoginUserStore
}

export const NavBar = observer(({ userStore }: NavBarProps): React.JSX.Element => {

    return (
        <Navbar fluid rounded className="bg-transparent">
            {/* NavBar Start */}
            <Navbar className="bg-transparent">
                <Link to="/" className="btn btn-ghost text-2xl font-medium dark:text-white"><span id="app-title" className="text-dark bg-clip-text bg-transparent to-emerald-600 from-sky-400">walking wizard</span></Link>
            </Navbar>

            {/* NavBar Center */}
            <Navbar.Collapse >
                <Navbar className="bg-transparent navbarLink">
                    <Link to="/datasets">datasets</Link>
                </Navbar>
                <Navbar className="bg-transparent navbarLink">
                    <a href="#">scenarios</a>
                </Navbar>
            </Navbar.Collapse>

            {/* NavBar End */}
            {
                userStore.user
                ?
                <div className="flex md:order-2">
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt="User settings" img="https://st4.depositphotos.com/9421792/31313/v/1600/depositphotos_313135282-stock-illustration-smiley-face-happy-smiley-emoji.jpg" rounded />
                        }
                        >
                        <Dropdown.Header>
                            <span className="block text-xs">{userStore.user.firstName}</span>
                            <span className="block truncate text-xs font-medium">{userStore.user.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                            onClick={async () => {
                            await logoutUser();
                            window.location.reload();
                            }}>
                                Sign out
                        </Dropdown.Item>
                    </Dropdown>
                </div>
                : 
                <div className="flex md:order-2">
                    <Button><Link to="/login-signup">Login | Sign up</Link></Button>
                </div>
            }

        </Navbar>
    )
});