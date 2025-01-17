import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div className="auth-asset-img">
          <Image
            src="/icons/auth-image.webp"
            alt="auth image"
            width={700}
            height={700}
          />
        </div>
      </div>
    </main>
  );
}
