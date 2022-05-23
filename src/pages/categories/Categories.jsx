import { useEffect, useState, useRef, useContext } from 'react';
import categoriesService from '../../services/categories.service';
import './categories.css';
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthContext } from '../../contexts/auth/AuthContext';

const url = process.env.REACT_APP_BACKEND_URL;
const Categories = () => {

    const [categories, setCategories] = useState([]);
    const [createorupdate, setCreateorupdate] = useState('create');
    const [categoryid, setCategoryId] = useState(0);

    const { user } = useContext(AuthContext);
    const token = user.token
    
    const refFormContainer = useRef();
    const refFormRegister = useRef();
    const refSucessfull = useRef();

    const schema = yup.object({
        name: yup.string().required(),
    })

    const { register, handleSubmit, reset, setValue,  formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = data => {
        handleCreateCategory(data); // ojo cambio de nombre del funcion
    };

    const onsubmitUpdate = data => {
        handleUpdateCategory(data, categoryid); // aca tambien
    };

    useEffect(() => {
        categoriesService.getCategories(url, token).then((res) => {
            setCategories(res)
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

    const handleCreateCategory = async(data) => {
        categoriesService.createCategory(url, data, token).then((response) => {
            if(response){
                categoriesService.getCategories(url, token).then((res) => {
                    setCategories(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    reset({name: ''});
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const handleUpdateCategory = async(data,  id) => {
        categoriesService.updateCategory(url, data, id, token).then((response) => {
            if(response){
                categoriesService.getCategories(url, token).then((res) => {
                    setCategories(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const setFormInf = (category) => {
        setCategoryId(category.id)
         setCreateorupdate('update')
         setValue('name', category.name)
         handleShowModal();
    }
 
     const deleteCategory = async(id) => {
         const deleted = await categoriesService.deleteCategory(url, id, token);
         console.log(deleted);
         if(deleted){
             categoriesService.getCategories(url, token).then((res) => {
                 setCategories(res)
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
                        categories.map((category) => {
                            return (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button className="btn btn--edit" onClick={() => setFormInf(category)}><i><MdOutlineModeEditOutline /></i></button>
                                        <button className="btn btn--delete" onClick={() => deleteCategory(category.id)}><i><FaTrashAlt /></i></button>
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
                                <h1>Register Category</h1>
                            :  
                            <h1>Update  Category</h1>  
                    }
                </div>
                <div className='inputs'>
                    <input type="text"  placeholder="Name" {...register("name")}></input>
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

export default Categories;