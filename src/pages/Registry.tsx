import React, { useEffect, useRef } from 'react'

import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Heading, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AnyARecord } from 'dns';
import axios from 'axios';
import { Link, Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import { EmailNotify, EmailNotifyRegistry, resetCodes, setUser } from '../store/CartSlice'
import { useAppDispatch, useAppSelector } from '../store/Index';
import { UserRegistry } from '../Types';



const Registry = () => {
  const { control, formState: { errors }, handleSubmit, register } = useForm()
  const [show, setShow] = React.useState(false);
  const user = useAppSelector(state => state.cart);

  const navigate = useNavigate()
  const handleToggle = () => setShow(!show);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user.success) {
      dispatch(resetCodes())
      navigate('/registry')
    }
    else if (user.is_error) {
      console.log(user)
    }
  }, [user.success, user.is_error])
  const Handler = (data: FieldValues) => {
    const user_form: UserRegistry = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
    }
    dispatch(setUser(user_form))
    dispatch(EmailNotify(user_form.email))
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

          <FormLabel>First name</FormLabel>
          <Controller
            {...register("first_name", {
              required: "First name is required",
              minLength: {
                value: 3,
                message: "Min is 3 symbols"
              }
            })}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                id='first_name'
                value={value}
                onChange={onChange}
              />
            )}
          />
          <FormErrorMessage>
            {getErrorMessage('first_name', errors)}
          </FormErrorMessage>

          <FormLabel>Last name</FormLabel>
          <Controller
            {...register("last_name", {
              required: "Last name is required",
              minLength: {
                value: 3,
                message: "Min is 3 symbols"
              }
            })}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                id='last_name'
                value={value}
                onChange={onChange}
              />
            )}
          />
          <FormErrorMessage>
            {getErrorMessage('last_name', errors)}
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
              <Link to={'/'}>Войти</Link>
            </Button>
          </Flex>
        </FormControl>
        {user.is_error && <Text>{user.error_msg}</Text>}
      </Box>
    </Flex>
  );
}

export default Registry
