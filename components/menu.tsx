"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Leaf, Flame, Sparkles } from "lucide-react"
import { useState } from "react"

const menuCategories = [
  {
    title: "Breakfast & Lunch",
    titleAmharic: "ቁርስ እና ምሳ",
    items: [
      {
        name: "Banie Mis Formaggio",
        price: "€4.00",
        description: "Cheese sandwich",
      },
      {
        name: "Banie Mis Tonno",
        price: "€5.50",
        description: "Tuna sandwich with onion, tomato, corn and Spanish peppers",
      },
      {
        name: "Banie Mis Inkaqho",
        price: "€7.30",
        description: "Fried egg sandwich with onion, tomato and Spanish peppers",
      },
      {
        name: "Banie Mis Kulwa",
        nameAmharic: "ባኒ ሚስ ኩልዋ",
        price: "€6.00",
        description: "Sandwich filled with beef, tomato, onions and peppers",
        badges: ["Spicy or Mild"],
      },
      {
        name: "Frittata",
        price: "€15.00",
        description: "Fried eggs prepared with onion, tomato, peppers and Spanish peppers",
      },
      {
        name: "Ful",
        nameAmharic: "ፉል",
        price: "€13.50",
        description: "Mashed fava beans prepared with onion, olive oil, tomato and served with bread",
        badges: ["Vegetarian"],
      },
      {
        name: "Ful with Feta & Egg",
        price: "€14.50",
        description: "Mashed fava beans with onion, olive oil, feta cheese, egg, tomato and served with bread",
      },
      {
        name: "Kitcha Fit Fit",
        price: "€14.50",
        description: "Fresh crispy East African bread, prepared with spiced chili powder and clarified butter",
      },
      {
        name: "Injera Fit Fit Zigni",
        price: "€14.50",
        description: "A spicy beef stew mixed with injera bread",
        badges: ["Spicy"],
      },
    ],
  },
  {
    title: "Appetizers & Starters",
    titleAmharic: "ምግብ ጀማሪዎች",
    items: [
      {
        name: "Samosa",
        nameAmharic: "ሳምቡሳ",
        price: "€3.50",
        description:
          "Thin triangular dough stuffed with spiced vegetables and herbs or lentils, lightly deep fried until golden brown",
        badges: ["Vegetarian"],
      },
    ],
  },
  {
    title: "Chicken Dishes",
    titleAmharic: "ዶሮ",
    items: [
      {
        name: "Doro Wot",
        nameAmharic: "ዶሮ ወጥ",
        price: "€18.50",
        description: "Tender chicken drumsticks in spicy berbere sauce with onions, garlic, ginger and hardboiled egg",
        badges: ["Signature", "Spicy"],
      },
      {
        name: "Doro Alicha",
        nameAmharic: "ዶሮ አልጫ",
        price: "€18.50",
        description: "Chicken drumstick in mild turmeric sauce with onions, garlic, ginger and hardboiled egg",
      },
    ],
  },
  {
    title: "Beef Specialties",
    titleAmharic: "ጥብስ",
    items: [
      {
        name: "Massawa Special Menu",
        price: "€19.00",
        description:
          "Mixed platter of beef, meat and chicken dishes, served with five vegetable side dishes and ayib cheese",
        badges: ["Signature"],
      },
      {
        name: "Keyh Xbhi",
        nameAmharic: "ቀይሕ ስብሒ",
        price: "€17.50",
        description: "Tender beef cubes simmered in rich berbere sauce with traditional Ethiopian spices",
        badges: ["Spicy"],
      },
      {
        name: "Yeshekla Tibs",
        nameAmharic: "የሸክላ ጥብስ",
        price: "€18.00",
        description:
          "Tender beef marinated with special sauce, sizzling with onion, rosemary, jalapeño, and fresh garlic",
        badges: ["Signature"],
      },
      {
        name: "Gored Gored",
        nameAmharic: "ጎረድ ጎረድ",
        price: "€18.50",
        description: "Cubed tender beef marinated with purified herbed butter sauce and blended spicy pepper",
        badges: ["Spicy"],
      },
      {
        name: "Massawa Special Kitfo",
        price: "€18.00",
        description:
          "Ethiopian steak tartare seasoned with purified herbed butter sauce & mitmita spice, served with ayib cheese",
        badges: ["Chef Special", "Signature"],
      },
    ],
  },
  {
    title: "Lamb Dishes",
    titleAmharic: "በግ",
    items: [
      {
        name: "Ye Beg Tibs",
        nameAmharic: "የበግ ጥብስ",
        price: "€18.50",
        description: "Succulent pieces of fresh lamb sautéed with onions, green pepper, tomato and rosemary",
      },
      {
        name: "Awaze Tibs",
        nameAmharic: "አዋዜ ጥብስ",
        price: "€17.00",
        description:
          "Succulent pieces of fresh lamb sautéed with hot pepper, onions, green pepper, tomato and rosemary",
        badges: ["Spicy"],
      },
      {
        name: "Gomen Besiga",
        nameAmharic: "ጎመን በስጋ",
        price: "€18.50",
        description: "Lamb cooked with kale, purified herbed butter, garlic, ginger, onions and green pepper",
      },
      {
        name: "Alicha Siga Wot",
        nameAmharic: "አልጫ ስጋ ወጥ",
        price: "€18.00",
        description: "Lamb stew in mild purified herbed butter sauce with onion, garlic, ginger and turmeric",
        badges: ["Vegetarian"],
      },
      {
        name: "Qey Siga Wot",
        nameAmharic: "ቀይ ስጋ ወጥ",
        price: "€18.00",
        description: "Hot and spicy lamb stew in hot and thick berbere sauce and purified herbed butter",
        badges: ["Spicy"],
      },
    ],
  },
  {
    title: "Vegetarian Dishes",
    titleAmharic: "የጾም ምግብ",
    items: [
      {
        name: "Vegetarian Special",
        nameAmharic: "በጾም",
        price: "€18.50",
        description: "Pumpkin dish with red lentils, sesame, chickpeas, mixed vegetables, spinach and ayib cheese",
        badges: ["Vegetarian", "Signature"],
      },
      {
        name: "Yeduba Wot",
        nameAmharic: "የዱባ ወጥ",
        price: "€15.00",
        description:
          "Cooked pumpkin with Ethiopian spices, served with injera, ayib cheese, vegetables, lentils, beetroots and carrots",
        badges: ["Vegetarian"],
      },
      {
        name: "Tegamino",
        nameAmharic: "ጤገሚኖ",
        price: "€15.50",
        description: "Roasted and powdered chickpeas (Shuro) simmered in our unique clay pot with mild berbere sauce",
        badges: ["Vegetarian"],
      },
      {
        name: "Yemisir Wot",
        nameAmharic: "የምስር ወጥ",
        price: "€15.50",
        description: "Puréed red split lentils simmered in our own spicy berbere sauce",
        badges: ["Vegetarian", "Spicy"],
      },
      {
        name: "Kik Alicha",
        nameAmharic: "ክክ አልጫ",
        price: "€15.50",
        description: "Yellow split peas cooked with turmeric, ginger, and mild spices",
        badges: ["Vegetarian"],
      },
      {
        name: "Gomen Wot",
        nameAmharic: "ጎመን ወጥ",
        price: "€16.50",
        description: "Chopped collard greens simmered with onions, garlic, ginger and traditional Ethiopian spices",
        badges: ["Vegetarian"],
      },
      {
        name: "Ataklit Wot",
        nameAmharic: "አትክልት ወጥ",
        price: "€17.50",
        description: "Cabbage, carrots and potatoes simmered with onions, garlic and ginger",
        badges: ["Vegetarian"],
      },
    ],
  },
  {
    title: "Traditional Beverages",
    titleAmharic: "ባህላዊ መጠጦች",
    items: [
      {
        name: "Tej",
        nameAmharic: "ጠጅ",
        price: "€4.00/glass",
        description: "Traditional Ethiopian honey wine, homemade according to ancient recipes",
      },
      {
        name: "Ethiopian & Eritrean Coffee",
        price: "€15.00",
        description: "Traditional hand-roasted coffee ceremony prepared and served with full ceremony",
      },
      {
        name: "Ethiopian & Eritrean Tea",
        price: "€2.80",
        description: "Traditional tea blend with aromatic spices and herbs",
      },
      {
        name: "Fresh East African Coffee (2 persons)",
        price: "€17.50",
        description: "Freshly brewed traditional East African coffee",
      },
      {
        name: "Fresh East African Coffee (3 persons)",
        price: "€18.50",
        description: "Freshly brewed traditional East African coffee",
      },
      {
        name: "Fresh East African Coffee (4 persons)",
        price: "€19.50",
        description: "Freshly brewed traditional East African coffee",
      },
    ],
  },
]

