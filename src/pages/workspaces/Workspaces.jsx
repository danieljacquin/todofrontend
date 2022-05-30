import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext";
import workspacesService from "../../services/workspaces.service";
import { Table, Button, Modal } from 'react-bootstrap';
import usersService from "../../services/users.service";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const url = process.env.REACT_APP_BACKEND_URL;
const Workspaces = () => {

    const [workspaces, setWorkspaces] = useState([]);
    console.log(workspaces);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [workspaceid, setWorkspaceId] = useState(0);
    const [createorupdate, setCreateorupdate] = useState('create');

    const schema = yup.object({
        title: yup.string().required(),
        desc: yup.string().required(),
        userId: yup.string().required()
    })

    const refSucessfull = useRef();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = data => {
        handleCreateWorkspaces(data);
    };

    const onsubmitUpdate = data => {
        console.log(data);
        handleUpdateWorkspaces(data, workspaceid);
    };

    const handleClose = () => {
        setShow(false);
        reset({ title: '', desc: '', userId: ''});
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);

    const { user } = useContext(AuthContext);
    const token = user.token

    const getWorkspacesOrginized = async () => {
        const dataWorkspaces = await workspacesService.getWorkspaces(url, token);
        if (dataWorkspaces) {
            let workspace = dataWorkspaces.map(workS => {
                return {
                    id: workS.id,
                    userName: workS.user.name,
                    userId: workS.user.id,
                    title: workS.title,
                    desc: workS.desc
                }
            });
            setWorkspaces(workspace);
        }
    }

    useEffect(() => {
        const getWorkspaces = async() => {
            const dataWorkspaces = await workspacesService.getWorkspaces(url, token);
            if (dataWorkspaces) {
                let workspace = dataWorkspaces.map(workS => {
                    return {
                        id: workS.id,
                        userName: workS.user.name,
                        userId: workS.user.id,
                        title: workS.title,
                        desc: workS.desc
                    }
                });
                setWorkspaces(workspace);
            }
        }
        getWorkspaces();

        const getUsers = async () => {
            const dataUsers = await usersService.getUsers(url, token);
            setUsers(dataUsers);
        }
        getUsers();

    }, [token])

    const handleCreateWorkspaces = async (data) => {
        console.log("ento a crear")
        const response = await workspacesService.createWorkspace(url, data, token); 
        if (response) {
            getWorkspacesOrginized();
            refSucessfull.current.classList.toggle('show__message-success');
            setTimeout(() => {
                reset({title: '', desc: '', userId: ''});
                refSucessfull.current.classList.toggle('show__message-success');
            }, 3000)
        };
    }

    const handleUpdateWorkspaces = async (data, id) => {
        console.log(token);
        const response = await workspacesService.updateWorkspace(url, data, id, token); 
        console.log(response)
        if (response) {
            getWorkspacesOrginized();
            refSucessfull.current.classList.toggle('show__message-success');
            setTimeout(()=>{
                refSucessfull.current.classList.toggle('show__message-success');
            },3000)
        }
    }

    const setFormInf = (workspaces) => {
        setWorkspaceId(workspaces.id)
        setCreateorupdate('update')
        setValue('title', workspaces.title)
        setValue('desc', workspaces.desc)
        setValue('userId', workspaces.userId)
        handleShow();
    }

    const deleteWorkspaces = async(id) => {
        console.log("delete")
        const deleted = await workspacesService.deleteWorkspace(url, id, token);
        if(deleted){
            getWorkspacesOrginized();
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
                        <th>TITLE</th>
                        <th>DESCRIPTION</th>
                        <th>USER</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        workspaces.map(ws => {
                            return (<tr key={ws.id}>
                                <td>{ws.id}</td>
                                <td>{ws.title}</td>
                                <td>{ws.desc}</td>
                                <td>{ws.userName}</td>
                                <td>
                                    <button className="btn btn-primary separeted" onClick={() => setFormInf(ws)}>UPDATE</button>
                                    <button className="btn btn-danger" onClick={() => deleteWorkspaces(ws.id)}>DELETE</button>
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
                            <Modal.Title>Register Workspaces</Modal.Title>

                            :
                            <Modal.Title>Update Workspaces</Modal.Title>

                    }
                </Modal.Header>
                <form className="p-3" onSubmit={handleSubmit(createorupdate === 'create' ? onSubmit : onsubmitUpdate)}>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="Title" {...register("title")}/>
                        <p className='message_error'>{errors.title?.message}</p>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control"  placeholder="Description" {...register("desc")}/>
                        <p className='message_error'>{errors.desc?.message}</p>
                    </div>
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

export default Workspaces;