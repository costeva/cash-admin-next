import { Logo } from "@/components/ui/Logo";

export default function layoutAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        <div className="flex justify-center items-center bg-cover bg-no-repeat lg:py-20 lg:bg-[url('/grafica.png')]">
          <div className="w-96 lg:py-20 ">
            <Logo />
          </div>
        </div>
        <div className="p-10 lg:py-28">
          <div className="max-w-3xl mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
