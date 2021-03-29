import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client'
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../services/stripe";

type User = {
    data: {
        stripe_customer_id: string;
    },
    ref: {
        id: string;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method not allowed');
    }

    const sessions = await getSession({ req });

    const user = await fauna.query<User>(
        q.Get(
            q.Match(
                q.Index('user_by_email'),
                q.Casefold(sessions.user.email),
            )
        )
    )

    let stripeCustomerId = user.data.stripe_customer_id;

    if (!stripeCustomerId) {
        const stripeCustomer = await stripe.customers.create({
            email: sessions.user.email
        });

        stripeCustomerId = stripeCustomer.id;

        await fauna.query(
            q.Update(
                q.Ref(
                    q.Collection('users'),
                    user.ref.id,
                ),
                {
                    data: {
                        stripe_customer_id: stripeCustomerId,
                    }
                }
            )
        )
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
            { price: "price_1IYicbGlGC4yaQ6ph0JZayQL", quantity: 1 }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({ sessionId: checkoutSession.id })
}