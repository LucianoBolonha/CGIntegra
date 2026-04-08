export default function HomePage() {
  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <p className="welcome-eyebrow">CGintegra</p>
        <h1>Bem-vindo ao CGintegra</h1>
        <p className="welcome-description">
          Plataforma para organizar o ciclo documental entre Pitch, PRD, RFC e
          implementacao com mais clareza, rastreabilidade e governanca.
        </p>
        <a className="welcome-button" href="/login">
          Fazer login
        </a>
      </section>
    </main>
  );
}
