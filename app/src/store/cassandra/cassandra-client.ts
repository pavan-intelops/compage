import cassandra from 'cassandra-driver';
import config from "../../utils/constants";

const contactPoints = config.db?.cassandra?.contactPoints as string[] || ['localhost'];
const localDataCenter = config.db?.cassandra?.localDataCenter as string || 'datacenter1'
const keyspace = config.db?.cassandra?.keyspace as string || 'compage';
const authProvider = new cassandra.auth.PlainTextAuthProvider(config.db?.cassandra?.credentials?.username as string, config.db?.cassandra?.credentials?.password as string);

export const cassandraClient = new cassandra.Client({
    contactPoints,
    authProvider,
    localDataCenter,
    keyspace
});

// TODO add a condition here later to non development condition
export const initializeCassandraClient = () => {
    const cassandraClient = new cassandra.Client({
        contactPoints,
        authProvider,
        localDataCenter,
        keyspace
    });
    cassandraClient.connect().then(r => console.log('Cassandra client connected'));
    return {
        cassandraClient
    };
};
