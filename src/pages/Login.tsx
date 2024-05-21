import React, { useEffect, useRef } from 'react'

import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { Box, Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Heading, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AnyARecord } from 'dns';
import axios from 'axios';
import { Link, Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../store/Index';
import { LoginEmailNotify, resetCodesLogin, setUserLogin } from '../store/UserLogin';
import { UserLogin } from '../Types';



const Login = () => {
  const { control, formState: { errors }, handleSubmit, register } = useForm()
  const [show, setShow] = React.useState(false);
  const user = useAppSelector(state => state.user_login);
  const user_info = useAppSelector(state => state.user_profile)

  const navigate = useNavigate()
  const handleToggle = () => setShow(!show);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user_info.success) {
      navigate('/profile')
    }
  })

  useEffect(() => {
    if (user.success) {
      dispatch(resetCodesLogin())
      navigate('/login')
    }
    else if (user.is_error) {
      console.log(user)
    }
  }, [user])


  const Handler = (data: FieldValues) => {
    const user_form: UserLogin = {
      email: data.email,
      password: data.password,
    }
    dispatch(setUserLogin(user_form))
    dispatch(LoginEmailNotify())
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
          <FormLabel>Email address</FormLabel>
          <Controller
            control={control}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address"
              }
            })}
            render={({ field: { value, onChange } }) => (
              <Input
                id='email'
                type='email'
                value={value}
                onChange={onChange}
              />
            )}
          />
          <FormErrorMessage>
            {getErrorMessage('email', errors)}
          </FormErrorMessage>

          <FormLabel>Password</FormLabel>
          <Controller
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Min is 8 symbols"
              }
            })}
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputGroup>
                <Input
                  id='password'
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='Enter password'
                  value={value}
                  onChange={onChange}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleToggle}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            )}
          />
          <FormErrorMessage>
            {getErrorMessage('password', errors)}
          </FormErrorMessage>
          <Flex justifyContent={'space-between'}>
            <Button
              mt={4}
              colorScheme='teal'
              type='submit'
              onClick={handleSubmit(Handler)}
            >
              Подтвердить
            </Button>
            <Button
              mt={4}
              colorScheme='teal'
              type='submit'
            >
              <Link to={'/registry-email'}>Регистрация</Link>
            </Button>
          </Flex>
        </FormControl>
        {user.is_error && <Text>{'Неверный логин или пароль'}</Text>}
      </Box>
    </Flex>
  );
}

export default Login
