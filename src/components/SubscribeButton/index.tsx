
import styles from './styles.module.scss';
import React from 'react';

interface SubscribeButtonProps {
    priceId: string;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ children, priceId }) => {
    return (
        <button
            type="button"
            className={styles.subscribeButton}
        >
            {children}
        </button>
    )
}