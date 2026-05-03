import { useState } from "react";
import Header from "../components/layout/Header";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Header setIsLoading={setIsLoading} />
      {/* <main>Keren</main> */}
      {/* <Footer /> */}
      <InteractiveBackground />
    </>
  );
}
