import React from 'react';
import { Link } from 'react-router-dom';
import { staticLinkStyles } from '../../constants/styles';
import "./header.css"

const Header: React.FC = () => {
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
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/login"> Login </Link>
                    </li>
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/register"> Register </Link>
                    </li>
                </span>
            </ul>
        </header>
    );
}

export default Header;

