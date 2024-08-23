export interface Store {
    file: File
    title: string
    category: string
    compression: boolean
    quality: number
    convertTo: string
}

export interface File {
    path: string
    size: number
    mimetype: string
    originalname: string
    filename: string
    uri?: string
}

export type Search = {
    category: string
    filename: string
}
