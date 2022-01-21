/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef, useCallback} from "react";
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup'; 
import { Link, useHistory } from "react-router-dom";

import {useAuth} from "../../hooks/Auth";
import { useToast } from "../../hooks/Toast";
import getValidationErrors from "../../utils/getValidationErrors";

import logoimg from '../../assets/logo.svg';
import { Container, Content, Background } from "./styles";

import Input from "../../components/input";
import Button from "../../components/Button";


interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    

    const {signIn} = useAuth();
    const {addToast} = useToast();

    const handleSubmit = useCallback( async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string().required('Email obrigatório').email('Digite seu email'),
                password: Yup.string().required('Senha faltando/inválida'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });
            await signIn({
                email: data.email,
                password: data.password,
            });

            history.push('/dashboard')


        } catch (err) {
                if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
        
                formRef.current?.setErrors(errors);
                }
                addToast({
                    type: 'error',
                    title: 'Erro na autenticação',
                    description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
                });
            }
    }, [signIn, addToast, history]);

    return (
        <Container>
            <Content>
                <img src={logoimg} alt="GoBarber" />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu LogIn</h1>

                    <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
                    <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                    <Button type="submit">Entrar</Button>

                    <Link to="/forgot-password">Esqueci minha senha</Link>
                </Form>

                <Link to="/signup" >
                    <FiLogIn/>    
                    Criar conta
                </Link>
            </Content>
            <Background></Background>
        </Container>
    );
};

export default SignIn;


