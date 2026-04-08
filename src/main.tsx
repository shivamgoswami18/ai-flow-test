import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';
import AppRoutes from './routes/AppRoutes.tsx';
import { BrowserRouter } from 'react-router-dom';
import RootWrapper from './services/RootWrapper.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/index.ts';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RootWrapper>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </RootWrapper>
            </PersistGate>
        </Provider>
    </StrictMode>
);
