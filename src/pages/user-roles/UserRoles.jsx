import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";
import userRolesService from "../../services/user-roles.service";
import { Table, Button, Modal } from 'react-bootstrap';
import usersService from "../../services/users.service";
import rolesService from "../../services/roles.service";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './user-rol.css';


const url = process.env.REACT_APP_BACKEND_URL;
const UserRoles = () => {

    const [userRoles, setUserRoles] = useState([]);
    console.log(userRoles);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [show, setShow] = useState(false);
    const [userRolid, setUserRolId] = useState(0);
    const [createorupdate, setCreateorupdate] = useState('create');

    const schema = yup.object({
        userId: yup.string().required(),
        rolId: yup.string().required()
    })

    const refSucessfull = useRef();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = data => {
        handleCreateUserRoles(data);
    };

    const onsubmitUpdate = data => {
        console.log(data);
        handleUpdateUsuerRoles(data, userRolid);
    };

    const handleClose = () => {

        setShow(false);
        reset({ userId: '', rolId: '' });
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);


    const { user } = useContext(AuthContext);
    const token = user.token

    const getUserRolesOrginized = async () => {
        const dataUserRoles = await userRolesService.getUserRoles(url, token);
        if (dataUserRoles) {
            let userRole = dataUserRoles.map(userR => {
                return {
                    id: userR.id,
                    rolName: userR.role.name,
                    userName: userR.user.name,
                    rolId: userR.role.id,
                    userId: userR.user.id
                }
            });
            setUserRoles(userRole);
        }
    }


    useEffect(() => {

        const getUserRoles = async() => {
            const dataUserRoles = await userRolesService.getUserRoles(url, token);
            if (dataUserRoles) {
                let userRole = dataUserRoles.map(userR => {
                    return {
                        id: userR.id,
                        rolName: userR.role.name,
                        userName: userR.user.name,
                        rolId: userR.role.id,
                        userId: userR.user.id
                    }
                });
                setUserRoles(userRole);
            }
        }
        getUserRoles();

    
        const getUsers = async () => {
            const dataUsers = await usersService.getUsers(url, token);
            setUsers(dataUsers);
        }
        getUsers();

        const getRoles = async () => {
            const dataRoles = await rolesService.getRoles(url, token);
            setRoles(dataRoles);
        }
        getRoles();

    }, [token])

    const handleCreateUserRoles = async (data) => {

        const response = await userRolesService.createUserRoles(url, data, token);
        if (response) {
            getUserRolesOrginized();
            refSucessfull.current.classList.toggle('show__message-success');
            setTimeout(() => {
                reset({ userId: '', rolId: '' });
                refSucessfull.current.classList.toggle('show__message-success');
            }, 3000)
        };
    }

    const handleUpdateUsuerRoles = async (data, id) => {
        console.log(token);
        userRolesService.updateUserRoles(url, data, id, token).then((response) => {

            if (response) {
                getUserRolesOrginized();
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }


    const setFormInf = (userRoles) => {
        setUserRolId(userRoles.id)
        setCreateorupdate('update')
        setValue('userId', userRoles.userId)
        setValue('rolId', userRoles.rolId)
        handleShow();
    }

    const deleteUserRoles = async(id) => {
        console.log("delete")
        const deleted = await userRolesService.deleteUserRoles(url, id, token);
        if(deleted){
            getUserRolesOrginized();
        }
    }


    return (
        <>
            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={handleShow}>CREATE</Button>
            </div>
            <Table striped="columns" hover size="md">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ROL</th>
                        <th>USERNAME</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userRoles.map(ur => {
                            return (<tr key={ur.id}>
                                <td>{ur.id}</td>
                                <td>{ur.rolName}</td>
                                <td>{ur.userName}</td>
                                <td>
                                    <button className="btn btn-primary separeted" onClick={() => setFormInf(ur)}>UPDATE</button>
                                    <button className="btn btn-danger" onClick={() => deleteUserRoles(ur.id)}>DELETE</button>
                                </td>
                            </tr>)
                        })
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                    {
                        createorupdate === 'create'
                            ?
                            <Modal.Title>Register User Roles</Modal.Title>

                            :
                            <Modal.Title>Update User Roles</Modal.Title>

                    }
                </Modal.Header>
                <form className="p-3" onSubmit={handleSubmit(createorupdate === 'create' ? onSubmit : onsubmitUpdate)}>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" {...register("userId")}>
                            <option defaultValue=""></option>
                            {
                                users.map(user => {
                                    return <option key={user.id} value={user.id}>{user.name}</option>
                                })
                            }
                        </select>
                        <p className='message_error'>{errors.userId?.message}</p>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" {...register("rolId")}>
                            <option defaultValue=""></option>
                            {
                                roles.map(rol => {
                                    return <option key={rol.id} value={rol.id}>{rol.name}</option>
                                })
                            }
                        </select>
                        <p className='message_error'>{errors.rolId?.message}</p>
                    </div>
                    {
                            createorupdate === 'create' 
                                ?
                                <button type='submit' className="btn btn-primary" >Save</button>
                                :  
                                <button type='submit' className="btn btn-primary" >Update</button>
                        }
                    <button type='botton' className="btn btn-danger" onClick={handleClose}>Close</button>
                    <p className='message__success' ref={refSucessfull} >¡successful Action!</p>
                </form>
            </Modal>
        </>

    )
}

export default UserRoles;