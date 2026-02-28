import localFont from "next/font/local";

export const productSans = localFont({
  src: [
    {
      path: "../../public/fonts/ProductSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProductSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProductSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-product-sans",
  display: "swap",
});
