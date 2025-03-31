import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/logo_cash.svg"
      alt="Logo"
      width={0}
      height={0}
      className="w-full"
      priority
    />
  );
}
