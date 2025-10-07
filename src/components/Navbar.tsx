import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-[1300px] mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl text-gray-900 hover:text-purple-600"
        >
          Micrart
        </Link>
        <div className="space-x-4">
          <Link href="/blog" className="text-gray-900 hover:text-purple-600">
            Blog
          </Link>
          <Link href="/admin/login" className="text-gray-900 hover:text-purple-600">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
