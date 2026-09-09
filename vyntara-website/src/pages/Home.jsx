import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import Solutions from '../components/Solutions/Solutions';
import Products from '../components/Products/Products';
import Portfolio from '../components/Portfolio/Portfolio';
import Technology from '../components/Technology/Technology';
import Process from '../components/Process/Process';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Solutions />
        <Products />
        <Portfolio />
        <Technology />
        <Process />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </>
  );
}

export default Home;