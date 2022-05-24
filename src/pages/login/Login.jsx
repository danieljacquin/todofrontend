import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth/AuthContext';
import './login.css';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import authService from '../../services/auth.service';
import jwt_decode from "jwt-decode";
import Register from '../register/Register';

const url = process.env.REACT_APP_BACKEND_URL;
const Login = () => {

    const { dispatch } = useContext(AuthContext);

    const navigate = useNavigate();
    const refSucessfull = useRef();

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

   


    return (
        <>
            <div className="login" >
                <div className="login-triangle"></div>

                <h2 className="login-header">Log in</h2>
                <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
                    <div className="inputs">
                        <input type="text" placeholder="Email" {...register("email")} />
                        <p className='message_error'>{errors.email?.message}</p>
                        <input type="password" placeholder="Password" {...register("password")} />
                        <p className='message_error'>{errors.password?.message}</p>
                        <button className="bton-form bton--save" type='submit'>Log in</button>
                        <p className='register__login'>Register  ?</p>
                        <p className='message__login' ref={refSucessfull} >User or password invalid</p>
                    </div>
                </form>
            </div>
            <Register />
        </>
    )
}

export default Login;