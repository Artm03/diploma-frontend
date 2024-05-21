import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { Box, Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Heading, Input, InputGroup, InputRightElement, Icon, Stack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Controller, FieldValues, SubmitHandler, UseFormRegisterReturn, useForm } from 'react-hook-form';
import { AnyARecord } from 'dns';
import axios from 'axios';
import { Link, Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink, LinkProps, Image } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../store/Index';
import { clearCodesLogin } from '../store/UserLogin';
import { neuro_images } from '../services/Neuro';
import { FiFile } from 'react-icons/fi'
import { CallCreateGallery, GetGalleries, resetGallery } from '../store/GalleryList';


const GalleryList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { control, formState: { errors }, handleSubmit, register, reset } = useForm()
    const user = useAppSelector(state => state.user_profile);
    const [show, setShow] = React.useState(false);
    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const getErrorMessage = (fieldName: string, errs: Record<string, any>): string | undefined =>
        typeof errs?.[fieldName]?.message === 'string' ? errs?.[fieldName]?.message : undefined;
    const galleries = useAppSelector(state => state.gallery_list);

    useEffect(() => {
        if (!galleries.success && !galleries.is_error) {
            dispatch(GetGalleries())
        }
        else if (galleries.is_error) {
            console.log('Error')
        }
        else if (galleries.success) {
            console.log(galleries)
        }
    }, [galleries.success, galleries.is_error])

    const Handler = (data: FieldValues) => {
        dispatch(CallCreateGallery({ name: data.name, description: data.description }))
        reset()
        onClose()
    }
    const RouteGallery = (gallery_id: string) => {
        console.log(gallery_id)
        navigate(`/images/${gallery_id}`)
    }


    const handleToggle = () => setShow(!show);
    return (
        <Flex
            flexDirection="column"
            margin={30}
            role="main"
        >
            <Flex
                justifyContent="right"
                alignItems="flex-end"
                flexDirection="column"
            >
                <Button onClick={onOpen} colorScheme='teal'>Создать галерею</Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Создать галерею</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <Flex>
                        <FormControl isRequired isInvalid>
                            <FormLabel>Имя</FormLabel>
                            <Controller
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Min is 3 symbols"
                                    }
                                })}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Input
                                        id='name'
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                            <FormErrorMessage>
                                {getErrorMessage('name', errors)}
                            </FormErrorMessage>

                            <FormLabel>Описание</FormLabel>
                            <Controller
                                {...register("description")}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Input
                                        id='description'
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                            <FormErrorMessage>
                                {getErrorMessage('description', errors)}
                            </FormErrorMessage>


                        </FormControl>
                    </Flex>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme='red'
                                mr={4}
                                mt={4}
                                onClick={onClose}
                            >
                                Закрыть
                            </Button>
                            <Button
                                mt={4}
                                colorScheme='teal'
                                type='submit'
                                onClick={handleSubmit(Handler)}
                            >
                                Создать
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Flex>
            <Flex alignItems='center'>
                {galleries.success && galleries.galleries &&
                    <Flex wrap={'wrap'} gap={5} marginTop={5}>
                        {
                            galleries.galleries.items.map(
                                (gallery) =>
                                    <Stack>
                                        <ChakraLink as={Link} to={`/images/${gallery.id}`}>
                                            <Image
                                                boxSize="250px"
                                                objectFit="cover"
                                                src={gallery.url}
                                                fallbackSrc='https://via.placeholder.com/150'
                                            />
                                        </ChakraLink>
                                        <Text fontWeight={'bold'}>Название</Text>
                                        <Text>{gallery.name}</Text>
                                        <Text fontWeight={'bold'}>Описание</Text>
                                        <Text>{gallery.description}</Text>
                                    </Stack>
                            )
                        }
                    </Flex>
                }
                {galleries.is_error && <Text>{galleries.error_msg}</Text>}
            </Flex>
        </Flex>
    );
}

export default GalleryList
