import { createAvatar } from '@dicebear/core'
import { shapes } from '@dicebear/collection'

import { createFunction } from '../../utils/lambda'
import { DB } from '../../utils/database'
import { auth } from '../../utils/firebase'
import { BadRequest } from '../../utils/responses'
import { Validate } from '../../../assets/scripts/app-validate'

type Body = {
    name: string
    subdomain?: string
    customSubdomain: boolean
    region?: string
    memory: number
    timeout: number
}

type WordsResponse = {
    data: Array<{
        [k: string]: {
            value: string
            numSyllables: number
        }
    }>
}

const NounsURL = 'https://randomwordgenerator.com/json/nouns_ws.json'
const AdjsURL = 'https://randomwordgenerator.com/json/adjectives_ws.json'
const Query =
    'insert into `apps` (`id`, `name`, `author`, `domain_custom`, `domain_generated`, `domain_set`, `timeout`, `memory`) values (:id, :name, :author, :domain_custom, :domain_generated, :domain_set, :timeout, :memory)'

async function GenerateName() {
    const { data: nouns } = await $fetch<WordsResponse>(NounsURL)
    const { data: adjectives } = await $fetch<WordsResponse>(AdjsURL)

    const nidx = Math.floor(Math.random() * nouns.length)
    const aidx = Math.floor(Math.random() * adjectives.length)

    return `${nouns[nidx].noun.value}-${adjectives[aidx].adjective.value}`
}

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return event.context

    const body = await readBody<Body>(event)
    if (!body.memory) return BadRequest(event)
    if (!body.name) return BadRequest(event)
    if (!body.timeout) return BadRequest(event)
    if (!Validate(body).valid) return BadRequest(event)

    try {
        const { uid, email_verified } = await auth.verifyIdToken(token, true)

        if (!email_verified) return BadRequest(event)

        const { count: nameCount } = await Apps.fetch({
            'owners?contains': uid,
            name: body.name,
        })

        if (nameCount > 0) return BadRequest(event, 'Name exists')

        const img = await createAvatar(shapes, {
            radius: 0,
            seed: '',
        }).toDataUri()

        const data = {
            memory: body.memory,
            timeout: body.timeout,
            name: body.name,
            domain: {
                isCustom: body.customSubdomain,
                generated: '',
                set: '',
            },
            img,
            events: ['no events yet'],
            owners: [uid],
            token: undefined,
        }

        if (!data.domain.isCustom) {
            while (true) {
                data.domain.generated = await GenerateName()

                const { count } = await Apps.fetch({
                    'domain.set': data.domain.generated,
                })

                if (count < 1) break
            }
        }

        const res = await Apps.put(data)

        if (!res) return BadRequest(event)

        return 'Ok'
    } catch (error) {
        return BadRequest(event)
    }
})

// const res = await createFunction({ name, code, region, memory, timeout })
