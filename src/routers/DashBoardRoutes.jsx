import { Route, Routes,Navigate } from 'react-router-dom';
import Menu from '../components/ui/Menu';
import Users from '../pages/users/Users';
import Roles from '../pages/roles/Roles';
import UserRoles from '../pages/user-roles/UserRoles';
import Categories from '../pages/categories/Categories';
import TodoCategories from '../pages/todo-categories/TodoCategories';
import Workspaces from '../pages/workspaces/Workspaces';
import Tasks from '../pages/tasks/Tasks';
import { Container } from 'react-bootstrap';

const DashBoardRoutes = () => {

    return (
        <>
            <Menu />
            <Container>
                <Routes>
                    <Route path="/users" element={<Users />}></Route>
                    <Route path="/Roles" element={<Roles />}></Route>
                    <Route path="/userRoles" element={<UserRoles />}></Route>
                    <Route path="/categories" element={<Categories />}></Route>
                    <Route path="/todoCategories" element={<TodoCategories />}></Route>
                    <Route path="/workspaces" element={<Workspaces />}></Route>
                    <Route path="/tasks" element={<Tasks />}></Route>
                    <Route
                        path="*"
                        element={<Navigate to="/users" replace />}
                    />
                </Routes>
            </Container>
        </>
    )
}

export default DashBoardRoutes;