import { build } from "../../helper";
import { createDbConnection as mockDb } from '../../db'

const app = build();

test("default root route", async () => {
  const res = await app.inject({
    url: "/",
  });
  expect(res.json()).toEqual({ root: true });
});

describe('GET /api/readings', () => {

    jest.mock('../../../src/utils/mysql.ts', mockDb);
    test("should handle filtering", async () => {
        const res = await app.inject({ url: "/api/readings", query: {
            start: "2026-01-01T20:00:00.000Z",
            end: "2026-01-01T24:00:00.000Z",
            location: "EE"
        }});

        const fetchedData = JSON.parse(res.body).data;

        const allEstonianData = 
            fetchedData.every((elem: {location: string}) => elem.location === "EE")
        expect(allEstonianData).toBe(true);

        const dataStartCorrect = 
            fetchedData.every((elem: {timestamp: string}) => {
                const elemTime = (new Date(elem.timestamp)).getTime();
                const filterTime = (new Date("2026-01-01T20:00:00.000Z")).getTime();

                return elemTime - filterTime > 0;
            })
        expect(dataStartCorrect).toBe(true);

        const dataEndCorrect = 
            fetchedData.every((elem: {timestamp: string}) => {
                const elemTime = (new Date(elem.timestamp)).getTime();
                const filterTime = (new Date("2026-01-01T20:00:00.000Z")).getTime();

                return filterTime - elemTime > 0;
            })
        expect(dataEndCorrect).toBe(true);
    });

})
