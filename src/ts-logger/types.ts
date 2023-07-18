export interface LoggerEntry {
    main: string,
}
export interface LoggerEntryErr extends LoggerEntry {
    hint?: string
}
export interface LoggerEntryWarn extends LoggerEntry {
    sugg?: string
}
export interface LoggerEntryLog extends LoggerEntry {
    sugg?: string
}