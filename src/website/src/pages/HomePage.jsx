import Header from "../components/Header";
import SearchDropdown from "../components/SearchDropdown";

function HomePage() {
  return (
    <div className="page">
      <Header />

      <section className="hero">
        <div className="hero-inner">
          <h2 className="hero-title">Learn more about local government</h2>

          <p className="hero-subtitle">
            Select a town or city from the dropdown below to see its elected
            offices, incumbents, clerk information, and more.
          </p>

          <SearchDropdown />
        </div>
      </section>

      <main className="project-description">
        <section className="content">
          <h2>What is MADemocracy?</h2>

          <p>
            A project to collect information about every elected position in
            every city and town in Massachusetts into one place.
          </p>

          <h2>Why are we doing this?</h2>

          <p>
            We believe that good governance begins with competitive elections,
            but many local races go uncontested. By gathering information about
            what seats are up for election next year and what the requirements
            are to run, we can begin to see where MA citizens can step into
            community and power. Wait, does this already exist? No, there is no
            one publicly-accessible place to look up all elected positions in
            MA, especially municipal (local/city/town-based elections)
          </p>

          <h2>How are we doing this?</h2>
          <p>
            The project is entirely run by volunteers. We have a small team of
            organizers, a few developers who maintain our home page and
            data-entry site, and a team that searches the internet for
            information to add to the hub. If you're interested in volunteering,
            please reach out to us at{" "}
            <a href="mailto:mademocracyhub@gmail.com?subject=Interested%20in%20Volunteering%20for%20MA%20Democracy">
              mademocracyhub@gmail.com
            </a>{" "}
            with your name and how you'd like to help. .
          </p>

          <h2>
            I'm part of another organization, can we use this data or
            collaborate?
          </h2>

          <p>
            Yes! We're actively interested in collaborating with other
            organizations that support democracy and civic engagement. Please
            reach out to us at{" "}
            <a href="mailto:mademocracyhub@gmail.com?subject=Collaboration%20Inquiry">
              mademocracyhub@gmail.com
            </a>{" "}
            with your organization's details and how you'd like to collaborate.
          </p>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
