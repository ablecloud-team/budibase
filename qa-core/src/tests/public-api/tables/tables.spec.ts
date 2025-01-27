import { Table } from "@budibase/server/api/controllers/public/mapping/types"
import { generateTable } from "../../../config/public-api/fixtures/tables"
import TestConfiguration from "../../../config/public-api/TestConfiguration"
import PublicAPIClient from "../../../config/public-api/TestConfiguration/PublicAPIClient"
import AccountsAPIClient from "../../../config/public-api/TestConfiguration/accountsAPIClient"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"

describe("Public API - /tables endpoints", () => {
  const api = new PublicAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const internalAPI = new InternalAPIClient()
  const config = new TestConfiguration<Table>(api, accountsAPI, internalAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
    await config.setApiKey()

    const [appResp, app] = await config.applications.seed()
    config.tables.api.appId = app._id

    const [tableResp, table] = await config.tables.seed()
    config.context = table
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create a table", async () => {
    const [response, table] = await config.tables.create(generateTable())
    expect(response).toHaveStatusCode(200)
    expect(table._id).toBeDefined()
  })

  it("POST - Search tables", async () => {
    const [response, tables] = await config.tables.search({
      name: config.context.name,
    })
    expect(response).toHaveStatusCode(200)
    expect(tables[0]).toEqual(config.context)
  })

  it("GET - Retrieve a table", async () => {
    const [response, table] = await config.tables.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(table).toEqual(config.context)
  })

  it("PUT - update a table", async () => {
    config.context.name = "updatedName"
    const [response, table] = await config.tables.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(table).toEqual(config.context)
  })
})
