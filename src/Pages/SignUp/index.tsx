/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef} from "react";
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi'; 
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from 'yup';
import getValidationErrors from "../../utils/getValidationErrors";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/apiClient";

import { useToast } from "../../hooks/Toast";

import logoimg from '../../assets/logo.svg';
import { Container, Content, Background } from "./styles";

import Input from "../../components/input";
import Button from "../../components/Button";
import { abort } from "process";

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback( async (data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('Email obrigatório').email('Digite seu email'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });

            await schema.validate(data, {
                abortEarly: false,
              });
      
              await api.post('/users', data);
      
              history.push('/');
      
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
          , [addToast, history]
      );

    return (
        <Container>
        <Background/>
        <Content>
            <img src={logoimg} alt="GoBarber" />
            <Form ref={formRef} onSubmit={handleSubmit}>
                <h1>Faça seu Cadastro</h1>

                <Input name="name" icon={FiUser} placeholder="Nome" />
                <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
                <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                <Button type="submit">Cadastrar</Button>

            </Form>

            <Link to="/">
                <FiArrowLeft/>    
                Voltar para Login
            </Link>
        </Content>
        
        </Container>
    )
};

export default SignUp;