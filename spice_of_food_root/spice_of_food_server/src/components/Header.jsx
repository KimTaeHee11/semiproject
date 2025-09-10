import React, { useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
    const navigate = useNavigate();

    const authUser = useAuthStore((state) => state.authUser);
    const setAuthUser = useAuthStore((state) => state.loginAuthUser);

    const logout = () => {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthUser(null); // 전역 상태 초기화
        navigate('/'); // 로그아웃 후 홈으로 이동
    };

    return (
        <Navbar collapseOnSelect expand='lg' className='bg-body-tertiary' fixed='top' bg='dark' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand as={Link} to='/' style={{ color: 'orange', fontWeight: 'bold' }}>
                    Spice Of Food
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav>
                        <Nav.Link as={Link} to='/'>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to='/recipePosts'>
                            레시피
                        </Nav.Link>
                        <Nav.Link as={Link} to='/ingrePosts'>
                            식재료
                        </Nav.Link>
                        <Nav.Link eventKey={2} as={Link} to='/mypage'>
                            마이페이지
                        </Nav.Link>
                    </Nav>
                    <Nav className='ms-auto align-items-center'>
                        {authUser ? (
                            <>
                                <span className='me-3' style={{ color: 'white' }}>
                                    {authUser.name} 님
                                </span>
                                <Button variant='outline-danger' onClick={logout}>
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant='outline-primary' className='me-2' onClick={() => navigate('/login')}>
                                    로그인
                                </Button>
                                <Button variant='outline-primary' onClick={() => navigate('/signup')}>
                                    회원가입
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
