const products = [
  {
    price: 6534,
    qtyInStock: 100,
    name: "ASRock B550M Phantom Gaming 4 DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699012801/circuitcrafter/jbaqlp8uqts4izzynmnj.webp",
  },
  {
    price: 6134,
    qtyInStock: 100,
    name: "ASRock B550M-HDV Supports 3rd Gen AMD AM4 Ryzen DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699012885/circuitcrafter/msw9od3hj5umecwlc8z9.webp",
  },
  {
    price: 9075,
    qtyInStock: 100,
    name: "ASROCK B560M PRO4 DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699012931/circuitcrafter/szjfxucztogphh5zxn2j.webp",
  },
  {
    price: 12705,
    qtyInStock: 100,
    name: "Asrock B560 Steel Legend DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699012946/circuitcrafter/xkk6htetr4h9r971oxfv.webp",
  },
  {
    price: 12000,
    qtyInStock: 100,
    name: "ASROCK B660M-ITX AC DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699012977/circuitcrafter/r3rg2m3dgpxqskfyx0h2.webp",
  },
  {
    price: 4900,
    qtyInStock: 100,
    name: "ASROCK H81M-VG4 R4 DDR3 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699012995/circuitcrafter/vfeutfkescz8zj9s0iag.webp",
  },
  {
    price: 38115,
    qtyInStock: 100,
    name: "ASROCK Z590 Taichi DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013049/circuitcrafter/nzcyez2xoljd5z1bxz33.webp",
  },
  {
    price: 17666,
    qtyInStock: 100,
    name: "ASRock Z790M PG Lightning/D4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013070/circuitcrafter/d93a62umrtxnuzou32z8.webp",
  },
  {
    price: 11300,
    qtyInStock: 100,
    name: "ASUS EX-B760M-V5 DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013112/circuitcrafter/n27px4r7jjakqleql4q6.webp",
  },
  {
    price: 22869,
    qtyInStock: 100,
    name: "Gigabyte Z690 GAMING X DDR4 V2 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013327/circuitcrafter/taq2e3g1ffxerx1pe1rx.webp",
  },
  {
    price: 5677,
    qtyInStock: 100,
    name: "Gigabyte H410M H V2 (rev. 1.0) DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013371/circuitcrafter/dhex6757prjoptecwbbe.webp",
  },
  {
    price: 56776,
    qtyInStock: 100,
    name: "Gigabyte GA-H110M-H (rev. 1.x) DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013380/circuitcrafter/kmfxcw2krcnjtnxqpadu.webp",
  },
  {
    price: 56776,
    qtyInStock: 100,
    name: "MSI MAG B550 TOMAHAWK MAX WIFI DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013422/circuitcrafter/cofszdsz5rccvd1hci3k.webp",
  },
  {
    price: 29800,
    qtyInStock: 100,
    name: "ASUS TUF GAMING Z790-PLUS WIFI DDR5 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013433/circuitcrafter/rjzkzirvs20jodqnqflh.webp",
  },
  {
    price: 29800,
    qtyInStock: 100,
    name: "Gigabyte Z790 UD (rev. 1.0) DDR5 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013477/circuitcrafter/flychlzetp0sxmls402x.webp",
  },
  {
    price: 8600,
    qtyInStock: 100,
    name: "MSI B450 GAMING PLUS MAX DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013492/circuitcrafter/exbm1zb74dfcbfwmoees.webp",
  },
  {
    price: 5100,
    qtyInStock: 100,
    name: "Colorful H510M-T M.2 V20 DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013511/circuitcrafter/tw6fssehdfx8x31dcaq5.webp",
  },
  {
    price: 15700,
    qtyInStock: 100,
    name: "MSI MPG Z590 Gaming Plus DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013529/circuitcrafter/eahape0trgmsjhj3lpro.webp",
  },
  {
    price: 12500,
    qtyInStock: 100,
    name: "Gigabyte B760M GAMING AC DDR5 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013545/circuitcrafter/mjgnoed9tcumz8zhscx7.webp",
  },
  {
    price: 22670,
    qtyInStock: 100,
    name: "ASUS Prime Z790-P-CSM ATX DDR5 MOTHERBOARD",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013565/circuitcrafter/tbabqkvywkijl7czyxqx.webp",
  },
  {
    price: 22670,
    qtyInStock: 100,
    name: "GIGABYTE B550 AORUS Master DDR4 Motherboard",
    image:
      "http://res.cloudinary.com/de128upqy/image/upload/v1699013602/circuitcrafter/elrtt29jcfzt4pwlc16q.webp",
  },
];

export default products;
