import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Generate default products from products.js reference data
const SEED_PRODUCTS = [
  {
    id: "prod-1",
    title: "Custom VVS Diamond Pendant",
    category: "pendants",
    material: "18k Gold & VVS Diamonds",
    price: 4500,
    rating: 4.9,
    reviewsCount: 2,
    image: "/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg",
    thumbnails: ["/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg"],
    description: "A custom-molded masterpiece crafted in-house. This VVS Diamond Pendant features hand-set, brilliant-cut VVS clarity diamonds encrusted on a stunning crowned skull motif, cast from solid 18k yellow gold. Each piece is polished to a mirror shine.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      stone: "Clarity VVS1, Color D-F Natural Diamonds (Total 4.5 Carats)",
      setting: "Hand-set Micro Pave",
      size: "55mm x 35mm"
    }),
    care: "Avoid chemical cleaners. Clean using warm water, mild dish soap, and a very soft toothbrush. Dry thoroughly with a microfiber cloth."
  },
  {
    id: "prod-2",
    title: "18k Miami Cuban Link Chain",
    category: "necklaces",
    material: "18k Solid Yellow Gold",
    price: 3200,
    rating: 4.9,
    reviewsCount: 2,
    image: "/assets/images/495915671_1751273732121557_3256046164248814030_n.jpg",
    thumbnails: ["/assets/images/495915671_1751273732121557_3256046164248814030_n.jpg"],
    description: "The gold standard of luxury streetwear. Our 18k Miami Cuban Link Chain is crafted from solid yellow gold links, hand-polished and fitted with a sleek, heavy-duty custom box lock with dual safety latches.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      width: "12mm",
      length: "22 inches",
      lock: "Custom fold-over box lock with safety latches"
    }),
    care: "Store flat in a fabric-lined box. Clean with a gold polishing cloth to maintain the high-gloss mirror finish."
  },
  {
    id: "prod-3",
    title: "Custom 18k Gold Grillz",
    category: "custom",
    material: "18k Gold (Set of 6)",
    price: 1850,
    rating: 4.8,
    reviewsCount: 2,
    image: "/assets/images/497435148_597443402699287_4382447146201741254_n.jpg",
    thumbnails: ["/assets/images/497435148_597443402699287_4382447146201741254_n.jpg"],
    description: "Custom molded upper or lower set of 6 teeth grillz. Hand-crafted from premium solid 18k yellow gold, meticulously polished to deliver a blinding gold shine. Includes custom molding kit and step-by-step instructions for a perfect fit.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      fit: "Custom molded (includes dental impression kit)",
      teethCount: "Set of 6 teeth (Upper or Lower)",
      finish: "High-Polish Mirror Finish"
    }),
    care: "Remove before eating, drinking, or sleeping. Wash with warm water and dry immediately. Do not use abrasive toothpaste."
  },
  {
    id: "prod-4",
    title: "Iced Out Royal Chronograph",
    category: "custom",
    material: "Moissanite & Stainless Steel",
    price: 9500,
    rating: 4.9,
    reviewsCount: 1,
    image: "/assets/images/497833627_1393279941815368_7853538822560960896_n.jpg",
    thumbnails: ["/assets/images/497833627_1393279941815368_7853538822560960896_n.jpg"],
    description: "Make a statement that cannot be ignored. The Royal Chronograph features a custom iced-out bezel and integrated bracelet, fully hand-paved with high-dispersion VVS Moissanite stones that pass thermal diamond testers. Fitted with a precise Japanese automatic movement.",
    specs: JSON.stringify({
      movement: "Japanese Automatic Chronograph (42 Hour Power Reserve)",
      stone: "VVS1 Moissanite Diamonds (Total 18.5 Carats)",
      case: "316L Stainless Steel (41mm Diameter)",
      waterResistance: "50 Meters (5 ATM)"
    }),
    care: "Gently wipe with a damp microfiber cloth. Ensure the crown is fully screwed down before cleaning."
  },
  {
    id: "prod-5",
    title: "VVS Diamond Tennis Bracelet",
    category: "bracelets",
    material: "14k White Gold & Diamonds",
    price: 3800,
    rating: 4.9,
    reviewsCount: 1,
    image: "/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg",
    thumbnails: ["/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg"],
    description: "A timeless classic modernized. Our VVS Diamond Tennis Bracelet is composed of a continuous, fluid line of matched round brilliant-cut VVS diamonds prong-set in solid 14k white gold. Seamless double-latch safety clasp.",
    specs: JSON.stringify({
      metal: "Solid 14k White Gold",
      stone: "Matched Round Brilliant VVS2 Diamonds (Total 5.5 Carats)",
      length: "7.25 inches",
      closure: "Seamless double-latch safety lock"
    }),
    care: "Clean regularly using a jewelry cleaning solution. Avoid contact with chlorine and abrasive surfaces."
  },
  {
    id: "prod-6",
    title: "Iced Out Custom Nameplate",
    category: "pendants",
    material: "14k Yellow Gold & VVS Diamonds",
    price: 2400,
    rating: 4.8,
    reviewsCount: 1,
    image: "/assets/images/499601723_1123628196153982_5964509621593198443_n.jpg",
    thumbnails: ["/assets/images/499601723_1123628196153982_5964509621593198443_n.jpg"],
    description: "Represent your name in style. Our Custom Iced Out Nameplate features custom 3D script lettering paved with brilliant-cut VVS diamonds, framed with a high-polish solid 14k yellow gold border. Fits up to 8 characters.",
    specs: JSON.stringify({
      metal: "Solid 14k Yellow Gold",
      stone: "VVS Clarity Diamonds (approx. 2.8 Carats depending on letters)",
      lettering: "Custom 3D Script Font (up to 8 characters)",
      bail: "Fits up to 10mm chains"
    }),
    care: "Clean gently with warm, soapy water. Avoid pulling on the letters when cleaning."
  },
  {
    id: "prod-7",
    title: "Solitaire Diamond Engagement Ring",
    category: "engagement rings",
    material: "18k White Gold",
    price: 1500,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/500200745_1440969573569043_5648713193081653598_n.jpg",
    thumbnails: ["/assets/images/500200745_1440969573569043_5648713193081653598_n.jpg"],
    description: "An elegant solitaire engagement ring setting that elevates your chosen center stone. Meticulously hand-set in 18k white gold.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      setting: "Solitaire",
      width: "2.0mm"
    }),
    care: "Avoid abrasive chemicals. Wipe down regularly with a soft lint-free polishing cloth."
  },
  {
    id: "prod-8",
    title: "Aura Solitaire Ring Setting",
    category: "rings",
    material: "18k White Gold",
    price: 1250,
    rating: 4.8,
    reviewsCount: 0,
    image: "/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg",
    thumbnails: ["/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg"],
    description: "An elegant solitaire engagement ring band meticulously cast in solid 18k white gold. Designed with comfort-fit styling to highlight any center stone shape.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      width: "2.0mm",
      fit: "Comfort Fit"
    }),
    care: "Wipe down with a polishing cloth. Avoid strong solvents."
  },
  {
    id: "prod-9",
    title: "Stellar Diamond Hoop Earrings",
    category: "earrings",
    material: "14k Yellow Gold & Diamonds",
    price: 1650,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg",
    thumbnails: ["/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg"],
    description: "Stellar hoop earrings paved with micro-prong brilliant round diamonds inside and out for maximum radiance. Cast in warm solid 14k yellow gold.",
    specs: JSON.stringify({
      metal: "Solid 14k Yellow Gold",
      stone: "0.75ct Brilliant Round Diamonds",
      closure: "Hinged Post Click Lock"
    }),
    care: "Clean regularly in warm soapy water using a soft brush."
  },
  {
    id: "prod-10",
    title: "Classic Platinum Wedding Band",
    category: "wedding bands",
    material: "Solid 950 Platinum",
    price: 950,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg",
    thumbnails: ["/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg"],
    description: "A heavy-weight Comfort Fit wedding band. Made of pure solid 950 platinum, this band represents everlasting fidelity with a mirror-finish polish.",
    specs: JSON.stringify({
      metal: "Solid 950 Platinum",
      width: "4mm",
      fit: "Comfort Fit"
    }),
    care: "Wipe with a lint-free cloth. Professional polish recommended annually."
  },
  {
    id: "prod-11",
    title: "Infinity Diamond Chain Bracelet",
    category: "bracelets",
    material: "18k Yellow Gold & Diamonds",
    price: 2900,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/502999619_24224725797135370_4369163186833760694_n.jpg",
    thumbnails: ["/assets/images/502999619_24224725797135370_4369163186833760694_n.jpg"],
    description: "An infinity linked chain bracelet set in solid 18k yellow gold. Paved with brilliant round cut VVS diamonds on every other link.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      stone: "1.2ct Natural Diamonds",
      closure: "Hidden safety box lock"
    }),
    care: "Store flat in a fabric box to prevent scratching."
  },
  {
    id: "prod-12",
    title: "Elysian Natural Akoya Pearl Necklace",
    category: "necklaces",
    material: "AAA Akoya Pearls & 18k Gold Clasp",
    price: 3500,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/503482297_17861545896426391_2715749128535163465_n.jpg",
    thumbnails: ["/assets/images/503482297_17861545896426391_2715749128535163465_n.jpg"],
    description: "A strand of AAA grade Akoya cultured pearls selected for their uniform shape, high luster, and clean surfaces. Completed with an 18k gold filigree ball clasp.",
    specs: JSON.stringify({
      pearls: "AAA Quality Akoya Pearls (7.0 - 7.5mm)",
      length: "18 inches",
      clasp: "Solid 18k Yellow Gold Clasp"
    }),
    care: "Avoid hairsprays or perfumes. Wipe with a damp cloth after wearing."
  },
  {
    id: "prod-13",
    title: "Fully Iced Out Royal Oak Chronograph",
    category: "custom",
    material: "18k White Gold & VVS Diamonds",
    price: 18500,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/475824088_18090637357557056_6045718502855486264_n.jpg",
    thumbnails: ["/assets/images/475824088_18090637357557056_6045718502855486264_n.jpg"],
    description: "The ultimate statement of watchmaking and high jewelry. This custom-paved Royal Oak chronograph features over 24 carats of matched, hand-set round brilliant VVS diamonds encrusting the entire case, bezel, dial, and integrated bracelet. Powered by an automatic movement.",
    specs: JSON.stringify({
      movement: "Swiss Automatic Chronograph",
      stone: "Matched VVS Clarity, Color D-F Natural Diamonds (Total 24.5 Carats)",
      case: "18k White Gold (41mm)",
      waterResistance: "50 Meters (5 ATM)"
    }),
    care: "Gently wipe with a soft microfiber cloth. Professional steam cleaning recommended annually."
  },
  {
    id: "prod-14",
    title: "Hand-Paved Diamond Cuban Link Bracelet",
    category: "bracelets",
    material: "14k White Gold & VVS Diamonds",
    price: 6200,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/476432644_1829671981188391_7777518501267256692_n.jpg",
    thumbnails: ["/assets/images/476432644_1829671981188391_7777518501267256692_n.jpg"],
    description: "A stunning display of modern urban luxury. This 14k white gold Miami Cuban link bracelet is meticulously paved with micro-prong set VVS diamonds across every single link. Hand-finished with a secure custom box lock.",
    specs: JSON.stringify({
      metal: "Solid 14k White Gold",
      stone: "VVS Clarity Diamonds (approx. 8.2 Carats)",
      width: "14mm",
      length: "8.0 inches"
    }),
    care: "Clean with warm soapy water and a soft toothbrush. Store in its original luxury box."
  },
  {
    id: "prod-15",
    title: "18k Presidential Emerald Dial Watch",
    category: "custom",
    material: "18k Yellow Gold & VVS Diamonds",
    price: 22000,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/486673421_577675541989565_505391099105838201_n.jpg",
    thumbnails: ["/assets/images/486673421_577675541989565_505391099105838201_n.jpg"],
    description: "A masterpiece of classic distinction. Crafted in solid 18k yellow gold, this Presidential timepiece is highlighted by a rich emerald green dial, a custom channel-set diamond bezel, and brilliant VVS diamond pave running down the center links of the presidential bracelet.",
    specs: JSON.stringify({
      movement: "Swiss Automatic Chronograph (48 Hour Power Reserve)",
      stone: "Matched VVS Clarity, Color D-F Diamonds (Total 12.8 Carats)",
      case: "18k Solid Yellow Gold (40mm)",
      dial: "Genuine Malachite Emerald Green Dial"
    }),
    care: "Avoid extreme shocks. Clean using warm water and mild soap. Ensure the crown is fully screwed in."
  },
  {
    id: "prod-16",
    title: "Iced Out VVS Cuban Link Chain",
    category: "necklaces",
    material: "14k White Gold & VVS Diamonds",
    price: 14500,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/640917534_1491710782527516_7413562406170824663_n.jpg",
    thumbnails: ["/assets/images/640917534_1491710782527516_7413562406170824663_n.jpg"],
    description: "Draped in pure brilliance. This 14k white gold Cuban link chain is fully iced out with hand-set, brilliant-cut VVS diamonds across the links and the prominent box lock clasp. Perfect alignment and high-gloss mirror-shine finish.",
    specs: JSON.stringify({
      metal: "Solid 14k White Gold",
      stone: "VVS Clarity Natural Diamonds (Total 18.5 Carats)",
      width: "12mm",
      length: "22 inches"
    }),
    care: "Store flat in a velvet-lined jewelry roll to prevent links from rubbing. Polish with a microfiber cloth."
  },
  {
    id: "prod-17",
    title: "Iced Out Square Santos Chronograph",
    category: "custom",
    material: "18k White Gold & VVS Diamonds",
    price: 19500,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/641723917_18128618890557056_250300516174668106_n.jpg",
    thumbnails: ["/assets/images/641723917_18128618890557056_250300516174668106_n.jpg"],
    description: "A striking blend of geometric structure and high-wattage shine. This square-cased Santos style watch is paved with brilliant VVS round diamonds across the bezel, case sides, dial face, and integrated white gold bracelet.",
    specs: JSON.stringify({
      movement: "Automatic Caliber Movement",
      stone: "Round Brilliant VVS Diamonds (Total 22.0 Carats)",
      case: "18k White Gold (40mm)",
      bezel: "Square Diamond Pave Bezel"
    }),
    care: "Wipe regularly with a microfiber cloth. Do not submerge in salt water."
  },
  {
    id: "prod-18",
    title: "Custom Winged Angel Face Pendant",
    category: "pendants",
    material: "14k Gold & Canary Diamonds",
    price: 5800,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/686281805_1535662337903927_6221901172189905796_n.jpg",
    thumbnails: ["/assets/images/686281805_1535662337903927_6221901172189905796_n.jpg"],
    description: "A unique custom-sculpted pendant held to the highest standards. Features a winged face motif paved with intense canary yellow diamonds on the face and white VVS diamonds on the wings, suspended from a diamond-accented bail.",
    specs: JSON.stringify({
      metal: "Solid 14k Yellow Gold",
      stone: "Canary Yellow & White VVS Diamonds (Total 6.8 Carats)",
      dimensions: "65mm x 45mm",
      bail: "Fits up to 12mm chains"
    }),
    care: "Use only warm water and a very soft brush. Dry completely before storing."
  },
  {
    id: "prod-19",
    title: "Vintage Emerald Cut Ring",
    category: "rings",
    material: "18k Yellow Gold & Emerald",
    price: 3200,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/503545241_17862149031426391_761653760876830438_n.jpg",
    thumbnails: ["/assets/images/503545241_17862149031426391_761653760876830438_n.jpg"],
    description: "A heritage design redefined. This vintage ring setting in warm 18k yellow gold holds a vibrant emerald-cut green emerald, flanked by brilliant baguette-cut diamonds for an absolute luxury look.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      stone: "Natural Green Emerald (1.5 Carats) and Baguette Diamonds",
      setting: "Bezel & Prong Setting"
    }),
    care: "Clean carefully. Avoid ultrasonic cleaners as emeralds are delicate."
  },
  {
    id: "prod-20",
    title: "Sapphire Diamond Halo Ring",
    category: "rings",
    material: "18k White Gold & Sapphire",
    price: 4100,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/503565116_17861482458426391_249500428216170849_n.jpg",
    thumbnails: ["/assets/images/503565116_17861482458426391_249500428216170849_n.jpg"],
    description: "Deep oceanic blue royal sapphire ring surrounded by a glittering halo of matched round brilliant VVS diamonds. Hand-cast in pure 18k white gold for a timeless presence.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      stone: "Royal Blue Sapphire (2.0 Carats) & VVS Diamonds (Total 0.8ct)",
      setting: "Classic Halo Setting"
    }),
    care: "Clean with warm water, mild soap, and a soft-bristled brush."
  },
  {
    id: "prod-21",
    title: "Imperial Gold Chain Necklace",
    category: "necklaces",
    material: "18k Solid Yellow Gold",
    price: 2850,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/503612415_17861545983426391_7631710889607204155_n.jpg",
    thumbnails: ["/assets/images/503612415_17861545983426391_7631710889607204155_n.jpg"],
    description: "A bold and solid statement chain crafted in Italy. Our Imperial Chain is cast in 18k solid yellow gold with custom lock safety closures, offering a sleek look that fits any premium outfit.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      width: "8mm",
      length: "20 inches",
      weight: "approx. 45 grams"
    }),
    care: "Wipe with a soft polishing cloth to maintain the high gloss mirror shine."
  },
  {
    id: "prod-22",
    title: "Pearl Luster Pendant",
    category: "pendants",
    material: "14k Gold & Natural Pearl",
    price: 1850,
    rating: 4.8,
    reviewsCount: 0,
    image: "/assets/images/504000704_17861519862426391_4303839881974050014_n.jpg",
    thumbnails: ["/assets/images/504000704_17861519862426391_4303839881974050014_n.jpg"],
    description: "A single, highly radiant South Sea pearl suspended from a custom 14k yellow gold diamond-paved bail. Delicate, modern elegance.",
    specs: JSON.stringify({
      metal: "Solid 14k Yellow Gold",
      stone: "South Sea Pearl (11mm diameter)",
      bail: "Paved with 0.15ct brilliant diamonds"
    }),
    care: "Pearls are organic. Keep away from perfumes, acids, and harsh soaps."
  },
  {
    id: "prod-23",
    title: "Diamond Tennis Necklace",
    category: "necklaces",
    material: "18k White Gold & Diamonds",
    price: 15500,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/515255261_17862817560426391_900831473192417878_n.jpg",
    thumbnails: ["/assets/images/515255261_17862817560426391_900831473192417878_n.jpg"],
    description: "A continuous flow of absolute radiance. The Diamond Tennis Necklace features a perfectly graduated sequence of matched round brilliant VVS diamonds prong-set in solid 18k white gold. Sleek safety lock mechanism.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      stone: "Matched Round Brilliant VVS Diamonds (Total 15.5 Carats)",
      length: "17 inches"
    }),
    care: "Professional inspections recommended every 6 months to check prong security."
  },
  {
    id: "prod-24",
    title: "Iced Out Solitaire Studs",
    category: "earrings",
    material: "14k White Gold & VVS Diamonds",
    price: 2400,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/524474771_17865858354426391_3150509920068753389_n.jpg",
    thumbnails: ["/assets/images/524474771_17865858354426391_3150509920068753389_n.jpg"],
    description: "Elegant, high-dispersion round brilliant diamond solitaire earrings. Held in dynamic 4-prong white gold baskets, these VVS diamonds capture the light with premium fire.",
    specs: JSON.stringify({
      metal: "Solid 14k White Gold",
      stone: "Matched Round Brilliant VVS1 Diamonds (Total 1.5 Carats)",
      closure: "Heavy duty push back lock"
    }),
    care: "Wipe with a microfiber cloth. Soak in warm soapy water to restore brilliance."
  },
  {
    id: "prod-25",
    title: "Classic Gold Hoops",
    category: "earrings",
    material: "18k Solid Yellow Gold",
    price: 1100,
    rating: 4.8,
    reviewsCount: 0,
    image: "/assets/images/527396337_1827024011359792_5153925414157942290_n.jpg",
    thumbnails: ["/assets/images/527396337_1827024011359792_5153925414157942290_n.jpg"],
    description: "Everyday luxury in its purest form. Crafted in solid 18k yellow gold, these high-polish hoops present a sleek profile, perfect weight, and absolute comfort-fit latch closures.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      diameter: "35mm",
      closure: "Snap post lock"
    }),
    care: "Clean with gold polishing cloth. Store in fabric pouch."
  },
  {
    id: "prod-26",
    title: "Vintage Platinum Band",
    category: "wedding bands",
    material: "Solid 950 Platinum",
    price: 1200,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/527452581_1067293382187755_69768922388660589_n.jpg",
    thumbnails: ["/assets/images/527452581_1067293382187755_69768922388660589_n.jpg"],
    description: "An elegant vintage-inspired wedding band crafted in solid 950 platinum, featuring a fine milgrain border and hand-polished satin finish details.",
    specs: JSON.stringify({
      metal: "Solid 950 Platinum",
      width: "5.5mm",
      fit: "Comfort Fit"
    }),
    care: "Polish with platinum cloth. Clean with mild soapy water."
  },
  {
    id: "prod-27",
    title: "Emerald Eternity Band",
    category: "wedding bands",
    material: "18k Yellow Gold & Emeralds",
    price: 2600,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/527456245_1483516309728796_6438227833154731815_n.jpg",
    thumbnails: ["/assets/images/527456245_1483516309728796_6438227833154731815_n.jpg"],
    description: "A continuous loop of lush green emeralds hand-set in solid 18k yellow gold. This eternity band represents endless commitment and high luxury styling.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      stone: "Round Brilliant Cut Natural Emeralds (Total 1.8 Carats)",
      setting: "Shared Prong Setting"
    }),
    care: "Avoid hard contact. Clean with warm soapy water and dry with microfiber cloth."
  },
  {
    id: "prod-28",
    title: "French Pavé Diamond Ring Setting",
    category: "engagement rings",
    material: "18k White Gold",
    price: 1850,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/527517722_17866470327426391_8999031617680294241_n.jpg",
    thumbnails: ["/assets/images/527517722_17866470327426391_8999031617680294241_n.jpg"],
    description: "A gorgeous French pavé ring band featuring hand-set micro-diamonds running along the shoulders of the 18k white gold band.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      setting: "Pavé",
      width: "1.8mm",
      accentStones: "0.35ct micro-pavé diamonds"
    }),
    care: "Wipe with a lint-free jewelry cloth. Avoid ultrasonic cleaning for micro-pavé stones."
  },
  {
    id: "prod-29",
    title: "Classic Halo Diamond Ring Setting",
    category: "engagement rings",
    material: "18k Yellow Gold",
    price: 2200,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg",
    thumbnails: ["/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg"],
    description: "Make your diamond look larger and more brilliant with a classic round halo setting crafted in solid 18k yellow gold.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      setting: "Halo",
      width: "2.1mm",
      accentStones: "0.50ct round brilliant diamonds"
    }),
    care: "Avoid abrasive solutions. Clean using warm soapy water and a soft-bristled brush."
  },
  {
    id: "prod-30",
    title: "Vintage Filigree Diamond Ring Setting",
    category: "engagement rings",
    material: "Solid 950 Platinum",
    price: 1950,
    rating: 4.8,
    reviewsCount: 0,
    image: "/assets/images/530392375_17867589615426391_5428670915730909007_n.jpg",
    thumbnails: ["/assets/images/530392375_17867589615426391_5428670915730909007_n.jpg"],
    description: "Antique romance meets precision engineering. Intricate milgrain details and filigree scrollwork in solid 950 platinum.",
    specs: JSON.stringify({
      metal: "Solid 950 Platinum",
      setting: "Vintage",
      width: "2.3mm"
    }),
    care: "Store separately in a fabric-lined box. Clean with a soft jewelry brush."
  },
  {
    id: "prod-31",
    title: "Cathedral Diamond Ring Setting",
    category: "engagement rings",
    material: "18k Rose Gold",
    price: 1450,
    rating: 4.9,
    reviewsCount: 0,
    image: "/assets/images/619991459_870329932295959_21626841659992945_n.jpg",
    thumbnails: ["/assets/images/619991459_870329932295959_21626841659992945_n.jpg"],
    description: "Architectural arches gracefully elevate your center stone. Handcrafted in romantic 18k rose gold.",
    specs: JSON.stringify({
      metal: "Solid 18k Rose Gold",
      setting: "Cathedral",
      width: "2.0mm"
    }),
    care: "Polish with a dry microfiber cloth. Avoid exposing to hot tubs or swimming pools."
  },
  {
    id: "prod-32",
    title: "Three Stone Diamond Ring Setting",
    category: "engagement rings",
    material: "18k Yellow Gold",
    price: 1700,
    rating: 5.0,
    reviewsCount: 0,
    image: "/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg",
    thumbnails: ["/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg"],
    description: "Representing your past, present, and future. Three matched round diamonds capture light in a gorgeous symbolic layout.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      setting: "Three Stone",
      width: "2.2mm"
    }),
    care: "Clean regularly in warm soapy water using a soft brush."
  }
];

