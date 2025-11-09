import { MapPin, Phone, Mail, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["Amsterdamsestraatweg 54", "3513 AG Utrecht", "Netherlands"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+31 6 24834382"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@massawa-restaurant.nl", "reservations@massawa-restaurant.nl"],
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Tuesday - Sunday: 17:00 - 23:00", "Monday: Closed", "Kitchen closes at 22:00"],
  },
]

export function Contact() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Visit Us
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty px-4 sm:px-0">
            We look forward to welcoming you to Massawa
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {contactInfo.map((item, index) => (
            <div key={index} className="text-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">{item.title}</h3>
              <div className="space-y-1">
                {item.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-xs sm:text-sm text-muted-foreground">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden bg-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2450.123456789!2d5.1234567!3d52.0987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c66f1234567890%3A0xabcdef1234567890!2sAmsterdamsestraatweg%2054%2C%203513%20AG%20Utrecht%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Massawa Restaurant Location"
          />
        </div>
      </div>
    </section>
  )
}
