import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { PageHeader } from "./PageHeader";
import { EmailCard, LocationCard } from "./ContactInfoCards";
import { SocialLinks } from "./SocialLinks";
import { ContactForm } from "./ContactForm";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen "
    style={{
  backgroundColor: "white",
  backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
  backgroundSize: "20px 20px",
}}>
      <Navbar />

      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <PageHeader />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <EmailCard />
            
              <LocationCard />
              <SocialLinks />
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
