import { NavLink } from "react-router-dom"
import Logo from "./Logo"
import styles from "./PageNav.module.css";

function PageNav() {
    return (
        <div className={styles.nav}>
        <Logo />
        <ul>
            <li>
                <NavLink to="/pricing">pricing</NavLink>
            </li>
            <li>
                <NavLink to="/product">product</NavLink>
            </li>
            <li>
                <NavLink to="/login" id="ddf">Login</NavLink>
            </li>
        </ul>
        </div>
    )
}

export default PageNav
