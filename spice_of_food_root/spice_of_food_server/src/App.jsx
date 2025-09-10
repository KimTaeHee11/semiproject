// import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import IngrePostApp from './pages/IngrePostApp';
import RecipePostApp from './pages/RecipePostApp';
import SignUp from './components/users/SignUp';
import MyPage from './components/users/MyPage';
import LoginModal from './components/users/LoginModal';
import LoginPage from './pages/LoginPage';
import { useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

function App() {
    const [showLogin, setShowLogin] = useState(false);

    const authUser = useAuthStore((s) => s.loginAuthUser);

    useEffect(() => {
        requestAuthUser();
    }, [authUser]);
    const requestAuthUser = async () => {
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            if (accessToken) {
                const response = await axiosInstance.get(`/auth/user`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const authUser = await response.data;
                authUser(authUser); //인증사용자 정보 전역 state에 설정 후 로딩상태 false
            }
        } catch (error) {
            console.error('accessToken 유효하지 않음: ', error);
            alert(error);
            sessionStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    return (
        <>
            <div className='container fluid py-5'>
                <BrowserRouter>
                    {/* <Row className='mb-3'>
                        {!authUser ? (
                            <>
                                <span className='me-3'>{authUser.name} 님</span>
                                <Button variant='outline-danger'>로그아웃</Button>
                            </>
                        ) : (
                            <>
                                <Button variant='outline-primary' className='me-2' onClick={() => setShowLogin(true)}>
                                    로그인
                                </Button>
                                <Button variant='outline-success' className='me-2' onClick={() => navigate('/signup')}>
                                    회원가입
                                </Button>
                            </>
                        )}
                    </Row> */}
                    <Row>
                        <Col className='mb-5'>
                            <Header />
                        </Col>
                    </Row>
                    <Row className='main'>
                        <Col xs={12} sm={4} md={4} lg={3} className='d-none d-sm-block mt-3'>
                            <LoginModal show={showLogin} setShowLogin={setShowLogin} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            {/* 라우트 */}
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/ingrePosts/*' element={<IngrePostApp />} />
                                <Route path='/recipePosts/*' element={<RecipePostApp />} />
                                <Route path='/mypage' element={<MyPage />} />
                                <Route path='/signup' element={<SignUp />} />

                                <Route path='/login' element={<LoginPage />} />
                            </Routes>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}></Col>
                    </Row>
                </BrowserRouter>
            </div>
            <Footer />
        </>
    );
}

export default App;
