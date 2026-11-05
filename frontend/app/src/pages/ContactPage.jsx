// import { useState } from 'react';

// const EMPTY = { name: '', email: '', message: '' };

// function validate(values) {
//   const errors = {};
//   if (values.name.trim().length < 3) {
//     errors.name = 'Numele trebuie să aibă cel puțin 3 caractere.';
//   }
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
//     errors.email = 'Introduceți o adresă validă, de exemplu ion@exemplu.ro.';
//   }
//   if (values.message.trim().length < 10) {
//     errors.message = 'Mesajul trebuie să aibă cel puțin 10 caractere.';
//   }
//   return errors;
// }

// export default function ContactPage() {
//   const [values, setValues] = useState(EMPTY);
//   const [touched, setTouched] = useState({});
//   const [sent, setSent] = useState(false);

//   const errors = validate(values);
//   const isValid = Object.keys(errors).length === 0;
//   function handleChange(event) {
//     const { name, value } = event.target;
//     setValues({ ...values, [name]: value });
//     setSent(false);
//   }
//   function handleBlur(event) {
//     setTouched({ ...touched, [event.target.name]: true });
//   }
//   function handleSubmit(event) {
//     event.preventDefault();
//     if (!isValid) return;
//     console.log('Mesaj de trimis:', values);
//     setSent(true);
//     setValues(EMPTY);
//     setTouched({});
//   }
