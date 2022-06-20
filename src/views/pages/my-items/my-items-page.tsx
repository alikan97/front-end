import { useState } from "react";
import { useAuth } from "../../../hooks/use-auth";

const MyItemsPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<string>('');

    const auth = useAuth();

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        auth.addRoleToUser({Email: email, Role: role});
    }

    return (
        <>
                <div className="flex items-center justify-center h-screen sm:px-6 bg-gray-100">
                    <div className="w-full max-w-md p-4 bg-white rounded-md sm:p-6 transition duration-400">
                        <div className="flex items-center justify-center">
                            <span className="text-2xl font-medium text-gray-900">Add role to user</span>
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
                                    className={`block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input border-black-900 focus:border-green-600 'border-black-900`}
                                    required
                                />
                            </label>
                            <label htmlFor="password" className="block mt-3">
                                <span className="text-sm text-gray-700">Password</span>
                                <input
                                    type="text"
                                    id="text"
                                    name="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    autoComplete="current-password"
                                    className={`block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input border-black-900 focus:border-green-600 'border-black-900`}
                                    required
                                />
                            </label>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 text-l text-center text-black rounded-md hover:bg-green-600 hover:text-white transition duration-300 ease-in-out">
                                    Add role to user
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        </>
    );
}

export default MyItemsPage;