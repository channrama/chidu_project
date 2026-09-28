import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'State Hostel Portal',
  description: 'Student and admin hostel management portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
