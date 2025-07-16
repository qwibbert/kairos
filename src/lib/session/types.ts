
export enum PomoType {
    Pomo = "POMO",
    ShortBreak = "SHORT_BREAK",
    LongBreak = "LONG_BREAK"
}

export enum SessionStatus {
    Active = "ACTIVE",
    Paused = "PAUSED",
    Ready = "READY",
    Inactive = "INACTIVE",
    Skipped = "SKIPPED",
    Interrupted = "INTERRUPTED",
}

export interface Pauses {
    timestamp: Date,
    duration: number,
}