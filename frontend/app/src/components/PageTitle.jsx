export default function PageTitle({ title, subtitle }) {
 return (
  <>
   <h1>{title}</h1>
   <p className="subtitle">{subtitle}</p>
  </>
 );
}