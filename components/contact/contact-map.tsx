
export default function ContactMap({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="bg-accent rounded-lg h-96 overflow-hidden">
      {emuted ? (
        <img
          src={emuted ? "/placeholder.svg" : "/tat-global-office-team.jpg"}
          alt="TAT GLOBAL"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={
            emuted
              ? "/placeholder.svg"
              : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.2365139157326!2d2.3520!3d48.8566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2s123%20Avenue%20Paris%2C%2075000%20Paris!5e0!3m2!1sfr!2sfr!4v1234567890"
          }
        />
      )}
    </div>
  );
}