const wineCategories = [
  {
    title: "French Wines",
    titleOriginal: "Franse Wijnen",
    items: [
      {
        name: "Merlot",
        description: "Soft red fruity and gentle wine with aromas of blackberries",
        priceGlass: "€7.00",
        priceBottle: "€35.00",
      },
      {
        name: "Traditional",
        description: "Soft red fruity wine with aromas of blackberries, light spicy",
        priceGlass: "€7.00",
        priceBottle: "€35.00",
      },
    ],
  },
  {
    title: "American Wines",
    titleOriginal: "Amerikaanse Wijnen",
    items: [
      {
        name: "Moscato (Sweet)",
        description: "Sweet and fruity white wine with tones of pineapple, peach and orange blossom",
        priceGlass: "€5.00",
        priceBottle: "€25.00",
      },
      {
        name: "Sauvignon Blanc",
        description: "Fresh and floral white wine with tones of green apple, peach and a hint of citrus",
        priceGlass: "€5.00",
        priceBottle: "€25.00",
      },
      {
        name: "Pinot Grigio",
        description: "Fresh, fruity white wine with the taste of melon and tones of citrus fruits",
        priceGlass: "€5.00",
        priceBottle: "€25.00",
      },
      {
        name: "Chardonnay",
        description: "Rich white wine with tones of peach and a hint of honey and vanilla",
        priceGlass: "€5.00",
        priceBottle: "€25.00",
      },
      {
        name: "White Zinfandel (Rosé)",
        description: "Wonderful fruity wine with cherries and raspberry taste",
        priceGlass: "€5.00",
        priceBottle: "€25.00",
      },
      {
        name: "Merlot",
        description: "Spicy and aromatic red wine with tones of forest fruits and raspberries",
        priceGlass: "€5.00",
        priceBottle: "€25.00",
      },
    ],
  },
]

