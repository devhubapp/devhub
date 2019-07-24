import Button from '../common/buttons/Button'

export interface GetStartedBlockProps {}

export default function GetStartedBlock(_props: GetStartedBlockProps) {
  return (
    <section id="get-started" className="bg-less-1 p-6">
      <div className="container text-center">
        <h3 className="uppercase mb-3">Get Started Now</h3>

        <div className="flex flex-row justify-center">
          <Button type="primary" href="/download">
            Download DevHub
          </Button>
        </div>
      </div>
    </section>
  )
}
