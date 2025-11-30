import './globals.css';
import { Providers } from "@/components/Providers";

/**
 * Metadata for the application, used by Next.js for SEO and document head configuration.
 */
export const metadata = {
    title: 'Seamless QR Dining',
    description: 'Order food from your table',
    icons: {
        icon: '/favicon.png',
    },
};

/**
 * The root layout component for the application.
 * Wraps all pages with the necessary providers and basic HTML structure.
 *
 * @component
 * @example
 * <RootLayout>
 *   <Page />
 * </RootLayout>
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page content.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