const beverageCategories = [
  {
    title: "Ethiopian Beers",
    titleOriginal: "Ethiopische Bieren",
    items: [
      {
        name: "St. George (Pilsener)",
        description:
          "Lager-type beer made from expertly selected malts, premium blends of hops, and pure processed highland water",
        price: "€4.95",
      },
      {
        name: "Walia (Pilsener)",
        description: "Walia beer from Ethiopia is a light lager and is brewed with pure barley malt",
        price: "€4.95",
      },
      {
        name: "Bedele (Pilsener)",
        description:
          "High quality rich full-flavoured 5.5% alcohol lager beer brewed with the best quality, fermented with two types of yeast, 100% natural ingredients — Ethiopia's special",
        price: "€4.95",
      },
      {
        name: "Habesha (Pilsener)",
        description: "Natural mineral water, barley malt, wheat and hops",
        price: "€4.95",
      },
    ],
  },
  {
    title: "Beer Selection",
    titleOriginal: "Bier",
    items: [
      { name: "Hertog Jan", price: "€3.50" },
      { name: "Heineken", price: "€3.50" },
      { name: "Desperados", price: "€4.00" },
      { name: "Wit", price: "€4.00" },
    ],
  },
  {
    title: "Soft Drinks",
    titleOriginal: "Frisdrank",
    items: [
      { name: "Coca Cola (Zero)", price: "€3.00" },
      { name: "Fanta (Cassis)", price: "€3.00" },
      { name: "Sprite", price: "€3.00" },
      { name: "Lipton Ice Tea Green", price: "€3.00" },
      { name: "Lipton Ice Tea Sparkling", price: "€3.00" },
      { name: "Lipton Ice Tea Redbul", price: "€3.00" },
      { name: "Redbul", price: "€3.50" },
      { name: "Spa 750 ml", price: "€6.50" },
      { name: "Ijs Thee", price: "€3.00" },
      { name: "Finley Tonic", price: "€3.00" },
      { name: "Spa Rood", price: "€3.00" },
      { name: "Better Lemon", price: "€3.00" },
      { name: "Appelsap", price: "€3.00" },
    ],
  },
]

