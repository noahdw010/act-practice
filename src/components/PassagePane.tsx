import { getPassage } from '../data'

export function PassagePane({ passageId }: { passageId?: string }) {
  const passage = getPassage(passageId)
  if (!passage) return null

  return (
    <div className="h-full overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-5">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">{passage.title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        {passage.text.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {passage.table && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {passage.table.headers.map((h) => (
                  <th
                    key={h}
                    className="border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold text-slate-900"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {passage.table.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-slate-200 px-3 py-2 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
