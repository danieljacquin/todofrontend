import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './register.css';
import usersService from "../../services/users.service";
import { useRef } from "react";
import image2 from '../../assets/img/image2.jpg';

const url = process.env.REACT_APP_BACKEND_URL;
const Register = ({showAndHide,registerView}) => {


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
         <div className="container hide_register" ref={registerView}>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card my-5">

                            <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className="text-center">
                                    <img src={image2} className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                        width="200px" alt="profile"></img>
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control"  aria-describedby="emailHelp"
                                        placeholder="Name" {...register("name")} />
                                    <p className='message_error'>{errors.name?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" placeholder="LastName"  {...register("lastName")} />
                                    <p className='message_error'>{errors.lastName?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" placeholder="Email"  {...register("email")} />
                                    <p className='message_error'>{errors.email?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" placeholder="Password"  {...register("password")} />
                                    <p className='message_error'>{errors.password?.message}</p>
                                </div>
                                <div className="text-center"><button type="submit" className="btn btn-primary px-5 mb-3 w-100">Register</button></div>
                                <p className='message__success' ref={refSucessfull} >¡successful Action!</p>
                                <div id="emailHelp" className="form-text text-center mb-3 text-dark register" onClick={showAndHide}>
                                    Go Login
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;