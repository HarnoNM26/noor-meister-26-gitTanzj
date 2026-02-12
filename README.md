## Kalle Riit

### Kuidas kasutada

Jooksuta järgmist käsklust, et ehitada üles arenduskeskkond:
`cd backend && npm i && cd ../client && npm i`

Jooksuta järgmist käsku, et luua client, backend ja andmebaas ning jooksutada migratsioone
`docker-compose up --build`

### Json andmete importimine

Saada päring `/api/import/json` endpointile koos JSON failiga kasutades multipart/data päist.

Näide Windowsil:
```
curl -X POST "http://localhost:3000/api/import/json"   --form "file=@C:\Users\<Sinu kasutaja>\Desktop\energy_dump.json;type=json" ;
```

### Testimine

Testimiseks backend kaustas on saadaval järgmised käsud:
`npm run test:unit` - Unit testide jooksutamine
ja
`npm run test:api` - Api testide jooksutamine

### Arhitektuur

Backend kasutab Fastify kihilist arhitektuuri mis koosneb:
- modelitest (data access layer)
- servicetest ja controlleritest (business logic layer)
- routes'idest (routing layer)

Lisaks sellele on ka dependency injection tagatud Fastify pluginate ning dekoraatorite kaudu

Frontend kasutab Reacti ning on ehitatud üles järgmiselt:
- `App.tsx` - Peamine leht
- /components - kaust lisakomponentide jaoks

### Endpointid

Backend võimaldab järgmised endpointid:

`GET /api/health` - Health endpoint rakenduse tervise ning andmebaasi tervise kontrollimiseks
`GET /api/readings` - Saadab kõik andmed vastavate filtritega
`DELETE /api/readings` - Kustutab kõik andmed vastavate filtritega
`POST /api/import/json` - Puhastab, filtreerib ning sisestab andmebaasi kõik lisatud JSON andmed
`POST /api/sync/prices` - Pärib hinnaandmed välisest https://dashboard.elering.ee APIst ning sisetab need andmebaasi vältides duplikaate
`GET /api/insights/prices` - Saadab kõikide andmete pealt tehtud arvutused sealhulgas keskmine hind, kõige odavamad ajad ning kõige kallimad ajad. Response võib näha välja järgmine:
`
    {
    "average_price": 179.02,
    "cheapest_slots": [
        {
            "id": 421134269,
            "timestamp": "2026-02-13T03:00:00.000Z",
            "location": "EE",
            "price_eur_mwh": "95",
            "source": "API",
            "created_at": "2026-02-12T14:44:30.260Z"
        },
        {
            "id": 737535126,
            "timestamp": "2026-02-08T22:45:00.000Z",
            "location": "EE",
            "price_eur_mwh": "95",
            "source": "API",
            "created_at": "2026-02-12T14:44:30.038Z"
        },
        {
            "id": 129060750,
            "timestamp": "2026-02-09T00:45:00.000Z",
            "location": "EE",
            "price_eur_mwh": "96",
            "source": "API",
            "created_at": "2026-02-12T14:44:30.037Z"
        }
    ],
    "most_expensive_slots": [
        {
            "id": 915755896,
            "timestamp": "2026-02-11T05:45:00.000Z",
            "location": "EE",
            "price_eur_mwh": "390",
            "source": "API",
            "created_at": "2026-02-12T14:44:30.124Z"
        },
        {
            "id": 540128053,
            "timestamp": "2026-02-10T06:45:00.000Z",
            "location": "EE",
            "price_eur_mwh": "348",
            "source": "API",
            "created_at": "2026-02-12T14:44:30.064Z"
        },
        {
            "id": 169075624,
            "timestamp": "2026-02-10T17:00:00.000Z",
            "location": "EE",
            "price_eur_mwh": "337",
            "source": "API",
            "created_at": "2026-02-12T14:44:30.074Z"
        }
    ]
}
`

### Suuremad moodulid

#### Fastify:
Backend raamistik, mis võimaladb päringute skeema validatsiooni out-of-box ning muid integratsioone läbi pluginate

#### @sinclair/typebox
Tüüpide loomise raamistik millega on võimalik läbi viia skeema validatsioonie ruuterites

#### Vite
Frontend bundler, millega on võimalik luua react frontend äppi

#### Kysely
Andmebaasi ORM, mis võimaldab natiivsete SQL päringute koostamist

#### @mui/x-date-pickers
Visuaalsed komponendid andmete haldamiseks

#### @mui/x-charts
Visuaalsed komponendid graafikute koostamiseks
