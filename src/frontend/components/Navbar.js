import { NavLink } from 'react-router-dom';
// import Breadcrums from './Breadcrums';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Chain Art-Certificate</h1>
            <div className="links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="createcertificate">Create Certificate</NavLink>
                <NavLink to="help">Help</NavLink>
            </div>
            {/* <Breadcrums /> */}
        </nav>
    );
} 

export default Navbar;