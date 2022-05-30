import { useEffect, useState, useRef, useContext } from 'react';
import usersService from '../../services/users.service';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthContext } from '../../contexts/auth/AuthContext';
import { Table, Button, Modal } from 'react-bootstrap';

const url = process.env.REACT_APP_BACKEND_URL;
const Users = () => {

    const [users, setUsers] = useState([]);
    const [createorupdate, setCreateorupdate] = useState('create');
    const [userid, setUserId] = useState(0);
    const [show, setShow] = useState(false);

    const { user } = useContext(AuthContext);
    const token = user.token

    const refSucessfull = useRef();


    const schema = yup.object({
        name: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required()
    })



    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = data => {
        handleCreateUsuer(data);
    };

    const onsubmitUpdate = data => {
        handleUpdateUsuer(data, userid);
    };


    useEffect(() => {
        usersService.getUsers(url, token).then((res) => {
            setUsers(res)
        });
    }, [token])

    const handleClose = () => {

        setShow(false);
        reset({ name: '', lastName: '', email: '', password: '' });
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);

    const handleCreateUsuer = async (data) => {
        usersService.createUser(url, data, token).then((response) => {

            if (response) {
                usersService.getUsers(url, token).then((res) => {
                    setUsers(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(() => {
                    reset({ name: '', lastName: '', email: '', password: '' });
                    refSucessfull.current.classList.toggle('show__message-success');
                }, 3000)
            }
        });
    }

    const handleUpdateUsuer = async (data, id) => {
        console.log(token);
        usersService.updateUser(url, data, id, token).then((response) => {

            if (response) {
                usersService.getUsers(url, token).then((res) => {
                    setUsers(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(() => {
                    refSucessfull.current.classList.toggle('show__message-success');
                }, 3000)
            }
        });
    }

    const setFormInf = (user) => {
        setUserId(user.id)
        setCreateorupdate('update')
        setValue('name', user.name)
        setValue('lastName', user.lastName)
        setValue('email', user.email)
        setValue('password', user.password)
        handleShow();
    }

    const deleteUser = async (id) => {

        const deleted = await usersService.deleteUser(url, id, token);

        if (deleted) {
            usersService.getUsers(url, token).then((res) => {
                setUsers(res)
            });
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
                        <th>NAME</th>
                        <th>LASTNAME</th>
                        <th>EMAIL</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-primary separeted" onClick={() => setFormInf(user)} >UPDATE</button>
                                        <button className="btn btn-danger" onClick={() => deleteUser(user.id)} >DELETE</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                    {
                        createorupdate === 'create'
                            ?
                            <Modal.Title>Register User</Modal.Title>

                            :
                            <Modal.Title>Update User</Modal.Title>

                    }
                </Modal.Header>
                <form className="p-3" onSubmit={handleSubmit(createorupdate === 'create' ? onSubmit : onsubmitUpdate)}>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="Name" {...register("name")}/>
                        <p className='message_error'>{errors.name?.message}</p>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="LastName" {...register("lastName")}/>
                        <p className='message_error'>{errors.lastName?.message}</p>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="Email" {...register("email")}/>
                        <p className='message_error'>{errors.email?.message}</p>
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control"  placeholder="Password" {...register("password")}/>
                        <p className='message_error'>{errors.password?.message}</p>
                    </div>
                    {
                        createorupdate === 'create'
                            ?
                            <button type='submit' className="btn btn-primary separeted" >Save</button>
                            :
                            <button type='submit' className="btn btn-primary separeted" >Update</button>
                    }
                    <button type='botton' className="btn btn-danger" onClick={handleClose}>Close</button>
                    <p className='message__success' ref={refSucessfull} >¡successful Action!</p>
                </form>
            </Modal>
        </>
    )
}

export default Users;