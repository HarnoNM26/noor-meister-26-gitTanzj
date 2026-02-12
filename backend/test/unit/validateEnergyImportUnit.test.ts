import { cleanEnergyData } from "../../src/helpers/validateEnergyImport";
import { mockEnergyData } from "../mocks/energyData";

describe('helpers', () => {
    describe('cleanEnergyData', () => {
        it('should filter correctly', () => {
            const result = cleanEnergyData(mockEnergyData, false);

            expect(result.skipped).toBe(1);
            expect(result.allDuplicates.length).toBe(0);
        })
    })
})
