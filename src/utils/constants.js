export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const FILE_TYPE_IMAGE = "Image"
export const FILE_TYPE_VIDEO = "Video"
export const FILE_TYPE_FOLDER = "Folder"
export const FILE_TYPE_DOCUMENT = "Document"
export const FILE_ACCESS_PUBLIC = "PUBLIC"
export const FILE_ACCESS_PRIVATE = "PRIVATE"
export const FILE_ACCESS_SUBSCRIPTION = "SUBSCRIPTION_REQUIRED"
export const ENTITY_TYPE_DIRECTORY = "directory"
export const ENTITY_TYPE_FILE = "file"

export const APPLICATION_CODE_PLURAL = {
  lookups: 'types_lookups',
  // user: 'users',
  user: 'clients',
  user_app_access: 'user_app_accesss'
}

export const SYSTEM_RESERVED_FIELD_NAMES = [
  'id', '__auto_id__', 'entity_status', 'fieldListFromAPI', 'tableData', 'item_meta_details'
]

export const COLLECTION_FIELD_NAME = {
  COMPONENT: 'component',
  RELATION: 'relation',
  LIST: 'list',
}


export const OTHER_PLURAL_ID = {
  accountPermission: "staff_permissions",
  role: "roles",
  application: "application_masters",
  installed_application: "installed_applications",
  appPermissionLookup: 'app_permission_lookups',
  websiteRequest: 'website_creation_requests'
}

export const COLLECTION_ENTITY = {
  person: 'person',
  program: 'program',
  files: 'files'
}

export const FILES_TAG_NAME_DEFAULT = "Tag Name"

export const DEFAULT_SCHEMA_ID = "ameya_appflyte"
