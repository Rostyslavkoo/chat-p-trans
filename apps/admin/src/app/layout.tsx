import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Панель підтримки — P-Trans",
  description: "Manager support inbox",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
