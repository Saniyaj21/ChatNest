import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'


export const metadata = {
  title: "ChatNest",
  description: "A modern chat application with global, group, and AI chat features.",
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
