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
              src="/masswa.png"
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

            <div className="space-y-4 text-foreground leading-relaxed">
              <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🌊 The Story Behind the Name – Massawa
              </h3>
              <p className="text-base md:text-lg">
                "Massawa" is more than just a name—it's a tribute to heritage, warmth, and timeless flavors. Our restaurant is named after Massawa, a beautiful port city on the Red Sea coast of Eritrea. Known for its rich history, multicultural charm, and stunning seaside views, Massawa has long been a crossroads of African, Arab, and Mediterranean influences. It was once a vital gateway for trade, culture, and spices—where stories were told over shared meals and the aroma of berbere and incense filled the air.
              </p>
              <p className="text-base md:text-lg">
                At Massawa, we aim to capture that same spirit: A place where flavors connect generations, and every dish tells a story of tradition, resilience, and hospitality. Whether you're tasting our fiery Zigni or savoring the delicate balance of our vegetarian platters, each bite carries the essence of a city that has welcomed travelers and traders for centuries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