const SEED_REVIEWS = [
  { id: "rev-1", productId: "prod-1", author: "Evelyn K.", rating: 5, comment: "Breathtaking quality. The VVS diamonds sparkle like crazy under any light. The gold has a nice heavy weight.", date: "May 12, 2026" },
  { id: "rev-2", productId: "prod-1", author: "Marcus T.", rating: 5, comment: "Custom work is outstanding. The setting is flawless and the detail is insane. Definitely coming back for more.", date: "April 28, 2026" },
  { id: "rev-3", productId: "prod-2", author: "Sarah H.", rating: 5, comment: "Super solid weight and the lock feels extremely secure. Perfect thickness for daily wear.", date: "June 02, 2026" },
  { id: "rev-4", productId: "prod-2", author: "Chloe L.", rating: 5, comment: "Exceeded my expectations. The link alignment is perfect and it feels extremely high-quality.", date: "May 19, 2026" },
  { id: "rev-5", productId: "prod-3", author: "Liam J.", rating: 5, comment: "Fit is absolutely perfect after using the impression kit. The shine is incredible.", date: "May 30, 2026" },
  { id: "rev-6", productId: "prod-3", author: "Elena R.", rating: 4, comment: "Got the upper set and they look amazing. Real solid gold, nice and heavy!", date: "April 15, 2026" },
  { id: "rev-7", productId: "prod-4", author: "Daniel S.", rating: 5, comment: "This watch is a masterpiece. The moissanite catches the light in a rainbow fire that is brighter than natural diamonds. Automatic movement is very smooth.", date: "May 10, 2026" },
  { id: "rev-8", productId: "prod-5", author: "Jessica M.", rating: 5, comment: "The sparkle is incredible, and the white gold setting is very sleek and sturdy. A beautiful daily luxury.", date: "June 05, 2026" },
  { id: "rev-9", productId: "prod-6", author: "Grace T.", rating: 5, comment: "Amazing detail! The 3D effect of the lettering makes it pop. The diamonds are super clean.", date: "May 24, 2026" }
];

