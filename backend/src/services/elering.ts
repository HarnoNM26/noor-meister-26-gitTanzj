import axios from 'axios';

type Location = 'ee' | 'lv' | 'fi'

interface EleringData {
    timestamp: number;
    price: number;
} 

class EleringService {
    private baseUrl = 'https://dashboard.elering.ee'

    public getPrices = async (filters: {
        start: string,
        end: string,
        fields: Array<Location>
    }) => {
        const {
            start,
            end,
            fields
        } = filters;

        const response = await axios.get(`${this.baseUrl}/api/nps/price`, {
            params: {
                start,
                end,
                fields
            }
        });

        if (response.status >= 400) {
            return {
                success: false
            }
        }

        const resData = response.data as {
            success: true,
            data: {
                'ee': EleringData[],
                'lv': EleringData[],
                'fi': EleringData[]
            }
        };

        return {
            success: true,
            data: resData.data[fields[0]]
        }
    }
}

export default EleringService
