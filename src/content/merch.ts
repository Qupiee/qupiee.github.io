import type { MerchItem, MerchStatus } from "./types";

export const merchStatusLabel: Record<MerchStatus, string> = {
  available: "В наличии",
  preorder: "Предзаказ",
  soon: "Скоро",
  "sold-out": "Распродано",
};

export const merch: MerchItem[] = [
  {
    id: "acrylic-stand",
    title: "Акриловая фигурка",
    price: 990,
    status: "available",
    description: [
      "Маленькая Missouri, которая будет охранять твой рабочий стол и следить, чтобы ты не забывал пить чай.",
      "Двусторонняя печать, подставка в форме сердечка.",
    ],
    details: [
      { label: "Высота", value: "12 см" },
      { label: "Материал", value: "акрил 3 мм" },
    ],
    images: ["merch/acrylic-stand/1.png", "merch/acrylic-stand/2.png", "merch/acrylic-stand/3.png"],
    credits: [{ name: "Художник", url: "https://example.com/merch-artist", role: "Арт" }],
  },
  {
    id: "keychain",
    title: "Брелок с рожками",
    price: 450,
    status: "available",
    description: ["Маленький акриловый брелок с блёстками — носи демоницу с собой."],
    details: [{ label: "Размер", value: "6 см" }],
    images: ["merch/keychain/1.png", "merch/keychain/2.png", "merch/keychain/3.png"],
  },
  {
    id: "stickers",
    title: "Набор стикеров",
    price: 350,
    status: "preorder",
    description: ["Восемь виниловых стикеров с самыми любимыми эмоциями из чата."],
    details: [
      { label: "В наборе", value: "8 шт." },
      { label: "Покрытие", value: "голографическое" },
    ],
    images: ["merch/stickers/1.png", "merch/stickers/2.png", "merch/stickers/3.png"],
  },
  {
    id: "plush",
    title: "Плюшевая Missouri",
    price: null,
    status: "soon",
    description: ["Мягкая, уютная и немножко демоническая. Цена и дата появятся позже — следи за анонсами в Telegram."],
    images: ["merch/plush/1.png", "merch/plush/2.png", "merch/plush/3.png"],
  },
  {
    id: "hoodie",
    title: "Худи «Cozy Demon»",
    price: 4290,
    status: "sold-out",
    description: ["Оверсайз-худи с вышивкой рожек на капюшоне. Первая партия разошлась — возможно, будет допечатка."],
    details: [
      { label: "Размеры", value: "S–XL" },
      { label: "Ткань", value: "футер с начёсом" },
    ],
    images: ["merch/hoodie/1.png", "merch/hoodie/2.png", "merch/hoodie/3.png"],
  },
  {
    id: "mousepad",
    title: "Коврик для мыши",
    price: 1490,
    status: "available",
    description: ["Большой коврик с артом стрима — для тех, кто играет так же уютно, как Missouri."],
    details: [{ label: "Размер", value: "80 × 30 см" }],
    images: ["merch/mousepad/1.png", "merch/mousepad/2.png", "merch/mousepad/3.png"],
  },
];
