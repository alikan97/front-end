import { useState } from "react";

export enum ThemeTypes {
    success = "Success",
    warn = "Warning",
    error = "Error"
}
const Themes:AuthThemes = {
    Success: {
        backgroundColor: 'bg-green-200',
        iconColor: 'text-green-500', 
        title: 'Success Login',
        description: "Redirecting you to homepage..."
    },
    Warning: {
        backgroundColor: 'bg-yellow-200',
        iconColor: 'text-yellow-600',
        title: 'What ??',
        description: 'Not too sure if this happens'
    },
    Error: {
        backgroundColor: 'bg-red-200',
        title: 'Unauthorized',
        iconColor: 'text-red-500',
        description: "Review your inputs"
    }
};

type AuthThemes = {
    [key in ThemeTypes]: genericTheme
}

interface genericTheme {
    backgroundColor: string;
    iconColor: string;
    title: string;
    description?: string;
    [key: string]: any | undefined;
}

interface IProps {
    theme: ThemeTypes
}

const Alert = ({theme}: IProps) => {
    const [close, setClose] = useState(false);
    const AlertTheme = Themes[theme];
    
    return (
        <>
            {!close ?
            <div className={`relative flex flex-col sm:flex-row sm:items-center ${AlertTheme.backgroundColor} transition duration-400 ease-in-out shadow rounded-md py-5 pl-6 pr-8 sm:pr-6`}>
                <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                    <div className={`${AlertTheme.iconColor}`}>
                        {theme === ThemeTypes.success ? <svg className="w-6 sm:w-5 h-6 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> :
                        theme === ThemeTypes.warn ? <svg className="fill-current w-6 sm:w-5 h-6 sm:h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2L1 21z"/></svg> :
                        <svg className="fill-current w-6 sm:w-5 h-6 sm:h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7z" /></svg>}
                    </div>
                    <div className="text-sm font-medium ml-3">{AlertTheme.title}</div>
                </div>
                {AlertTheme.description ?
                <div className="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-4">{AlertTheme.description}</div>
                : null}
                <div className="absolute sm:relative sm:top-auto sm:right-auto ml-auto right-4 top-4 text-gray-400 hover:text-gray-800 cursor-pointer" onClick={() => setClose(!close)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
            </div> : null }
        </>
    );
}


export default Alert;