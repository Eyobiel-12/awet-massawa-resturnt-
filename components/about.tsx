export function About() {
  return (
    <section
      id="about"
      className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src="/images/design-mode/WhatsApp%20Image%202025-10-18%20at%2015.59.49%20%281%29.jpeg"
              alt="Massawa Restaurant interior showcasing authentic Ethiopian and Eritrean ambiance"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Our <span className="text-sunset-gradient">Story</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A journey of flavors, tradition, and hospitality that spans generations
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                From Massawa to Your Table
              </h3>
              <p>
                Named after the historic port city of Massawa, our restaurant was born from a dream to share the
                authentic flavors of Ethiopian and Eritrean cuisine with our community. Founded in 2010 by the Tekle
                family, we have remained committed to preserving traditional cooking methods while creating an elegant
                dining experience.
              </p>
              <p>
                Our recipes have been passed down through four generations, each dish carefully crafted using
                time-honored techniques and the finest spices imported directly from the Horn of Africa. We believe that
                food is more than sustenance—it's a celebration of culture, family, and community.
              </p>
              <p>
                Today, Massawa Restaurant stands as a testament to our heritage, offering an authentic culinary journey
                that honors our ancestors while embracing the future of fine dining.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
