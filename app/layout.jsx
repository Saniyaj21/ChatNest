import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'


export const metadata = {
  title: "ChatNest",
  description: "A modern chat application with global, group, and AI chat features.",
  icons: {
    icon: "/favicon.ico", // or "/favicon.ico" if you prefer the .ico
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
