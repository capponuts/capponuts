interface Props { params: { id: string } }

export default function ProfilePage({ params }: Props) {
  const { id } = params
  return (
    <main className="min-h-screen p-6 text-cyan-100">
      <h1 className="text-2xl mb-4">Profil public</h1>
      <div>ID: {id}</div>
      <p className="opacity-80 mt-2">Stats agrégées et liens publics (à venir)</p>
    </main>
  )
}


