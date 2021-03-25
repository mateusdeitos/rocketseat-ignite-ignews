
import styles from './styles.module.scss';
import React from 'react';

export const SubscribeButton: React.FC = ({ children }) => {
    return (
        <button
            type="button"
            className={styles.subscribeButton}
        >
            {children}
        </button>
    )
}