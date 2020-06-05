import React from 'react';
import { prependOnceListener } from 'cluster';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );}

export default Header;