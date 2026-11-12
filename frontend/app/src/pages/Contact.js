import { useFormik } from "formik";
import * as Yup from "yup";

function Contact() {
  const formik = useFormik({
    initialValues: {
      nume: "",
      email: "",
      subiect: "",
      message: "",
    },
    validationSchema: Yup.object({
      nume: Yup.string().required("Numele este obligatoriu."),
      email: Yup.string()
        .email("Adresa de email nu este validă.")
        .required("Emailul este obligatoriu."),
      subiect: Yup.string()
        .min(5, "Subiectul trebuie să aibă cel puțin 5 caractere.")
        .required("Subiectul este obligatoriu."),
      message: Yup.string().required("Mesajul este obligatoriu."),
    }),
    onSubmit: (values) => {
      console.log(values);
      alert("Mesaj trimis!");
    },
    message: Yup.string()
  .required("Mesajul este obligatoriu.")
  .max(500, "Mesajul poate avea cel mult 500 de caractere."),
  });

  return (
    <div>
      <h1>Contact</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="nume">Nume</label>
        <input
          id="nume"
          name="nume"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.nume}
        />
        {formik.touched.nume && formik.errors.nume ? (
          <div>{formik.errors.nume}</div>
        ) : null}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}

        {/* === Noul câmp: Subiect === */}
        <label htmlFor="subiect">Subiect</label>
        <input
          id="subiect"
          name="subiect"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.subiect}
        />
        {formik.touched.subiect && formik.errors.subiect ? (
          <div>{formik.errors.subiect}</div>
        ) : null}

        <label htmlFor="message">Mesaj</label>
        <textarea
        
          id="message"
          name="message"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
        />
        {formik.touched.message && formik.errors.message ? (
          <div>{formik.errors.message}</div>
        ) : null}
        {/* Contorul de caractere */}
<p>{formik.values.message.length} / 500</p>

        <button type="submit">Trimite</button>
      </form>
    </div>
  );
}

export default Contact;