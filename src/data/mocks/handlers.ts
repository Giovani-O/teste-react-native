import { delay, HttpResponse, http } from 'msw'
import { School } from '../../domain/entities/School'
import { Shift, Turma } from '../../domain/entities/Turma'
import { computeClassCount, dataStore } from './dataStore'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function adaptSchoolResponse(school: School): School {
  return {
    ...school,
    classCount: computeClassCount(school.id),
  }
}

export const handlers = [
  // Escolas
  http.get('*/api/schools', async () => {
    console.log('[Handler] GET /api/schools hit')
    try {
      await delay(200)
      console.log('[Handler] delay done, reading dataStore...')
      const schoolsWithCount = dataStore.schools.map(adaptSchoolResponse)
      console.log('[Handler] returning', schoolsWithCount.length, 'schools')
      return HttpResponse.json(schoolsWithCount)
    } catch (e) {
      console.log('[Handler] GET /api/schools threw:', e)
      throw e
    }
  }),

  http.post('*/api/schools', async ({ request }) => {
    console.log('[Handler] POST /api/schools hit')
    try {
      await delay(200)
      const body = (await request.json()) as { name: string; address: string }
      console.log('[Handler] POST body:', body)
      const newSchool: School = {
        id: generateId(),
        name: body.name,
        address: body.address,
        classCount: 0,
      }
      dataStore.schools.push(newSchool)
      return HttpResponse.json(adaptSchoolResponse(newSchool), { status: 201 })
    } catch (e) {
      console.log('[Handler] POST /api/schools threw:', e)
      throw e
    }
  }),

  http.get('*/api/schools/:id', async ({ params }) => {
    await delay(200)
    const school = dataStore.schools.find((s) => s.id === params.id)
    if (!school) {
      return HttpResponse.json({ error: 'School not found' }, { status: 404 })
    }
    return HttpResponse.json(adaptSchoolResponse(school))
  }),

  http.put('*/api/schools/:id', async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as { name?: string; address?: string }
    const index = dataStore.schools.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'School not found' }, { status: 404 })
    }
    const updated: School = {
      ...dataStore.schools[index],
      ...body,
    }
    dataStore.schools[index] = updated
    return HttpResponse.json(adaptSchoolResponse(updated))
  }),

  http.delete('*/api/schools/:id', async ({ params }) => {
    await delay(200)
    const index = dataStore.schools.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'School not found' }, { status: 404 })
    }
    dataStore.schools.splice(index, 1)
    dataStore.turmas = dataStore.turmas.filter((t) => t.schoolId !== params.id)
    return HttpResponse.json({ success: true })
  }),

  // Turmas
  http.get('*/api/schools/:schoolId/turmas', async ({ params }) => {
    await delay(200)
    const turmas = dataStore.turmas.filter(
      (t) => t.schoolId === params.schoolId,
    )
    return HttpResponse.json(turmas)
  }),

  http.post('*/api/turmas', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as {
      name: string
      shift: Shift
      academicYear: number
      schoolId: string
    }
    const newTurma: Turma = {
      id: generateId(),
      name: body.name,
      shift: body.shift,
      academicYear: body.academicYear,
      schoolId: body.schoolId,
    }
    dataStore.turmas.push(newTurma)
    return HttpResponse.json(newTurma, { status: 201 })
  }),

  http.get('*/api/turmas/:id', async ({ params }) => {
    await delay(200)
    const turma = dataStore.turmas.find((t) => t.id === params.id)
    if (!turma) {
      return HttpResponse.json({ error: 'Turma not found' }, { status: 404 })
    }
    return HttpResponse.json(turma)
  }),

  http.put('*/api/turmas/:id', async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as {
      name?: string
      shift?: Shift
      academicYear?: number
    }
    const index = dataStore.turmas.findIndex((t) => t.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Turma not found' }, { status: 404 })
    }
    const updated: Turma = {
      ...dataStore.turmas[index],
      ...body,
    }
    dataStore.turmas[index] = updated
    return HttpResponse.json(updated)
  }),

  http.delete('*/api/turmas/:id', async ({ params }) => {
    await delay(200)
    const index = dataStore.turmas.findIndex((t) => t.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Turma not found' }, { status: 404 })
    }
    dataStore.turmas.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),
]
