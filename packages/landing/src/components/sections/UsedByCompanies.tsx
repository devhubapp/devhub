import { aspectRatioToStyle } from '../../helpers'

export interface UsedByCompaniesProps {}

export default function UsedByCompanies(_props: UsedByCompaniesProps) {
  return (
    <section id="trusted-by" className="bg-gray-200 p-6 mb-16 md:mb-32">
      <div className="container text-center">
        <h3 className="uppercase">Loved by</h3>
        <h4>15,000+ Developers and Managers, including from:</h4>

        <div className="flex flex-row justify-center mt-3">
          <div className="w-32">
            <div
              className="bg-gray-400 rounded-full"
              style={aspectRatioToStyle(1 / 3)}
            />
          </div>
          <div className="w-32 ml-1 lg:ml-3">
            <div
              className="bg-gray-400 rounded-full"
              style={aspectRatioToStyle(1 / 3)}
            />
          </div>
          <div className="w-32 ml-1 lg:ml-3">
            <div
              className="bg-gray-400 rounded-full"
              style={aspectRatioToStyle(1 / 3)}
            />
          </div>
          <div className="w-32 ml-1 lg:ml-3">
            <div
              className="bg-gray-400 rounded-full"
              style={aspectRatioToStyle(1 / 3)}
            />
          </div>
          <div className="w-32 ml-1 lg:ml-3">
            <div
              className="bg-gray-400 rounded-full"
              style={aspectRatioToStyle(1 / 3)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
