export interface WishlistItem {
  id: string;
  name: string;
  url?: string;
  price?: number;
  notes?: string[];
  isPreferred?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  purchaseDeadline?: string;
  items: WishlistItem[];
}

export const categories: Category[] = [
  {
    id: "washroom",
    name: "Washroom Corner Shelf",
    icon: "🚿",
    items: [
      {
        id: "vesken",
        name: "VESKEN Corner shelf unit - white 33x33x71 cm",
        url: "https://www.ikea.com/ca/en/p/vesken-corner-shelf-unit-white-70471092/",
        price: 17.99,
      },
    ],
  },
  {
    id: "hallway-coat",
    name: "Hallway Coat Stand",
    icon: "🧥",
    items: [
      {
        id: "alganas",
        name: "ÄLGANÄS Hat and coat stand - black",
        url: "https://www.ikea.com/ca/en/p/aelganaes-hat-and-coat-stand-black-90585894/",
        price: 34.99,
      },
    ],
  },
  {
    id: "sideboard",
    name: "Sideboard",
    icon: "🗄️",
    items: [
      {
        id: "lanesund",
        name: "LÄNESUND Sideboard - gray-brown",
        url: "https://www.ikea.com/ca/en/p/lanesund-sideboard-gray-brown-90466546/",
        price: 899.99,
        isPreferred: true,
        notes: [
          "Good size, fits the area next to the balcony window",
          "Storage for: dishes, kitchenware, snacks, etc.",
          "Look for a similar product",
        ],
      },
      {
        id: "hauga-sideboard",
        name: "HAUGA Sideboard - white",
        url: "https://www.ikea.com/ca/en/p/hauga-sideboard-white-50596559/",
        price: 499.99,
      },
      {
        id: "besta",
        name: "BESTÅ Storage combination with doors",
        url: "https://www.ikea.com/ca/en/p/besta-storage-combination-with-doors-lappviken-stubbarp-sindvik-white-clear-glass-s59419086/",
        price: 700,
        notes: ["Good option, costs a bit less ~$700"],
      },
    ],
  },
  {
    id: "tea-cabinet",
    name: "Tea Cabinet",
    icon: "☕",
    items: [
      {
        id: "fjaellbo",
        name: "FJÄLLBO Sideboard - black",
        url: "https://www.ikea.com/ca/en/p/fjaellbo-sideboard-black-00502799/",
        notes: ["Bigger size, for coffee machine and grinder"],
      },
      {
        id: "vihals",
        name: "VIHALS Cabinet with sliding glass doors - white",
        url: "https://www.ikea.com/ca/en/p/vihals-cabinet-with-sliding-glass-doors-white-80542876/",
        notes: ["Smaller size"],
      },
      {
        id: "sagmaestare",
        name: "SAGMÅSTARE Cabinet - light gray-blue",
        url: "https://www.ikea.com/ca/en/p/sagmaestare-cabinet-light-gray-blue-90555364/",
        notes: ["Might be too high"],
      },
      {
        id: "hauga-glass",
        name: "HAUGA Glass-door cabinet - gray",
        url: "https://www.ikea.com/ca/en/p/hauga-glass-door-cabinet-gray-80415048/",
        notes: ["Might be too high"],
      },
    ],
  },
  {
    id: "sofa-bed",
    name: "Sofa Bed",
    icon: "🛋️",
    items: [
      {
        id: "barsloev",
        name: "BÅRSLÖV 3-seat sofa-bed with chaise longue - beige/gray",
        url: "https://www.ikea.com/ca/en/p/barsloev-3-seat-sofa-bed-with-chaise-lounge-tibbleby-beige-gray-50541581/",
      },
    ],
  },
  {
    id: "guest-bed",
    name: "Guest Bed",
    icon: "🛏️",
    purchaseDeadline: "June/July 2026",
    items: [
      {
        id: "utaker",
        name: "UTÅKER Stackable bed with 2 mattresses",
        url: "https://www.ikea.com/ca/en/p/utaker-stackable-bed-with-2-mattresses-pine-asvang-medium-firm-s09428125/",
        notes: [
          "2 Mattress + Bed frame",
          "Flexible",
          "Can purchase no later than June/July",
        ],
      },
    ],
  },
  {
    id: "drawer",
    name: "Drawer",
    icon: "👕",
    items: [
      {
        id: "lennart",
        name: "LENNART Drawer unit - white",
        url: "https://www.ikea.com/ca/en/p/lennart-drawer-unit-white-30326177/",
        notes: ["For clothing"],
      },
    ],
  },
  {
    id: "moving-storage",
    name: "Moving Storage",
    icon: "📦",
    items: [
      {
        id: "parkla",
        name: "PÄRKLA Shoe bag",
        url: "https://www.ikea.com/ca/en/p/paerkla-shoe-bag-30522381/",
      },
      {
        id: "frakta",
        name: "FRAKTA Storage bag - blue",
        url: "https://www.ikea.com/ca/en/p/frakta-storage-bag-blue-90149148",
      },
    ],
  },
  {
    id: "shoe-coat-rack",
    name: "Shoe & Coat Rack",
    icon: "👟",
    items: [
      {
        id: "nipasen",
        name: "NIPASÈN Coat rack and bench with shoe storage - black",
        url: "https://www.ikea.com/ca/en/p/nipasen-coat-rack-and-bench-w-shoe-storage-black-50586145/",
      },
    ],
  },
  {
    id: "organiser",
    name: "Organiser",
    icon: "🗂️",
    items: [
      {
        id: "vattenkar",
        name: "VATTENKAR Desktop shelf - black",
        url: "https://www.ikea.com/ca/en/p/vattenkar-desktop-shelf-black-40541572/",
        notes: ["On dining tables?"],
      },
      {
        id: "skadis",
        name: "SKÅDIS Pegboard - wood",
        url: "https://www.ikea.com/ca/en/p/skadis-pegboard-wood-10347171/",
        notes: ["Pegboard for the coat rack?"],
      },
      {
        id: "palycke-basket",
        name: "PÅLYCKE Clip-on basket",
        url: "https://www.ikea.com/ca/en/p/palycke-clip-on-basket-00534432/",
      },
      {
        id: "palycke-hook",
        name: "PÅLYCKE Clip-on hook rack",
        url: "https://www.ikea.com/ca/en/p/palycke-clip-on-hook-rack-80541155/",
      },
    ],
  },
];
