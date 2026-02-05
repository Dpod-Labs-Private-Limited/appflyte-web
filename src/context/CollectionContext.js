import { createContext, useContext, useEffect, useState } from 'react';

const CollectionContext = createContext();

export function CollectionProvider({ children }) {

    const [centralLoadingFlags, setCentralLoadingFlag] = useState({})

    const [collectionTypeList, setCollectionTypeList] = useState([])
    const [collectionPublishedList, setCollectionPublishedList] = useState([])
    const [collectionPublishedListFiltered, setCollectionPublishedListFiltered] = useState([])

    const [fieldSetList, setFieldSetList] = useState([])
    const [fieldSetListPublished, setFieldSetListPublished] = useState([])

    return (
        <CollectionContext.Provider value={{
            centralLoadingFlags,
            setCentralLoadingFlag,

            collectionTypeList,
            setCollectionTypeList,

            collectionPublishedList,
            setCollectionPublishedList,

            collectionPublishedListFiltered,
            setCollectionPublishedListFiltered,

            fieldSetList,
            setFieldSetList,

            fieldSetListPublished,
            setFieldSetListPublished
        }}>
            {children}
        </CollectionContext.Provider>
    );
}

export function useCollection() {
    return useContext(CollectionContext);
}
