import { aspectRatioToStyle } from '../../helpers'

export interface UsedByCompaniesBlockProps {}

export default function UsedByCompaniesBlock(
  _props: UsedByCompaniesBlockProps,
) {
  return (
    <section id="trusted-by" className="bg-less-1 py-6">
      <div className="container text-center">
        <h3 className="uppercase mb-0">
          Used by 15,000+ Developers &amp; Managers
        </h3>
        <h4 className="mb-4">Including people from these companies:</h4>

        <div className="flex flex-row flex-wrap justify-center">
          <div className="flex-shrink-0 w-32 mx-1 my-1">
            <div
              className="relative bg-less-3 rounded-full"
              style={aspectRatioToStyle(3 / 1)}
            >
              <img
                alt="Microsoft"
                src="/static/companies/logo-microsoft-light.png"
                className="visible-light-theme company-logo absolute inset-0 w-full h-full object-cover bg-white rounded-full"
              />
              <img
                alt="Microsoft"
                src="/static/companies/logo-microsoft-dark.png"
                className="visible-dark-theme company-logo absolute inset-0 w-full h-full object-cover rounded-full"
                style={{ backgroundColor: '#575352' }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 w-32 mx-1 my-1">
            <div
              className="relative bg-less-3 rounded-full"
              style={aspectRatioToStyle(3 / 1)}
            >
              <img
                alt="Google"
                src="/static/companies/logo-google-transparent.png"
                className="visible-light-theme company-logo absolute inset-0 w-full h-full object-cover bg-white rounded-full"
              />
              <img
                alt="Google"
                src="/static/companies/logo-google-transparent.png"
                className="visible-dark-theme company-logo absolute inset-0 w-full h-full object-cover bg-default rounded-full"
              />
            </div>
          </div>

          <div className="flex-shrink-0 w-32 mx-1 my-1">
            <div
              className="relative bg-less-3 rounded-full"
              style={aspectRatioToStyle(3 / 1)}
            >
              <img
                alt="Facebook"
                src="/static/companies/logo-facebook.png"
                className="company-logo absolute inset-0 w-full h-full object-cover rounded-full"
                style={{ backgroundColor: '#1778f2' }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 w-32 mx-1 my-1">
            <div
              className="relative bg-less-3 rounded-full"
              style={aspectRatioToStyle(3 / 1)}
            >
              <img
                alt="Mozilla"
                src="/static/companies/logo-mozilla-light.png"
                className="visible-light-theme company-logo absolute inset-0 w-full h-full object-cover bg-white rounded-full"
              />
              <img
                alt="Mozilla"
                src="/static/companies/logo-mozilla-dark.png"
                className="visible-dark-theme company-logo absolute inset-0 w-full h-full object-cover bg-black rounded-full"
              />
            </div>
          </div>

          <div className="flex-shrink-0 w-32 mx-1 my-1">
            <div
              className="relative bg-less-3 rounded-full"
              style={aspectRatioToStyle(3 / 1)}
            >
              <img
                alt="Salesforce"
                src="/static/companies/logo-salesforce.png"
                className="company-logo absolute inset-0 w-full h-full object-cover rounded-full"
                style={{ backgroundColor: '#00a1e1' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        .company-logo {
          filter: grayscale(1);
        }

        .company-logo:hover {
          filter: none;
        }
      `}</style> */}
    </section>
  )
}
