import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

let db, auth;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    if (initialAuthToken) {
        await signInWithCustomToken(auth, initialAuthToken);
    } else {
        await signInAnonymously(auth);
    }
    console.log("Firebase initialized and user signed in.");

} catch (error) {
    console.error("Firebase initialization failed:", error);
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.innerHTML = "Sorry, We’re doing a little maintenance on our submission service.<br>Please reach out to us via Whatsapp.";
    }
}
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formStatus = document.getElementById('form-status');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        formStatus.textContent = 'Sending...';
        formStatus.style.color = 'gray';

        const name = contactForm.name.value;
        const email = contactForm.email.value;
        const message = contactForm.message.value;
        const timestamp = new Date();

        try {
            if (!db) {
                throw new Error("Database is not initialized.");
            }
            const messagesCollection = collection(db, `artifacts/${appId}/public/data/messages`);
            
            await addDoc(messagesCollection, {
                name: name,
                email: email,
                message: message,
                createdAt: timestamp
            });

            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.style.color = 'green';
            contactForm.reset();

        } catch (error) {
            console.error("Error adding document: ", error);
            formStatus.textContent = 'Sorry, there was an error sending your message. Please try again later.';
            formStatus.style.color = 'red';
        } finally {
            submitButton.disabled = false;
        }
    });
}