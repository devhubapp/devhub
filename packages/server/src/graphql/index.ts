import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`

const resolvers = {
  Query: {
    sayHello(parent: any, args: any, context: any) {
      return 'Hello World!'
    },
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })
module.exports = apolloServer.createHandler()
