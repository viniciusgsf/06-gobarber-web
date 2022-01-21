/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef, useCallback} from "react";
import { FiLogIn, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup'; 
import { Link, useLocation } from "react-router-dom";

import { useToast, } from "../../hooks/Toast";
import getValidationErrors from "../../utils/getValidationErrors";

import logoimg from '../../assets/logo.svg';
import { Container, Content, Background } from "./styles";

import Input from "../../components/input";
import Button from "../../components/Button";
import api from "../../services/apiClient";


interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const {addToast} = useToast();
    const location = useLocation();

    const handleSubmit = useCallback( async (data: ResetPasswordFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                password: Yup.string().required('Senha faltando/inválida'),
                password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const {password, password_confirmation} = data;
            const token = location.search.replace('?token=', '');

            if(!token ) {
                throw new Error();
            }

            await api.post('/password/reset', {
                password,
                password_confirmation,
                token
            });
            
        } catch (err) {
                if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
        
                formRef.current?.setErrors(errors);
                }
                addToast({
                    type: 'error',
                    title: 'Erro na resetar senha',
                    description: 'Ocorreu um erro ao resetar senha, tente novamente',
                });
            }
    }, [addToast, location.search]);

    return (
        <Container>
            <Content>
                <img src={logoimg} alt="GoBarber" />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Resetar senha</h1>
                    <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
                    <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação de Senha" />

                    <Button type="submit">Alterar senha</Button>

                </Form>

                <Link to="/" >
                    <FiLogIn/>    
                    Voltar para login
                </Link>
            </Content>
            <Background></Background>
        </Container>
    );
};

export default ResetPassword;