import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/use-auth";
import { registerFailed, registerSuccess } from "../../../types/responses/registration-response";
import Alert, { ThemeTypes } from "../../components/alerts";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedRoles, setSelectedRoles] = useState<Array<string>>([]);
    const [success, setSuccess] = useState<registerSuccess>();
    const [errors, setErrors] = useState<registerFailed>();

    const auth = useAuth();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const request = {
            Email: email,
            FullName: name,
            Password: password,
            Roles: selectedRoles
        };

        const registerRequest = await auth.register(request);
        if ((registerRequest as registerSuccess).id) setSuccess(registerRequest as registerSuccess);
        if ((registerRequest as registerFailed).status) setErrors(registerRequest as registerFailed);
    }

    const objToString = (obj: Record<string, Array<string>>):string => {
        let finalStr = "";
        Object.entries(obj).forEach(([key, value]) => {
            finalStr += ("\n" + key +": " + value);
        });
        return finalStr;
    }

    return (
        <div className="flex justify-center min-h-screen text-gray-900 bg-gray-100">
            <div className="flex justify-center flex-1 max-w-screen-xl m-0 bg-white shadow sm:m-20 sm:rounded-lg">
                <div className="flex-1 hidden text-center bg-indigo-100 lg:flex">
                    <div className="w-full m-12 bg-center bg-no-repeat bg-contain xl:m-16"></div>
                </div>
                <div className="p-6 lg:w-1/2 xl:w-5/12 sm:p-12">
            {errors?.status ? <Alert theme={ThemeTypes.error} title="Registration failed" description={objToString(errors.errors)}/> :
                success?.id ? <Alert theme={ThemeTypes.success} title="Registration succesful" description={`User ${success?.id} successfully created`} /> : null} 
                    <div className="flex flex-col items-center mt-4">
                        <h1 className="text-2xl font-extrabold xl:text-3xl">
                            Sign up
                        </h1>
                        <div className="flex-1 w-full mt-8">
                            <div className="flex flex-col items-center">
                                <button
                                    className="flex items-center justify-center w-full max-w-xs py-3 font-bold text-gray-800 transition-all duration-300 ease-in-out bg-green-100 rounded-lg shadow-sm focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                                    <div className="p-2 bg-white rounded-full">
                                        <svg className="w-4" viewBox="0 0 533.5 544.3">
                                            <path
                                                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                                fill="#4285f4" />
                                            <path
                                                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                                fill="#34a853" />
                                            <path
                                                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                                fill="#fbbc04" />
                                            <path
                                                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                                fill="#ea4335" />
                                        </svg>
                                    </div>
                                    <span className="ml-4">
                                        Sign Up with Google
                                    </span>
                                </button>

                                <button
                                    className="flex items-center justify-center w-full max-w-xs py-3 mt-5 font-bold text-gray-800 transition-all duration-300 ease-in-out bg-green-100 rounded-lg shadow-sm focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                                    <div className="p-1 bg-white rounded-full">
                                        <svg className="w-6" viewBox="0 0 32 32">
                                            <path d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z" />
                                        </svg>
                                    </div>
                                    <span className="ml-4">
                                        Sign Up with GitHub
                                    </span>
                                </button>
                            </div>

                            <div className="my-12 text-center border-b">
                                <div
                                    className="inline-block px-2 text-sm font-medium leading-none tracking-wide text-gray-600 transform translate-y-1/2 bg-white">
                                    Or sign up with e-mail
                                </div>
                            </div>
                            <form onSubmit={(e) => { handleRegister(e) }}>
                                <div className="max-w-xs mx-auto">
                                    <input
                                        className="w-full px-6 py-4 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <input
                                        className="w-full px-6 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        required
                                    />
                                    <input
                                        className="w-full px-6 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        required
                                    />
                                    <fieldset className="space-y-3 mt-2">
                                        <legend className="text-md font-bold text-gray-900">Roles</legend>
                                        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6">
                                            <div className="inline-flex items-center space-x-1.5">
                                                <input
                                                    id="private"
                                                    type="checkbox"
                                                    checked={selectedRoles.includes("Admin")}
                                                    onChange={() => selectedRoles.includes("Admin") ? setSelectedRoles(selectedRoles.filter((role) => role !== "Admin")) : setSelectedRoles([...selectedRoles, "Admin"])}
                                                    className="cursor-pointer rounded border-gray-300 text-blue-600 transition focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75" />
                                                <label htmlFor="private" className="cursor-pointer truncate text-xs font-medium text-gray-500"> Admin </label>
                                            </div>
                                            <div className="inline-flex items-center space-x-1.5">
                                                <input
                                                    id="basic"
                                                    type="checkbox"
                                                    checked={selectedRoles.includes("Dev")}
                                                    onChange={() => selectedRoles.includes("Dev") ? setSelectedRoles(selectedRoles.filter((role) => role !== "Dev")) : setSelectedRoles([...selectedRoles, "Dev"])}
                                                    className="cursor-pointer rounded border-gray-300 text-blue-600 transition focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75" />
                                                <label htmlFor="basic" className="cursor-pointer truncate text-xs font-medium text-gray-500"> Dev </label>
                                            </div>
                                            <div className="inline-flex items-center space-x-1.5">
                                                <input
                                                    id="public"
                                                    type="checkbox"
                                                    checked={selectedRoles.includes("Customer")}
                                                    onChange={() => selectedRoles.includes("Customer") ? setSelectedRoles(selectedRoles.filter((role) => role !== "Customer")) : setSelectedRoles([...selectedRoles, "Customer"])}
                                                    className="cursor-pointer rounded border-gray-300 text-blue-600 transition focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75" />
                                                <label htmlFor="public" className="cursor-pointer truncate text-xs font-medium text-gray-500"> Customer </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <button
                                        className="flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out bg-green-600 rounded-lg hover:bg-green-800 focus:shadow-outline focus:outline-none"
                                        type="submit">
                                        <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor">
                                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <path d="M20 8v6M23 11h-6" />
                                        </svg>
                                        <span className="ml-3">
                                            Sign Up
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default RegisterPage;