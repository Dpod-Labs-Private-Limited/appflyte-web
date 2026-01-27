import axios from "axios";

class CreditBalanceService {

    getCredit = async (organization_id) => {
        const response = await axios.get(`${process.env.REACT_APP_OAUTH_SERVER_URL}/get-credit-balance/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/${organization_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }

}
const CreditBalanceApi = new CreditBalanceService()
export default CreditBalanceApi;