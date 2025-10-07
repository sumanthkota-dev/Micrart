import Link from 'next/link';

interface CardProps {
  title: string;
  image: string;
  href: string;
}

export default function Card({ title, image, href }: CardProps) {
  return (
    <Link href={href} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 font-semibold">{title}</div>
    </Link>
  );
}
