import path from 'path'

export const CustomPathFile = (newPath: string, file: any) => {
    const ext = path.extname(file.filename)
    if (!ext) file.filename = file.filename + path.extname(file.originalname)
    return `${newPath}/${file.filename}`
}
