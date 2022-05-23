import { useEffect, useState, useRef, useContext } from 'react';
import usersService from '../../services/users.service';
import './users.css';
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthContext } from '../../contexts/auth/AuthContext';

    const url = process.env.REACT_APP_BACKEND_URL;
const Users = () => {
   
    const [users, setUsers] = useState([]);
    const [createorupdate, setCreateorupdate] = useState('create');
    const [userid, setUserId] = useState(0);

    const { user } = useContext(AuthContext);
    const token = user.token

    const refFormContainer = useRef();
    const refFormRegister = useRef();
    const refSucessfull = useRef();


    const schema = yup.object({
        name: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required()
    })



    const { register, handleSubmit, reset, setValue,  formState: { errors } } = useForm({
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
    },[token])

    const handleShowModal = () => {
        refFormContainer.current.classList.toggle('show_modal__container');
        refFormRegister.current.classList.toggle('show__modal');
    }

    const handleRemoveModal = (e) => {
        e.preventDefault();
        
        refFormRegister.current.classList.toggle('show__modal');
        setTimeout(()=>{
            reset({name: '', lastName: '', email: '', password: ''});
            refFormContainer.current.classList.toggle('show_modal__container');
            setCreateorupdate('create')
        },400)
    }

    const handleCreateUsuer = async(data) => {
        usersService.createUser(url, data, token).then((response) => {

            if(response){
                usersService.getUsers(url, token).then((res) => {
                    setUsers(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    reset({name: '', lastName: '', email: '', password: ''});
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const handleUpdateUsuer = async(data,  id) => {
        console.log(token);
        usersService.updateUser(url, data, id, token).then((response) => {

            if(response){
                usersService.getUsers(url, token).then((res) => {
                    setUsers(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
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
        handleShowModal();
    }

    const deleteUser = async(id) => {
        console.log(id)

        const deleted = await usersService.deleteUser(url, id, token);

        if(deleted){
            usersService.getUsers(url, token).then((res) => {
                setUsers(res)
            });
        }
    }
        

        


    return (

        <div className='user'>
            <span className="plus" onClick={handleShowModal} ><AiOutlinePlus /></span>
            <div className="table">
                <table className="table__data">
                    <thead className="table__header">
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>LASTNAME</th>
                            <th>EMAIL</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="table__body">
                        {
                            users.map((user) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button className="btn btn--edit" onClick={() => setFormInf(user)}><i><MdOutlineModeEditOutline /></i></button>
                                            <button className="btn btn--delete" onClick={() => deleteUser(user.id)}><i><FaTrashAlt /></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="form__container" ref={refFormContainer}>
                <form className="user__register" ref={refFormRegister} onSubmit={handleSubmit( createorupdate === 'create' ? onSubmit :  onsubmitUpdate )}>
                    <div className="title">
                        {
                            createorupdate === 'create' 
                                ?
                                    <h1>Register User</h1>
                                :  
                                <h1> Update  User</h1>  
                        }
                        
                    </div>
                    <div className='inputs'>
                        <input type="text"  placeholder="Name" {...register("name")}></input>
                        <p className='message_error'>{errors.name?.message}</p>
                        <input type="text" placeholder="LastName" {...register("lastName")}></input>
                        <p className='message_error'>{errors.lastName?.message}</p>
                        <input type="text" placeholder="Email" {...register("email")}></input>
                        <p className='message_error'>{errors.email?.message}</p>
                        <input type="password" placeholder="Password" {...register("password")}></input>
                        <p className='message_error'>{errors.password?.message}</p>
                    </div>
                    <div className="wrap-btn__save">
                        {
                            createorupdate === 'create' 
                                ?
                                <button className="btn-form btn--save" type='submit'>Save</button>
                                :  
                                <button className="btn-form btn--save" type='submit'>Update</button>
                        }
                        <button className="btn-form btn--cancel"  onClick={handleRemoveModal}>Close</button>
                    </div>
                    <p className='message__success' ref={refSucessfull} >¡successful Action!</p>
                </form>
            </div>
        </div>
    )
}

export default Users;