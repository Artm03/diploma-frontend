import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { Box, Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Heading, Input, InputGroup, InputRightElement, Icon } from '@chakra-ui/react';
import { Controller, FieldValues, SubmitHandler, UseFormRegisterReturn, useForm } from 'react-hook-form';
import { AnyARecord } from 'dns';
import axios from 'axios';
import { Link, Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink, LinkProps, Image } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../store/Index';
import { clearCodesLogin } from '../store/UserLogin';
import { neuro_images } from '../services/Neuro';
import { FiFile } from 'react-icons/fi'


const UserPage = () => {
    const { control, formState: { errors }, handleSubmit, register } = useForm()
    const user = useAppSelector(state => state.user_profile);

    const [urls, setUrls] = useState<string[]>([])
    const [values, setValues] = useState<Array<File>>([])

    const navigate = useNavigate()
    const getErrorMessage = (fieldName: string, errs: Record<string, any>): string | undefined =>
        typeof errs?.[fieldName]?.message === 'string' ? errs?.[fieldName]?.message : undefined;

    const TestHandle = () => {
        navigate('/gallery')
    }

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            role="main">
            <Box alignItems='center'>
                <Text>{user.email} {user.first_name} {user.last_name}</Text>
            </Box>
            <Button
                mt={4}
                colorScheme='teal'
                type='submit'
                onClick={handleSubmit(TestHandle)}
            >
                Посмотреть галереи
            </Button>
        </Flex>

    );
}

export default UserPage
