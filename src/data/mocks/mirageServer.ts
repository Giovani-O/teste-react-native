// src/data/mocks/mirageServer.ts
import { createServer, Response as MirageResponse, Model } from 'miragejs'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function startMirageServer() {
  const server = createServer({
    models: {
      school: Model,
      turma: Model,
    },

    routes() {
      this.urlPrefix = 'http://localhost'
      this.namespace = 'api'

      // GET /api/schools
      this.get('/schools', (schema) => {
        const schools = schema.db.schools.where({})
        return schools.map((s: any) => ({
          ...s,
          classCount: schema.db.turmas.where({ schoolId: s.id }).length,
        }))
      })

      // POST /api/schools
      this.post('/schools', (schema, request) => {
        const body = JSON.parse(request.requestBody)
        const newSchool = {
          id: generateId(),
          name: body.name,
          address: body.address,
          classCount: 0,
        }
        schema.db.schools.insert(newSchool)
        return new MirageResponse(
          201,
          { 'Content-Type': 'application/json' },
          JSON.stringify(newSchool),
        )
      })

      // GET /api/schools/:id
      this.get('/schools/:id', (schema, request) => {
        const school = schema.db.schools.findBy({ id: request.params.id })
        if (!school) {
          return new MirageResponse(
            404,
            {},
            JSON.stringify({ error: 'School not found' }),
          )
        }
        return {
          ...school,
          classCount: schema.db.turmas.where({ schoolId: school.id }).length,
        }
      })

      // PUT /api/schools/:id
      this.put('/schools/:id', (schema, request) => {
        const school = schema.db.schools.findBy({ id: request.params.id })
        if (!school) {
          return new MirageResponse(
            404,
            {},
            JSON.stringify({ error: 'School not found' }),
          )
        }
        const body = JSON.parse(request.requestBody)
        schema.db.schools.update({ id: request.params.id }, body)
        const updated = schema.db.schools.findBy({ id: request.params.id })
        return {
          ...updated,
          classCount: schema.db.turmas.where({ schoolId: updated.id }).length,
        }
      })

      // DELETE /api/schools/:id
      this.del('/schools/:id', (schema, request) => {
        const school = schema.db.schools.findBy({ id: request.params.id })
        if (!school) {
          return new MirageResponse(
            404,
            {},
            JSON.stringify({ error: 'School not found' }),
          )
        }
        schema.db.turmas
          .where({ schoolId: request.params.id })
          .forEach((t: any) => {
            schema.db.turmas.remove(t)
          })
        schema.db.schools.remove(school)
        return { success: true }
      })

      // GET /api/schools/:schoolId/turmas
      this.get('/schools/:schoolId/turmas', (schema, request) => {
        return schema.db.turmas.where({ schoolId: request.params.schoolId })
      })

      // POST /api/turmas
      this.post('/turmas', (schema, request) => {
        const body = JSON.parse(request.requestBody)
        const newTurma = {
          id: generateId(),
          name: body.name,
          shift: body.shift,
          academicYear: body.academicYear,
          schoolId: body.schoolId,
        }
        schema.db.turmas.insert(newTurma)
        return new MirageResponse(
          201,
          { 'Content-Type': 'application/json' },
          JSON.stringify(newTurma),
        )
      })

      // GET /api/turmas/:id
      this.get('/turmas/:id', (schema, request) => {
        const turma = schema.db.turmas.findBy({ id: request.params.id })
        if (!turma) {
          return new MirageResponse(
            404,
            {},
            JSON.stringify({ error: 'Turma not found' }),
          )
        }
        return turma
      })

      // PUT /api/turmas/:id
      this.put('/turmas/:id', (schema, request) => {
        const turma = schema.db.turmas.findBy({ id: request.params.id })
        if (!turma) {
          return new MirageResponse(
            404,
            {},
            JSON.stringify({ error: 'Turma not found' }),
          )
        }
        const body = JSON.parse(request.requestBody)
        schema.db.turmas.update({ id: request.params.id }, body)
        return schema.db.turmas.findBy({ id: request.params.id })
      })

      // DELETE /api/turmas/:id
      this.del('/turmas/:id', (schema, request) => {
        const turma = schema.db.turmas.findBy({ id: request.params.id })
        if (!turma) {
          return new MirageResponse(
            404,
            {},
            JSON.stringify({ error: 'Turma not found' }),
          )
        }
        schema.db.turmas.remove(turma)
        return { success: true }
      })

      // Allow all other requests to pass through (e.g. asset bundles)
      this.passthrough()
    },
  })

  return server
}
