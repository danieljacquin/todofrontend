
import { useEffect, useState, useRef, useContext } from 'react';
import rolesService from '../../services/roles.service';
import './roles.css';
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthContext } from '../../contexts/auth/AuthContext';
const url = process.env.REACT_APP_BACKEND_URL;
const Roles = () => {

    const [roles, setRoles] = useState([]);
    const [createorupdate, setCreateorupdate] = useState('create');
    const [roleid, setRoleId] = useState(0);
    
    const refFormContainer = useRef();
    const refFormRegister = useRef();
    const refSucessfull = useRef();

    const { user } = useContext(AuthContext);
    const token = user.token

    const schema = yup.object({
        name: yup.string().required(),        
    })

    const { register, handleSubmit, reset, setValue,  formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

    const onSubmit = data => {
        handleCreateRole(data);
    };

    const onsubmitUpdate = data => {
        
        handleUpdateRole(data, roleid);
    };


    useEffect(() => {
        rolesService.getRoles(url, token).then((res) => {
            setRoles(res)
        });
    },[])


    const handleShowModal = () => {
        refFormContainer.current.classList.toggle('show_modal__container');
        refFormRegister.current.classList.toggle('show__modal');
    }

    const handleRemoveModal = (e) => {
        e.preventDefault();
        
        refFormRegister.current.classList.toggle('show__modal');
        setTimeout(()=>{
            reset({name: ''});
            refFormContainer.current.classList.toggle('show_modal__container');
            setCreateorupdate('create')
        },400)
    }

    const handleCreateRole = async(data) => {
        rolesService.createRole(url, data, token).then((response) => {

            if(response){
                rolesService.getRoles(url,token).then((res) => {
                    setRoles(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    reset({name: ''});
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const handleUpdateRole = async(data,  id) => {
        rolesService.updateRole(url, data, id, token).then((response) => {

            if(response){
                rolesService.getRoles(url, token).then((res) => {
                    setRoles(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const setFormInf = (role) => {
        setRoleId(role.id)
         setCreateorupdate('update')
         setValue('name', role.name)         
         handleShowModal();
     }
 
     const deleteRole = async(id) => {
         const deleted = await rolesService.deleteRole(url, id, token);
         console.log(deleted);
 
         if(deleted){
             rolesService.getRoles(url, token).then((res) => {
                 setRoles(res)
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
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {
                        roles.map((role) => {
                            return (
                                <tr key={role.id}>
                                    <td>{role.id}</td>
                                    <td>{role.name}</td>
                                    <td>
                                        <button className="btn btn--edit" onClick={() => setFormInf(role)}><i><MdOutlineModeEditOutline /></i></button>
                                        <button className="btn btn--delete" onClick={() => deleteRole(role.id)}><i><FaTrashAlt /></i></button>
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
                                <h1>Register Role</h1>
                            :  
                            <h1> Update  Role</h1>  
                    }
                    
                </div>
                <div className='inputs'>
                    <input type="text"  placeholder="name" {...register("name")}></input>
                    <p className='message_error'>{errors.name?.message}</p>
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

export default Roles;