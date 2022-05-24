import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './register.css';
import usersService from "../../services/users.service";
import { useRef } from "react";

const url = process.env.REACT_APP_BACKEND_URL;
const Register = () => {


    const schema = yup.object({
        name: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required()
    })

    

    const { register, handleSubmit, reset,  formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

      const onSubmit = data => {
          console.log(data);
            handleCreateUsuer(data);
        };

        const refSucessfull = useRef();


        const handleCreateUsuer = async(data) => {
            usersService.createUserWitoutToken(url, data).then((response) => {
    
                if(response){
                    refSucessfull.current.classList.toggle('show__message-success');
                    setTimeout(()=>{
                        reset({name: '', lastName: '', email: '', password: ''});
                        refSucessfull.current.classList.toggle('show__message-success');
                    },3000)
                }
            });
        }


    return (
        <>
            <div className="register" >
                <div className="login-triangle"></div>

                <h2 className="login-header">Register</h2>

                <form className="login-container" onSubmit={handleSubmit( onSubmit)}>
                        <div className="inputs">
                        <input type="text"  placeholder="Name" {...register("name")}></input>
                        <p className='message_error'>{errors.name?.message}</p>
                        <input type="text" placeholder="LastName" {...register("lastName")}></input>
                        <p className='message_error'>{errors.lastName?.message}</p>
                        <input type="text" placeholder="Email" {...register("email")}></input>
                        <p className='message_error'>{errors.email?.message}</p>
                        <input type="password" placeholder="Password" {...register("password")}></input>
                        <p className='message_error'>{errors.password?.message}</p>
                        <button className="btn-form btnn--save" type='submit'>Register</button>
                        </div>
                        <p className='message__success' ref={refSucessfull} >¡successful Action!</p>
                </form>
            </div>
        </>
    )
}

export default Register;