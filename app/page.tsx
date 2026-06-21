import { getAllEventCounts } from '@/lib/kv'

export const revalidate = 0

export default async function AdminPage() {
  const counts = await getAllEventCounts()
  const eventNames = Object.keys(counts).sort()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Minigraf Analytics</h1>

      {eventNames.length === 0 && (
        <p className="text-gray-500">No events recorded yet.</p>
      )}

      {eventNames.map((eventName) => {
        const daily = counts[eventName]
        const dates = Object.keys(daily).sort().reverse()
        const total = Object.values(daily).reduce((a, b) => a + b, 0)

        return (
          <section key={eventName} className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">{eventName}</h2>
            <table className="w-full max-w-xs text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-left text-gray-400">
                  <th className="pb-2 pr-8 font-medium">Date</th>
                  <th className="pb-2 font-medium">Count</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((date) => (
                  <tr key={date} className="border-b border-gray-800">
                    <td className="py-1.5 pr-8 text-gray-300">{date}</td>
                    <td className="py-1.5">{daily[date]}</td>
                  </tr>
                ))}
                <tr className="text-gray-400 font-medium">
                  <td className="pt-2 pr-8">Total</td>
                  <td className="pt-2">{total}</td>
                </tr>
              </tbody>
            </table>
          </section>
        )
      })}
    </main>
  )
}
