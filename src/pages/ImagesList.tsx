import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { Box, Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Heading, Input, InputGroup, InputRightElement, Icon, Stack, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Controller, FieldValues, SubmitHandler, UseFormRegisterReturn, useForm } from 'react-hook-form';
import { AnyARecord } from 'dns';
import axios from 'axios';
import { Link, Link as ReactRouterLink, useNavigate, useParams } from 'react-router-dom'
import { Link as ChakraLink, LinkProps, Image } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../store/Index';
import { clearCodesLogin } from '../store/UserLogin';
import { neuro_images } from '../services/Neuro';
import { FiFile } from 'react-icons/fi'
import { CallCreateImagesDetect, CallCreateImagesUpload, CallDeleteGallery, GetImages, resetImages } from '../store/ImageList';
import { resetGallery } from '../store/GalleryList';
import { ImageWithNames } from '../Types';


const ImagesList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { control, formState: { errors }, handleSubmit, register } = useForm()
    const { galleryId } = useParams()
    const images = useAppSelector(state => state.image_list);
    const dispatch = useAppDispatch();
    const [show, setShow] = React.useState(false);
    const [show_2, setShow2] = React.useState(false);

    const [urls, setUrls] = useState<string[]>([])
    const [urls2, setUrls2] = useState<string[]>([])
    const [values, setValues] = useState<Array<File>>([])
    const [values2, setValues2] = useState<Array<File>>([])


    const [image, setImage] = React.useState<ImageWithNames>({ url: '', names: [], created_at: '' });

    const navigate = useNavigate()

    const HandlerDetect = () => {
        if (values2.length) {
            let formData = new FormData();
            for (var i = 0; i < values2.length; i++) {
                formData.append("pics", values2[i]);
            }
            if (galleryId === undefined) {
                navigate('/gallery')
            }
            dispatch(CallCreateImagesDetect({ formData: formData, galleryId: galleryId || '' }))
            setUrls([])
            setValues([])
        }
    }
    const SetImageState = (img: ImageWithNames) => {
        setImage(img)
        onOpen()
    }
    const Handler = (data: FieldValues) => {
        if (values.length) {
            let formData = new FormData();
            for (var i = 0; i < values.length; i++) {
                formData.append("pics", values[i]);
                formData.append("names", data['name_' + String(i)]);
            }
            if (galleryId === undefined) {
                navigate('/gallery')
            }
            dispatch(CallCreateImagesUpload({ formData: formData, galleryId: galleryId || '' }))
            setUrls([])
            setValues([])
        }
    }

    const HandlerDelete = () => {
        dispatch(resetGallery())
        dispatch(CallDeleteGallery(galleryId || '')).then(
            () => navigate('/gallery')
        )
    }

    const TestHandle = () => {
        navigate('/gallery')
    }

    useEffect(() => {
        console.log(galleryId)
        dispatch(resetImages())
    }, [])

    useEffect(() => {
        if (!images.success && !images.is_error) {
            if (galleryId === undefined) {
                navigate('/gallery')
            }
            dispatch(GetImages(galleryId || ''))
        }
        else if (images.is_error) {
            console.log('Error')
        }
        else if (images.success) {
            console.log(images)
        }
    }, [images.success, images.is_error])

    const getErrorMessage = (fieldName: string, errs: Record<string, any>): string | undefined =>
        typeof errs?.[fieldName]?.message === 'string' ? errs?.[fieldName]?.message : undefined;

    const handleToggle = () => setShow(!show);
    const handleToggle2 = () => setShow2(!show_2);

    return (
        <Flex
            flexDirection="column"
            role="main"
            margin={30}
        >
            <Flex
                justifyContent='space-between'
            >

                <Button
                    mr={4}
                    colorScheme='teal'
                    type='submit'
                    onClick={handleSubmit(TestHandle)}
                >
                    Посмотреть галереи
                </Button>
                <Button onClick={HandlerDelete} colorScheme='red'>Удалить галерею</Button>
            </Flex>
            <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                background={'#87CEEB'}
            >
                <Button
                    mt={4}
                    colorScheme='teal'
                    type='submit'
                    onClick={handleToggle}
                >
                    Добавить известные изображения
                </Button>
                {show &&
                    <Flex direction={'column'}>
                        <Input
                            id='files'
                            onChange={
                                (e) => {
                                    setUrls((prevUrls) => [...prevUrls, ...Array.from(e.target.files ?? []).map((file) => URL.createObjectURL(file))])
                                    setValues((prevValues) => [...prevValues, ...Array.from(e.target.files ?? [])])
                                }
                            }
                            multiple={true}
                            type="file"
                            accept={'image/*'} />
                        <Stack
                            flexDirection="column"
                        >
                            {urls.map((url, index) => (
                                <FormControl isRequired isInvalid>
                                    <Image
                                        src={url}
                                        key={index}
                                        style={{
                                            flex: '1 1 0',
                                            width: '15vh',
                                        }}
                                        alt="loaded image"
                                    />
                                    <Controller
                                        {...register("name_" + String(index), {
                                            required: "Name is required",
                                            minLength: {
                                                value: 3,
                                                message: "Min is 3 symbols"
                                            }
                                        })}
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Input
                                                id={'name_' + String(index)}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                    <FormErrorMessage>
                                        {getErrorMessage("name_" + String(index), errors)}
                                    </FormErrorMessage>
                                </FormControl>

                            ))}
                        </Stack>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type='submit'
                            onClick={handleSubmit(Handler)}
                        >
                            Загрузить
                        </Button>
                    </Flex>
                }
            </Flex>
            <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                background={'#87CEEB'}
            >
                <Button
                    mt={4}
                    colorScheme='teal'
                    type='submit'
                    onClick={handleToggle2}
                >
                    Добавить изображения для распознания
                </Button>
                {show_2 &&
                    <Flex direction={'column'}>
                        <Input
                            id='files'
                            onChange={
                                (e) => {
                                    setUrls2((prevUrls) => [...prevUrls, ...Array.from(e.target.files ?? []).map((file) => URL.createObjectURL(file))])
                                    setValues2((prevValues) => [...prevValues, ...Array.from(e.target.files ?? [])])
                                }
                            }
                            multiple={true}
                            type="file"
                            accept={'image/*'} />
                        <Stack
                            flexDirection="column"
                        >
                            {urls2.map((url, index) => (
                                <FormControl isRequired isInvalid>
                                    <Image
                                        src={url}
                                        key={index}
                                        style={{
                                            flex: '1 1 0',
                                            width: '15vh',
                                        }}
                                        alt="loaded image"
                                    />
                                    <FormErrorMessage>
                                        {getErrorMessage("name_" + String(index), errors)}
                                    </FormErrorMessage>
                                </FormControl>

                            ))}
                        </Stack>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type='submit'
                            onClick={handleSubmit(HandlerDetect)}
                        >
                            Загрузить
                        </Button>
                    </Flex>
                }
            </Flex>
            <Flex alignItems='center'>
                {images.success && images.images &&
                    <Flex wrap={'wrap'} gap={5} marginTop={5}>
                        {
                            images.images.items.map(
                                (image) =>
                                    <Flex direction={'column'}>
                                        <Image
                                            boxSize="300px"
                                            objectFit="contain"
                                            src={image.url}
                                            alt={image.names.join(', ')}
                                            border={'solid'}
                                            borderColor={'black'}
                                            borderRadius={10}
                                            onClick={() => SetImageState(image)}

                                        />
                                        <Stack
                                            flexDirection="column"
                                        >
                                            {
                                                image.names.map((image, _) => (
                                                    <Text>{image}</Text>
                                                ))
                                            }
                                        </Stack>
                                    </Flex>
                            )
                        }

                    </Flex>
                }
                {images.is_error && <Text>{images.error_msg}</Text>}
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size={'5xl'} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody >
                        <Image

                            objectFit="contain"
                            src={image.url}
                            alt={image.names.join(', ')}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>

    );
}

export default ImagesList
