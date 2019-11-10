import DownloadButtons from './download/DownloadButtons'

export interface GetStartedBlockProps {}

export default function GetStartedBlock(_props: GetStartedBlockProps) {
  return (
    <section id="get-started" className="bg-less-1 p-6">
      <div className="container text-center">
        <h3 className="uppercase mb-6">Get Started Now</h3>
        <DownloadButtons center />
      </div>
    </section>
  )
}
