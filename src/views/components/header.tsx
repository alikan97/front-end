import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { getAllItemsAction } from '../../stores/actions/item-actions';
import { Link } from 'react-router-dom';
import { staticLinkStyles } from '../../constants/link-text-styles';
import "./header.css"

const Header: React.FC = () => {
    const dispatch = useAppDispatch();

    const items = useAppSelector((state) => state.item);
    const HandleClick = () => dispatch(getAllItemsAction());

    return (
        <header className='header'>
            <ul className='header-list'>
                <h4 className='header-title'>
                    <Link style={staticLinkStyles} to="/"> Myapp </Link>
                </h4>
                <span className='header-column'>
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/"> All Items </Link>
                    </li>
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/request-item"> Request Item </Link>
                    </li>
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/my-items"> My Items </Link>
                    </li>
                    <li className='header-list-item' onClick={() => console.log(items)}>
                        <Link style={staticLinkStyles} to="/login"> Login </Link>
                    </li>
                    <li className='header-list-item' onClick={() => { HandleClick() }}>
                        <Link style={staticLinkStyles} to="/register"> Register </Link>
                    </li>
                </span>
            </ul>
        </header>
    );
}

export default Header;