// Setup local JSON file path with serverless / read-only filesystem fallback
const DEFAULT_LOCAL_DB_PATH = path.join(process.cwd(), '.local_db.json');
let cachedDbPath: string | null = null;

function getResolvedDbPath(): string {
  if (cachedDbPath) return cachedDbPath;
  try {
    if (fs.existsSync(DEFAULT_LOCAL_DB_PATH)) {
      fs.accessSync(DEFAULT_LOCAL_DB_PATH, fs.constants.R_OK | fs.constants.W_OK);
    } else {
      // Check if folder is writable by attempting a quick write
      fs.writeFileSync(DEFAULT_LOCAL_DB_PATH, '{}', 'utf-8');
    }
    cachedDbPath = DEFAULT_LOCAL_DB_PATH;
  } catch {
    const tempDir = process.env.TEMP || process.env.TMP || '/tmp';
    cachedDbPath = path.join(tempDir, '.local_db.json');
    console.warn(`Local directory is read-only or inaccessible. Mock database redirected to: ${cachedDbPath}`);
  }
  return cachedDbPath;
}

// Atomic file writer to prevent corruption under concurrent requests
function safeWriteFile(filePath: string, content: string) {
  const tempPath = `${filePath}.${Math.random().toString(36).substring(2)}.tmp`;
  try {
    fs.writeFileSync(tempPath, content, 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
    // Fallback direct write
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

interface SchemaState {
  users: any[];
  products: any[];
  reviews: any[];
  diamonds: any[];
  orders: any[];
  configurations: any[];
  newsletterSubscribers?: any[];
}

// Ensure the local JSON DB file exists with basic seed data
function initLocalDb(): SchemaState {
  const dbPath = getResolvedDbPath();
  if (!fs.existsSync(dbPath)) {
    const defaultData: SchemaState = {
      users: [
        {
          id: "admin-1",
          email: "admin@jdjewel.com",
          passwordHash: "$2b$10$UoW1iL39X1Q1eE4m3lP7fObT4m2V4o7W9l6E5r5Y5z5w5e5r5t5y", // Mock hash
          name: "Mohan Saina",
          role: "ADMIN",
          createdAt: new Date().toISOString()
        }
      ],
      products: SEED_PRODUCTS,
      reviews: SEED_REVIEWS,
      diamonds: [], // Preloaded VDB mock diamonds will populate here if needed
      orders: [],
      configurations: [],
      newsletterSubscribers: []
    };
    safeWriteFile(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(raw);
    
    // Auto-migration: ensure all SEED_PRODUCTS exist and have correct images in the local db
    let isDbModified = false;
    for (const seedProd of SEED_PRODUCTS) {
      const idx = data.products.findIndex((p: any) => p.id === seedProd.id);
      if (idx === -1) {
        data.products.push(seedProd);
        isDbModified = true;
      } else {
        if (data.products[idx].image !== seedProd.image) {
          data.products[idx].image = seedProd.image;
          data.products[idx].thumbnails = seedProd.thumbnails;
          isDbModified = true;
        }
      }
    }
    
    if (isDbModified) {
      safeWriteFile(dbPath, JSON.stringify(data, null, 2));
    }
    
    return data;
  } catch (e) {
    console.error("Failed to read local DB, resetting:", e);
    // Overwrite with empty structure to prevent crashes
    const defaultData = { users: [], products: SEED_PRODUCTS, reviews: SEED_REVIEWS, diamonds: [], orders: [], configurations: [], newsletterSubscribers: [] };
    safeWriteFile(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

// Write updates back to local file
function saveLocalDb(data: SchemaState) {
  const dbPath = getResolvedDbPath();
  safeWriteFile(dbPath, JSON.stringify(data, null, 2));
}

// Mock Prisma client mapping
class MockPrismaClient {
  private get data() {
    return initLocalDb();
  }

  private set data(state: SchemaState) {
    saveLocalDb(state);
  }

  public user = {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const u = this.data.users.find(u => {
        if (where.email) return u.email === where.email;
        if (where.id) return u.id === where.id;
        return false;
      });
      return u || null;
    },
    create: async ({ data }: { data: any }) => {
      const state = this.data;
      const newUser = { id: `usr-${Date.now()}`, role: 'CUSTOMER', createdAt: new Date().toISOString(), ...data };
      state.users.push(newUser);
      this.data = state;
      return newUser;
    }
  };

  public product = {
    findMany: async (args?: { where?: { category?: string } }) => {
      let prods = this.data.products;
      if (args?.where?.category) {
        const cat = args.where.category.toLowerCase();
        prods = prods.filter(p => p.category.toLowerCase() === cat);
      }
      return prods;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const prod = this.data.products.find(p => p.id === where.id);
      return prod || null;
    },
    create: async ({ data }: { data: any }) => {
      const state = this.data;
      const newProd = { id: `prod-${Date.now()}`, rating: 5.0, reviewsCount: 0, thumbnails: [data.image], ...data };
      state.products.push(newProd);
      this.data = state;
      return newProd;
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const state = this.data;
      const idx = state.products.findIndex(p => p.id === where.id);
      if (idx === -1) throw new Error("Product not found");
      state.products[idx] = { ...state.products[idx], ...data };
      this.data = state;
      return state.products[idx];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const state = this.data;
      const idx = state.products.findIndex(p => p.id === where.id);
      if (idx === -1) throw new Error("Product not found");
      const deleted = state.products.splice(idx, 1)[0];
      this.data = state;
      return deleted;
    }
  };

  public review = {
    findMany: async ({ where }: { where: { productId: string } }) => {
      return this.data.reviews.filter(r => r.productId === where.productId);
    },
    create: async ({ data }: { data: any }) => {
      const state = this.data;
      const newReview = { id: `rev-${Date.now()}`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), ...data };
      state.reviews.push(newReview);
      
      // Update product aggregate rating
      const pIdx = state.products.findIndex(p => p.id === data.productId);
      if (pIdx !== -1) {
        const prodReviews = state.reviews.filter(r => r.productId === data.productId);
        const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
        state.products[pIdx].rating = parseFloat((sum / prodReviews.length).toFixed(1));
        state.products[pIdx].reviewsCount = prodReviews.length;
      }
      
      this.data = state;
      return newReview;
    }
  };

  public diamond = {
    findMany: async (args?: { where?: any }) => {
      let list = this.data.diamonds;
      if (args?.where) {
        const { shape, color, clarity, cut, priceMin, priceMax, caratMin, caratMax } = args.where;
        if (shape) list = list.filter(d => d.shape.toLowerCase() === shape.toLowerCase());
        if (color) list = list.filter(d => color.includes(d.color));
        if (clarity) list = list.filter(d => clarity.includes(d.clarity));
        if (cut) list = list.filter(d => cut.includes(d.cut));
        if (priceMin !== undefined) list = list.filter(d => d.price >= priceMin);
        if (priceMax !== undefined) list = list.filter(d => d.price <= priceMax);
        if (caratMin !== undefined) list = list.filter(d => d.carat >= caratMin);
        if (caratMax !== undefined) list = list.filter(d => d.carat <= caratMax);
      }
      return list;
    },
    findUnique: async ({ where }: { where: { id?: string; certificateNo?: string } }) => {
      return this.data.diamonds.find(d => {
        if (where.id) return d.id === where.id;
        if (where.certificateNo) return d.certificateNo === where.certificateNo;
        return false;
      }) || null;
    },
    create: async ({ data }: { data: any }) => {
      const state = this.data;
      const newDiamond = { id: `dia-${Date.now()}`, ...data };
      state.diamonds.push(newDiamond);
      this.data = state;
      return newDiamond;
    }
  };

  public order = {
    findMany: async (args?: { where?: { userId?: string } }) => {
      let ords = this.data.orders;
      if (args?.where?.userId) {
        ords = ords.filter(o => o.userId === args.where?.userId);
      }
      return ords;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      return this.data.orders.find(o => o.id === where.id) || null;
    },
    create: async ({ data }: { data: any }) => {
      const state = this.data;
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `JD-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Handle relation structure logic
      const { items, ...header } = data;
      const orderItems = (items?.create || []).map((itm: any, idx: number) => ({
        id: `orditem-${orderId}-${idx}`,
        orderId,
        ...itm
      }));

      const newOrder = {
        id: orderId,
        orderNumber,
        status: "PLACED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: orderItems,
        ...header
      };

      state.orders.push(newOrder);
      this.data = state;
      return newOrder;
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const state = this.data;
      const idx = state.orders.findIndex(o => o.id === where.id);
      if (idx === -1) throw new Error("Order not found");
      state.orders[idx] = { ...state.orders[idx], ...data, updatedAt: new Date().toISOString() };
      this.data = state;
      return state.orders[idx];
    }
  };

  public configuration = {
    findUnique: async ({ where }: { where: { id: string } }) => {
      return this.data.configurations.find(c => c.id === where.id) || null;
    },
    create: async ({ data }: { data: any }) => {
      const state = this.data;
      const newConfig = { id: `cfg-${Date.now()}`, createdAt: new Date().toISOString(), ...data };
      state.configurations.push(newConfig);
      this.data = state;
      return newConfig;
    }
  };

  public newsletterSubscriber = {
    findMany: async (args?: any) => {
      const subs = this.data.newsletterSubscribers || [];
      if (args?.orderBy?.createdAt === 'desc') {
        return [...subs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return subs;
    },
    findUnique: async ({ where }: { where: { email: string } }) => {
      const subs = this.data.newsletterSubscribers || [];
      return subs.find((s: any) => s.email === where.email) || null;
    },
    create: async ({ data }: { data: { email: string } }) => {
      const state = this.data;
      if (!state.newsletterSubscribers) {
        state.newsletterSubscribers = [];
      }
      const newSub = {
        id: `sub-${Date.now()}`,
        email: data.email,
        createdAt: new Date().toISOString()
      };
      state.newsletterSubscribers.push(newSub);
      this.data = state;
      return newSub;
    }
  };
}

class DatabaseProxy {
  private prisma: PrismaClient;
  private mock: MockPrismaClient;
  private useMock: boolean = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.mock = new MockPrismaClient();
  }

  public async $transaction(actions: any) {
    if (this.useMock) {
      if (typeof actions === 'function') {
        return actions(this.mock);
      }
      return actions;
    }
    try {
      if (typeof actions === 'function') {
        return await this.prisma.$transaction(async (tx) => {
          return actions(tx);
        });
      }
      return await this.prisma.$transaction(actions);
    } catch (error: any) {
      const isConnectionError = 
        error.code === 'P1001' || 
        error.code === 'P1002' || 
        error.code === 'P1003' ||
        error.message?.includes("Can't reach database server") ||
        error.message?.includes("failed to connect") ||
        error.message?.includes("Timed out");

      if (isConnectionError) {
        console.warn(`[Database Failover] Transaction failed, switching to local offline DB.`);
        this.useMock = true;
        if (typeof actions === 'function') {
          return actions(this.mock);
        }
        return actions;
      }
      throw error;
    }
  }

  public get user() { return this.wrap('user'); }
  public get product() { return this.wrap('product'); }
  public get order() { return this.wrap('order'); }
  public get review() { return this.wrap('review'); }
  public get diamond() { return this.wrap('diamond'); }
  public get configuration() { return this.wrap('configuration'); }
  public get newsletterSubscriber() { return this.wrap('newsletterSubscriber'); }

  private wrap(modelName: string) {
    const prismaModel = (this.prisma as any)[modelName];
    const mockModel = (this.mock as any)[modelName];

    return new Proxy(prismaModel, {
      get: (target, prop) => {
        const originalMethod = target[prop];
        if (typeof originalMethod !== 'function') return originalMethod;

        return async (...args: any[]) => {
          if (this.useMock) {
            return mockModel[prop](...args);
          }
          try {
            return await originalMethod.apply(target, args);
          } catch (error: any) {
            console.error("[Database Proxy Error details]:", {
              message: error.message,
              code: error.code,
              meta: error.meta
            });
            const isConnectionError = 
              error.code === 'P1001' || 
              error.code === 'P1002' || 
              error.code === 'P1003' ||
              error.message?.includes("Can't reach database server") ||
              error.message?.includes("failed to connect") ||
              error.message?.includes("Timed out");

            if (isConnectionError) {
              console.warn(`[Database Failover] Unable to connect to Supabase database. Falling back to local offline JSON database (.local_db.json).`);
              this.useMock = true;
              return mockModel[prop](...args);
            }
            throw error;
          }
        };
      }
    });
  }
}

// Global caching for development hot reloading
let dbInstance: any;

export function getDbClient(): any {
  if (process.env.DATABASE_URL) {
    if (!global.prismaGlobal) {
      global.prismaGlobal = new DatabaseProxy() as any;
    }
    return global.prismaGlobal;
  } else {
    if (!global.mockDbGlobal) {
      global.mockDbGlobal = new MockPrismaClient();
    }
    return global.mockDbGlobal;
  }
}

// Declare globals for TypeScript caching
declare global {
  var prismaGlobal: any;
  var mockDbGlobal: any;
}
