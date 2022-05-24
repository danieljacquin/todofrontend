import {  Route, Routes } from 'react-router-dom';
import Nav from '../components/ui/Nav';
import Users from '../pages/users/Users';
import Roles from '../pages/roles/Roles';
import UserRoles from '../pages/user-roles/UserRoles';
import Categories from '../pages/categories/Categories';
import TodoCategories from '../pages/todo-categories/TodoCategories';
import Workspaces from '../pages/workspaces/Workspaces';
import Tasks from '../pages/tasks/Tasks';
import Register from '../pages/register/Register';

const DashBoardRoutes = () => {

    return (
        <>
           <Nav/>
           <div className='container'>
               <Routes>
               <Route path="/users" element={<Users/>}></Route>
                    <Route path="/Roles" element={<Roles/>}></Route>
                    <Route path="/userRoles" element={<UserRoles/>}></Route>
                    <Route path="/categories" element={<Categories/>}></Route>
                    <Route path="/todoCategories" element={<TodoCategories/>}></Route>
                    <Route path="/workspaces" element={<Workspaces/>}></Route>
                    <Route path="/tasks" element={<Tasks/>}></Route>
               </Routes>
            </div>    
        </>
    )
}

export default DashBoardRoutes;