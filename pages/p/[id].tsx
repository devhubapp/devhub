import fetch from 'isomorphic-unfetch'
import { NextPage } from 'next'
import Markdown from 'react-markdown'

import LandingLayout from '@devhub/landing/src/components/layouts/LandingLayout'

export interface PostProps {
  show: any
}

const Post: NextPage<PostProps> = props => {
  return (
    <LandingLayout>
      <h1>{props.show.name}</h1>
      <p>{props.show.summary.replace(/<[/]?p>/g, '')}</p>
      <img src={props.show.image.medium} />

      <div className="markdown">
        <Markdown
          source={`
This is our blog post.
Yes. We can have a [link](/link).
And we can have a title as well.

### This is a title

And here's the content.
      `}
        />
      </div>
      <style jsx global>{`
        .markdown {
          font-family: 'Arial';
        }

        .markdown a {
          text-decoration: none;
          color: blue;
        }

        .markdown a:hover {
          opacity: 0.6;
        }

        .markdown h3 {
          margin: 0;
          padding: 0;
          text-transform: uppercase;
        }
      `}</style>
    </LandingLayout>
  )
}

Post.getInitialProps = async context => {
  const { id } = context.query

  const res = await fetch(`https://api.tvmaze.com/shows/${id}`)
  const show = await res.json()

  // console.log(`Fetched show: ${show.name}`)

  return { show }
}

export default Post
