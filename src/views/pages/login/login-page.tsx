import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/use-auth";
import { AuthStatus } from "../../../types/auth";
import Alert, { ThemeTypes } from "../../components/alerts";
import Spinner from "../../components/spinner";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await auth.signIn({ Emai: email, Password: password });
    }

    useEffect(() => {
        if (auth.state?.status === AuthStatus.AUTHENTICATED) {
            setTimeout(() => navigate('/'), 1500);
        }
    }, [auth.state]);

    return (
        <>
            {auth.loading ? <Spinner /> :
                <div className="flex items-center justify-center h-screen sm:px-6 bg-gray-100">
                    <div className="w-full max-w-md p-4 bg-white rounded-md sm:p-6 transition duration-400">
                        {auth.state?.status === AuthStatus.AUTHENTICATED ? <Alert theme={ThemeTypes.success} /> :
                            auth.state?.status === AuthStatus.NOT_AUTHENTICATED ? <Alert theme={ThemeTypes.warn} /> :
                                auth.state?.status === AuthStatus.AUTHENTICATION_FAILED ? <Alert theme={ThemeTypes.error} /> : null}
                        <div className="flex items-center justify-center">
                            <span className="text-2xl font-medium text-gray-900">Login</span>
                        </div>
                        <form className="mt-4" onSubmit={(e) => handleSubmit(e)}>
                            <label htmlFor="email" className="block">
                                <span className="text-sm text-gray-700">Email</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input border-black-900 focus:border-green-600 ${auth.state?.status === AuthStatus.AUTHENTICATION_FAILED || auth.state?.status === AuthStatus.NOT_AUTHENTICATED ? 'border-red-700' : 'border-black-900'}`}
                                    required
                                />
                            </label>
                            <label htmlFor="password" className="block mt-3">
                                <span className="text-sm text-gray-700">Password</span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className={`block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input border-black-900 focus:border-green-600 ${auth.state?.status === AuthStatus.AUTHENTICATION_FAILED || auth.state?.status === AuthStatus.NOT_AUTHENTICATED ? 'border-red-700' : 'border-black-900'}`}
                                    required
                                />
                            </label>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="text-indigo-600 border form-checkbox transition duration-200"
                                        />
                                        <span className="mx-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                </div>
                                <div>
                                    <a
                                        className="block text-sm text-indigo-700 hover:underline"
                                        href="/register"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 text-l text-center text-black rounded-md hover:bg-green-600 hover:text-white transition duration-300 ease-in-out">
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
};

export default LoginPage;
