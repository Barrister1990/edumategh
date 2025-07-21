// app/layout.tsx
//import { Footer } from '@/components/Footer';
//import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
  {/* Mouse  <Navbar /> gradient */}    
          <main className="flex-1">{children}</main>
           {/* Mouse  <Footer /> gradient */}    
          
        </div>
        <Toaster />
      </body>
    </html>
  );
}
