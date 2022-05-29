import { useEffect, useState, useRef, useContext } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthContext } from '../../contexts/auth/AuthContext';
import { Table, Button, Modal } from 'react-bootstrap';
import categoriesService from "../../services/categories.service";

const url = process.env.REACT_APP_BACKEND_URL;
const Categories = () => {

    const [categories, setCategories] = useState([]);
    const [createorupdate, setCreateorupdate] = useState('create');
    const [categoryid, setCategoryId] = useState(0);
    const [show, setShow] = useState(false);

    const { user } = useContext(AuthContext);
    const token = user.token

    const refSucessfull = useRef();

    const schema = yup.object({
        name: yup.string().required()
    })

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = data => {
        handleCreateCategory(data);
    };

    const onsubmitUpdate = data => {
        handleUpdateCategory(data, categoryid);
    };

    useEffect(() => {
        categoriesService.getCategories(url, token).then((res) => {
            setCategories(res)
        });
    }, [token])

    const handleClose = () => {

        setShow(false);
        reset({ name: '' });
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);

    const handleCreateCategory = async (data) => {
        categoriesService.createCategory(url, data, token).then((response) => {

            if (response) {
                categoriesService.getCategories(url, token).then((res) => {
                    setCategories(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(() => {
                    reset({ name: ''});
                    refSucessfull.current.classList.toggle('show__message-success');
                }, 3000)
            }
        });
    }

    const handleUpdateCategory = async (data, id) => {
        console.log(token);
        categoriesService.updateCategory(url, data, id, token).then((response) => {
            if (response) {
                categoriesService.getCategories(url, token).then((res) => {
                    setCategories(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(() => {
                    refSucessfull.current.classList.toggle('show__message-success');
                }, 3000)
            }
        });
    }

    const setFormInf = (category) => {
        setCategoryId(category.id)
        setCreateorupdate('update')
        setValue('name', category.name)
        handleShow();
    }

    const deleteCategory = async (id) => {
        const deleted = await categoriesService.deleteCategory(url, id, token);
        if (deleted) {
            categoriesService.getCategories(url, token).then((res) => {
                setCategories(res)
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
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map((category) => {
                            return (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => setFormInf(category)} >UPDATE</button>
                                        <button className="btn btn-danger" onClick={() => deleteCategory(category.id)} >DELETE</button>
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
                            <Modal.Title>Register Category</Modal.Title>

                            :
                            <Modal.Title>Update Category</Modal.Title>

                    }
                </Modal.Header>
                <form className="p-3" onSubmit={handleSubmit(createorupdate === 'create' ? onSubmit : onsubmitUpdate)}>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="Name" {...register("name")}/>
                        <p className='message_error'>{errors.name?.message}</p>
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

export default Categories;