const dessertCategories = [
  {
    title: "Desserts",
    titleOriginal: "Nagerechten",
    items: [
      {
        name: "Citroenvrucht met Citroenjijs",
        description: "Frozen lemon with lemon ice cream",
        price: "€6.00",
      },
      {
        name: "Sinaasappel met Sinaasappelijs",
        description: "Frozen orange with orange ice cream",
        price: "€6.00",
      },
      {
        name: "Cocos met Cocos Ijs",
        description: "Frozen coconut with coconut ice cream",
        price: "€6.00",
      },
      {
        name: "Huis Gebakken Chocolade Brownie",
        description: "Home baked chocolate brownie with ice cream",
        price: "€5.00",
      },
      {
        name: "Baklava (2 Stuks)",
        description: "Turkish pastry (2 pieces)",
        price: "€4.50",
      },
      {
        name: "Baklava met Ijs",
        description: "Turkish pastry with ice cream",
        price: "€5.00",
      },
      {
        name: "Tiramisu",
        price: "€4.50",
      },
    ],
  },
  {
    title: "Fruit Shakes",
    items: [
      { name: "Aardbei", nameEnglish: "Strawberry", price: "€6.25" },
      { name: "Banaan", nameEnglish: "Banana", price: "€6.00" },
      { name: "Avocado", price: "€6.25" },
      { name: "Mango", price: "€6.25" },
    ],
  },
]

