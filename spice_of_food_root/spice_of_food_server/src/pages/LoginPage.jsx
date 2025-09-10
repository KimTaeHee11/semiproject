import React, { useState } from 'react';
import LoginModal from '../components/users/LoginModal';

export default function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);

    return <LoginModal show={showLogin} setShowLogin={setShowLogin} />;
}
