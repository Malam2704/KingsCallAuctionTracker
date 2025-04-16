import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../../services/firebase';

function EmailVerification() {
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmailWithCode = async () => {
            // Get the action code from the URL
            const queryParams = new URLSearchParams(location.search);
            const actionCode = queryParams.get('oobCode');

            if (!actionCode) {
                setVerifying(false);
                setError('Invalid verification link. No verification code found.');
                return;
            }

            try {
                await verifyEmail(actionCode);
                setSuccess(true);
                setVerifying(false);
            } catch (error) {
                setError('Email verification failed. The link may have expired or already been used.');
                setVerifying(false);
            }
        };

        verifyEmailWithCode();
    }, [location]);

    const handleContinue = () => {
        navigate('/login');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Email Verification</h1>

                {verifying && (
                    <div className="text-center py-4">
                        <svg className="animate-spin mx-auto h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2">Verifying your email...</p>
                    </div>
                )}

                {success && (
                    <div className="text-center">
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                            <p>Your email has been successfully verified!</p>
                        </div>
                        <button
                            onClick={handleContinue}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            Continue to Login
                        </button>
                    </div>
                )}

                {error && (
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                            <p>{error}</p>
                        </div>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            Go Back to Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmailVerification;