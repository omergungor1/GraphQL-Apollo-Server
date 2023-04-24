const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
// const { startStandaloneServer } = require('@apollo/server/standalone');
const { events, locations, users, participants } = require('./data.js');

const port = 4000;

const typeDefs = `#graphql

type User{
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
}

type Event{
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID! 
    user_id: ID!
    user: User!
    location:Location!
    participants:[Participant!]!
}

type Location{
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
}

type Participant{
    id:ID!
    user_id: ID!
    event_id: ID!
}

type Query {
    #User
    users:[User!]!
    user(id:ID!):User!

    #Event
    events:[Event!]!
    event(id:ID!):Event!

    #Loaction
    locations:[Location!]!
    location(id:ID!):Location!
    
    #Participant
    participants:[Participant!]!
    participant(id:ID!):Participant!
  }

`;


const resolvers = {
    Query: {
        users: () => users,
        user: (parent, args) => users.find(user => user.id == args.id),

        events: () => events,
        event: (parent, args) => events.find(event => event.id == args.id),

        locations: () => locations,
        location: (parent, args) => locations.find(location => location.id == args.id),

        participants: () => participants,
        participant: (parent, args) => participants.find(participant => participant.id == args.id)
    },

    User: {
        events: (parent, args) => events.filter(event => event.id == parent.id)
    },

    Event: {
        user: (parent) => users.find(user => user.id === parent.user_id),
        location: (parent) => locations.find(location => location.id === parent.user_id),
        participants: (parent) => participants.filter(participant => participant.user_id == parent.user_id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({}),
    ],
});

server.listen(port).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
});
