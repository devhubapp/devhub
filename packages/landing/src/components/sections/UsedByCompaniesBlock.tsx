import { aspectRatioToStyle } from '../../helpers'

export interface UsedByCompaniesBlockProps {}

export default function UsedByCompaniesBlock(
  _props: UsedByCompaniesBlockProps,
) {
  return (
    <section id="trusted-by" className="bg-gray-200 p-6">
      <div className="container text-center">
        <h3 className="uppercase">Used by 15,000+ Developers &amp; Managers</h3>
        <h4 className="mb-4">Including amazing people from these companies:</h4>

        <div className="flex flex-row justify-center">
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
