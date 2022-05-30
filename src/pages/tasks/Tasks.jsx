import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";
import tasksService from "../../services/tasks.service";
import { Table, Button, Modal } from 'react-bootstrap';
import workspacesService from "../../services/workspaces.service";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const url = process.env.REACT_APP_BACKEND_URL;
const Tasks = () => {

    const [task, setTask] = useState([]);
    console.log(task);
    const [workspaces, setWorkspaces] = useState([]);
    const [show, setShow] = useState(false);
    const [taskId, setTaskId] = useState(0);
    const [createorupdate, setCreateorupdate] = useState('create');

    const schema = yup.object({
        desc: yup.string().required(),
        workspaceId: yup.string().required()
    })

    const refSucessfull = useRef();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = data => {
        handleCreateTask(data);
    };

    const onsubmitUpdate = data => {
        console.log(data);
        handleUpdateTask(data, taskId);
    };

    const handleClose = () => {
        setShow(false);
        reset({ desc: '', workspaceId: ''});
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);

    const { user } = useContext(AuthContext);
    const token = user.token

    const getTaskOrginized = async () => {
        const dataTask = await tasksService.getTask(url, token);
        if (dataTask) {
            let task = dataTask.map(task => {
                return {
                    id: task.id,
                    desc: task.desc,
                    workspaceId: task.workspace.id,
                    workspace: task.workspace.title
                }
            });
            setTask(task);
        }
    }

    useEffect(() => {
        const getTask = async() => {
            const dataTask = await tasksService.getTask(url, token);
            if (dataTask) {
                let task = dataTask.map(task => {
                    return {
                        id: task.id,
                        desc: task.desc,
                        workspaceId: task.workspace.id,
                        workspace: task.workspace.title
                    }
                });
                setTask(task);
            }
        }
        getTask();

        const getWorkspaces = async () => {
            const dataTask = await workspacesService.getWorkspaces(url, token);
            setWorkspaces(dataTask);
        }
        getWorkspaces();

    }, [token])

    const handleCreateTask = async (data) => {

        const response = await tasksService.createTask(url, data, token);
        if (response) {
            getTaskOrginized();
            refSucessfull.current.classList.toggle('show__message-success');
            setTimeout(() => {
                reset({ desc: '', workspaceId: '' });
                refSucessfull.current.classList.toggle('show__message-success');
            }, 3000)
        };
    }

    const handleUpdateTask = async (data, id) => {
        console.log(token);
        tasksService.updateTask(url, data, id, token).then((response) => {

            if (response) {
                getTaskOrginized();
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(()=>{
                    refSucessfull.current.classList.toggle('show__message-success');
                },3000)
            }
        });
    }

    const setFormInf = (task) => {
        setTaskId(task.id)
        setCreateorupdate('update')
        setValue('desc', task.desc)
        setValue('workspaceId', task.workspaceId)
        handleShow();
    }

    const deleteTask = async(id) => {
        console.log("delete")
        const deleted = await tasksService.deleteTask(url, id, token);
        if(deleted){
            getTaskOrginized();
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
                        <th>DESC</th>
                        <th>WORKSPACE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        task.map(t => {
                            return (<tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.desc}</td>
                                <td>{t.workspace}</td>
                                <td>
                                    <button className="btn btn-primary separeted" onClick={() => setFormInf(t)}>UPDATE</button>
                                    <button className="btn btn-danger" onClick={() => deleteTask(t.id)}>DELETE</button>
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
                            <Modal.Title>Register Task</Modal.Title>

                            :
                            <Modal.Title>Update Task</Modal.Title>

                    }
                </Modal.Header>
                <form className="p-3" onSubmit={handleSubmit(createorupdate === 'create' ? onSubmit : onsubmitUpdate)}>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="Desc" {...register("desc")}/>
                        <p className='message_error'>{errors.desc?.message}</p>
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

export default Tasks;