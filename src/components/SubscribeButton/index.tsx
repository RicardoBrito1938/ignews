import { signIn, useSession } from 'next-auth/client'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './style.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export const SubscribeButton = ({priceId}: SubscribeButtonProps) => {
    const [session] = useSession()

    const handleSubscribe = async () => {
        if(!session) {
            signIn('gitHub')
            return
        }

        try {
            const {data} = await api.post('/subscribe')

            const {sessionId} = data

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId})
        } catch (error) {
            alert(error)
        }        
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}