export interface Store {
    file: File
    caption: string
    title: string
    description: string
    category: string
    tags: string[]
}

export interface File {
    path: string
    size: number
    mimetype: string
    originalname: string
    filename: string
    uri?: string
}
