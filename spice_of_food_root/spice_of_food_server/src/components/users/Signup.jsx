import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({ name: '', email: '', passwd: '', passwdConfirm: '', role: 'USER' });
    const [email_checked, set_email_checked] = useState(false);
    const [checked_email_msg, set_checked_email_msg] = useState('');
    const [passwordMatchMsg, setPasswordMatchMsg] = useState(''); // 비밀번호 확인 메시지

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const pwRef = useRef(null);
    const pwConfirmRef = useRef(null);
    const roleRef = useRef(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 비밀번호 확인 입력시 실시간 체크
        if (name === 'passwdConfirm' || name === 'passwd') {
            if (name === 'passwdConfirm') {
                if (value !== formData.passwd) {
                    setPasswordMatchMsg('비밀번호가 일치하지 않습니다.');
                } else {
                    setPasswordMatchMsg('');
                }
            }
            if (name === 'passwd') {
                if (formData.passwdConfirm && value !== formData.passwdConfirm) {
                    setPasswordMatchMsg('비밀번호가 일치하지 않습니다.');
                } else {
                    setPasswordMatchMsg('');
                }
            }
        }
    };

    const check_email = async () => {
        const email = formData.email;

        if (!email.trim()) {
            alert('이메일을 입력하세요');
            emailRef.current?.focus();
            return;
        }

        try {
            const url = `http://localhost:7777/api/sign/check-email?email=${email}`;
            const response = await axios.get(url);
            if (response.data.available) {
                set_email_checked(true);
                set_checked_email_msg('사용 가능한 이메일입니다.');
            } else {
                set_email_checked(false);
                set_checked_email_msg('이미 사용 중인 이메일입니다.');
            }
        } catch (err) {
            console.error(err);
            set_email_checked(false);
            set_checked_email_msg('이메일 중복 체크 중 오류 발생');
        }
    };

    const check = () => {
        const { name, email, passwd, passwdConfirm, role } = formData;
        if (!name.trim()) {
            alert('이름을 입력하세요');
            nameRef.current?.focus();
            return false;
        }
        if (!email.trim()) {
            alert('이메일 입력하세요');
            emailRef.current?.focus();
            return false;
        }
        if (!email_checked) {
            alert('이메일 중복 체크를 해주세요');
            emailRef.current?.focus();
            return false;
        }
        if (!passwd.trim()) {
            alert('비밀번호 입력하세요');
            pwRef.current?.focus();
            return false;
        }
        if (!passwdConfirm.trim()) {
            alert('비밀번호 확인을 입력하세요');
            pwConfirmRef.current?.focus();
            return false;
        }
        if (passwd !== passwdConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            pwConfirmRef.current?.focus();
            return false;
        }
        if (!role.trim()) {
            alert('역할을 선택하세요');
            roleRef.current?.focus();
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!check()) return;

        try {
            const url = `http://localhost:7777/api/sign`;
            const postData = { ...formData };
            delete postData.passwdConfirm; // 서버에 보내지 않음

            const response = await axios.post(url, postData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                alert('회원가입을 완료했습니다. 로그인 페이지로 이동합니다');
                navigate('/');
            }
        } catch (error) {
            alert('서버 오류: ' + error.message);
        }
    };

    const handleReset = () => {
        setFormData({ name: '', email: '', passwd: '', passwdConfirm: '', role: 'USER' });
        set_email_checked(false);
        set_checked_email_msg('');
        setPasswordMatchMsg('');
    };

    const { name, email, passwd, passwdConfirm, role } = formData;

    return (
        <div className='container py-4' style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className='text-center my-4'>Signup</h1>
            <Form method='post' onSubmit={handleSubmit}>
                <Form.Group as={Row} className='mb-3'>
                    <Col sm={1} />
                    <Form.Label column sm={2}>
                        이름
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type='text'
                            name='name'
                            value={name}
                            ref={nameRef}
                            placeholder='Name'
                            onChange={handleChange}
                        />
                    </Col>
                    <Col sm={1} />
                </Form.Group>

                <Form.Group as={Row} className='mb-3'>
                    <Col sm={1} />
                    <Form.Label column sm={2}>
                        이메일
                    </Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            type='email'
                            name='email'
                            value={email}
                            ref={emailRef}
                            placeholder='Email'
                            onChange={handleChange}
                        />
                        {checked_email_msg && (
                            <div className={`mt-1 small ${email_checked ? 'text-success' : 'text-danger'}`}>
                                {checked_email_msg}
                            </div>
                        )}
                    </Col>
                    <Col sm={2} className='d-flex align-items-center ps-0'>
                        <Button
                            type='button'
                            variant='success'
                            onClick={check_email}
                            className='w-auto btn-sm'
                            style={{
                                whiteSpace: 'nowrap',
                                minWidth: '60px',
                                padding: '0.25rem 0.4rem',
                                fontSize: '0.70rem',
                                marginTop: '3px',
                            }}
                        >
                            중복체크
                        </Button>
                    </Col>
                    <Col sm={1} />
                </Form.Group>

                <Form.Group as={Row} className='mb-3'>
                    <Col sm={1} />
                    <Form.Label column sm={2}>
                        비밀번호
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type='password'
                            name='passwd'
                            value={passwd}
                            ref={pwRef}
                            placeholder='Password'
                            onChange={handleChange}
                        />
                    </Col>
                    <Col sm={1} />
                </Form.Group>

                <Form.Group as={Row} className='mb-3'>
                    <Col sm={1} />
                    <Form.Label column sm={2}>
                        비밀번호 확인
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type='password'
                            name='passwdConfirm'
                            value={passwdConfirm}
                            ref={pwConfirmRef}
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            isInvalid={passwordMatchMsg !== ''}
                        />
                        {passwordMatchMsg && <div className='text-danger small mt-1'>{passwordMatchMsg}</div>}
                    </Col>
                    <Col sm={1} />
                </Form.Group>

                {/* <Form.Group as={Row} className='mb-3'>
                    <Col sm={1} />
                    <Form.Label column sm={2}>
                        역 할
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Select name='role' value={role} ref={roleRef} onChange={handleChange}>
                            <option value=''>:::역할 선택::</option>
                            <option value='USER'>USER</option>
                            <option value='ADMIN'>ADMIN</option>
                        </Form.Select>
                    </Col>
                    <Col sm={1} />
                </Form.Group> */}

                <Row>
                    <Col className='d-flex justify-content-center gap-2'>
                        <Button type='submit' className='btn btn-outline-dark text-dark bg-white border-dark'>
                            회원가입
                        </Button>
                        <Button
                            type='button'
                            onClick={handleReset}
                            className='btn btn-outline-dark text-dark bg-white border-dark'
                        >
                            다시쓰기
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
