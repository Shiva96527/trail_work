import React, { useEffect, useState } from "react";
import { Col, Row, Button, Form, Input, InputGroup, InputGroupText, Label } from 'reactstrap';
import { BsFillKeyFill, } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authenticateHTTP } from "../services/user-service";
import Logo from '../assets/img/logo.png';
import { useDispatch } from "react-redux";
import { setMenuItems, setUserInfo } from "../redux/slices/globalSlice";
import { getMenuItemsHTTP } from "../services/global-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
const appVersion = '2.0';

const Login = (props) => {
    const navigate = useNavigate();
    const [state, setState] = useState({ userName: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const rememberMeChecked = localStorage.getItem('rememberMe') === 'Yes';
        setRememberMe(rememberMeChecked);

        if (rememberMeChecked) {
            if (localStorage.getItem('loginDetails')) {
                const { userName, password } = JSON.parse(localStorage.getItem('loginDetails'));
                setState({ ...state, userName, password });
                submitHandler(null, { userName, password });
            }
        } else {
            localStorage.clear();
        }
        // eslint-disable-next-line
    }, [])

    const submitHandler = async (e, rememberCred) => {
        if (e)
            e.preventDefault();
        const payload = {
            MaxisId: state.userName || rememberCred?.userName,
            Password: state.password || rememberCred?.password,
            Production: ''
        }
        // if (process.env.REACT_APP_TROUBLESHOOT) {
        //     payload['Production'] = 'Troubleshoot';
        // }
        try {
            const { data } = await authenticateHTTP(payload);
            const { statusCode, statusMessage, Myosstoken, version, data: resultData } = data;
            debugger;

            if (statusCode === 200) {
                if (version === appVersion) {
                    sessionStorage.setItem('token', Myosstoken);
                    sessionStorage.setItem('userInfo', JSON.stringify(resultData));
                    sessionStorage.setItem('uiid', resultData?.LoginUIID);
                    sessionStorage.setItem('userDetails', JSON.stringify({ MaxisId: state.userName, Password: state.password }));
                    dispatch(setUserInfo({ token: Myosstoken, user: resultData }));
                    const { data: menuData } = await getMenuItemsHTTP({ Action: 'Grid', LoginUIID: resultData?.LoginUIID });
                    dispatch(setMenuItems(menuData?.data));
                    sessionStorage.setItem('menuItems', JSON.stringify(menuData?.data));
                    toast.success(statusMessage);

                    if (rememberMe) {
                        localStorage.setItem('loginDetails', JSON.stringify({ userName: state.userName, password: state?.password }));
                        localStorage.setItem('rememberMe', 'Yes');
                    }
                    navigate('/neptune');
                }
                else {
                    toast.warning("Please clear the browser cache to reflect new changes")
                }
            }
            else {
                toast.error(statusMessage);
            }

        } catch (e) {
            toast.error('System error.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    return (
        <>
            <div className="fullPage" >
                <div className="content" >
                    <div id="header">
                        <Row className="divider" /><br />
                        <Row className="divider" /><br />
                        <Form onSubmit={submitHandler}>
                            <Row className="justify-content-center">
                                <Row>
                                    <Col md={12} className="text-center">
                                        <img src={Logo} loading="lazy" height={'45px'} alt="logo" />
                                    </Col>
                                </Row>
                                <Col md={4} className="border rounded p-3 shadow login-panel">
                                    <Row>
                                        <Col md={12} className="text-center">
                                            <FontAwesomeIcon icon={faUserCircle} fontSize={"50px"} color="lightgray" />
                                        </Col>
                                    </Row>
                                    <InputGroup className="mt-2">
                                        <InputGroupText>
                                            <FaUserAlt />
                                        </InputGroupText>
                                        <Input name="userName"
                                            value={state.userName}
                                            onChange={handleInputChange} style={{ backgroundColor: 'white', color: 'Black' }} placeholder="Maxis ID">
                                        </Input>
                                    </InputGroup>
                                    <InputGroup className="mt-2">
                                        <InputGroupText>
                                            <BsFillKeyFill />
                                        </InputGroupText>
                                        <Input type="password" name="password"
                                            value={state.password}
                                            onChange={handleInputChange}
                                            placeholder="Password" style={{ backgroundColor: 'white', color: 'Black' }}>
                                        </Input>
                                    </InputGroup>
                                    <div className="text-center">
                                        <Input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(prevState => !prevState)} />&nbsp;<Label>Remember Me</Label><br />
                                        <Button style={{ width: '100%' }} type="submit" size="xl" color="primary">Sign in</Button><br />
                                        <div>V{appVersion}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login; 