export function Menu() {
  const [activeTab, setActiveTab] = useState<"food" | "drinks" | "desserts">("food")

  return (
    <section id="menu" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sunset-amber/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-sunset-coral/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-sunset-rose/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-sunset-amber/3 rounded-full blur-2xl animate-float-slow" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-block">
            <Sparkles className="w-8 h-8 text-sunset-amber mx-auto mb-4 animate-sparkle" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Culinary Excellence
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Each dish is a masterpiece, crafted with the finest ingredients and centuries-old traditions
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-16 flex-wrap animate-fade-in-up animation-delay-200">
          <Button
            variant={activeTab === "food" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTab("food")}
            className={`px-8 py-6 text-base font-serif transition-all duration-500 hover:scale-105 hover:shadow-xl relative overflow-hidden group ${
              activeTab === "food"
                ? "bg-gradient-to-r from-sunset-amber via-sunset-coral to-sunset-amber bg-[length:200%_100%] animate-gradient shadow-sunset-amber/30"
                : "hover:border-sunset-amber/50 hover:shadow-sunset-amber/20"
            }`}
          >
            <span className="relative z-10">Food Menu</span>
            {activeTab !== "food" && (
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-amber/10 to-sunset-coral/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </Button>
          <Button
            variant={activeTab === "drinks" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTab("drinks")}
            className={`px-8 py-6 text-base font-serif transition-all duration-500 hover:scale-105 hover:shadow-xl relative overflow-hidden group ${
              activeTab === "drinks"
                ? "bg-gradient-to-r from-sunset-amber via-sunset-coral to-sunset-amber bg-[length:200%_100%] animate-gradient shadow-sunset-amber/30"
                : "hover:border-sunset-amber/50 hover:shadow-sunset-amber/20"
            }`}
          >
            <span className="relative z-10">Beverages & Wines</span>
            {activeTab !== "drinks" && (
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-amber/10 to-sunset-coral/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </Button>
          <Button
            variant={activeTab === "desserts" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveTab("desserts")}
            className={`px-8 py-6 text-base font-serif transition-all duration-500 hover:scale-105 hover:shadow-xl relative overflow-hidden group ${
              activeTab === "desserts"
                ? "bg-gradient-to-r from-sunset-amber via-sunset-coral to-sunset-amber bg-[length:200%_100%] animate-gradient shadow-sunset-amber/30"
                : "hover:border-sunset-amber/50 hover:shadow-sunset-amber/20"
            }`}
          >
            <span className="relative z-10">Desserts</span>
            {activeTab !== "desserts" && (
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-amber/10 to-sunset-coral/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </Button>
        </div>

        {activeTab === "food" && (
          <div className="space-y-24">
            {menuCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="space-y-12 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground font-serif italic text-xl animate-fade-in animation-delay-100">
                    {category.titleAmharic}
                  </p>
                  <Separator className="max-w-xs mx-auto mt-4 bg-gradient-to-r from-transparent via-sunset-amber to-transparent h-px animate-expand" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-sunset-amber/60 transition-all duration-700 hover:shadow-2xl hover:shadow-sunset-amber/20 hover:-translate-y-3 animate-fade-in-up overflow-hidden"
                      style={{ animationDelay: `${itemIndex * 50}ms` }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sunset-amber/0 via-sunset-coral/0 to-sunset-rose/0 group-hover:from-sunset-amber/8 group-hover:via-sunset-coral/8 group-hover:to-sunset-rose/8 transition-all duration-700 pointer-events-none" />

                      <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute top-4 left-4 w-8 h-0.5 bg-gradient-to-r from-sunset-amber to-transparent" />
                        <div className="absolute top-4 left-4 w-0.5 h-8 bg-gradient-to-b from-sunset-amber to-transparent" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-4 right-4 w-8 h-0.5 bg-gradient-to-l from-sunset-amber to-transparent" />
                        <div className="absolute bottom-4 right-4 w-0.5 h-8 bg-gradient-to-t from-sunset-amber to-transparent" />
                      </div>

                      <div className="relative z-10">
                        {/* Header with Name and Price */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1 space-y-2">
                            <h4 className="font-serif text-2xl font-bold text-foreground leading-tight group-hover:text-sunset-amber transition-colors duration-500">
                              {item.name}
                            </h4>
                            {item.nameAmharic && (
                              <p className="text-base text-muted-foreground/80 font-serif italic group-hover:text-muted-foreground transition-colors duration-500">
                                {item.nameAmharic}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="font-serif text-2xl font-bold text-sunset-amber group-hover:scale-110 inline-block transition-transform duration-500">
                              {item.price}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="text-muted-foreground leading-relaxed mb-4 text-base group-hover:text-foreground/80 transition-colors duration-500">
                            {item.description}
                          </p>
                        )}

                        {item.badges && item.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/30 group-hover:border-sunset-amber/30 transition-colors duration-500">
                            {item.badges.map((badge, badgeIndex) => (
                              <Badge
                                key={badgeIndex}
                                variant="outline"
                                className="bg-background/50 text-foreground border-sunset-amber/20 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 transition-all duration-500 hover:bg-sunset-amber/10 hover:border-sunset-amber/40 hover:scale-105 hover:shadow-md"
                              >
                                {badge.toLowerCase().includes("vegetarian") && (
                                  <Leaf className="w-3.5 h-3.5 text-green-600 animate-pulse-slow" />
                                )}
                                {badge.toLowerCase().includes("spicy") && (
                                  <Flame className="w-3.5 h-3.5 text-orange-600 animate-flicker" />
                                )}
                                {(badge.toLowerCase().includes("signature") ||
                                  badge.toLowerCase().includes("special")) && (
                                  <Sparkles className="w-3.5 h-3.5 text-sunset-amber animate-sparkle" />
                                )}
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunset-amber/0 to-transparent group-hover:via-sunset-amber/60 transition-all duration-700 rounded-b-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </div>

                      <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-sunset-amber rounded-full animate-ping" />
                        <div className="absolute top-4 right-4 w-2 h-2 bg-sunset-amber rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "drinks" && (
          <div className="space-y-24">
            {/* Traditional Beverages */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
                  Traditional Beverages
                </h3>
                <p className="text-muted-foreground font-serif italic text-xl animate-fade-in animation-delay-100">
                  ባህላዊ መጠጦች
                </p>
                <Separator className="max-w-xs mx-auto mt-4 bg-gradient-to-r from-transparent via-sunset-amber to-transparent h-px animate-expand" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {menuCategories
                  .find((cat) => cat.title === "Traditional Beverages")
                  ?.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group relative bg-card rounded-xl p-8 border border-border/50 hover:border-sunset-amber/40 transition-all duration-500 hover:shadow-xl hover:shadow-sunset-amber/5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 space-y-2">
                          <h4 className="font-serif text-2xl font-bold text-foreground leading-tight group-hover:text-sunset-amber transition-colors duration-300">
                            {item.name}
                          </h4>
                          {item.nameAmharic && (
                            <p className="text-base text-muted-foreground/80 font-serif italic">{item.nameAmharic}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="font-serif text-2xl font-bold text-sunset-amber">{item.price}</span>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground leading-relaxed text-base">{item.description}</p>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunset-amber/0 to-transparent group-hover:via-sunset-amber/30 transition-all duration-500" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Wine Selection */}
            {wineCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-12">
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground font-serif italic text-xl">{category.titleOriginal}</p>
                  <Separator className="max-w-xs mx-auto mt-4 bg-gradient-to-r from-transparent via-sunset-amber to-transparent h-px" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group relative bg-card rounded-xl p-8 border border-border/50 hover:border-sunset-amber/40 transition-all duration-500 hover:shadow-xl hover:shadow-sunset-amber/5"
                    >
                      <h4 className="font-serif text-2xl font-bold text-foreground leading-tight mb-4 group-hover:text-sunset-amber transition-colors duration-500">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-muted-foreground leading-relaxed mb-6 text-base group-hover:text-foreground/80 transition-colors duration-500">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6 pt-4 border-t border-border/30 group-hover:border-sunset-amber/20 transition-colors duration-500">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">Glass</p>
                          <p className="font-serif text-xl font-bold text-sunset-amber">{item.priceGlass}</p>
                        </div>
                        <Separator orientation="vertical" className="h-12 bg-border/50" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">Bottle</p>
                          <p className="font-serif text-xl font-bold text-sunset-amber">{item.priceBottle}</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunset-amber/0 to-transparent group-hover:via-sunset-amber/30 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Beer & Soft Drinks */}
            {beverageCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-12">
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground font-serif italic text-xl">{category.titleOriginal}</p>
                  <Separator className="max-w-xs mx-auto mt-4 bg-gradient-to-r from-transparent via-sunset-amber to-transparent h-px" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group relative bg-card rounded-lg p-6 border border-border/50 hover:border-sunset-amber/40 transition-all duration-500 hover:shadow-lg hover:shadow-sunset-amber/5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="font-serif text-lg font-bold text-foreground leading-tight group-hover:text-sunset-amber transition-colors duration-500 flex-1">
                          {item.name}
                        </h4>
                        <span className="font-serif text-lg font-bold text-sunset-amber flex-shrink-0">
                          {item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sunset-amber/0 to-transparent group-hover:via-sunset-amber/30 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "desserts" && (
          <div className="space-y-24">
            {dessertCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-12">
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{category.title}</h3>
                  {category.titleOriginal && (
                    <p className="text-muted-foreground font-serif italic text-xl">{category.titleOriginal}</p>
                  )}
                  <Separator className="max-w-xs mx-auto mt-4 bg-gradient-to-r from-transparent via-sunset-amber to-transparent h-px" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group relative bg-card rounded-xl p-8 border border-border/50 hover:border-sunset-amber/40 transition-all duration-500 hover:shadow-xl hover:shadow-sunset-amber/5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 space-y-2">
                          <h4 className="font-serif text-xl font-bold text-foreground leading-tight group-hover:text-sunset-amber transition-colors duration-500">
                            {item.name}
                          </h4>
                          {item.nameEnglish && (
                            <p className="text-sm text-muted-foreground/80 italic">({item.nameEnglish})</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="font-serif text-xl font-bold text-sunset-amber">{item.price}</span>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunset-amber/0 to-transparent group-hover:via-sunset-amber/30 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-20 pt-16 border-t border-border/50 animate-fade-in-up animation-delay-500">
          <div className="max-w-2xl mx-auto space-y-6">
            <Sparkles className="w-10 h-10 text-sunset-amber mx-auto animate-sparkle" />
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Experience Authentic Flavors</h3>
            <p className="text-muted-foreground leading-relaxed">
              All dishes are prepared fresh to order using traditional recipes passed down through generations and the
              finest ingredients sourced from the Horn of Africa
            </p>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-10 py-6 h-auto bg-transparent border-sunset-amber/30 hover:bg-sunset-amber/10 hover:border-sunset-amber transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-sunset-amber/30 font-serif group relative overflow-hidden"
            >
              <span className="relative z-10">Download Full Menu (PDF)</span>
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-amber/0 via-sunset-amber/20 to-sunset-amber/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes expand {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(20px) translateX(-10px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-15px) translateX(15px) scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 8px currentColor);
          }
          50% {
            opacity: 0.8;
            transform: rotate(180deg) scale(1.1);
            filter: drop-shadow(0 0 16px currentColor);
          }
        }

        @keyframes flicker {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-expand {
          animation: expand 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-flicker {
          animation: flicker 1.5s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </section>
  )
}
