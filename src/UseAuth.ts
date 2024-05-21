import {useEffect, useState} from 'react';
import { useAppDispatch, useAppSelector } from './store/Index';
import { jwtDecode } from "jwt-decode";
import {registry_service} from './services/Auth';
import {useNavigate} from 'react-router-dom';
import { GetUserMe } from './store/UserMe';

export const useAuth = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.user_profile);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        const verifyTokens = async () => {
            const accessToken = localStorage.getItem('user') ?? '';

            let jwtInfo = jwtDecode(accessToken);

            if(!jwtInfo || (jwtInfo.exp?? Date.now()) < (Date.now() - 10_000)) {
                try {
                    await registry_service.refresh();
                } catch(err) {
                    setIsError(() => true);
                    return;
                }
            }

            if (!state.success) {
                try {
                    dispatch(GetUserMe());
                } catch(err) {
                    setIsError(() => true);
                    return;
                }
            }

            setIsLoading(() => false);
        }

        verifyTokens();
    });

    useEffect(() => {
        if (isError) {
            navigate('/')
        }
    }, [isError])

    return isLoading;
}
