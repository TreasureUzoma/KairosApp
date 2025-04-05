import Image from "next/image";

function Logo() {
  return (
    <main>
      <section className="flex justify-center items-center space-x-1">
        <Image
          src="/logo/white-logo.png"
          alt="Logo Dark"
          width={29}
          height={29}
          className="object-contain hidden dark:block"
          layout="intrinsic"
        />
        <Image
          src="/logo/black-logo.png"
          alt="Logo Light"
          width={29}
          height={29}
          className="object-contain block dark:hidden"
          layout="intrinsic"
        />
        <p className="text-black text-[22px] font-orbitron md:text-[20px] font-bolder dark:text-white">
          Kairos
        </p>
      </section>
    </main>
  );
}

export default Logo;
