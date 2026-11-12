import { useState } from 'react';
import PageTitle from '../components/PageTitle';

const initialValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  }

  function validateForm(nextValues = values) {
    const nextErrors = {};

    if (!nextValues.subject.trim()) {
      nextErrors.subject = 'Câmpul Subiect este obligatoriu.';
    } else if (nextValues.subject.trim().length < 5) {
      nextErrors.subject = 'Subiectul trebuie să aibă cel puțin 5 caractere.';
    }

    if (nextValues.message.length > 500) {
      nextErrors.message = 'Mesajul trebuie să aibă cel mult 500 de caractere.';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      alert('Mesajul a fost trimis cu succes!');
      setValues(initialValues);
      setErrors({});
    }
  }

  return (
    <section>
      <PageTitle
        title="Contact"
        subtitle="Ne puteți contacta pentru informații sau colaborări."
      />

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Nume
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Numele dumneavoastră"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </label>

          <label>
            Subiect
            <input
              type="text"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              placeholder="Subiectul mesajului"
              minLength={5}
              required
            />
            {errors.subject && <small className="status status-error">{errors.subject}</small>}
          </label>

          <label>
            Mesaj
            <textarea
              name="message"
              value={values.message}
              onChange={handleChange}
              placeholder="Scrieți mesajul dumneavoastră..."
              rows="5"
              maxLength={500}
              required
            />
            <small>{values.message.length} / 500</small>
            {errors.message && <small className="status status-error">{errors.message}</small>}
          </label>
        </div>

        <button type="submit">Trimite</button>
      </form>
    </section>
  );
}
