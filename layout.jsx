export const metadata = {
  title: "One Roof",
  description: "One page, any category, your own online shop.",
  manifest: "/manifest.json",
  themeColor: "#2B1B12",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "One Roof",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
