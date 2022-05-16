import { Link } from 'react-router-dom';
import './nav.css';
import { RiLogoutCircleRLine } from "react-icons/ri";

const Nav = () => {
    return (
        <header className="header">
           <nav className='header__nav'>
               <span className='header__log'>TASKMANAGER</span>
                <ul className='header__list'>
                    <li className="header__list-item"><Link className="header__link" to="/users">Users</Link></li> 
                    <li className="header__list-item"><Link className="header__link" to="/roles">Roles</Link></li> 
                    <li className="header__list-item"><Link className="header__link" to="/userRoles">UserRoles</Link></li> 
                    <li className="header__list-item"><Link className="header__link" to="/categories">Categories</Link></li> 
                    <li className="header__list-item"><Link className="header__link" to="/workspaces">Workspaces</Link></li> 
                    <li className="header__list-item"><Link className="header__link" to="/todoCategories">TodoCategories</Link></li> 
                    <li className="header__list-item"><Link className="header__link" to="/tasks">Tasks</Link></li> 
                    <li className="header__list-item"><RiLogoutCircleRLine/></li>
                </ul>
           </nav>
        </header>
    )
}

export default Nav;