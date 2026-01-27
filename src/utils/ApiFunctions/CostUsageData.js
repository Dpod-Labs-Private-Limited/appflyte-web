import CostServiceApi from "../../Api/Services/AmeyaBackend/CostServiceApi";

const getCostUsageData = async (reqObj, page, pageSize) => {
    try {
        const response = await CostServiceApi.getAll(reqObj, page, pageSize);

        if (response.status === 200 && response.data) {
            const totalCount = response.data.total_count || 0;

            return {
                usage_data: response.data.data || [],
                total_cost_sum: response.data.total_cost_sum || 0,
                total_count: totalCount,
                total_pages: Math.ceil(totalCount / pageSize),
                current_page: page,
            };
        }
    } catch (err) {
        console.error(err);
    }

    return {
        usage_data: [],
        total_cost_sum: 0,
        total_count: 0,
        total_pages: 1,
        current_page: page,
    };
};

export default getCostUsageData;