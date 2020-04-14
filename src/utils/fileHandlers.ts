import * as fs from 'fs'

export const writeToFile = (fileName: string, stringToWrite: string) => {
	fs.writeFileSync(fileName, stringToWrite)
}

export const appendToFile = (fileName: string, stringToWrite: string) => {
	fs.appendFileSync(fileName, stringToWrite)
}
