"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Flame, Sparkles, Search, X } from "lucide-react"
import { useState, useMemo } from "react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter menu items based on search
  const filteredMenuCategories = useMemo(() => {
    if (!searchQuery) return menuCategories

    const query = searchQuery.toLowerCase()
    return menuCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.nameAmharic?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.badges?.some((badge) => badge.toLowerCase().includes(query))
        ),
      }))
      .filter((category) => category.items.length > 0)
  }, [searchQuery])

  const allCategories = useMemo(() => {
    return menuCategories.map((cat) => cat.title)
  }, [])

  return (
    <section id="menu" className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
            Our Menu
          </h1>
          <p className="text-lg text-foreground max-w-2xl mx-auto font-medium">
            Discover authentic flavors from the Horn of Africa, crafted with traditional recipes and the finest ingredients
          </p>
      </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dishes, ingredients, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-base border-2 focus:border-amber-500 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Mobile & Tablet) */}
        {activeTab === "food" && !searchQuery && (
          <div className="mb-8 md:hidden">
            <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex-shrink-0 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-300 snap-start min-w-fit min-h-[44px] flex items-center justify-center ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-white text-foreground border-2 border-border active:border-amber-500 active:bg-amber-50 active:scale-95"
                  }`}
                >
                  All
                </button>
                {allCategories.map((category) => {
                  const shortName = category.split(" ")[0]
                  const fullName = category.split(" & ")[0].split(" ")[0]
                  const displayName = fullName.length <= 8 ? fullName : shortName
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        // Scroll to category section on mobile
                        setTimeout(() => {
                          const categoryIndex = menuCategories.findIndex(c => c.title === category)
                          if (categoryIndex !== -1) {
                            const element = document.getElementById(`category-${categoryIndex}`)
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                          }
                        }, 100)
                      }}
                      className={`flex-shrink-0 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-300 snap-start min-w-fit min-h-[44px] flex items-center justify-center ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg scale-105"
                          : "bg-white text-foreground border-2 border-border active:border-amber-500 active:bg-amber-50 active:scale-95"
                      }`}
                    >
                      {displayName}
                    </button>
                  )
                })}
              </div>
              {/* Gradient fade indicators */}
              <div className="absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          <Button
            variant={activeTab === "food" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              setActiveTab("food")
              setSearchQuery("")
              setSelectedCategory(null)
            }}
            className={`px-6 py-3 text-base font-semibold transition-all ${
              activeTab === "food"
                ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg hover:shadow-xl"
                : "hover:border-amber-500"
            }`}
          >
            Food Menu
          </Button>
          <Button
            variant={activeTab === "drinks" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              setActiveTab("drinks")
              setSearchQuery("")
              setSelectedCategory(null)
            }}
            className={`px-6 py-3 text-base font-semibold transition-all ${
              activeTab === "drinks"
                ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg hover:shadow-xl"
                : "hover:border-amber-500"
            }`}
          >
            Beverages & Wines
          </Button>
          <Button
            variant={activeTab === "desserts" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              setActiveTab("desserts")
              setSearchQuery("")
              setSelectedCategory(null)
            }}
            className={`px-6 py-3 text-base font-semibold transition-all ${
              activeTab === "desserts"
                ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg hover:shadow-xl"
                : "hover:border-amber-500"
            }`}
          >
            Desserts
          </Button>
        </div>

        {/* Desktop Category Filter */}
        {activeTab === "food" && !searchQuery && (
          <div className="hidden md:flex justify-center mb-12">
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-full text-base font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg hover:shadow-xl"
                    : "bg-white text-foreground border-2 border-border hover:border-amber-500 hover:bg-amber-50"
                }`}
              >
                All Categories
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-base font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg hover:shadow-xl"
                      : "bg-white text-foreground border-2 border-border hover:border-amber-500 hover:bg-amber-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Food Menu */}
        {activeTab === "food" && (
          <div className="space-y-16">
            {(selectedCategory
              ? filteredMenuCategories.filter((cat) => cat.title === selectedCategory)
              : filteredMenuCategories
            ).map((category, categoryIndex) => (
              <div key={categoryIndex} className="scroll-mt-24" id={`category-${categoryIndex}`}>
                <div className="text-center mb-10 space-y-3">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    {category.title}
                  </h2>
                  {category.titleAmharic && (
                    <p className="text-foreground font-serif italic text-lg sm:text-xl font-medium">
                      {category.titleAmharic}
                    </p>
                  )}
                  <Separator className="max-w-xs mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent h-0.5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group bg-white rounded-2xl p-6 border-2 border-border shadow-md hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-1 group-hover:text-amber-600 transition-colors">
                              {item.name}
                          </h3>
                            {item.nameAmharic && (
                            <p className="text-sm text-foreground font-serif italic font-medium">
                                {item.nameAmharic}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                          <span className="font-serif text-xl font-bold text-amber-600 whitespace-nowrap">
                              {item.price}
                            </span>
                          </div>
                        </div>

                        {item.description && (
                        <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-2 font-medium">
                            {item.description}
                          </p>
                        )}

                        {item.badges && item.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {item.badges.map((badge, badgeIndex) => (
                              <Badge
                                key={badgeIndex}
                                variant="outline"
                              className="text-xs border-amber-500 bg-amber-100 text-foreground flex items-center gap-1 font-semibold"
                              >
                                {badge.toLowerCase().includes("vegetarian") && (
                                <Leaf className="w-3 h-3 text-green-600" />
                                )}
                                {badge.toLowerCase().includes("spicy") && (
                                <Flame className="w-3 h-3 text-orange-600" />
                                )}
                                {(badge.toLowerCase().includes("signature") ||
                                  badge.toLowerCase().includes("special")) && (
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                )}
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredMenuCategories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground text-lg font-semibold">No dishes found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Drinks Menu */}
        {activeTab === "drinks" && (
          <div className="space-y-16">
            {/* Traditional Beverages */}
            <div>
              <div className="text-center mb-10 space-y-3">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  Traditional Beverages
                </h2>
                <p className="text-foreground font-serif italic text-lg sm:text-xl font-medium">
                  ባህላዊ መጠጦች
                </p>
                <Separator className="max-w-xs mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent h-0.5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuCategories
                  .find((cat) => cat.title === "Traditional Beverages")
                  ?.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-2xl p-6 border-2 border-border shadow-md hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                            {item.name}
                          </h3>
                          {item.nameAmharic && (
                            <p className="text-sm text-foreground font-serif italic font-medium">
                              {item.nameAmharic}
                            </p>
                          )}
                        </div>
                        <span className="font-serif text-xl font-bold text-amber-600 whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-foreground leading-relaxed font-medium">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Wine Categories */}
            {wineCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-10 space-y-3">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    {category.title}
                  </h2>
                  {category.titleOriginal && (
                    <p className="text-foreground font-serif italic text-lg sm:text-xl font-medium">
                      {category.titleOriginal}
                    </p>
                  )}
                  <Separator className="max-w-xs mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent h-0.5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-2xl p-6 border-2 border-border shadow-md hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                    >
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-foreground leading-relaxed mb-4 font-medium">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6 pt-4 border-t border-border">
                        <div className="flex-1">
                          <p className="text-xs text-foreground mb-1 uppercase tracking-wide font-bold">Glass</p>
                          <p className="font-serif text-lg font-bold text-amber-600">{item.priceGlass}</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="flex-1">
                          <p className="text-xs text-foreground mb-1 uppercase tracking-wide font-bold">Bottle</p>
                          <p className="font-serif text-lg font-bold text-amber-600">{item.priceBottle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Beverage Categories */}
            {beverageCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-10 space-y-3">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    {category.title}
                  </h2>
                  {category.titleOriginal && (
                    <p className="text-foreground font-serif italic text-lg sm:text-xl font-medium">
                      {category.titleOriginal}
                    </p>
                  )}
                  <Separator className="max-w-xs mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent h-0.5" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-xl p-4 border-2 border-border shadow-md hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col gap-2">
                        <h4 className="font-serif text-base font-bold text-foreground leading-tight">
                          {item.name}
                        </h4>
                        <span className="font-serif text-lg font-bold text-amber-600">
                          {item.price}
                        </span>
                        {item.description && (
                          <p className="text-xs text-foreground leading-relaxed line-clamp-2 mt-1 font-medium">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desserts Menu */}
        {activeTab === "desserts" && (
          <div className="space-y-16">
            {dessertCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-10 space-y-3">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    {category.title}
                  </h2>
                  {category.titleOriginal && (
                    <p className="text-muted-foreground font-serif italic text-lg sm:text-xl">
                      {category.titleOriginal}
                    </p>
                  )}
                  <Separator className="max-w-xs mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent h-0.5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-2xl p-6 border-2 border-border shadow-md hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                            {item.name}
                          </h3>
                          {item.nameEnglish && (
                            <p className="text-sm text-foreground italic font-medium">({item.nameEnglish})</p>
                          )}
                        </div>
                        <span className="font-serif text-xl font-bold text-amber-600 whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-foreground leading-relaxed font-medium">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-20 pt-16 border-t border-border/50">
          <div className="max-w-2xl mx-auto space-y-6">
            <Sparkles className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Experience Authentic Flavors
            </h3>
            <p className="text-foreground leading-relaxed font-medium">
              All dishes are prepared fresh to order using traditional recipes passed down through generations
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-500 hover:bg-amber-50 text-foreground font-semibold px-8 py-6 h-auto"
            >
              Reserve Your Table
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
