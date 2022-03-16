
import styles from './styles.module.scss';
import React from 'react';
import { signIn, useSession } from 'next-auth/client';
import { Session } from 'next-auth'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-front';
import { useRouter } from 'next/router';


export const SubscribeButton: React.FC = ({ children }) => {
	const [session]: [Session & { activeSubscription?: object | null }, boolean] = useSession();
	const router = useRouter();

	const handleSubscribe = async () => {
		if (!session) {
			signIn('github');
			return;
		}

		if (session.activeSubscription) {
			router.push('/posts');
			return;
		}

		try {
			const response = await api.post('/subscribe')
			const { sessionId } = response.data;
			const stripe = await getStripeJs();

			stripe.redirectToCheckout({ sessionId });
		} catch (error) {
			alert(error.message);
		}

	}

	return (
		<button
			type="button"
			className={styles.subscribeButton}
			onClick={handleSubscribe}
		>
			{children}
		</button>
	)
}