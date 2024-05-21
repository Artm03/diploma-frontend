import React, { useEffect, useRef } from 'react'

import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { Box, Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Heading, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AnyARecord } from 'dns';

import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/Index';
import { EmailNotifyCode, resetCodes, setUserCode } from '../store/CartSlice';


const EmailRegistry = () => {
    const { control, formState: { errors }, handleSubmit, register } = useForm()
    const user = useAppSelector(state => state.cart);

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!user || !user.email) {
            navigate('/registry-email')
        }
        console.log(user.email_code);
        console.log(user);
        if (user.success) {
            navigate('/')
        }
        else if (user.is_error) {
            dispatch(resetCodes())
            console.log(user, 'Error')
        }
    }, [user.success, user.is_error])

    const Handler = (data: FieldValues) => {
        dispatch(setUserCode(data.email_code))
        dispatch(EmailNotifyCode())
    }

    const getErrorMessage = (fieldName: string, errs: Record<string, any>): string | undefined =>
        typeof errs?.[fieldName]?.message === 'string' ? errs?.[fieldName]?.message : undefined;
    const nameError = getErrorMessage('name', errors);
    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            role="main">
            <Box alignItems='center'>
                <FormControl isRequired isInvalid>

                    <FormLabel>Enter code from email</FormLabel>
                    <Controller
                        {...register("email_code", {
                            required: "Code is required",
                            minLength: {
                                value: 6,
                                message: "Code is 6 symbols"
                            },
                            maxLength: {
                                value: 6,
                                message: "Code is 6 symbols"
                            }
                        })}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Input
                                id='email_code'
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <FormErrorMessage>
                        {getErrorMessage('email_code', errors)}
                    </FormErrorMessage>

                    <Button
                        mt={4}
                        colorScheme='teal'
                        type='submit'
                        onClick={handleSubmit(Handler)}
                    >
                        Подтвердить
                    </Button>
                    {user.is_error && <Text>{user.error_msg}</Text>}
                </FormControl>
            </Box>
        </Flex>
    );
}

export default EmailRegistry
