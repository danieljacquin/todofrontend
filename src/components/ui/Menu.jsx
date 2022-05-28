import {  useNavigate } from 'react-router-dom';
import './menu.css';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'


const Menu = () => {

    const navigate = useNavigate();

    const { user, dispatch } = useContext(AuthContext)
    const { name } = user;

    const handleLogout = () => {
        dispatch({
            type: 'logout'
        });

        navigate('/login');
    }

    return (

        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand > <span className='header__log'>TASKMANAGER</span></Navbar.Brand>
                    <Nav className="me-auto">
                        <LinkContainer to="/users">
                            <Nav.Link >Users</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/roles">
                            <Nav.Link >Roles</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/userRoles">
                            <Nav.Link >UserRoles</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/categories">
                            <Nav.Link >Categories</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/workspaces">
                            <Nav.Link >Workspaces</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/todoCategories">
                            <Nav.Link >TodoCategories</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/tasks">
                            <Nav.Link >Tasks</Nav.Link>
                        </LinkContainer>

                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            {name}   <span onClick={handleLogout}><RiLogoutCircleRLine /></span>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


        </>

    )
}

export default Menu;