import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Noto_Sans, Geist_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const geistMonoHeading = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-heading',
});

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn('font-sans', notoSans.variable, geistMonoHeading.variable)}
    >
      <body>
        <ThemeProvider attribute='class' defaultTheme='dark' forcedTheme='dark'>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
