import contacts from "@/lib/data/raw/contact";
import ContactCard from "./contact-card";

export default function ContactInfos({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      {contacts.map((contact, index) => (
        <ContactCard key={index} emuted={emuted} contact={contact} />
      ))}
    </div>
  );
}
