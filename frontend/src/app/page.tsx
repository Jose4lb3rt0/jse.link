import Image from "next/image";

export default function Home() {
  return (
    <div>
      <form>
      <input type="url" className="bg-white text-black" />
      <button type="submit">Submit</button>
      </form>
    </div>
  );
}
