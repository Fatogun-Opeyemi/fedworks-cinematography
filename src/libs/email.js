import emailjs from '@emailjs/browser'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// export function sendContactEmail(form) {
//     return emailjs.sendForm(
//         serviceId,
//         templateId,
//         form,
//         {
//             publicKey,
//         }
//     )
// }
export function sendContactEmail(form) {
    return emailjs
        .sendForm(
            serviceId,
            templateId,
            form,
            {
                publicKey,
            }
        )
        .then((response) => {
            console.log('EmailJS SUCCESS:', response.status, response.text)
            return response
        })
        .catch((error) => {
            console.error('EmailJS FAILED:', error)
            throw error
        })
}