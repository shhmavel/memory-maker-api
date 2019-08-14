const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('scores Endpoints', function(){
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/scores`, () => {
        const testScores = helpers.makeScoresArray();
        this.beforeEach('insert scores', () => {
            helpers.seedScores(
                db, 
                testScores,
            )
        })

        it(`responds with 200 and all of the scores`, () => {
            return supertest(app)
                .get('/api/scores')
                .expect(200, testScores)
        })
    })
})