import React from 'react';
import { Link } from 'react-router-dom';
import { staticLinkStyles } from '../../constants/styles';
import { useAuth } from '../../hooks/use-auth';
import { AuthStatus } from '../../types/auth';
import "./header.css"

const Header: React.FC = () => {
    const auth = useAuth();
    
    const handleLogout = async () => {
        await auth.signOut();
        window.location.reload();
    }

    return (
        <header className='header'>
            <ul className='header-list'>
                <h4 className='header-title'>
                    <Link style={staticLinkStyles} to="/"> Myapp </Link>
                </h4>
                <span className='header-column'>
                {auth.state?.status === AuthStatus.AUTHENTICATED ?
                    <h5 className='inline-block px-10 py-15'>
                        Welcome <strong>{auth.state.userInfo.userName} : {auth.state.userInfo.userEmail}</strong>
                    </h5> :
                    null}
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/"> All Items </Link>
                    </li>
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/create-item"> Create Item </Link>
                    </li>
                    {auth.state?.status === AuthStatus.AUTHENTICATED && auth.state.userInfo.hasRoleFunction("Admin") ?
                        <li className='header-list-item'>
                            <Link style={staticLinkStyles} to="/add-role"> Add Roles </Link>
                        </li>
                        : null}
                    {auth.state?.status === AuthStatus.AUTHENTICATED ?
                        <li className='header-list-item'>
                            <Link style={staticLinkStyles} onClick={handleLogout} to="/"> Logout </Link>
                        </li> :
                        <li className='header-list-item'>
                            <Link style={staticLinkStyles} to="/login"> Login </Link>
                        </li>
                    }
                    <li className='header-list-item'>
                        <Link style={staticLinkStyles} to="/register"> Register </Link>
                    </li>
                </span>
            </ul>
        </header>
    );
}

export default Header;

