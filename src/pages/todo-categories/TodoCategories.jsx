import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";
import todoCategoriesService from "../../services/todo-categories.service";
import { Table, Button, Modal } from 'react-bootstrap';
import categoriesService from "../../services/categories.service";
import workspacesService from "../../services/workspaces.service";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const url = process.env.REACT_APP_BACKEND_URL;
const TodoCategories = () => {

    const [workspace, setTodoCategories] = useState([]);
    console.log(workspace);
    const [categories, setCategories] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [show, setShow] = useState(false);
    const [todoCategorid, setTodoCategorId] = useState(0);
    const [createorupdate, setCreateorupdate] = useState('create');

    const schema = yup.object({
        categoryId: yup.string().required(),
        workspaceId: yup.string().required()
    })

    const refSucessfull = useRef();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = data => {
        handleCreateTodoCategories(data);
    };

    const onsubmitUpdate = data => {
        console.log(data);
        handleUpdateUsuerWorkspaces(data, todoCategorid);
    };

    const handleClose = () => {

        setShow(false);
        reset({ categoryId: '', workspaceId: '' });
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);
    const { user } = useContext(AuthContext);
    const token = user.token

    const getTodoCategoriesOrginized = async () => {
        const dataTodoCategories = await todoCategoriesService.getTodoCategories(url, token);
        if (dataTodoCategories) {
            let todoCategory = dataTodoCategories.map(todoC => {
                return {
                    id: todoC.id,
                    workspaceName: todoC.workspace.title,
                    categoryName: todoC.category.name,
                    workspaceId: todoC.workspace.id,
                    categoryId: todoC.category.id
                }
            });
            setTodoCategories(todoCategory);
        }
    }

    useEffect(() => {
        const getTodoCategories = async() => {
            const dataTodoCategories = await todoCategoriesService.getTodoCategories(url, token);
            if (dataTodoCategories) {
                let todoCategory = dataTodoCategories.map(todoC => {
                    return {
                        id: todoC.id,
                        workspaceName: todoC.workspace.title,
                        categoryName: todoC.category.name,
                        workspaceId: todoC.workspace.id,
                        categoryId: todoC.category.id
                    }
                });
                setTodoCategories(todoCategory);
            }
        }
        getTodoCategories();
    
        const getCategories = async () => {
            const dataCategories = await categoriesService.getCategories(url, token);
            setCategories(dataCategories);
        }
        getCategories();

        const getWorkspaces = async () => {
            const dataWorkspaces = await workspacesService.getWorkspaces(url, token);
            setWorkspaces(dataWorkspaces);
        }
        getWorkspaces();

    }, [token])

    const handleCreateTodoCategories = async (data) => {

        const response = await todoCategoriesService.createTodoCategories(url, data, token);
        if (response) {
            getTodoCategoriesOrginized();
            refSucessfull.current.classList.toggle('show__message-success');
            setTimeout(() => {
                reset({ categoryId: '', workspaceId: '' });
                refSucessfull.current.classList.toggle('show__message-success');
            }, 3000)
        };
    }

    const handleUpdateUsuerWorkspaces = async (data, id) => {
        console.log(token);
        todoCategoriesService.updateTodoCategories(url, data, id, token).then((response) => {

            if (response) {
                getTodoCategoriesOrginized();
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const setFormInf = (workspace) => {
        setTodoCategorId(workspace.id)
        setCreateorupdate('update')
        setValue('categoryId', workspace.categoryId)
        setValue('workspaceId', workspace.workspaceId)
        handleShow();
    }

    const deleteTodoCategories = async(id) => {
        console.log("delete")
        const deleted = await todoCategoriesService.deleteTodoCategories(url, id, token);
        if(deleted){
            getTodoCategoriesOrginized();
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
                        <th>WORKSPACE</th>
                        <th>CATEGORY</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        workspace.map(tc => {
                            return (<tr key={tc.id}>
                                <td>{tc.id}</td>
                                <td>{tc.workspaceName}</td>
                                <td>{tc.categoryName}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => setFormInf(tc)}>UPDATE</button>
                                    <button className="btn btn-danger" onClick={() => deleteTodoCategories(tc.id)}>DELETE</button>
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
                            <Modal.Title>Register Todo Categories</Modal.Title>

                            :
                            <Modal.Title>Update Todo Categories</Modal.Title>

                    }
                </Modal.Header>
                <form className="p-3" onSubmit={handleSubmit(createorupdate === 'create' ? onSubmit : onsubmitUpdate)}>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" {...register("categoryId")}>
                            <option defaultValue=""></option>
                            {
                                categories.map(category => {
                                    return <option key={category.id} value={category.id}>{category.name}</option>
                                })
                            }
                        </select>
                        <p className='message_error'>{errors.categoryId?.message}</p>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" {...register("workspaceId")}>
                            <option defaultValue=""></option>
                            {
                                workspaces.map(workspace => {
                                    return <option key={workspace.id} value={workspace.id}>{workspace.title}</option>
                                })
                            }
                        </select>
                        <p className='message_error'>{errors.workspaceId?.message}</p>
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

export default TodoCategories;