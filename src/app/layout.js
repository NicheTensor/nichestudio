import { Poppins } from "next/font/google";
import { NextUIProvider } from '@nextui-org/react'
import "./globals.css";
import Favicon from '../../public/favicon.ico';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"]
});

export const metadata = {
  title: "NicheTensor Studio",
  description: "NicheTensor Studio",
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextUIProvider style={{ background: "#F5F5F5" }} className="text-primary">
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
