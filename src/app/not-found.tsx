import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header onHome={false} />
      <main id="main" className="not-found">
        <span id="top" />
        <div className="container">
          <p className="not-found__code" aria-hidden="true">404</p>
          <h1 className="not-found__title">This page is <em>not in our lesson plan.</em></h1>
          <p className="not-found__text">The page you are looking for does not exist. · ไม่พบหน้าที่คุณค้นหา</p>
          <a className="btn btn--primary" href="/">Back to NEW LESSON</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
