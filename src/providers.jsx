import React from 'react';
import rtkstore from './redux/store';
import { Provider as ReduxProvider } from "react-redux";
import SocketContextProvider from './context/socket.context';
import GlobalErrorContextProvider from './context/global-alert';
import GlobalLoadingContextProvider from './context/loading';
import PageTitleContextProvider from './context/page-title';

const ProviderComposer = ({ contexts, children }) => {
    return contexts.reduceRight((kids, parent) => {
        return React.cloneElement(parent, { children: kids });
    }, children);
}

const ContextProvider = ({ children }) => {
    return (
        <ProviderComposer contexts={
            [ 
                <GlobalLoadingContextProvider />,
                <ReduxProvider store={rtkstore} />,
                <SocketContextProvider />,
                <GlobalErrorContextProvider />,
                <PageTitleContextProvider />
            ]
        }>
            {children}
        </ProviderComposer>
    )
}

export { ContextProvider };