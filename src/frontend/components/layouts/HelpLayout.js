import { NavLink, Outlet } from "react-router-dom";

export default function HelpLayout() {
  return (
    <div className="nav-layout">
        <h2>Website Help</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea, rerum.</p>

        <nav>
            <NavLink to='faq'>View the FAQ</NavLink>
            <NavLink to='contact'>Contact Us</NavLink>
        </nav>
        <Outlet />
    </div>
  )
}
