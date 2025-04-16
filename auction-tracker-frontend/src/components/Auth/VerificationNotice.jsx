import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendVerificationEmail } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

function VerificationNotice() {
    const { currentUser } = useAuth();
    const [resendStatus, setResendStatus] = useState('');
    const [isResending, setIsResending] = useState(false);

    const handleResendVerification = async () => {
        if (!currentUser) return;

        try {
            setIsResending(true);
            await sendVerificationEmail(currentUser);
            setResendStatus('success');
        } catch (error) {
            setResendStatus('error');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h1>

                <div className="mb-6">
                    <p className="mb-4">
                        We've sent a verification email to <strong>{currentUser?.email}</strong>.
                        Please check your inbox and click the verification link to complete your registration.
                    </p>
                    <p className="mb-4">
                        If you don't see the email, please check your spam folder.
                    </p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className={`w-full ${isResending ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded flex justify-center items-center`}
                    >
                        {isResending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resending...
                            </>
                        ) : (
                            'Resend Verification Email'
                        )}
                    </button>

                    {resendStatus === 'success' && (
                        <p className="text-green-600 text-sm mt-2">
                            Verification email has been resent!
                        </p>
                    )}

                    {resendStatus === 'error' && (
                        <p className="text-red-600 text-sm mt-2">
                            Failed to resend verification email. Please try again later.
                        </p>
                    )}
                </div>

                <div className="text-center text-sm">
                    <Link to="/login" className="text-blue-500 hover:text-blue-700">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VerificationNotice;