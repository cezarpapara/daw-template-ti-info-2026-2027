export default function PageTitle({ title, subtitle }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    );
}