export default function ErrorPage({ message = "Terjadi kesalahan" }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{message}</p>
      {/* Bisa pakai useRouteError() kalau integrate dgn react-router */}
    </div>
  );
}
