import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth/AuthContext';
import './login.css';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import authService from '../../services/auth.service';
import jwt_decode from "jwt-decode";
import Register from '../register/Register';
import image1 from '../../assets/img/image1.jpg';

const url = process.env.REACT_APP_BACKEND_URL;
const Login = () => {

    const { dispatch } = useContext(AuthContext);

    const navigate = useNavigate();
    const refSucessfull = useRef();
    const loginView = useRef();
    const registerView = useRef();

    const schema = yup.object({
        email: yup.string().required().email(),
        password: yup.string().required()
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {

        const response = await authService.login(url, data)
        if (!response.data) {
            console.log("entro aqui")
            refSucessfull.current.classList.toggle('show__message-login');
            setTimeout(() => {
                refSucessfull.current.classList.toggle('show__message-login');
            }, 3000)

        } else {
            const token = response.data.access_token;
            let decoded = jwt_decode(token);
            handleLogin(token, decoded)
        }

    };

    const handleLogin = (token, decoded) => {

        dispatch({
            type: 'login',
            payload: {
                token,
                ...decoded
            }
        });
        navigate('/');
    }

    const showAndHide = () => {
        loginView.current.classList.toggle('hide__login');
        registerView.current.classList.toggle('show_register');
    }



    return (
        <>
            <div className="container" ref={loginView}>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card my-5">

                            <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit(onSubmit)}>

                                <div className="text-center">
                                    <img src={image1} className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                        width="200px" alt="profile"></img>
                                </div>

                                <div className="mb-3">
                                    <input type="text" className="form-control" id="Username" aria-describedby="emailHelp"
                                        placeholder="Email" {...register("email")} />
                                    <p className='message_error'>{errors.email?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <input type="Password" className="form-control" id="password" placeholder="password"  {...register("password")} />
                                    <p className='message_error'>{errors.password?.message}</p>
                                </div>
                                <div className="text-center"><button type="submit" className="btn btn-primary px-5 mb-3 w-100">Login</button></div>
                                <p className='message-login' ref={refSucessfull} >Email or Password are invalid</p>
                                <div id="emailHelp" className="form-text text-center mb-5 text-dark register" onClick={showAndHide}>Not
                                    Registered?  Create an
                                    Account
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
            <Register showAndHide={showAndHide} registerView={registerView}/>
        </>
    )
}

export default Login;