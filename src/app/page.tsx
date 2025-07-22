import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Projet Capponuts
        </h1>
        <p className="text-xl text-white/80">
          Bienvenue sur votre nouveau projet
        </p>
      </div>
    </main>
  )
}
