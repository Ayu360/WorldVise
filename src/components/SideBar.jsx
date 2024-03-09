import { Outlet } from "react-router-dom";
import styles from "./Sidebar.module.css"
import Logo from "./Logo";
import AppNav from "./AppNav"
function SideBar() {
    return (
        <div className={styles.sidebar}>
            <Logo/>
            <AppNav />
            
            <Outlet />

            <footer className={styles.footer}>
                &copy; Copyright date {new Date().getFullYear()} by WorldWise Inc.
            </footer>
        </div>
    )
}

export default SideBar
