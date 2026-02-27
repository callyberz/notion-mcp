export interface WishlistItem {
  id: string;
  name: string;
  url?: string;
  price?: number;
  notes?: string[];
  isPreferred?: boolean;
  imageUrl?: string;
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
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/vesken-corner-shelf-unit-white__0831999_pe777543_s5.jpg",
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
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/lanesund-sideboard-gray-brown__1160570_pe888966_s5.jpg",
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
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/hauga-sideboard-white__1398029_pe967825_s5.jpg",
      },
      {
        id: "besta",
        name: "BESTÅ Storage combination with doors",
        url: "https://www.ikea.com/ca/en/p/besta-storage-combination-with-doors-lappviken-stubbarp-sindvik-white-clear-glass-s59419086/",
        price: 700,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/besta-storage-combination-with-doors-lappviken-stubbarp-sindvik-white-clear-glass__0979800_pe814713_s5.jpg",
        notes: ["Good option, costs a bit less ~$700"],
      },
      {
        id: "skruvby",
        name: "SKRUVBY Sideboard - white",
        url: "https://www.ikea.com/ca/en/p/skruvby-sideboard-white-60568725/",
        price: 249,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/skruvby-sideboard-white__1241237_pe919729_s5.jpg",
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
        price: 299,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/fjaellbo-sideboard-black__1129167_pe891018_s5.jpg",
        notes: ["Bigger size, for coffee machine and grinder"],
      },
      {
        id: "vihals",
        name: "VIHALS Cabinet with sliding glass doors - white",
        url: "https://www.ikea.com/ca/en/p/vihals-cabinet-with-sliding-glass-doors-white-80542876/",
        price: 159,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/vihals-cabinet-with-sliding-glass-doors-white__1203697_pe906388_s5.jpg",
        notes: ["Smaller size"],
      },
      {
        id: "sagmaestare",
        name: "SAGMÅSTARE Cabinet - light gray-blue",
        url: "https://www.ikea.com/ca/en/p/sagmaestare-cabinet-light-gray-blue-90555364/",
        price: 129,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/sagmaestare-cabinet-light-gray-blue__1391205_pe965711_s5.jpg",
        notes: ["Might be too high"],
      },
      {
        id: "hauga-glass",
        name: "HAUGA Glass-door cabinet - gray",
        url: "https://www.ikea.com/ca/en/p/hauga-glass-door-cabinet-gray-80415048/",
        price: 279,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/hauga-glass-door-cabinet-gray__0914106_pe783848_s5.jpg",
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
        price: 1390,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/barsloev-3-seat-sofa-bed-with-chaise-lounge-tibbleby-beige-gray__1213693_pe911220_s5.jpg",
      },
      {
        id: "morabo",
        name: "MORABO Loveseat with chaise - Gunnared light green/wood",
        url: "https://www.ikea.com/ca/en/p/morabo-loveseat-with-chaise-gunnared-light-green-wood-s89575886/",
        price: 1199,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/morabo-loveseat-with-chaise-gunnared-light-green-wood__0602395_pe680328_s5.jpg",
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
        price: 577,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/utaker-stackable-bed-with-2-mattresses-pine-asvang-medium-firm__1161848_pe889564_s5.jpg",
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
        price: 24.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/lennart-drawer-unit-white__0395412_pe564513_s5.jpg",
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
        price: 0.69,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/paerkla-shoe-bag__1045872_pe842745_s5.jpg",
      },
      {
        id: "frakta",
        name: "FRAKTA Storage bag - blue",
        url: "https://www.ikea.com/ca/en/p/frakta-storage-bag-blue-90149148",
        price: 3.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/frakta-storage-bag-blue__0711261_pe728099_s5.jpg",
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
        price: 79.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/nipasen-coat-rack-and-bench-w-shoe-storage-black__1390535_pe965439_s5.jpg",
      },
      {
        id: "mackapaer",
        name: "MACKAPÄER Coat rack with shoe storage unit - white",
        url: "https://www.ikea.com/ca/en/p/mackapaer-coat-rack-with-shoe-storage-unit-white-50530988/",
        price: 79.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/mackapaer-coat-rack-with-shoe-storage-unit-white__1094141_pe863318_s5.jpg",
      },
      {
        id: "alganas",
        name: "ÄLGANÄS Hat and coat stand - black",
        url: "https://www.ikea.com/ca/en/p/aelganaes-hat-and-coat-stand-black-90585894/",
        price: 34.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/aelganaes-hat-and-coat-stand-black__1358349_pe953846_s5.jpg",
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
        price: 19.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/vattenkar-desktop-shelf-black__1150009_pe884317_s5.jpg",
        notes: ["On dining tables?"],
      },
      {
        id: "skadis",
        name: "SKÅDIS Pegboard - wood",
        url: "https://www.ikea.com/ca/en/p/skadis-pegboard-wood-10347171/",
        price: 24.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/skadis-pegboard-wood__0710684_pe727713_s5.jpg",
        notes: ["Pegboard for the coat rack?"],
      },
      {
        id: "palycke-basket",
        name: "PÅLYCKE Clip-on basket",
        url: "https://www.ikea.com/ca/en/p/palycke-clip-on-basket-00534432/",
        price: 7.99,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/palycke-clip-on-basket__1094044_pe863299_s5.jpg",
      },
      {
        id: "palycke-hook",
        name: "PÅLYCKE Clip-on hook rack",
        url: "https://www.ikea.com/ca/en/p/palycke-clip-on-hook-rack-80541155/",
        price: 2.49,
        imageUrl:
          "https://www.ikea.com/ca/en/images/products/palycke-clip-on-hook-rack__1093997_pe863271_s5.jpg",
      },
    ],
  },
];
