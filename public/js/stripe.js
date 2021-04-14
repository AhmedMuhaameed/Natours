import axios from 'axios';
import {showAlert} from './alert.js';
const stripe = Stripe(
  'pk_test_51IfNybKKe1orXVA5kmFqvnyODCKq8m3eggTNcvB3i2X6hzGoCe8dbOk9BViMfCTaSYBfwqWkt2wGdoORiuKmWYQu00EhpNFnqe'
);

export const bookTour = async (tourId) => {
    try{

        //1)get the session from the server
        const session = await axios(
          `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );
        console.log(session);
        //2)create checkout form  + charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    }
    catch(err){
        showAlert('error',err);
    }
};
