export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      BARRA LATERAL
      {children}
    </main>
  );
}
