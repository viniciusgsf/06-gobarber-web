/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {ChangeEvent, useCallback, useRef} from "react";
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi'; 
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from 'yup';
import getValidationErrors from "../../utils/getValidationErrors";
import { useHistory, Link } from "react-router-dom";
import api from "../../services/apiClient";

import { useToast } from "../../hooks/Toast";

import { Container, Content, AvatarInput} from "./styles";

import Input from "../../components/input";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/Auth";


interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}


const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const token = localStorage.getItem('@GoBarber:token');

    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback( async (data: ProfileFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('Email obrigatório').email('Digite seu email'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password', {
                  is: (val: { lenght: any; }) => !!val.lenght,
                  then: Yup.string().required('Campo obrigatório'),
                  otherwise: Yup.string(),
                }),
                password_confirmation: Yup.string().when('old_password', {
                  is: (val: { lenght: any; }) => !!val.lenght,
                  then: Yup.string().required('Campo obrigatório'),
                  otherwise: Yup.string(),
                }).oneOf([Yup.ref('password'), null], 'Passwords must match'),
            });

            await schema.validate(data, {
                abortEarly: false,
              });

              const {name, email, old_password, password, password_confirmation } = data;

              const formData = Object.assign({
                name,
                email,
                }, old_password ? {
                  old_password,
                  password,
                  password_confirmation,
              } : {});
      
              const response = await api.put('/profile', formData, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              // updateUser(response.data)
      
              history.push('/dashboard');
      
              addToast({
                type: 'success',
                title: 'Cadastro realizado!',
                description: 'Você já pode fazer seu logon no GoBarber!',
              });
            } catch (err) {
              if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
      
                formRef.current?.setErrors(errors);
      
                return;
              }
      
              addToast({
                type: 'error',
                title: 'Erro no cadastro',
                description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
              });
            }
          }
          , [addToast, history, token]
      );

    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0])

         api.patch('/users/avatar', data).then(response  => {
          // updateUser(response.data);
          console.log(response);

           addToast({
             type: 'success',
             title: 'Avatar atualizado!'
           })
         })
      }
    }, [addToast, ]); //updateUser

    return (
        <Container>
        <header>
          <div>
            <Link to={"/dashboard"}>
              <FiArrowLeft/>
            </Link>
          </div>
        </header>
        <Content>
          
            <Form ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}>
                <AvatarInput>
                  <img src={user.avatar_url} alt={user.name} />
                  <label htmlFor="avatar">
                    <FiCamera/>

                    <input type="file" id="avatar" onChange={handleAvatarChange} />
                  </label>

                  
                </AvatarInput>

                <h1>Meu perfil</h1>

                <Input name="name" icon={FiUser} placeholder="Nome" />
                <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
                <Input containerStyle={{marginTop: 24}} name="old_password" icon={FiLock} type="password" placeholder="Senha atual" />
                <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
                <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar nova senha" />

                <Button type="submit">Confirmar mudanças</Button>

            </Form>

        </Content>
        
        </Container>
    )
};

export default Profile;