import Image from "next/image";
export default function Test() {
  return (
    <div className="container">
      {/* navbar */}
      <div className=" flex top-0 border-2 rounded-md h-10">
        <div className="m-auto align-middle">
          {/* logo */}
          <Image src="/user.png" width="30" height="20" className="w-10" />
          {/* logo */}
        </div>
      </div>
    </div>
  );
}
