import { useEffect, useState, useRef, useContext } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthContext } from '../../contexts/auth/AuthContext';
import { Table, Button, Modal } from 'react-bootstrap';
import rolesService from "../../services/roles.service";

const url = process.env.REACT_APP_BACKEND_URL;
const Roles = () => {

    const [roles, setRoles] = useState([]);
    const [createorupdate, setCreateorupdate] = useState('create');
    const [roleid, setRoleId] = useState(0);
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
        handleCreateRole(data);
    };

    const onsubmitUpdate = data => {
        handleUpdateRole(data, roleid);
    };

    useEffect(() => {
        rolesService.getRoles(url, token).then((res) => {
            setRoles(res)
        });
    }, [token])

    const handleClose = () => {

        setShow(false);
        reset({ name: '' });
        setCreateorupdate('create');
    }
    const handleShow = () => setShow(true);

    const handleCreateRole = async (data) => {
        rolesService.createRole(url, data, token).then((response) => {

            if (response) {
                rolesService.getRoles(url, token).then((res) => {
                    setRoles(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(() => {
                    reset({ name: ''});
                    refSucessfull.current.classList.toggle('show__message-success');
                }, 3000)
            }
        });
    }

    const handleUpdateRole = async (data, id) => {
        console.log(token);
        rolesService.updateRole(url, data, id, token).then((response) => {
            if (response) {
                rolesService.getRoles(url, token).then((res) => {
                    setRoles(res)
                });
                refSucessfull.current.classList.toggle('show__message-success');
                setTimeout(() => {
                    refSucessfull.current.classList.toggle('show__message-success');
                }, 3000)
            }
        });
    }

    const setFormInf = (role) => {
        setRoleId(role.id)
        setCreateorupdate('update')
        setValue('name', role.name)
        handleShow();
    }

    const deleteRole = async (id) => {
        const deleted = await rolesService.deleteRole(url, id, token);
        if (deleted) {
            rolesService.getRoles(url, token).then((res) => {
                setRoles(res)
            });
        }
    }



    return (

        <>
            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={handleShow}>CREATE</Button>
            </div>
            <Table striped="columns" hover size="sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        roles.map((role) => {
                            return (
                                <tr key={role.id}>
                                    <td>{role.id}</td>
                                    <td>{role.name}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => setFormInf(role)} >UPDATE</button>
                                        <button className="btn btn-danger" onClick={() => deleteRole(role.id)} >DELETE</button>
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
                            <Modal.Title>Register Role</Modal.Title>

                            :
                            <Modal.Title>Update Role</Modal.Title>

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

export default Roles;