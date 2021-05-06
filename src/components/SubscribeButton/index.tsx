import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './style.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export const SubscribeButton = ({priceId}: SubscribeButtonProps) => {
    const [session] = useSession()
    const {push} = useRouter()

    const handleSubscribe = async () => {
        if(!session) {
            signIn('gitHub')
            return
        }

        if(session.activeSubscription) {
            push('/posts')
            return;
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