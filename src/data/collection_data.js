const fetchCollectionTypes = (ignoreLoading) => {
    if (parsedDPODToken && selected_project) {
        setCentralLoadingFlag(prev => ({
            ...prev,
            collectionTypes: true,
        }))
        const accID = parsedDPODToken.root_account_id
        const subscriberId = parsedDPODToken.subscriber_id
        const subscriptionId = parsedDPODToken.subscription_id
        const schemaId = selected_project.payload.__auto_id__
        CollectionTypesService
            .getAllCollectionTypesForCoach(accID, subscriptionId, subscriberId, schemaId)
            .then(res => {
                setCollectionTypeList(res.data)
            })
            .catch(err => {
                console.log("Error occured while fetching all collection type list for a coach", err)
                setCollectionTypeList()
            })
            .finally(() => {
                if (ignoreLoading && ignoreLoading === true) {
                    // Do Nothing
                }
                else
                    setCentralLoadingFlag(prev => ({
                        ...prev,
                        collectionTypes: false,
                    }))
            })
        fetchPublishedCollection()
    }
}