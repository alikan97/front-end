import { useState } from "react";
import { createItemResponse } from "../../types/responses/create-item-response";

//refactor
const Themes: ModalTheme = {
    Success: {
        backgroundColor: 'bg-green-200',
        iconColor: 'text-green-500',
        title: 'Item created',
        description: "Item was successfully created"
    },
    Error: {
        backgroundColor: 'bg-red-200',
        title: 'Error',
        iconColor: 'text-red-500',
        description: "Could not create item"
    }
};

export enum ModalThemes {
    success = "Success",
    error = "Error"
}

type ModalTheme = {
    [key in ModalThemes]: genericTheme
}

interface genericTheme {
    backgroundColor: string;
    iconColor: string;
    title: string;
    description?: string;
    [key: string]: any | undefined;
}

interface IProps {
    theme: ModalThemes
    modalState: boolean,
    setModalState: React.Dispatch<React.SetStateAction<boolean>>,
    title?: string,
    description?: createItemResponse,
}

const Modal = ({ theme, title, description, modalState, setModalState }: IProps) => {
    const selectedTheme = Themes[theme];

    return (
        <div aria-hidden={modalState} className={`${modalState === false ? 'hidden' : null} flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal transition-opacity`}>
            <div className="md:w-1/5 sm:w-full rounded-lg shadow-lg bg-white my-3">
                <div className={`flex flex-col ${selectedTheme.backgroundColor} items-left border-b border-gray-100 px-5 py-4`}>
                    <div className={`${selectedTheme.iconColor} inline-flex `}>
                        {theme === ModalThemes.success ?
                            <svg className="w-6 sm:w-5 h-6 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> :
                            <svg className="fill-current w-6 sm:w-5 h-6 sm:h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7z" /></svg>
                        }
                    <span className="font-bold ml-4 text-gray-700 text-lg">{title ?? selectedTheme.title}</span>
                    </div>
                    {theme === ModalThemes.success ?
                        <div className="items-left mt-4">
                            <p className="font-bold text-sm py-2 text-gray-600"> Item Name: {description?.name}</p>
                            <p className="font-bold text-sm py-2 text-gray-600"> Category: {description?.category} </p>
                            <p className="font-bold text-sm py-2 text-gray-600"> Price: {description?.price} </p>
                            <p className="font-bold text-sm py-2 text-gray-600"> Id: {description?.id} </p>
                            <p className="font-bold text-sm py-2 text-gray-600"> CreatedAt: {description?.createdDate} </p>
                        </div> 
                        : <div className="mt-4"> <span> {selectedTheme.description} </span> </div>
                  }
                    <div className="py-2 mt-4 px-2 w-fit bg-black rounded-md">
                        <button onClick={() => setModalState(!modalState)} className="text-m text-black-700 text-white hover:text-gray-600 transition duration-150">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Modal;